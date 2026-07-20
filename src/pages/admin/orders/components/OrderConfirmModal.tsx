import type { ConfirmTarget } from '../orderAdminUtils'
import { formatOrderId } from '../../../../utils/orderDisplay'

type OrderConfirmModalProps = {
  confirmTarget: ConfirmTarget
  isWorking: boolean
  onClose: () => void
  onConfirm: () => void
}

function OrderConfirmModal({
  confirmTarget,
  isWorking,
  onClose,
  onConfirm,
}: OrderConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/60 px-4">
      <div className="w-full max-w-md border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]">
        <h2 className="text-2xl font-bold">
          {confirmTarget.type === 'cancel' ? 'Cancel order?' : 'Delete order?'}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#6b5f53]">
          {formatOrderId(confirmTarget.order._id)} will be{' '}
          {confirmTarget.type === 'cancel' ? 'cancelled' : 'deleted'}.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
            onClick={onClose}
            type="button"
          >
            Keep order
          </button>
          <button
            className="min-h-11 bg-[#8f3f1d] px-4 text-sm font-bold text-white transition hover:bg-[#6f2f15] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isWorking}
            onClick={onConfirm}
            type="button"
          >
            {isWorking
              ? 'Working...'
              : confirmTarget.type === 'cancel'
                ? 'Cancel order'
                : 'Delete order'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmModal
