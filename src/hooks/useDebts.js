import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export function useDebts() {
  const { user } = useAuth()
  const [debts, setDebts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('debts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) { toast.error('Failed to load debts'); console.error(error) }
    else setDebts(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  async function add(record) {
    const { data, error } = await supabase.from('debts').insert([{ ...record, user_id: user.id }]).select().single()
    if (error) { toast.error('Failed to add debt'); return false }
    setDebts(prev => [data, ...prev])
    toast.success('Debt added!')
    return true
  }

  async function update(id, record) {
    const { data, error } = await supabase.from('debts').update(record).eq('id', id).select().single()
    if (error) { toast.error('Failed to update debt'); return false }
    setDebts(prev => prev.map(r => r.id === id ? data : r))
    toast.success('Debt updated!')
    return true
  }

  async function remove(id) {
    const { error } = await supabase.from('debts').delete().eq('id', id)
    if (error) { toast.error('Failed to delete debt'); return false }
    setDebts(prev => prev.filter(r => r.id !== id))
    toast.success('Debt deleted')
    return true
  }

  return { debts, loading, add, update, remove, refetch: fetch }
}
