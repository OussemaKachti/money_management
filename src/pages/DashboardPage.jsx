import React, { useMemo } from 'react'
import { Layout } from '../components/layout/Layout'
import { KPICard } from '../components/ui/KPICard'
import { SpendingPieChart } from '../components/charts/SpendingPieChart'
import { BudgetVsActualBar } from '../components/charts/BudgetVsActualBar'
import { CashFlowTrend } from '../components/charts/CashFlowTrend'
import { SavingsProgress } from '../components/charts/SavingsProgress'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Badge } from '../components/ui/Badge'
import { useIncome } from '../hooks/useIncome'
import { useBills } from '../hooks/useBills'
import { useExpenses } from '../hooks/useExpenses'
import { useSavings } from '../hooks/useSavings'
import { useDebts } from '../hooks/useDebts'
import { useMonth } from '../context/MonthContext'
import { calculateDashboard, groupByCategory } from '../utils/calculations'
import { formatCurrency, formatPercent } from '../utils/formatCurrency'
import {
  TrendingUp, TrendingDown, DollarSign, CreditCard,
  PiggyBank, Landmark, Wallet, BarChart2
} from 'lucide-react'

// Mock 6-month trend (replace with real data from Supabase in production)
function buildTrendData(income, expenses, monthLabel) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const totalInc = income.reduce((s, r) => s + (parseFloat(r.actual) || 0), 0)
  const totalExp = expenses.reduce((s, r) => s + (parseFloat(r.actual) || 0), 0)
  // Simulate nearby months
  return months.map((m, i) => ({
    month: m,
    Income: Math.round(totalInc * (0.8 + Math.random() * 0.4)),
    Expenses: Math.round(totalExp * (0.7 + Math.random() * 0.5)),
  }))
}

