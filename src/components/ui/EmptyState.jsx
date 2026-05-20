import React from 'react'
import { PlusCircle } from 'lucide-react'

export function EmptyState({ icon: Icon = PlusCircle, title, description, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-lavender-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-lavender-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-1">{title || 'No records yet'}</h3>
      <p className="text-sm text-gray-400 text-center max-w-xs mb-6">
        {description || 'Add your first record to get started.'}
      </p>
      {action && (
        <button onClick={action} className="btn-primary">
          <PlusCircle className="w-4 h-4" />
          {actionLabel || 'Add Record'}
        </button>
      )}
    </div>
  )
}
