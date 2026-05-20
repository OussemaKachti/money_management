import React, { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useAccounts } from '../hooks/useAccounts'
import { formatCurrency } from '../utils/formatCurrency'
import { PlusCircle, Pencil, Trash2, Wallet } from 'lucide-react'

const TYPES = ['Checking', 'Savings', 'Investment', 'Credit Card', 'Cash', 'Other']
const defaultForm = { account_name: '', account_type: 'Checking', balance: '', deposits: '', withdrawals: '', notes: '' }

export default function AccountsPage() {
  const { accounts, loading, add, update, remove } = useAccounts()
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [deleteId, setDeleteId] = useState(null)
  const [saving, setSaving] = useState(false)

  function openAdd() { setForm(defaultForm); setEditItem(null); setModal(true) }
  function openEdit(item) { setForm(item); setEditItem(item); setModal(true) }
  function set(f) { return e => setForm(p => ({ ...p, [f]: e.target.value })) }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, balance: parseFloat(form.balance)||0, deposits: parseFloat(form.deposits)||0, withdrawals: parseFloat(form.withdrawals)||0 }
    const ok = editItem ? await update(editItem.id, payload) : await add(payload)
    setSaving(false)
    if (ok) setModal(false)
  }

  async function handleDelete(id) { await remove(id); setDeleteId(null) }

  const totalBalance = accounts.reduce((s, r) => s + (parseFloat(r.balance)||0), 0)
  const totalDeposits = accounts.reduce((s, r) => s + (parseFloat(r.deposits)||0), 0)
  const totalWithdrawals = accounts.reduce((s, r) => s + (parseFloat(r.withdrawals)||0), 0)

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800">Accounts & Wallets</h1><p className="text-sm text-gray-400 mt-0.5">Track all your financial accounts</p></div>
        <button onClick={openAdd} className="btn-primary" id="accounts-add-btn"><PlusCircle className="w-4 h-4" /> Add Account</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card overflow-hidden"><div className="section-header-blue">Net Balance</div><div className="px-5 py-4"><span className="text-2xl font-bold text-positive">{formatCurrency(totalBalance)}</span></div></div>
        <div className="card overflow-hidden"><div className="section-header-sage">Total Deposits</div><div className="px-5 py-4"><span className="text-2xl font-bold text-positive">{formatCurrency(totalDeposits)}</span></div></div>
        <div className="card overflow-hidden"><div className="section-header-blush">Total Withdrawals</div><div className="px-5 py-4"><span className="text-2xl font-bold text-negative">{formatCurrency(totalWithdrawals)}</span></div></div>
      </div>

      <div className="card overflow-hidden">
        <div className="section-header-blue flex items-center gap-2"><Wallet className="w-4 h-4" /> Account Summary</div>
        {loading ? <LoadingSpinner /> : accounts.length === 0 ? (
          <EmptyState icon={Wallet} title="No accounts" description="Add your bank accounts and wallets to track balances." action={openAdd} actionLabel="Add Account" />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Account Name</th><th>Type</th><th className="text-right">Balance</th><th className="text-right">Deposits</th><th className="text-right">Withdrawals</th><th className="text-right">Net</th><th>Notes</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {accounts.map(r => {
                  const net = (parseFloat(r.balance)||0) + (parseFloat(r.deposits)||0) - (parseFloat(r.withdrawals)||0)
                  return (
                    <tr key={r.id}>
                      <td className="font-medium">{r.account_name}</td>
                      <td><span className="px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full text-xs font-medium">{r.account_type}</span></td>
                      <td className="text-right font-medium">{formatCurrency(r.balance)}</td>
                      <td className="text-right text-positive">{formatCurrency(r.deposits)}</td>
                      <td className="text-right text-negative">{formatCurrency(r.withdrawals)}</td>
                      <td className={`text-right font-bold ${net >= 0 ? 'text-positive' : 'text-negative'}`}>{formatCurrency(net)}</td>
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
                  <td className="text-right">{formatCurrency(totalBalance)}</td>
                  <td className="text-right text-positive">{formatCurrency(totalDeposits)}</td>
                  <td className="text-right text-negative">{formatCurrency(totalWithdrawals)}</td>
                  <td className="text-right text-positive">{formatCurrency(totalBalance+totalDeposits-totalWithdrawals)}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editItem ? 'Edit Account' : 'Add Account'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">Account Name *</label><input className="form-input" value={form.account_name} onChange={set('account_name')} placeholder="e.g. Chase Checking" required /></div>
            <div><label className="form-label">Account Type</label><select className="form-input" value={form.account_type} onChange={set('account_type')}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="form-label">Balance ($)</label><input type="number" step="0.01" className="form-input" value={form.balance} onChange={set('balance')} placeholder="0.00" /></div>
            <div><label className="form-label">Deposits ($)</label><input type="number" step="0.01" className="form-input" value={form.deposits} onChange={set('deposits')} placeholder="0.00" /></div>
            <div><label className="form-label">Withdrawals ($)</label><input type="number" step="0.01" className="form-input" value={form.withdrawals} onChange={set('withdrawals')} placeholder="0.00" /></div>
          </div>
          <div><label className="form-label">Notes</label><textarea className="form-input" rows={2} value={form.notes} onChange={set('notes')} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (editItem ? 'Update' : 'Add Account')}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Account" size="sm">
        <p className="text-sm text-gray-500 mb-6">Delete this account? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={() => handleDelete(deleteId)} className="btn-danger flex-1 justify-center">Delete</button>
        </div>
      </Modal>
    </Layout>
  )
}
