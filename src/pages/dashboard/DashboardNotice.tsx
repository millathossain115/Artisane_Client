import { X } from 'lucide-react'

type DashboardNoticeProps = {
  errorText: string
  loadingText: string
  onClose?: () => void
  show: boolean
}

function DashboardNotice({
  errorText,
  loadingText,
  onClose,
  show,
}: DashboardNoticeProps) {
  if (!show) {
    return null
  }

  return (
    <div
      className={`mb-4 border px-4 py-3 text-sm font-semibold ${
        errorText
          ? 'border-[#c85f2f]/30 bg-[#fff5ef] text-[#8f3f1d]'
          : 'border-black/10 bg-white text-[#6b5f53]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span>{errorText || loadingText}</span>
        {onClose ? (
          <button
            aria-label="Close dashboard notice"
            className="grid h-7 w-7 shrink-0 place-items-center border border-current/20 transition hover:bg-white/45"
            onClick={onClose}
            type="button"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default DashboardNotice
