import { X } from 'lucide-react'

type ProductStatusBannerProps = {
  error: string
  onClose: () => void
  status: string
}

function ProductStatusBanner({
  error,
  onClose,
  status,
}: ProductStatusBannerProps) {
  if (!status && !error) {
    return null
  }

  return (
    <div
      className={`border-b border-black/10 px-5 py-3 text-sm font-semibold ${
        error ? 'bg-[#fff5ef] text-[#8f3f1d]' : 'bg-[#effaf3] text-[#1f6b43]'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span>{error || status}</span>
        <button
          aria-label="Close message"
          className="grid h-8 w-8 shrink-0 place-items-center border border-current/20 transition hover:bg-white/45"
          onClick={onClose}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default ProductStatusBanner
