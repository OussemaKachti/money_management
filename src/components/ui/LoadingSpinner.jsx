import React from 'react'

export function LoadingSpinner({ size = 'md', fullScreen = false }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-cream-100 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className={`${sizes.lg} border-4 border-lavender-200 border-t-lavender-400 rounded-full animate-spin`} />
          <p className="text-sm text-gray-500 font-medium">Loading your finances...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className={`${sizes[size]} border-3 border-lavender-200 border-t-lavender-400 rounded-full animate-spin`} />
    </div>
  )
}
