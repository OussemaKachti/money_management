import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'

export function KPICard({ title, value, currency = '$', subtitle, trend, trendLabel, colorClass = 'bg-lavender-100', icon: Icon, isCurrency = true }) {
  const displayValue = isCurrency ? formatCurrency(value, currency) : value

  const trendColor = trend > 0 ? 'text-green-600' : trend < 0 ? 'text-rose-500' : 'text-gray-400'
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus

  return (
    <div className="card-hover overflow-hidden">
      {/* Colored top bar */}
      <div className={`${colorClass} px-5 py-3 flex items-center justify-between`}>
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">{title}</span>
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
      </div>
      {/* Value */}
      <div className="px-5 py-4">
        <div className={`text-2xl font-bold tracking-tight ${
          typeof value === 'number' && value < 0 ? 'text-rose-500' : 'text-gray-800'
        }`}>
          {displayValue}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}
        {trendLabel && (
          <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            <span className="text-xs font-medium">{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  )
}
