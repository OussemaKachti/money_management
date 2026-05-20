import React, { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Badge } from '../components/ui/Badge'
import { useBills } from '../hooks/useBills'
import { useMonth } from '../context/MonthContext'
import { formatCurrency } from '../utils/formatCurrency'
import { PlusCircle, Pencil, Trash2, Receipt } from 'lucide-react'
import { format } from 'date-fns'

const STATUSES = ['Paid', 'Unpaid', 'Upcoming']
const defaultForm = { bill_name: '', due_date: '', budgeted: '', actual: '', paid_status: 'Unpaid', notes: '' }

export default function BillsPage() {
  const { monthLabel } = useMonth()
  const { bills, loading, add, update, remove } = useBills()
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [deleteId, setDeleteId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('All')

  function openAdd() { setForm(defaultForm); setEditItem(null); setModal(true) }
  function openEdit(item) { setForm({ ...item, due_date: item.due_date?.slice(0, 10) || '' }); setEditItem(item); setModal(true) }
  function set(f) { return e => setForm(p => ({ ...p, [f]: e.target.value })) }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, budgeted: parseFloat(form.budgeted) || 0, actual: parseFloat(form.actual) || 0 }
    const ok = editItem ? await update(editItem.id, payload) : await add(payload)
    setSaving(false)
    if (ok) setModal(false)
  }

  async function handleDelete(id) { await remove(id); setDeleteId(null) }

  const filtered = filter === 'All' ? bills : bills.filter(b => b.paid_status === filter)
  const totalBudgeted = bills.reduce((s, r) => s + (parseFloat(r.budgeted) || 0), 0)
  const totalActual = bills.reduce((s, r) => s + (parseFloat(r.actual) || 0), 0)
  const paidCount = bills.filter(b => b.paid_status === 'Paid').length

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bills</h1>
          <p className="text-sm text-gray-400 mt-0.5">{monthLabel}</p>
        </div>
        <button onClick={openAdd} className="btn-primary" id="bills-add-btn">
          <PlusCircle className="w-4 h-4" /> Add Bill
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="card overflow-hidden"><div className="section-header-lavender">Budgeted</div><div className="px-5 py-4"><span className="text-2xl font-bold">{formatCurrency(totalBudgeted)}</span></div></div>
        <div className="card overflow-hidden"><div className="section-header-blue">Actual Paid</div><div className="px-5 py-4"><span className="text-2xl font-bold">{formatCurrency(totalActual)}</span></div></div>
        <div className="card overflow-hidden"><div className="section-header-sage">Bills Paid</div><div className="px-5 py-4"><span className="text-2xl font-bold">{paidCount}/{bills.length}</span></div></div>
        <div className="card overflow-hidden">
          <div className={`section-header-${totalActual > totalBudgeted ? 'blush' : 'sage'}`}>Difference</div>
          <div className="px-5 py-4"><span className={`text-2xl font-bold ${totalActual > totalBudgeted ? 'text-negative' : 'text-positive'}`}>{formatCurrency(totalBudgeted - totalActual)}</span></div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {['All', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === s ? 'bg-lavender-200 text-lavender-800' : 'bg-white text-gray-500 hover:bg-cream-100 border border-gray-200'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="section-header-lavender flex items-center gap-2">
          <Receipt className="w-4 h-4" /> Bill Tracker
        </div>
        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <EmptyState icon={Receipt} title="No bills" description="Add your first bill to track." action={openAdd} actionLabel="Add Bill" />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bill Name</th>
                  <th>Due Date</th>
                  <th className="text-right">Budgeted</th>
                  <th className="text-right">Actual</th>
                  <th className="text-right">Diff</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const diff = (parseFloat(r.budgeted) || 0) - (parseFloat(r.actual) || 0)
                  const overBudget = parseFloat(r.actual) > parseFloat(r.budgeted)
                  return (
                    <tr key={r.id}>
                      <td className="font-medium">{r.bill_name}</td>
                      <td className="text-gray-500">{r.due_date ? format(new Date(r.due_date), 'MMM d') : '—'}</td>
                      <td className="text-right">{formatCurrency(r.budgeted)}</td>
                      <td className={`text-right font-medium ${overBudget ? 'text-negative' : ''}`}>{formatCurrency(r.actual)}</td>
                      <td className={`text-right font-medium ${diff >= 0 ? 'text-positive' : 'text-negative'}`}>{formatCurrency(diff)}</td>
                      <td><Badge status={r.paid_status} /></td>
                      <td className="text-gray-400 text-xs max-w-[100px] truncate">{r.notes || '—'}</td>
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
                  <td colSpan={2}>Total</td>
                  <td className="text-right">{formatCurrency(totalBudgeted)}</td>
                  <td className="text-right">{formatCurrency(totalActual)}</td>
                  <td className={`text-right ${totalBudgeted - totalActual >= 0 ? 'text-positive' : 'text-negative'}`}>{formatCurrency(totalBudgeted - totalActual)}</td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editItem ? 'Edit Bill' : 'Add Bill'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Bill Name *</label>
              <input className="form-input" value={form.bill_name} onChange={set('bill_name')} placeholder="e.g. Rent" required />
            </div>
            <div>
              <label className="form-label">Due Date</label>
              <input type="date" className="form-input" value={form.due_date} onChange={set('due_date')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Budgeted ($)</label>
              <input type="number" step="0.01" className="form-input" value={form.budgeted} onChange={set('budgeted')} placeholder="0.00" />
            </div>
            <div>
              <label className="form-label">Actual ($)</label>
              <input type="number" step="0.01" className="form-input" value={form.actual} onChange={set('actual')} placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="form-label">Status</label>
            <select className="form-input" value={form.paid_status} onChange={set('paid_status')}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Notes</label>
            <textarea className="form-input" rows={2} value={form.notes} onChange={set('notes')} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (editItem ? 'Update' : 'Add Bill')}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Bill" size="sm">
        <p className="text-sm text-gray-500 mb-6">Delete this bill? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={() => handleDelete(deleteId)} className="btn-danger flex-1 justify-center">Delete</button>
        </div>
      </Modal>
    </Layout>
  )
}
