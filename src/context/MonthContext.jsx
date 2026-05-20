import React, { createContext, useContext, useState } from 'react'
import { format, startOfMonth, endOfMonth } from 'date-fns'

const MonthContext = createContext(null)

export function MonthProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth() // 0-indexed
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const monthName = format(selectedDate, 'MMMM')
  const monthLabel = format(selectedDate, 'MMMM yyyy')

  // For Supabase date filtering (YYYY-MM-DD)
  const startDate = format(monthStart, 'yyyy-MM-dd')
  const endDate = format(monthEnd, 'yyyy-MM-dd')

  function prevMonth() {
    setSelectedDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }

  function nextMonth() {
    setSelectedDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  function goToToday() {
    setSelectedDate(new Date())
  }

  const value = {
    selectedDate,
    setSelectedDate,
    year,
    month,
    monthName,
    monthLabel,
    startDate,
    endDate,
    prevMonth,
    nextMonth,
    goToToday,
  }

  return <MonthContext.Provider value={value}>{children}</MonthContext.Provider>
}

export function useMonth() {
  const context = useContext(MonthContext)
  if (!context) throw new Error('useMonth must be used within MonthProvider')
  return context
}
