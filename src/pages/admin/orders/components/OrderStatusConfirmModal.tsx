import { AlertTriangle, X } from 'lucide-react'

import type { Order } from '../../../../features/orders/orderApi'
import {
  formatOrderId,
  formatOrderStatus,
} from '../../../../utils/orderDisplay'
import type { StatusFormState } from '../orderAdminUtils'

type OrderStatusConfirmModalProps = {
  onCancel: () => void
  onConfirm: () => void
  order: Order
  statusForm: StatusFormState
}

function OrderStatusConfirmModal({
  onCancel,
  onConfirm,
  order,
  statusForm,
}: OrderStatusConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md border border-black/10 bg-[#f6f0e5] p-6 text-[#181512] shadow-2xl">
        <button
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center border border-black/10 bg-white text-[#181512] transition hover:bg-[#181512] hover:text-white"
          onClick={onCancel}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#8f3f1d] text-white">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Update Order Status?</h3>
            <p className="text-xs text-[#6b5f53]">
              Changes will update order records for {formatOrderId(order._id)}.
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-black/10 pt-4 text-xs space-y-2">
          {statusForm.orderStatus ? (
            <div className="flex justify-between border-b border-black/5 pb-2">
              <span className="font-bold">Order status:</span>
              <span className="font-semibold text-[#8f3f1d]">
                {formatOrderStatus(order.orderStatus)} &rarr;{' '}
                {formatOrderStatus(statusForm.orderStatus)}
              </span>
            </div>
          ) : null}
          {statusForm.paymentStatus ? (
            <div className="flex justify-between pb-1">
              <span className="font-bold">Payment status:</span>
              <span className="font-semibold text-[#8f3f1d]">
                {formatOrderStatus(order.paymentStatus)} &rarr;{' '}
                {formatOrderStatus(statusForm.paymentStatus)}
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#8f3f1d] px-4 text-sm font-bold text-white transition hover:bg-[#181512]"
            onClick={onConfirm}
            type="button"
          >
            Confirm changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderStatusConfirmModal
