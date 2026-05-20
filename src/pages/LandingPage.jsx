import React from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, TrendingUp, Shield, BarChart2, PiggyBank, CreditCard,
  ArrowRight, CheckCircle2, Star
} from 'lucide-react'

const features = [
  { icon: TrendingUp, label: 'Income Tracking', desc: 'Monitor all income sources and track against expected amounts.', color: 'bg-sage-100 text-green-600' },
  { icon: CreditCard, label: 'Expense Management', desc: 'Categorize spending and stay within your monthly budget.', color: 'bg-blush-100 text-rose-600' },
  { icon: BarChart2, label: 'Visual Analytics', desc: 'Beautiful charts that make your finances easy to understand.', color: 'bg-lavender-100 text-lavender-600' },
  { icon: PiggyBank, label: 'Savings Goals', desc: 'Set goals, track progress, and reach your financial dreams.', color: 'bg-sky-100 text-sky-600' },
  { icon: Shield, label: 'Bank-Level Security', desc: 'Your data is protected with Supabase Row Level Security.', color: 'bg-peach-100 text-orange-600' },
  { icon: Sparkles, label: 'Smart Dashboard', desc: 'Auto-calculated KPIs, summaries, and monthly snapshots.', color: 'bg-sand-100 text-amber-600' },
]

const testimonials = [
  { name: 'Sarah M.', role: 'Freelancer', text: 'Finally a budget app that\'s actually beautiful to use. I actually look forward to tracking my finances now!', rating: 5 },
  { name: 'James L.', role: 'Small Business Owner', text: 'The dashboard gives me a complete picture of my finances at a glance. Game changer.', rating: 5 },
  { name: 'Priya K.', role: 'Marketing Manager', text: 'Clean, elegant, and so easy to use. This replaced my entire Excel spreadsheet setup.', rating: 5 },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-100 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-lavender-300 to-lavender-500 flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-gray-800">Luminary Budget</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-sm py-2 px-4">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-lavender-100 rounded-full blur-3xl opacity-60 translate-x-1/2 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blush-100 rounded-full blur-3xl opacity-50 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-sky-100 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-lavender-100 rounded-full text-lavender-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Premium Personal Finance Dashboard
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
            Your finances,{' '}
            <span className="bg-gradient-to-r from-lavender-500 to-sky-400 bg-clip-text text-transparent">
              beautifully
            </span>{' '}
            organized
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Track income, bills, expenses, savings, and debt — all in one elegant dashboard.
            Make smarter financial decisions with real-time insights and stunning visualizations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base py-3 px-8 shadow-md hover:shadow-lg">
              Start for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-secondary text-base py-3 px-8">
              Sign In to Dashboard
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-gray-400">
            {['Free to start', 'No credit card', 'Bank-level security'].map(item => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sage-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Mock */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-hover border border-gray-100 overflow-hidden p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Income', value: '$6,770.45', color: 'bg-sage-100' },
                { label: 'Total Expenses', value: '$2,519.00', color: 'bg-blush-100' },
                { label: 'Total Savings', value: '$1,000.00', color: 'bg-sky-100' },
                { label: 'Amount Left', value: '$2,400.45', color: 'bg-lavender-100' },
              ].map(card => (
                <div key={card.label} className="card overflow-hidden">
                  <div className={`${card.color} px-4 py-2`}>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">{card.label}</span>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-xl font-bold text-gray-800">{card.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Cash Flow Summary', color: 'section-header-blue' },
                { label: 'Bill Tracker', color: 'section-header-lavender' },
                { label: 'Expense Tracker', color: 'section-header-peach' },
              ].map(s => (
                <div key={s.label} className="card overflow-hidden">
                  <div className={s.color}>{s.label}</div>
                  <div className="p-4 space-y-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-3 bg-gray-100 rounded-full" style={{ width: `${60 + i*10}%` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Everything you need</h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto">A complete personal finance toolkit wrapped in a premium, beautiful interface.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, label, desc, color }) => (
              <div key={label} className="card-hover p-6">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1.5">{label}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Loved by thousands</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, rating }) => (
              <div key={name} className="card p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">"{text}"</p>
                <div>
                  <p className="text-xs font-semibold text-gray-700">{name}</p>
                  <p className="text-xs text-gray-400">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-lavender-100 via-blush-50 to-sky-100 rounded-3xl p-12 border border-lavender-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to take control?</h2>
            <p className="text-gray-500 mb-8">Join thousands managing their finances with confidence.</p>
            <Link to="/register" className="btn-primary text-base py-3 px-10 shadow-md">
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-lavender-300 to-lavender-500 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-600">Luminary Budget</span>
          </div>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Luminary Budget. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
