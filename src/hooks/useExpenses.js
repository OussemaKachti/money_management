import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useMonth } from '../context/MonthContext'
import toast from 'react-hot-toast'

export function useExpenses() {
  const { user } = useAuth()
  const { startDate, endDate } = useMonth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('created_at', { ascending: false })
    if (error) { toast.error('Failed to load expenses'); console.error(error) }
    else setExpenses(data || [])
    setLoading(false)
  }, [user, startDate, endDate])

  useEffect(() => { fetch() }, [fetch])

  async function add(record) {
    const { data, error } = await supabase.from('expenses').insert([{ ...record, user_id: user.id }]).select().single()
    if (error) { toast.error('Failed to add expense'); return false }
    setExpenses(prev => [data, ...prev])
    toast.success('Expense added!')
    return true
  }

  async function update(id, record) {
    const { data, error } = await supabase.from('expenses').update(record).eq('id', id).select().single()
    if (error) { toast.error('Failed to update expense'); return false }
    setExpenses(prev => prev.map(r => r.id === id ? data : r))
    toast.success('Expense updated!')
    return true
  }

  async function remove(id) {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (error) { toast.error('Failed to delete expense'); return false }
    setExpenses(prev => prev.filter(r => r.id !== id))
    toast.success('Expense deleted')
    return true
  }

  return { expenses, loading, add, update, remove, refetch: fetch }
}
