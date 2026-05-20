import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useMonth } from '../context/MonthContext'
import toast from 'react-hot-toast'

export function useBills() {
  const { user } = useAuth()
  const { year, month } = useMonth()
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)

  // Bills are filtered by the year/month of their due_date
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) { toast.error('Failed to load bills'); console.error(error) }
    else setBills(data || [])
    setLoading(false)
  }, [user, monthStr])

  useEffect(() => { fetch() }, [fetch])

  async function add(record) {
    const { data, error } = await supabase.from('bills').insert([{ ...record, user_id: user.id }]).select().single()
    if (error) { toast.error('Failed to add bill'); return false }
    setBills(prev => [data, ...prev])
    toast.success('Bill added!')
    return true
  }

  async function update(id, record) {
    const { data, error } = await supabase.from('bills').update(record).eq('id', id).select().single()
    if (error) { toast.error('Failed to update bill'); return false }
    setBills(prev => prev.map(r => r.id === id ? data : r))
    toast.success('Bill updated!')
    return true
  }

  async function remove(id) {
    const { error } = await supabase.from('bills').delete().eq('id', id)
    if (error) { toast.error('Failed to delete bill'); return false }
    setBills(prev => prev.filter(r => r.id !== id))
    toast.success('Bill deleted')
    return true
  }

  return { bills, loading, add, update, remove, refetch: fetch }
}
