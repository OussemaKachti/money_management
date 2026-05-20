import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export function useSavings() {
  const { user } = useAuth()
  const [savings, setSavings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('savings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) { toast.error('Failed to load savings'); console.error(error) }
    else setSavings(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  async function add(record) {
    const { data, error } = await supabase.from('savings').insert([{ ...record, user_id: user.id }]).select().single()
    if (error) { toast.error('Failed to add savings goal'); return false }
    setSavings(prev => [data, ...prev])
    toast.success('Savings goal added!')
    return true
  }

  async function update(id, record) {
    const { data, error } = await supabase.from('savings').update(record).eq('id', id).select().single()
    if (error) { toast.error('Failed to update savings goal'); return false }
    setSavings(prev => prev.map(r => r.id === id ? data : r))
    toast.success('Savings goal updated!')
    return true
  }

  async function remove(id) {
    const { error } = await supabase.from('savings').delete().eq('id', id)
    if (error) { toast.error('Failed to delete savings goal'); return false }
    setSavings(prev => prev.filter(r => r.id !== id))
    toast.success('Savings goal deleted')
    return true
  }

  return { savings, loading, add, update, remove, refetch: fetch }
}
