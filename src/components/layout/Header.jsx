import React from 'react'
import { ChevronLeft, ChevronRight, Calendar, Menu } from 'lucide-react'
import { useMonth } from '../../context/MonthContext'

export function Header({ onMobileMenuOpen }) {
  const { monthLabel, prevMonth, nextMonth, goToToday } = useMonth()

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Month selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-cream-100 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-lavender-500" />
            <span className="text-sm font-semibold text-gray-700 min-w-[110px] text-center">
              {monthLabel}
            </span>
          </div>

          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors text-gray-500 hover:text-gray-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={goToToday}
            className="hidden sm:block text-xs text-lavender-500 hover:text-lavender-700 font-medium px-2 py-1 rounded-lg hover:bg-lavender-50 transition-colors"
          >
            Today
          </button>
        </div>

        {/* Right side placeholder for future search/notifications */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-xs text-gray-400 font-medium">
            Personal Finance Dashboard
          </div>
        </div>
      </div>
    </header>
  )
}
