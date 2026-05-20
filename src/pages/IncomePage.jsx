import React, { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useIncome } from '../hooks/useIncome'
import { useMonth } from '../context/MonthContext'
import { formatCurrency } from '../utils/formatCurrency'
import { PlusCircle, Pencil, Trash2, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const CATEGORIES = ['Salary', 'Business', 'Freelance', 'Side Income', 'Investments', 'Rental', 'Other']

const defaultForm = { date: format(new Date(), 'yyyy-MM-dd'), source: '', category: 'Salary', expected: '', actual: '', notes: '' }

export default function IncomePage() {
  const { monthLabel } = useMonth()
  const { income, loading, add, update, remove } = useIncome()
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [deleteId, setDeleteId] = useState(null)
  const [saving, setSaving] = useState(false)

  function openAdd() { setForm(defaultForm); setEditItem(null); setModal(true) }
  function openEdit(item) { setForm({ ...item, date: item.date?.slice(0, 10) || '' }); setEditItem(item); setModal(true) }
  function set(f) { return e => setForm(p => ({ ...p, [f]: e.target.value })) }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.source.trim()) { toast.error('Source is required'); return }
    setSaving(true)
    const payload = { ...form, expected: parseFloat(form.expected) || 0, actual: parseFloat(form.actual) || 0 }
    const ok = editItem ? await update(editItem.id, payload) : await add(payload)
    setSaving(false)
    if (ok) setModal(false)
  }

  async function handleDelete(id) {
    await remove(id)
    setDeleteId(null)
  }

  const totalExpected = income.reduce((s, r) => s + (parseFloat(r.expected) || 0), 0)
  const totalActual = income.reduce((s, r) => s + (parseFloat(r.actual) || 0), 0)

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Income</h1>
          <p className="text-sm text-gray-400 mt-0.5">{monthLabel}</p>
        </div>
        <button onClick={openAdd} className="btn-primary" id="income-add-btn">
          <PlusCircle className="w-4 h-4" /> Add Income
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card overflow-hidden">
          <div className="section-header-sage">Total Expected</div>
          <div className="px-5 py-4"><span className="text-2xl font-bold text-gray-800">{formatCurrency(totalExpected)}</span></div>
        </div>
        <div className="card overflow-hidden">
          <div className="section-header-blue">Total Actual</div>
          <div className="px-5 py-4"><span className="text-2xl font-bold text-gray-800">{formatCurrency(totalActual)}</span></div>
        </div>
        <div className="card overflow-hidden">
          <div className={`section-header-${totalActual - totalExpected >= 0 ? 'sage' : 'blush'}`}>Difference</div>
          <div className="px-5 py-4">
            <span className={`text-2xl font-bold ${totalActual - totalExpected >= 0 ? 'text-positive' : 'text-negative'}`}>
              {formatCurrency(totalActual - totalExpected)}
            </span>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="section-header-sage flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Income Tracker
        </div>
        {loading ? <LoadingSpinner /> : income.length === 0 ? (
          <EmptyState icon={TrendingUp} title="No income records" description="Add your first income source for this month." action={openAdd} actionLabel="Add Income" />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th className="text-right">Expected</th>
                  <th className="text-right">Actual</th>
                  <th className="text-right">Diff</th>
                  <th>Notes</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {income.map(r => {
                  const diff = (parseFloat(r.actual) || 0) - (parseFloat(r.expected) || 0)
                  return (
                    <tr key={r.id}>
                      <td className="font-medium">{r.source}</td>
                      <td><span className="px-2 py-0.5 bg-sage-100 text-green-700 rounded-full text-xs font-medium">{r.category}</span></td>
                      <td className="text-gray-500">{r.date ? format(new Date(r.date), 'MMM d') : '—'}</td>
                      <td className="text-right">{formatCurrency(r.expected)}</td>
                      <td className="text-right font-medium">{formatCurrency(r.actual)}</td>
                      <td className={`text-right font-medium ${diff >= 0 ? 'text-positive' : 'text-negative'}`}>{formatCurrency(diff)}</td>
                      <td className="text-gray-400 text-xs max-w-[120px] truncate">{r.notes || '—'}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(r)} className="btn-ghost p-1.5" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setDeleteId(r.id)} className="btn-ghost p-1.5 text-rose-400 hover:bg-rose-50" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-cream-100 font-bold">
                  <td colSpan={3}>Total</td>
                  <td className="text-right">{formatCurrency(totalExpected)}</td>
                  <td className="text-right">{formatCurrency(totalActual)}</td>
                  <td className={`text-right ${totalActual - totalExpected >= 0 ? 'text-positive' : 'text-negative'}`}>{formatCurrency(totalActual - totalExpected)}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editItem ? 'Edit Income' : 'Add Income'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Source *</label>
              <input className="form-input" value={form.source} onChange={set('source')} placeholder="e.g. Paycheck" required />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select className="form-input" value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Date</label>
            <input type="date" className="form-input" value={form.date} onChange={set('date')} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Expected ($)</label>
              <input type="number" step="0.01" className="form-input" value={form.expected} onChange={set('expected')} placeholder="0.00" />
            </div>
            <div>
              <label className="form-label">Actual ($)</label>
              <input type="number" step="0.01" className="form-input" value={form.actual} onChange={set('actual')} placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="form-label">Notes</label>
            <textarea className="form-input" rows={2} value={form.notes} onChange={set('notes')} placeholder="Optional notes..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (editItem ? 'Update' : 'Add Income')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Income" size="sm">
        <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this income record? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={() => handleDelete(deleteId)} className="btn-danger flex-1 justify-center">Delete</button>
        </div>
      </Modal>
    </Layout>
  )
}
