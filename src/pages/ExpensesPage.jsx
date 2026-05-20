import React, { useState, useMemo } from 'react'
import { Layout } from '../components/layout/Layout'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useExpenses } from '../hooks/useExpenses'
import { useMonth } from '../context/MonthContext'
import { formatCurrency } from '../utils/formatCurrency'
import { PlusCircle, Pencil, Trash2, CreditCard } from 'lucide-react'
import { format } from 'date-fns'

const CATEGORIES = ['Food', 'Transportation', 'Health', 'Education', 'Entertainment', 'Beauty', 'Household', 'Shopping', 'Travel', 'Gifts', 'Other']
const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet']
const defaultForm = { date: format(new Date(), 'yyyy-MM-dd'), category: 'Food', subcategory: '', payment_method: 'Cash', budget: '', actual: '', notes: '' }

export default function ExpensesPage() {
  const { monthLabel } = useMonth()
  const { expenses, loading, add, update, remove } = useExpenses()
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [deleteId, setDeleteId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [filterCat, setFilterCat] = useState('All')

  function openAdd() { setForm(defaultForm); setEditItem(null); setModal(true) }
  function openEdit(item) { setForm({ ...item, date: item.date?.slice(0, 10) || '' }); setEditItem(item); setModal(true) }
  function set(f) { return e => setForm(p => ({ ...p, [f]: e.target.value })) }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, budget: parseFloat(form.budget) || 0, actual: parseFloat(form.actual) || 0 }
    const ok = editItem ? await update(editItem.id, payload) : await add(payload)
    setSaving(false)
    if (ok) setModal(false)
  }

  async function handleDelete(id) { await remove(id); setDeleteId(null) }

  const filtered = filterCat === 'All' ? expenses : expenses.filter(e => e.category === filterCat)
  const totalBudget = filtered.reduce((s, r) => s + (parseFloat(r.budget) || 0), 0)
  const totalActual = filtered.reduce((s, r) => s + (parseFloat(r.actual) || 0), 0)

  const usedCategories = [...new Set(expenses.map(e => e.category))]

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
          <p className="text-sm text-gray-400 mt-0.5">{monthLabel}</p>
        </div>
        <button onClick={openAdd} className="btn-primary" id="expenses-add-btn">
          <PlusCircle className="w-4 h-4" /> Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card overflow-hidden"><div className="section-header-peach">Total Budget</div><div className="px-5 py-4"><span className="text-2xl font-bold">{formatCurrency(expenses.reduce((s, r) => s + (parseFloat(r.budget) || 0), 0))}</span></div></div>
        <div className="card overflow-hidden"><div className="section-header-blush">Total Actual</div><div className="px-5 py-4"><span className={`text-2xl font-bold ${totalActual > totalBudget ? 'text-negative' : 'text-gray-800'}`}>{formatCurrency(totalActual)}</span></div></div>
        <div className="card overflow-hidden">
          <div className={`section-header-${totalActual <= totalBudget ? 'sage' : 'blush'}`}>Remaining</div>
          <div className="px-5 py-4"><span className={`text-2xl font-bold ${totalBudget - totalActual >= 0 ? 'text-positive' : 'text-negative'}`}>{formatCurrency(totalBudget - totalActual)}</span></div>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {['All', ...usedCategories].map(c => (
          <button key={c} onClick={() => setFilterCat(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterCat === c ? 'bg-peach-200 text-orange-800' : 'bg-white text-gray-500 hover:bg-cream-100 border border-gray-200'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="section-header-peach flex items-center gap-2">
          <CreditCard className="w-4 h-4" /> Expense Tracker
        </div>
        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <EmptyState icon={CreditCard} title="No expenses" description="Track your spending by adding expenses." action={openAdd} actionLabel="Add Expense" />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Subcategory</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th className="text-right">Budget</th>
                  <th className="text-right">Actual</th>
                  <th className="text-right">Diff</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const diff = (parseFloat(r.budget) || 0) - (parseFloat(r.actual) || 0)
                  const over = parseFloat(r.actual) > parseFloat(r.budget)
                  return (
                    <tr key={r.id}>
                      <td><span className="px-2 py-0.5 bg-peach-100 text-orange-700 rounded-full text-xs font-medium">{r.category}</span></td>
                      <td className="text-gray-500">{r.subcategory || '—'}</td>
                      <td className="text-gray-500">{r.date ? format(new Date(r.date), 'MMM d') : '—'}</td>
                      <td className="text-xs text-gray-500">{r.payment_method}</td>
                      <td className="text-right">{formatCurrency(r.budget)}</td>
                      <td className={`text-right font-medium ${over ? 'text-negative' : ''}`}>{formatCurrency(r.actual)}</td>
                      <td className={`text-right font-medium ${diff >= 0 ? 'text-positive' : 'text-negative'}`}>{formatCurrency(diff)}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(r)} className="btn-ghost p-1.5"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setDeleteId(r.id)} className="btn-ghost p-1.5 text-rose-400 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-cream-100 font-bold">
                  <td colSpan={4}>Total</td>
                  <td className="text-right">{formatCurrency(totalBudget)}</td>
                  <td className={`text-right ${totalActual > totalBudget ? 'text-negative' : ''}`}>{formatCurrency(totalActual)}</td>
                  <td className={`text-right ${totalBudget - totalActual >= 0 ? 'text-positive' : 'text-negative'}`}>{formatCurrency(totalBudget - totalActual)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editItem ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Category *</label>
              <select className="form-input" value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Subcategory</label>
              <input className="form-input" value={form.subcategory} onChange={set('subcategory')} placeholder="e.g. Groceries" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Date</label>
              <input type="date" className="form-input" value={form.date} onChange={set('date')} />
            </div>
            <div>
              <label className="form-label">Payment Method</label>
              <select className="form-input" value={form.payment_method} onChange={set('payment_method')}>
                {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Budget ($)</label>
              <input type="number" step="0.01" className="form-input" value={form.budget} onChange={set('budget')} placeholder="0.00" />
            </div>
            <div>
              <label className="form-label">Actual ($)</label>
              <input type="number" step="0.01" className="form-input" value={form.actual} onChange={set('actual')} placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="form-label">Notes</label>
            <textarea className="form-input" rows={2} value={form.notes} onChange={set('notes')} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (editItem ? 'Update' : 'Add Expense')}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Expense" size="sm">
        <p className="text-sm text-gray-500 mb-6">Delete this expense? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={() => handleDelete(deleteId)} className="btn-danger flex-1 justify-center">Delete</button>
        </div>
      </Modal>
    </Layout>
  )
}
