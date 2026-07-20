import { ExternalLink, X } from 'lucide-react'

import type { Order } from '../../../features/orders/orderApi'
import { formatPrice, getAssetUrl } from '../../../utils/productDisplay'
import {
  formatCourierProvider,
  formatOrderDate,
  formatOrderId,
  formatOrderStatus,
  getDeliveryIssueLabel,
  getOrderItemImage,
  getOrderItemName,
  getOrderProgressIndex,
  getOrderTrackingUrl,
} from '../../../utils/orderDisplay'

type MyOrdersDetailModalProps = {
  order: Order
  onClose: () => void
}

function TrackingCodeLink({ order }: { order: Order }) {
  const trackingCode = order.trackingCode?.trim()
  const trackingUrl = getOrderTrackingUrl(order)

  if (!trackingCode) {
    return <span className="text-[#6b5f53]">Not set</span>
  }

  if (!trackingUrl) {
    return <span className="font-bold">{trackingCode}</span>
  }

  return (
    <a
      className="inline-flex items-center gap-1 font-bold text-[#7a3f1d] underline"
      href={trackingUrl}
      rel="noreferrer"
      target="_blank"
    >
      {trackingCode}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  )
}

function MyOrdersDetailModal({ order, onClose }: MyOrdersDetailModalProps) {
  const orderProgressSteps = [
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ] as const

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

        <div className="mt-5 border-b border-black/10 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
                Delivery tracker
              </p>
              <p className="mt-1 text-sm text-[#6b5f53]">
                Live state from admin and courier.
              </p>
            </div>
            {getDeliveryIssueLabel(order) ? (
              <span className="inline-flex min-h-10 items-center bg-[#fff5ef] px-3 text-xs font-bold text-[#8f3f1d]">
                {getDeliveryIssueLabel(order)}
              </span>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {orderProgressSteps.map((step, index) => {
              const progressIndex = getOrderProgressIndex(order)
              const done = progressIndex >= index && order.orderStatus !== 'cancelled'
              const active = progressIndex === index && order.orderStatus !== 'cancelled'

              return (
                <div
                  className={`border px-4 py-3 text-sm font-bold ${
                    order.orderStatus === 'cancelled'
                      ? 'border-[#c85f2f]/25 bg-[#fff5ef] text-[#8f3f1d]'
                      : done
                        ? 'border-[#1f7a4d]/20 bg-[#effaf3] text-[#1f6b43]'
                        : 'border-black/10 bg-white text-[#6b5f53]'
                  }`}
                  key={step.key}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`grid h-6 w-6 place-items-center border text-xs ${
                        active
                          ? 'border-[#181512] bg-[#181512] text-white'
                          : done
                            ? 'border-[#1f7a4d] bg-[#1f7a4d] text-white'
                            : 'border-black/15 bg-white text-[#6b5f53]'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span>{step.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {order.courierProvider || order.courierOrderId || order.trackingCode ? (
          <div className="mt-5 grid gap-3 border-b border-black/10 pb-5 text-sm md:grid-cols-2">
            <p>
              <span className="font-bold">Courier:</span>{' '}
              {formatCourierProvider(order.courierProvider)}
            </p>
            <p>
              <span className="font-bold">Courier order id:</span>{' '}
              {order.courierOrderId ?? 'Not set'}
            </p>
            <p>
              <span className="font-bold">Tracking code:</span>{' '}
              <TrackingCodeLink order={order} />
            </p>
            <p>
              <span className="font-bold">Placed:</span>{' '}
              {formatOrderDate(order.createdAt)}
            </p>
          </div>
        ) : null}

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
