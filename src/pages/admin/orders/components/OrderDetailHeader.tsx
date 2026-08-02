import { X } from 'lucide-react'

import type { Order } from '../../../../features/orders/orderApi'
import { formatOrderId } from '../../../../utils/orderDisplay'

type OrderDetailHeaderProps = {
  isFetchingOrderDetail: boolean
  isModal: boolean
  onClose: () => void
  order: Order
}

function OrderDetailHeader({
  isFetchingOrderDetail,
  isModal,
  onClose,
  order,
}: OrderDetailHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
          Order detail
        </p>
        <h2 className="mt-2 text-3xl font-bold">
          {formatOrderId(order._id)}
        </h2>
        {isFetchingOrderDetail ? (
          <p className="mt-2 text-sm font-semibold text-[#6b5f53]">
            Loading latest order data...
          </p>
        ) : null}
      </div>
      {isModal ? (
        <button
          aria-label="Close order detail"
          className="grid h-10 w-10 place-items-center border border-black/10 transition hover:border-[#181512]"
          onClick={onClose}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  )
}

export default OrderDetailHeader
