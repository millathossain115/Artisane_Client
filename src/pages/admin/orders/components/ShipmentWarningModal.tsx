import { AlertCircle } from 'lucide-react'

import type { Order } from '../../../../features/orders/orderApi'
import { formatOrderId } from '../../../../utils/orderDisplay'

type ShipmentWarningModalProps = {
  fraudFlags: string[]
  fraudRisk: string
  isCreatingShipment: boolean
  onClose: () => void
  onConfirm: () => void
  order: Order
}

function ShipmentWarningModal({
  fraudFlags,
  fraudRisk,
  isCreatingShipment,
  onClose,
  onConfirm,
  order,
}: ShipmentWarningModalProps) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[#181512]/70 px-4">
      <div className="w-full max-w-lg border border-[#c85f2f]/25 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.32)]">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#fff5ef] text-[#8f3f1d]">
            <AlertCircle className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-2xl font-bold">Create shipment?</h2>
            <p className="mt-2 text-sm leading-6 text-[#6b5f53]">
              This will send {formatOrderId(order._id)} to Steadfast and move
              the order to processing. Verify payment, phone, and address
              before continuing.
            </p>
            {fraudRisk !== 'low' ? (
              <div className="mt-3 border border-[#c85f2f]/25 bg-[#fff5ef] p-3 text-sm font-semibold text-[#8f3f1d]">
                Fraud risk: {fraudRisk}
                {fraudFlags.length ? ` - ${fraudFlags.join(', ')}` : ''}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isCreatingShipment}
            onClick={onClose}
            type="button"
          >
            Review again
          </button>
          <button
            className="min-h-11 bg-[#8f3f1d] px-4 text-sm font-bold text-white transition hover:bg-[#6f2f15] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isCreatingShipment}
            onClick={onConfirm}
            type="button"
          >
            {isCreatingShipment ? 'Creating...' : 'Create shipment'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShipmentWarningModal
