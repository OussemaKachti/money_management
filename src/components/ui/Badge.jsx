import React from 'react'

export function Badge({ status }) {
  const styles = {
    Paid: 'badge-paid',
    Unpaid: 'badge-unpaid',
    Upcoming: 'badge-upcoming',
    Active: 'badge-paid',
    'In Progress': 'badge-upcoming',
    Completed: 'badge-paid',
    Overdue: 'badge-unpaid',
  }
  return (
    <span className={styles[status] || 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600'}>
      {status}
    </span>
  )
}
