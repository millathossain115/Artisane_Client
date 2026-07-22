import React from 'react'
import { Loader2 } from 'lucide-react'

interface PageSpinnerProps {
  message?: string
  fullScreen?: boolean
  className?: string
}

export const PageSpinner: React.FC<PageSpinnerProps> = ({
  message = 'Loading...',
  fullScreen = false,
  className = '',
}) => {
  const content = (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="relative mb-4 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-[#e5dcd0] border-t-[#5c3d2e] animate-spin" />
        <Loader2 className="absolute h-5 w-5 text-[#5c3d2e] animate-pulse" />
      </div>
      {message && (
        <p className="text-sm font-medium text-[#7a6b63] animate-pulse">
          {message}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fdfbf7]/80 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}

export default PageSpinner
