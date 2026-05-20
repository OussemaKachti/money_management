import React from 'react'
import { formatCurrency, formatPercent } from '../../utils/formatCurrency'

export function SavingsProgress({ savings }) {
  if (!savings || savings.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-gray-400">
        No savings goals yet
      </div>
    )
  }

  const colors = ['#BBA3E8', '#93C5FD', '#A5D6A7', '#FFB3B3', '#FFD6A5']

  return (
    <div className="space-y-4">
      {savings.slice(0, 4).map((goal, idx) => {
        const target = parseFloat(goal.target_amount) || 1
        const saved = parseFloat(goal.current_saved) || 0
        const pct = Math.min((saved / target) * 100, 100)
        const color = colors[idx % colors.length]

        return (
          <div key={goal.id} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600 truncate">{goal.goal}</span>
              <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                {formatCurrency(saved)} / {formatCurrency(target)}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">{formatPercent(pct)} saved</span>
              {goal.deadline && (
                <span className="text-xs text-gray-400">Due {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
