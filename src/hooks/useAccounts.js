import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export function useAccounts() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) { toast.error('Failed to load accounts'); console.error(error) }
    else setAccounts(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  async function add(record) {
    const { data, error } = await supabase.from('accounts').insert([{ ...record, user_id: user.id }]).select().single()
    if (error) { toast.error('Failed to add account'); return false }
    setAccounts(prev => [data, ...prev])
    toast.success('Account added!')
    return true
  }

  async function update(id, record) {
    const { data, error } = await supabase.from('accounts').update(record).eq('id', id).select().single()
    if (error) { toast.error('Failed to update account'); return false }
    setAccounts(prev => prev.map(r => r.id === id ? data : r))
    toast.success('Account updated!')
    return true
  }

  async function remove(id) {
    const { error } = await supabase.from('accounts').delete().eq('id', id)
    if (error) { toast.error('Failed to delete account'); return false }
    setAccounts(prev => prev.filter(r => r.id !== id))
    toast.success('Account deleted')
    return true
  }

  return { accounts, loading, add, update, remove, refetch: fetch }
}
