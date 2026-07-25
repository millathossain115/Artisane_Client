import { X } from 'lucide-react'

import OrderDeliveryStepper from '../../../components/orders/OrderDeliveryStepper'
import type { Order } from '../../../features/orders/orderApi'
import { formatPrice, getAssetUrl } from '../../../utils/productDisplay'
import {
  formatOrderId,
  formatOrderStatus,
  getOrderItemImage,
  getOrderItemName,
} from '../../../utils/orderDisplay'

type MyOrdersDetailModalProps = {
  order: Order
  onClose: () => void
}

function MyOrdersDetailModal({ order, onClose }: MyOrdersDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/60 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
              Order details
            </p>
            <h2 className="mt-2 text-3xl font-bold">{formatOrderId(order._id)}</h2>
          </div>
          <button
            aria-label="Close order details"
            className="grid h-10 w-10 place-items-center border border-black/10 transition hover:border-[#181512]"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 border-y border-black/10 py-4 text-sm sm:grid-cols-2">
          <p>
            <span className="font-bold">Shipping:</span>{' '}
            {order.shippingAddress ?? 'Not set'}
          </p>
          <p>
            <span className="font-bold">Phone:</span>{' '}
            {order.contactPhone ?? 'Not set'}
          </p>
          <p>
            <span className="font-bold">Order:</span>{' '}
            {formatOrderStatus(order.orderStatus)}
          </p>
          <p>
            <span className="font-bold">Payment:</span>{' '}
            {formatOrderStatus(order.paymentStatus)}
          </p>
        </div>

        <div className="mt-5">
          <OrderDeliveryStepper order={order} />
        </div>

        <div className="mt-5 grid gap-3">
          {(order.items ?? []).map((item, index) => {
            const imageUrl = getAssetUrl(getOrderItemImage(item))

            return (
              <article
                className="grid grid-cols-[64px_1fr_auto] gap-3 border border-black/10 p-3 text-sm"
                key={item._id ?? index}
              >
                <div className="h-16 overflow-hidden bg-[#f8f3ea]">
                  {imageUrl ? (
                    <img
                      alt={getOrderItemName(item)}
                      className="h-full w-full object-cover"
                      src={imageUrl}
                    />
                  ) : null}
                </div>
                <div>
                  <p className="font-bold">{getOrderItemName(item)}</p>
                  <p className="mt-1 text-[#6b5f53]">Qty {item.quantity ?? 1}</p>
                </div>
                <p className="font-bold">{formatPrice(item.subtotal ?? 0)}</p>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MyOrdersDetailModal
