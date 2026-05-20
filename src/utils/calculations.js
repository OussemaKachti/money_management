/**
 * Calculate dashboard summary metrics
 */
export function calculateDashboard({ income, bills, expenses, savings, debts }) {
  const totalIncome = income.reduce((s, r) => s + (parseFloat(r.actual) || 0), 0)
  const totalExpected = income.reduce((s, r) => s + (parseFloat(r.expected) || 0), 0)

  const totalBills = bills.reduce((s, r) => s + (parseFloat(r.actual) || 0), 0)
  const budgetedBills = bills.reduce((s, r) => s + (parseFloat(r.budgeted) || 0), 0)

  const totalExpenses = expenses.reduce((s, r) => s + (parseFloat(r.actual) || 0), 0)
  const budgetedExpenses = expenses.reduce((s, r) => s + (parseFloat(r.budget) || 0), 0)

  const totalSavings = savings.reduce((s, r) => s + (parseFloat(r.monthly_contribution) || 0), 0)
  const totalSavingsTarget = savings.reduce((s, r) => s + (parseFloat(r.target_amount) || 0), 0)
  const totalCurrentSaved = savings.reduce((s, r) => s + (parseFloat(r.current_saved) || 0), 0)

  const totalDebt = debts.reduce((s, r) => s + (parseFloat(r.remaining_balance) || 0), 0)
  const totalMonthlyDebt = debts.reduce((s, r) => s + (parseFloat(r.monthly_payment) || 0), 0)

  const totalOutflow = totalBills + totalExpenses + totalSavings + totalMonthlyDebt
  const amountLeft = totalIncome - totalOutflow
  const netCashFlow = totalIncome - totalOutflow
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0

  // Daily average (30 days)
  const dailyAvg = totalExpenses / 30

  return {
    totalIncome,
    totalExpected,
    totalBills,
    budgetedBills,
    totalExpenses,
    budgetedExpenses,
    totalSavings,
    totalSavingsTarget,
    totalCurrentSaved,
    totalDebt,
    totalMonthlyDebt,
    totalOutflow,
    amountLeft,
    netCashFlow,
    savingsRate,
    dailyAvg,
  }
}

/**
 * Group expenses by category for pie chart
 */
export function groupByCategory(expenses) {
  const map = {}
  expenses.forEach(e => {
    const key = e.category || 'Other'
    map[key] = (map[key] || 0) + (parseFloat(e.actual) || 0)
  })
  return Object.entries(map).map(([name, value]) => ({ name, value }))
}

/**
 * Get bills by status counts
 */
export function getBillStats(bills) {
  const paid = bills.filter(b => b.paid_status === 'Paid').length
  const unpaid = bills.filter(b => b.paid_status === 'Unpaid').length
  const upcoming = bills.filter(b => b.paid_status === 'Upcoming').length
  return { paid, unpaid, upcoming, total: bills.length }
}
