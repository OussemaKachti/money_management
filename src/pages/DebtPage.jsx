import React, { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useDebts } from '../hooks/useDebts'
import { formatCurrency, formatPercent } from '../utils/formatCurrency'
import { PlusCircle, Pencil, Trash2, Landmark } from 'lucide-react'
import { format } from 'date-fns'

const defaultForm = { debt_name: '', initial_amount: '', remaining_balance: '', interest_rate: '', monthly_payment: '', due_date: '', notes: '' }

export default function DebtPage() {
  const { debts, loading, add, update, remove } = useDebts()
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [deleteId, setDeleteId] = useState(null)
  const [saving, setSaving] = useState(false)

  function openAdd() { setForm(defaultForm); setEditItem(null); setModal(true) }
  function openEdit(item) { setForm({ ...item, due_date: item.due_date?.slice(0, 10) || '' }); setEditItem(item); setModal(true) }
  function set(f) { return e => setForm(p => ({ ...p, [f]: e.target.value })) }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, initial_amount: parseFloat(form.initial_amount)||0, remaining_balance: parseFloat(form.remaining_balance)||0, interest_rate: parseFloat(form.interest_rate)||0, monthly_payment: parseFloat(form.monthly_payment)||0 }
    const ok = editItem ? await update(editItem.id, payload) : await add(payload)
    setSaving(false)
    if (ok) setModal(false)
  }

  async function handleDelete(id) { await remove(id); setDeleteId(null) }

  const totalInitial = debts.reduce((s, r) => s + (parseFloat(r.initial_amount)||0), 0)
  const totalRemaining = debts.reduce((s, r) => s + (parseFloat(r.remaining_balance)||0), 0)
  const totalPayment = debts.reduce((s, r) => s + (parseFloat(r.monthly_payment)||0), 0)
  const paidOff = totalInitial > 0 ? ((totalInitial - totalRemaining) / totalInitial) * 100 : 0

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800">Debt Tracker</h1><p className="text-sm text-gray-400 mt-0.5">Monitor and pay down your debts</p></div>
        <button onClick={openAdd} className="btn-primary" id="debt-add-btn"><PlusCircle className="w-4 h-4" /> Add Debt</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="card overflow-hidden"><div className="section-header-blush">Total Debt</div><div className="px-5 py-4"><span className="text-2xl font-bold text-negative">{formatCurrency(totalInitial)}</span></div></div>
        <div className="card overflow-hidden"><div className="section-header-lavender">Remaining</div><div className="px-5 py-4"><span className="text-2xl font-bold text-negative">{formatCurrency(totalRemaining)}</span></div></div>
        <div className="card overflow-hidden"><div className="section-header-peach">Monthly</div><div className="px-5 py-4"><span className="text-2xl font-bold">{formatCurrency(totalPayment)}</span></div></div>
        <div className="card overflow-hidden"><div className="section-header-sage">Paid Off</div><div className="px-5 py-4"><span className="text-2xl font-bold text-positive">{formatPercent(paidOff)}</span></div></div>
      </div>
      <div className="card overflow-hidden">
        <div className="section-header-blush flex items-center gap-2"><Landmark className="w-4 h-4" /> Debt Overview</div>
        {loading ? <LoadingSpinner /> : debts.length === 0 ? (
          <EmptyState icon={Landmark} title="No debts" description="Add debts to track payoff progress." action={openAdd} actionLabel="Add Debt" />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Debt Name</th><th className="text-right">Initial</th><th className="text-right">Remaining</th><th className="text-right">Rate</th><th className="text-right">Monthly</th><th className="text-right">Progress</th><th>Due</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {debts.map(r => {
                  const pct = Math.min(((parseFloat(r.initial_amount)||0)-(parseFloat(r.remaining_balance)||0))/(parseFloat(r.initial_amount)||1)*100, 100)
                  return (
                    <tr key={r.id}>
                      <td className="font-medium">{r.debt_name}</td>
                      <td className="text-right">{formatCurrency(r.initial_amount)}</td>
                      <td className="text-right text-negative font-medium">{formatCurrency(r.remaining_balance)}</td>
                      <td className="text-right">{r.interest_rate}%</td>
                      <td className="text-right">{formatCurrency(r.monthly_payment)}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-sage-400 rounded-full" style={{width:`${pct}%`}} /></div>
                          <span className="text-xs font-medium text-positive">{formatPercent(pct)}</span>
                        </div>
                      </td>
                      <td className="text-gray-500">{r.due_date ? format(new Date(r.due_date),'MMM yyyy') : '—'}</td>
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
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editItem ? 'Edit Debt' : 'Add Debt'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="form-label">Debt Name *</label><input className="form-input" value={form.debt_name} onChange={set('debt_name')} placeholder="e.g. Student Loan" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">Initial Amount ($)</label><input type="number" step="0.01" className="form-input" value={form.initial_amount} onChange={set('initial_amount')} placeholder="0.00" /></div>
            <div><label className="form-label">Remaining Balance ($)</label><input type="number" step="0.01" className="form-input" value={form.remaining_balance} onChange={set('remaining_balance')} placeholder="0.00" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">Interest Rate (%)</label><input type="number" step="0.01" className="form-input" value={form.interest_rate} onChange={set('interest_rate')} placeholder="0.00" /></div>
            <div><label className="form-label">Monthly Payment ($)</label><input type="number" step="0.01" className="form-input" value={form.monthly_payment} onChange={set('monthly_payment')} placeholder="0.00" /></div>
          </div>
          <div><label className="form-label">Due Date</label><input type="date" className="form-input" value={form.due_date} onChange={set('due_date')} /></div>
          <div><label className="form-label">Notes</label><textarea className="form-input" rows={2} value={form.notes} onChange={set('notes')} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (editItem ? 'Update' : 'Add Debt')}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Debt" size="sm">
        <p className="text-sm text-gray-500 mb-6">Delete this debt? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={() => handleDelete(deleteId)} className="btn-danger flex-1 justify-center">Delete</button>
        </div>
      </Modal>
    </Layout>
  )
}
