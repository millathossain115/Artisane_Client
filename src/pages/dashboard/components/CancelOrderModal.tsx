import { LoaderCircle, AlertTriangle } from 'lucide-react'

type CancelOrderModalProps = {
  isCancelling: boolean
  onClose: () => void
  onConfirm: () => void
  orderId: string
}

function CancelOrderModal({
  isCancelling,
  onClose,
  onConfirm,
  orderId,
}: CancelOrderModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/55 px-4"
      role="presentation"
    >
      <div
        aria-modal="true"
        className="w-full max-w-md border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
        role="dialog"
      >
        <div className="flex items-center gap-2 text-[#8f3f1d]">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm font-bold">Cancel order warning</p>
        </div>

        <h2 className="mt-2 text-2xl font-bold">Cancel order #{orderId.slice(-6)}?</h2>
        <p className="mt-3 text-sm leading-6 text-[#6b5f53]">
          Are you sure you want to cancel this order? This action cannot be undone.
        </p>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
            disabled={isCancelling}
            onClick={onClose}
            type="button"
          >
            Keep order
          </button>
          <button
            className="inline-flex min-h-11 items-center gap-2 bg-[#8f3f1d] px-4 text-sm font-bold text-white transition hover:bg-[#181512] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isCancelling}
            onClick={onConfirm}
            type="button"
          >
            {isCancelling ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : null}
            {isCancelling ? 'Cancelling...' : 'Confirm cancel'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CancelOrderModal
