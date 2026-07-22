import React from 'react'

interface SkeletonTableProps {
  rows?: number
  cols?: number
  className?: string
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  cols = 5,
  className = '',
}) => {
  return (
    <div className={`w-full overflow-hidden rounded-xl border border-[#e5dcd0] bg-white shadow-sm ${className}`}>
      {/* Header Skeleton */}
      <div className="flex border-b border-[#e5dcd0] bg-[#fdfbf7] p-4">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <div key={colIndex} className="flex-1 px-3">
            <div className="h-4 w-2/3 animate-pulse rounded bg-[#e8ded5]" />
          </div>
        ))}
      </div>

      {/* Rows Skeleton */}
      <div className="divide-y divide-[#f0e8e0]">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center p-4">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1 px-3">
                <div
                  className="h-4 animate-pulse rounded bg-[#f0e8e0]"
                  style={{
                    width: `${Math.max(40, Math.floor(Math.sin(rowIndex + colIndex) * 30 + 60))}%`,
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkeletonTable
