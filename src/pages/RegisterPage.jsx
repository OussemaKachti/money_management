import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { seedDemoData } from '../utils/seedData'
import { Sparkles, Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [seedLoading, setSeedLoading] = useState(false)
  const [showSeed, setShowSeed] = useState(false)
  const [userId, setUserId] = useState(null)

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    const { data, error: err } = await signUp(form.email, form.password, form.name)
    setLoading(false)
    if (err) { setError(err.message); return }
    setUserId(data?.user?.id)
    setShowSeed(true)
  }

  async function loadDemoData() {
    if (!userId) { navigate('/dashboard'); return }
    setSeedLoading(true)
    const result = await seedDemoData(userId)
    setSeedLoading(false)
    if (result.success) {
      toast.success('Demo data loaded! Your dashboard is ready 🎉')
    } else {
      toast.error('Could not load demo data, but you can add your own!')
    }
    navigate('/dashboard')
  }

  function skipSeed() {
    navigate('/dashboard')
  }

  if (showSeed) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-10 text-center">
            <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Account created! 🎉</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Would you like to load some demo data so your dashboard looks great right away?
              You can always clear it later.
            </p>
            <div className="space-y-3">
              <button
                onClick={loadDemoData}
                disabled={seedLoading}
                className="btn-primary w-full justify-center py-3"
                id="load-demo-btn"
              >
                {seedLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : '✨ Load Demo Data'}
              </button>
              <button onClick={skipSeed} className="btn-secondary w-full justify-center py-3" id="skip-demo-btn">
                Start Empty
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="fixed top-0 right-0 w-96 h-96 bg-lavender-100 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/4 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-sage-100 rounded-full blur-3xl opacity-40 -translate-x-1/3 pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-lavender-300 to-lavender-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="block text-base font-bold text-gray-800">Luminary</span>
              <span className="block text-xs text-gray-400 -mt-0.5">Budget</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create your account</h1>
          <p className="text-sm text-gray-400">Start managing your finances beautifully</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-blush-50 border border-blush-200 rounded-xl text-rose-600 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="form-label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input id="reg-name" type="text" value={form.name} onChange={set('name')}
                  className="form-input pl-10" placeholder="Jane Doe" required />
              </div>
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input id="reg-email" type="email" value={form.email} onChange={set('email')}
                  className="form-input pl-10" placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input id="reg-password" type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')}
                  className="form-input pl-10 pr-10" placeholder="Min. 6 characters" required />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="form-label">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input id="reg-confirm" type="password" value={form.confirm} onChange={set('confirm')}
                  className="form-input pl-10" placeholder="Repeat password" required />
              </div>
            </div>

            <button type="submit" disabled={loading} id="register-submit"
              className="btn-primary w-full justify-center py-3 text-base">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-lavender-600 font-semibold hover:text-lavender-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
