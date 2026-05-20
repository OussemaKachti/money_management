import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useMonth } from '../context/MonthContext'
import toast from 'react-hot-toast'

export function useIncome() {
  const { user } = useAuth()
  const { startDate, endDate } = useMonth()
  const [income, setIncome] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('income')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('created_at', { ascending: false })
    if (error) { toast.error('Failed to load income'); console.error(error) }
    else setIncome(data || [])
    setLoading(false)
  }, [user, startDate, endDate])

  useEffect(() => { fetch() }, [fetch])

  async function add(record) {
    const { data, error } = await supabase.from('income').insert([{ ...record, user_id: user.id }]).select().single()
    if (error) { toast.error('Failed to add income'); return false }
    setIncome(prev => [data, ...prev])
    toast.success('Income added!')
    return true
  }

  async function update(id, record) {
    const { data, error } = await supabase.from('income').update(record).eq('id', id).select().single()
    if (error) { toast.error('Failed to update income'); return false }
    setIncome(prev => prev.map(r => r.id === id ? data : r))
    toast.success('Income updated!')
    return true
  }

  async function remove(id) {
    const { error } = await supabase.from('income').delete().eq('id', id)
    if (error) { toast.error('Failed to delete income'); return false }
    setIncome(prev => prev.filter(r => r.id !== id))
    toast.success('Income deleted')
    return true
  }

  return { income, loading, add, update, remove, refetch: fetch }
}
