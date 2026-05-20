import React, { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import { User, DollarSign, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const CURRENCIES = [
  { symbol: '$', label: 'USD — US Dollar' },
  { symbol: '€', label: 'EUR — Euro' },
  { symbol: '£', label: 'GBP — British Pound' },
  { symbol: '₱', label: 'PHP — Philippine Peso' },
  { symbol: '¥', label: 'JPY — Japanese Yen' },
  { symbol: 'C$', label: 'CAD — Canadian Dollar' },
  { symbol: 'A$', label: 'AUD — Australian Dollar' },
]

export default function SettingsPage() {
  const { user, profile, updateProfile } = useAuth()
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    currency: profile?.currency || '$',
  })
  const [saving, setSaving] = useState(false)

  function set(f) { return e => setForm(p => ({ ...p, [f]: e.target.value })) }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    const { error } = await updateProfile(form)
    setSaving(false)
    if (error) toast.error('Failed to save settings')
    else toast.success('Settings saved!')
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your account preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <div className="card overflow-hidden">
          <div className="section-header-lavender flex items-center gap-2">
            <User className="w-4 h-4" /> Profile Settings
          </div>
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div>
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.full_name} onChange={set('full_name')} placeholder="Your name" id="settings-name" />
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <input className="form-input bg-gray-50 cursor-not-allowed" value={user?.email || ''} disabled />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed here.</p>
            </div>
            <div>
              <label className="form-label flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" />Currency</label>
              <select className="form-input" value={form.currency} onChange={set('currency')} id="settings-currency">
                {CURRENCIES.map(c => (
                  <option key={c.symbol} value={c.symbol}>{c.symbol} — {c.label}</option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={saving} className="btn-primary" id="settings-save">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" />Save Settings</>}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="card overflow-hidden">
          <div className="section-header-sand">Account Information</div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">User ID</span>
              <span className="text-xs font-mono text-gray-400 truncate max-w-[200px]">{user?.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm font-medium text-gray-700">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-500">Member Since</span>
              <span className="text-sm text-gray-700">{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card overflow-hidden">
          <div className="section-header-sky">About Luminary Budget</div>
          <div className="p-6">
            <p className="text-sm text-gray-500 leading-relaxed">
              Luminary Budget is a premium personal finance dashboard built with React, Tailwind CSS, and Supabase.
              Your data is encrypted and secured with Row Level Security — only you can access your records.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['React 18', 'Tailwind CSS', 'Supabase', 'Recharts', 'Lucide Icons'].map(t => (
                <span key={t} className="px-2.5 py-1 bg-lavender-100 text-lavender-700 rounded-lg text-xs font-medium">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
