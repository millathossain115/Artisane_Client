import { AlertCircle, CheckCircle2, X } from 'lucide-react'

import type { OrderMessage } from '../myOrdersUtils'

type MyOrdersMessageBannerProps = {
  message: OrderMessage
  onClose: () => void
}

function MyOrdersMessageBanner({
  message,
  onClose,
}: MyOrdersMessageBannerProps) {
  return (
    <div
      className={`mb-5 flex items-start justify-between gap-3 border px-4 py-3 text-sm font-bold ${
        message.type === 'error'
          ? 'border-[#c85f2f]/30 bg-[#fff5ef] text-[#8f3f1d]'
          : 'border-[#1f7a4d]/20 bg-[#effaf3] text-[#1f6b43]'
      }`}
    >
      <span className="flex items-center gap-2">
        {message.type === 'error' ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        {message.text}
      </span>
      <button
        aria-label="Close order message"
        className="grid h-7 w-7 shrink-0 place-items-center border border-current/20"
        onClick={onClose}
        type="button"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export default MyOrdersMessageBanner
