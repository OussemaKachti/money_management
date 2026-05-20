import { supabase } from '../lib/supabase'
import { format, subMonths } from 'date-fns'

/**
 * Insert demo data for a new user
 */
export async function seedDemoData(userId) {
  const today = new Date()
  const currentMonth = format(today, 'yyyy-MM')
  const firstDay = `${currentMonth}-01`

  try {
    // Income
    await supabase.from('income').insert([
      { user_id: userId, date: firstDay, source: 'Paycheck', category: 'Salary', expected: 5500, actual: 5500.45 },
      { user_id: userId, date: firstDay, source: 'Freelance', category: 'Business', expected: 1000, actual: 800 },
      { user_id: userId, date: firstDay, source: 'Side Hustle', category: 'Side Income', expected: 500, actual: 350 },
      { user_id: userId, date: firstDay, source: 'Dividends', category: 'Investments', expected: 150, actual: 120 },
    ])

    // Bills
    await supabase.from('bills').insert([
      { user_id: userId, bill_name: 'Rent', due_date: `${currentMonth}-01`, budgeted: 1500, actual: 1500, paid_status: 'Paid' },
      { user_id: userId, bill_name: 'Electricity', due_date: `${currentMonth}-15`, budgeted: 120, actual: 98, paid_status: 'Paid' },
      { user_id: userId, bill_name: 'Internet', due_date: `${currentMonth}-10`, budgeted: 60, actual: 60, paid_status: 'Paid' },
      { user_id: userId, bill_name: 'Water', due_date: `${currentMonth}-20`, budgeted: 45, actual: 0, paid_status: 'Upcoming' },
      { user_id: userId, bill_name: 'Gym', due_date: `${currentMonth}-05`, budgeted: 50, actual: 50, paid_status: 'Paid' },
      { user_id: userId, bill_name: 'Health Insurance', due_date: `${currentMonth}-01`, budgeted: 250, actual: 250, paid_status: 'Paid' },
      { user_id: userId, bill_name: 'Netflix', due_date: `${currentMonth}-12`, budgeted: 18, actual: 18, paid_status: 'Paid' },
      { user_id: userId, bill_name: 'Spotify', due_date: `${currentMonth}-12`, budgeted: 10, actual: 10, paid_status: 'Paid' },
    ])

    // Expenses
    await supabase.from('expenses').insert([
      { user_id: userId, date: firstDay, category: 'Food', subcategory: 'Groceries', payment_method: 'Credit Card', budget: 400, actual: 380 },
      { user_id: userId, date: firstDay, category: 'Food', subcategory: 'Dining Out', payment_method: 'Credit Card', budget: 200, actual: 165 },
      { user_id: userId, date: firstDay, category: 'Transportation', subcategory: 'Gas', payment_method: 'Credit Card', budget: 150, actual: 130 },
      { user_id: userId, date: firstDay, category: 'Transportation', subcategory: 'Parking', payment_method: 'Cash', budget: 50, actual: 35 },
      { user_id: userId, date: firstDay, category: 'Health', subcategory: 'Pharmacy', payment_method: 'Cash', budget: 80, actual: 45 },
      { user_id: userId, date: firstDay, category: 'Education', subcategory: 'Online Courses', payment_method: 'Credit Card', budget: 100, actual: 79 },
      { user_id: userId, date: firstDay, category: 'Entertainment', subcategory: 'Movies', payment_method: 'Cash', budget: 60, actual: 30 },
      { user_id: userId, date: firstDay, category: 'Beauty', subcategory: 'Personal Care', payment_method: 'Cash', budget: 80, actual: 65 },
      { user_id: userId, date: firstDay, category: 'Household', subcategory: 'Cleaning Supplies', payment_method: 'Cash', budget: 50, actual: 42 },
    ])

    // Savings
    await supabase.from('savings').insert([
      { user_id: userId, goal: 'Emergency Fund', target_amount: 10000, current_saved: 4500, monthly_contribution: 300, deadline: `${today.getFullYear() + 1}-12-31` },
      { user_id: userId, goal: 'Vacation', target_amount: 3000, current_saved: 800, monthly_contribution: 200, deadline: `${today.getFullYear()}-12-31` },
      { user_id: userId, goal: 'New Car', target_amount: 15000, current_saved: 2000, monthly_contribution: 500, deadline: `${today.getFullYear() + 2}-06-30` },
    ])

    // Debts
    await supabase.from('debts').insert([
      { user_id: userId, debt_name: 'Student Loan', initial_amount: 25000, remaining_balance: 18500, interest_rate: 5.5, monthly_payment: 350, due_date: `${today.getFullYear() + 5}-12-31` },
      { user_id: userId, debt_name: 'Credit Card', initial_amount: 3000, remaining_balance: 1200, interest_rate: 19.9, monthly_payment: 200, due_date: `${today.getFullYear()}-12-31` },
    ])

    // Accounts
    await supabase.from('accounts').insert([
      { user_id: userId, account_name: 'Chase Checking', account_type: 'Checking', balance: 4250.80, deposits: 6770.45, withdrawals: 2519.65 },
      { user_id: userId, account_name: 'Savings Account', account_type: 'Savings', balance: 7300, deposits: 500, withdrawals: 0 },
      { user_id: userId, account_name: 'Investment Account', account_type: 'Investment', balance: 15400, deposits: 200, withdrawals: 0 },
    ])

    return { success: true }
  } catch (err) {
    console.error('Seed error:', err)
    return { success: false, error: err }
  }
}
