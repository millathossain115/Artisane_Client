import React from 'react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  message?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  message = 'There are no items to display at the moment.',
  icon,
  action,
  className = '',
}) => {
  return (
    <div
      className={`my-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e5dcd0] bg-[#fdfbf7]/50 p-10 text-center ${className}`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0e8e0] text-[#5c3d2e]">
        {icon || <Inbox className="h-7 w-7" />}
      </div>
      <h3 className="mb-1 text-lg font-semibold text-[#2d1810]">{title}</h3>
      <p className="mb-4 max-w-sm text-sm text-[#7a6b63]">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export default EmptyState
