import React from 'react'

interface SkeletonCardProps {
  count?: number
  gridCols?: string
  className?: string
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  count = 4,
  gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  className = '',
}) => {
  return (
    <div className={`grid gap-6 ${gridCols} ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-[#e5dcd0]/60 bg-white p-4 shadow-sm"
        >
          <div className="mb-4 h-48 w-full rounded-xl bg-[#f0e8e0]" />
          <div className="mb-2 h-4 w-3/4 rounded bg-[#e8ded5]" />
          <div className="mb-4 h-3 w-1/2 rounded bg-[#f0e8e0]" />
          <div className="flex items-center justify-between pt-2">
            <div className="h-5 w-1/4 rounded bg-[#e8ded5]" />
            <div className="h-9 w-24 rounded-lg bg-[#f0e8e0]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default SkeletonCard
