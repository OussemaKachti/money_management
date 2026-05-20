import React, { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { SavingsProgress } from '../components/charts/SavingsProgress'
import { useSavings } from '../hooks/useSavings'
import { formatCurrency, formatPercent } from '../utils/formatCurrency'
import { PlusCircle, Pencil, Trash2, PiggyBank } from 'lucide-react'
import { format } from 'date-fns'

const defaultForm = { goal: '', target_amount: '', current_saved: '', monthly_contribution: '', deadline: '', notes: '' }

export default function SavingsPage() {
  const { savings, loading, add, update, remove } = useSavings()
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [deleteId, setDeleteId] = useState(null)
  const [saving, setSaving] = useState(false)

  function openAdd() { setForm(defaultForm); setEditItem(null); setModal(true) }
  function openEdit(item) { setForm({ ...item, deadline: item.deadline?.slice(0, 10) || '' }); setEditItem(item); setModal(true) }
  function set(f) { return e => setForm(p => ({ ...p, [f]: e.target.value })) }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      target_amount: parseFloat(form.target_amount) || 0,
      current_saved: parseFloat(form.current_saved) || 0,
      monthly_contribution: parseFloat(form.monthly_contribution) || 0,
    }
    const ok = editItem ? await update(editItem.id, payload) : await add(payload)
    setSaving(false)
    if (ok) setModal(false)
  }

  async function handleDelete(id) { await remove(id); setDeleteId(null) }

  const totalTarget = savings.reduce((s, r) => s + (parseFloat(r.target_amount) || 0), 0)
  const totalSaved = savings.reduce((s, r) => s + (parseFloat(r.current_saved) || 0), 0)
  const totalMonthly = savings.reduce((s, r) => s + (parseFloat(r.monthly_contribution) || 0), 0)
  const overallPct = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Savings</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track your savings goals</p>
        </div>
        <button onClick={openAdd} className="btn-primary" id="savings-add-btn">
          <PlusCircle className="w-4 h-4" /> Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="card overflow-hidden"><div className="section-header-sage">Total Target</div><div className="px-5 py-4"><span className="text-2xl font-bold">{formatCurrency(totalTarget)}</span></div></div>
        <div className="card overflow-hidden"><div className="section-header-blue">Total Saved</div><div className="px-5 py-4"><span className="text-2xl font-bold text-positive">{formatCurrency(totalSaved)}</span></div></div>
        <div className="card overflow-hidden"><div className="section-header-lavender">Monthly Contribution</div><div className="px-5 py-4"><span className="text-2xl font-bold">{formatCurrency(totalMonthly)}</span></div></div>
        <div className="card overflow-hidden"><div className="section-header-sand">Overall Progress</div><div className="px-5 py-4"><span className="text-2xl font-bold text-positive">{formatPercent(overallPct)}</span></div></div>
      </div>

      {savings.length > 0 && (
        <div className="card overflow-hidden mb-6">
          <div className="section-header-sage">Progress Overview</div>
          <div className="p-6">
            <SavingsProgress savings={savings} />
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="section-header-sage flex items-center gap-2">
          <PiggyBank className="w-4 h-4" /> Savings Goals
        </div>
        {loading ? <LoadingSpinner /> : savings.length === 0 ? (
          <EmptyState icon={PiggyBank} title="No savings goals" description="Create your first savings goal and start building wealth." action={openAdd} actionLabel="Add Goal" />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Goal</th>
                  <th className="text-right">Target</th>
                  <th className="text-right">Saved</th>
                  <th className="text-right">Monthly</th>
                  <th className="text-right">Progress</th>
                  <th>Deadline</th>
                  <th>Notes</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {savings.map(r => {
                  const pct = Math.min(((parseFloat(r.current_saved) || 0) / (parseFloat(r.target_amount) || 1)) * 100, 100)
                  return (
                    <tr key={r.id}>
                      <td className="font-medium">{r.goal}</td>
                      <td className="text-right">{formatCurrency(r.target_amount)}</td>
                      <td className="text-right text-positive">{formatCurrency(r.current_saved)}</td>
                      <td className="text-right">{formatCurrency(r.monthly_contribution)}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-sage-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-medium text-positive">{formatPercent(pct)}</span>
                        </div>
                      </td>
                      <td className="text-gray-500">{r.deadline ? format(new Date(r.deadline), 'MMM yyyy') : '—'}</td>
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
                  <td>Total</td>
                  <td className="text-right">{formatCurrency(totalTarget)}</td>
                  <td className="text-right text-positive">{formatCurrency(totalSaved)}</td>
                  <td className="text-right">{formatCurrency(totalMonthly)}</td>
                  <td className="text-right text-positive">{formatPercent(overallPct)}</td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editItem ? 'Edit Savings Goal' : 'Add Savings Goal'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="form-label">Goal Name *</label>
            <input className="form-input" value={form.goal} onChange={set('goal')} placeholder="e.g. Emergency Fund" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Target Amount ($)</label>
              <input type="number" step="0.01" className="form-input" value={form.target_amount} onChange={set('target_amount')} placeholder="0.00" />
            </div>
            <div>
              <label className="form-label">Currently Saved ($)</label>
              <input type="number" step="0.01" className="form-input" value={form.current_saved} onChange={set('current_saved')} placeholder="0.00" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Monthly Contribution ($)</label>
              <input type="number" step="0.01" className="form-input" value={form.monthly_contribution} onChange={set('monthly_contribution')} placeholder="0.00" />
            </div>
            <div>
              <label className="form-label">Deadline</label>
              <input type="date" className="form-input" value={form.deadline} onChange={set('deadline')} />
            </div>
          </div>
          <div>
            <label className="form-label">Notes</label>
            <textarea className="form-input" rows={2} value={form.notes} onChange={set('notes')} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (editItem ? 'Update' : 'Add Goal')}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Savings Goal" size="sm">
        <p className="text-sm text-gray-500 mb-6">Delete this savings goal? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={() => handleDelete(deleteId)} className="btn-danger flex-1 justify-center">Delete</button>
        </div>
      </Modal>
    </Layout>
  )
}