export default function DashboardPage() {
  const { monthLabel, monthName } = useMonth()
  const { income, loading: incLoading } = useIncome()
  const { bills, loading: billsLoading } = useBills()
  const { expenses, loading: expLoading } = useExpenses()
  const { savings, loading: savLoading } = useSavings()
  const { debts, loading: debtLoading } = useDebts()

  const isLoading = incLoading || billsLoading || expLoading || savLoading || debtLoading

  const metrics = useMemo(() => calculateDashboard({ income, bills, expenses, savings, debts }), [income, bills, expenses, savings, debts])
  const pieData = useMemo(() => groupByCategory(expenses), [expenses])
  const trendData = useMemo(() => buildTrendData(income, expenses, monthLabel), [income, expenses, monthLabel])

  const budgetBarData = useMemo(() => [
    { name: 'Bills', Budget: metrics.budgetedBills, Actual: metrics.totalBills },
    { name: 'Expenses', Budget: metrics.budgetedExpenses, Actual: metrics.totalExpenses },
    { name: 'Savings', Budget: metrics.totalSavings, Actual: metrics.totalCurrentSaved },
    { name: 'Debt', Budget: metrics.totalMonthlyDebt, Actual: metrics.totalMonthlyDebt },
  ], [metrics])

  if (isLoading) return <Layout><LoadingSpinner /></Layout>

  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()

  return (
    <Layout>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{monthName}</h1>
        <p className="text-sm text-gray-400 mt-0.5">★ Budget Dashboard ★</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Total Income"
          value={metrics.totalIncome}
          colorClass="bg-sage-200"
          icon={TrendingUp}
          subtitle={`Expected: ${formatCurrency(metrics.totalExpected)}`}
        />
        <KPICard
          title="Total Expenses"
          value={metrics.totalExpenses}
          colorClass="bg-blush-200"
          icon={CreditCard}
          subtitle={`Budgeted: ${formatCurrency(metrics.budgetedExpenses)}`}
        />
        <KPICard
          title="Total Savings"
          value={metrics.totalSavings}
          colorClass="bg-sky-200"
          icon={PiggyBank}
          subtitle={`Saved: ${formatCurrency(metrics.totalCurrentSaved)}`}
        />
        <KPICard
          title="Total Debt"
          value={metrics.totalDebt}
          colorClass="bg-peach-200"
          icon={Landmark}
          subtitle={`Monthly: ${formatCurrency(metrics.totalMonthlyDebt)}`}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Amount Left"
          value={metrics.amountLeft}
          colorClass="bg-lavender-200"
          icon={Wallet}
          subtitle="Income minus outflows"
        />
        <KPICard
          title="Daily Avg Expenses"
          value={metrics.dailyAvg}
          colorClass="bg-sand-200"
          icon={BarChart2}
          subtitle={`Over ${daysInMonth} days`}
        />
        <KPICard
          title="Net Cash Flow"
          value={metrics.netCashFlow}
          colorClass={metrics.netCashFlow >= 0 ? 'bg-sage-200' : 'bg-blush-200'}
          icon={metrics.netCashFlow >= 0 ? TrendingUp : TrendingDown}
          subtitle="Income - total outflows"
        />
        <KPICard
          title="Savings Rate"
          value={`${formatPercent(metrics.savingsRate)}`}
          colorClass="bg-rose-100"
          icon={PiggyBank}
          isCurrency={false}
          subtitle="of total income"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {/* Allocation Pie */}
        <div className="card lg:col-span-1 xl:col-span-1 overflow-hidden">
          <div className="section-header-lavender">Allocation Summary</div>
          <div className="p-4">
            <SpendingPieChart data={pieData} />
          </div>
        </div>

        {/* Budget vs Actual */}
        <div className="card lg:col-span-1 xl:col-span-1 overflow-hidden">
          <div className="section-header-blue">Budget vs Actual</div>
          <div className="p-4">
            <BudgetVsActualBar data={budgetBarData} />
          </div>
        </div>

        {/* Cash Flow Trend */}
        <div className="card lg:col-span-2 xl:col-span-2 overflow-hidden">
          <div className="section-header-sage">6-Month Cash Flow Trend</div>
          <div className="p-4">
            <CashFlowTrend data={trendData} />
          </div>
        </div>
      </div>

      {/* Summary Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Cash Flow Summary */}
        <div className="card overflow-hidden">
          <div className="section-header-blue">Cash Flow Summary</div>
          <div className="px-4 pb-4">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th className="text-right">Budget</th>
                  <th className="text-right">Actual</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="font-medium">Income</td><td className="text-right text-positive">{formatCurrency(metrics.totalExpected)}</td><td className="text-right text-positive">{formatCurrency(metrics.totalIncome)}</td></tr>
                <tr><td className="font-medium">Bills</td><td className="text-right">{formatCurrency(metrics.budgetedBills)}</td><td className="text-right">{formatCurrency(metrics.totalBills)}</td></tr>
                <tr><td className="font-medium">Expenses</td><td className="text-right">{formatCurrency(metrics.budgetedExpenses)}</td><td className="text-right">{formatCurrency(metrics.totalExpenses)}</td></tr>
                <tr><td className="font-medium">Savings</td><td className="text-right">{formatCurrency(metrics.totalSavings)}</td><td className="text-right">{formatCurrency(metrics.totalCurrentSaved)}</td></tr>
                <tr><td className="font-medium">Debt</td><td className="text-right">{formatCurrency(metrics.totalMonthlyDebt)}</td><td className="text-right">{formatCurrency(metrics.totalMonthlyDebt)}</td></tr>
              </tbody>
              <tfoot>
                <tr className="font-bold border-t-2 border-gray-200">
                  <td>LEFT</td>
                  <td className="text-right">{formatCurrency(metrics.totalExpected - metrics.budgetedBills - metrics.budgetedExpenses - metrics.totalSavings - metrics.totalMonthlyDebt)}</td>
                  <td className={`text-right ${metrics.amountLeft >= 0 ? 'text-positive' : 'text-negative'}`}>{formatCurrency(metrics.amountLeft)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Bills Summary */}
        <div className="card overflow-hidden">
          <div className="section-header-lavender">Bills Summary</div>
          <div className="px-4 pb-4">
            {bills.length === 0 ? (
              <p className="text-center py-8 text-sm text-gray-400">No bills this month</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Bill</th>
                    <th className="text-right">Budget</th>
                    <th className="text-right">Actual</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.slice(0, 6).map(b => (
                    <tr key={b.id}>
                      <td className="font-medium truncate max-w-[90px]">{b.bill_name}</td>
                      <td className="text-right">{formatCurrency(b.budgeted)}</td>
                      <td className={`text-right ${parseFloat(b.actual) > parseFloat(b.budgeted) ? 'text-negative' : ''}`}>{formatCurrency(b.actual)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold border-t-2 border-gray-200">
                    <td>Total</td>
                    <td className="text-right">{formatCurrency(metrics.budgetedBills)}</td>
                    <td className="text-right">{formatCurrency(metrics.totalBills)}</td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>

        {/* Savings Summary */}
        <div className="card overflow-hidden">
          <div className="section-header-sage">Savings Progress</div>
          <div className="p-4">
            <SavingsProgress savings={savings} />
          </div>
        </div>

        {/* Debt Summary */}
        <div className="card overflow-hidden">
          <div className="section-header-blush">Debt Summary</div>
          <div className="px-4 pb-4">
            {debts.length === 0 ? (
              <p className="text-center py-8 text-sm text-gray-400">No debts tracked</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Debt</th>
                    <th className="text-right">Balance</th>
                    <th className="text-right">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {debts.map(d => (
                    <tr key={d.id}>
                      <td className="font-medium truncate max-w-[90px]">{d.debt_name}</td>
                      <td className="text-right text-negative">{formatCurrency(d.remaining_balance)}</td>
                      <td className="text-right">{formatCurrency(d.monthly_payment)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold border-t-2 border-gray-200">
                    <td>Total</td>
                    <td className="text-right text-negative">{formatCurrency(metrics.totalDebt)}</td>
                    <td className="text-right">{formatCurrency(metrics.totalMonthlyDebt)}</td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
