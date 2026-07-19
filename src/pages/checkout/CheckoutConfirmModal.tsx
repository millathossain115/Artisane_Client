import { X } from 'lucide-react'

import { formatPrice } from '../../utils/productDisplay'
import { paymentOptions, type PendingCheckoutOrder } from './checkoutUtils'

type CheckoutConfirmModalProps = {
  cartItemCount: number
  isConfirmingOrder: boolean
  onClose: () => void
  onConfirm: () => void
  pendingOrder: PendingCheckoutOrder
  subtotal: number
}

function CheckoutConfirmModal({
  cartItemCount,
  isConfirmingOrder,
  onClose,
  onConfirm,
  pendingOrder,
  subtotal,
}: CheckoutConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[#181512]/65 px-4">
      <div className="w-full max-w-md border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
              Confirm order
            </p>
            <h2 className="mt-2 text-3xl font-bold">Place this order?</h2>
          </div>
          <button
            aria-label="Close order confirmation"
            className="grid h-10 w-10 place-items-center border border-black/10 transition hover:border-[#181512]"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 border-y border-black/10 py-4 text-sm">
          <p>
            <span className="font-bold">Items:</span> {cartItemCount}
          </p>
          <p>
            <span className="font-bold">Subtotal:</span> {formatPrice(subtotal)}
          </p>
          <p>
            <span className="font-bold">Payment:</span>{' '}
            {paymentOptions.find(
              (option) => option.value === pendingOrder.paymentMethod,
            )?.label ?? 'Payment method'}
          </p>
          <p>
            <span className="font-bold">Phone:</span> {pendingOrder.contactPhone}
          </p>
          <p className="leading-6">
            <span className="font-bold">Shipping:</span>{' '}
            {pendingOrder.shippingAddress}
          </p>
        </div>

        {pendingOrder.paymentMethod !== 'cod' ? (
          <p className="mt-4 border border-[#f1dfc8] bg-[#fffaf2] px-4 py-3 text-sm font-semibold text-[#7a3f1d]">
            Online payment is selected. Order will be created now; payment
            gateway will open after confirmation.
          </p>
        ) : null}

        <div className="mt-5 flex justify-end gap-2">
          <button
            className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
            onClick={onClose}
            type="button"
          >
            Review again
          </button>
          <button
            className="min-h-11 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isConfirmingOrder}
            onClick={onConfirm}
            type="button"
          >
            {isConfirmingOrder ? 'Placing...' : 'Confirm order'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutConfirmModal
