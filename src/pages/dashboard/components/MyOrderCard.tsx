import { Eye, LoaderCircle, RotateCcw, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Order } from '../../../features/orders/orderApi'
import {
  canCancelOrder,
  formatOrderDate,
  formatOrderId,
  formatOrderStatus,
  getOrderUrl,
} from '../../../utils/orderDisplay'
import { formatPrice } from '../../../utils/productDisplay'
import {
  getOrderStatusBadgeClass,
  getPaymentStatusBadgeClass,
} from './myOrdersCardUtils'
import MyOrderItemRow from './MyOrderItemRow'
import MyOrderTrackingCodeLink from './MyOrderTrackingCodeLink'

type MyOrderCardProps = {
  isReordering: boolean
  onCancelOrder: (order: Order) => void
  onReorder: (order: Order) => void
  order: Order
}

function MyOrderCard({
  isReordering,
  onCancelOrder,
  onReorder,
  order,
}: MyOrderCardProps) {
  const items = order.items ?? []
  const previewItems = items.slice(0, 2)
  const remainingCount = Math.max(0, items.length - previewItems.length)

  return (
    <article className="border border-black/10 bg-white p-4 shadow-[0_18px_34px_rgba(24,21,18,0.06)] transition hover:border-[#7a3f1d]/35 sm:p-5">
      <div className="flex flex-col gap-3 border-b border-black/10 pb-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-[#6b5f53]">Order No:</p>
            <Link
              className="font-bold text-[#181512] hover:text-[#7a3f1d] hover:underline"
              to={getOrderUrl(order)}
            >
              {formatOrderId(order._id)}
            </Link>
            <Link
              className="inline-flex items-center gap-1 text-sm font-bold text-[#7a3f1d] hover:underline"
              to={getOrderUrl(order)}
            >
              View Details
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-[#6b5f53]">
            <span>Placed on: {formatOrderDate(order.createdAt)}</span>
            <span className="hidden text-black/30 sm:inline">|</span>
            <span>
              <MyOrderTrackingCodeLink order={order} />
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <span
            className={`inline-flex min-h-8 items-center px-3 text-xs font-bold ${getPaymentStatusBadgeClass(
              order.paymentStatus,
            )}`}
          >
            Payment: {formatOrderStatus(order.paymentStatus)}
          </span>
          <span
            className={`inline-flex min-h-8 items-center px-3 text-xs font-bold ${getOrderStatusBadgeClass(
              order.orderStatus,
            )}`}
          >
            Order: {formatOrderStatus(order.orderStatus)}
          </span>
        </div>
      </div>

      <div className="mt-1">
        {previewItems.length ? (
          previewItems.map((item, index) => (
            <MyOrderItemRow item={item} key={item._id ?? index} />
          ))
        ) : (
          <p className="border-t border-black/10 py-4 text-sm font-semibold text-[#6b5f53]">
            No item details available.
          </p>
        )}
      </div>

      {remainingCount > 0 ? (
        <Link
          className="mt-1 inline-flex text-sm font-bold text-[#7a3f1d] hover:underline"
          to={getOrderUrl(order)}
        >
          +{remainingCount} more item{remainingCount === 1 ? '' : 's'}
        </Link>
      ) : null}

      <div className="mt-4 flex flex-col gap-3 border-t border-black/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-bold text-[#181512]">
          Total{' '}
          <span className="font-display text-2xl text-[#7a3f1d]">
            {formatPrice(order.totalPrice ?? 0)}
          </span>
        </p>

        <div className="flex flex-wrap gap-2">
          <Link
            className="inline-flex min-h-10 items-center gap-2 border border-black/10 bg-white px-3 text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
            to={getOrderUrl(order)}
          >
            <Eye className="h-4 w-4" />
            Details
          </Link>
          <button
            className="inline-flex min-h-10 items-center gap-2 border border-black/10 bg-white px-3 text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isReordering}
            onClick={() => onReorder(order)}
            type="button"
          >
            {isReordering ? (
              <LoaderCircle className="h-4 w-4 animate-spin text-[#7a3f1d]" />
            ) : (
              <ShoppingBag className="h-4 w-4 text-[#7a3f1d]" />
            )}
            {isReordering ? 'Checking...' : 'Reorder'}
          </button>
          {canCancelOrder(order) ? (
            <button
              className="inline-flex min-h-10 items-center gap-2 border border-[#c85f2f]/25 bg-[#fff5ef] px-3 text-sm font-bold text-[#8f3f1d] transition hover:border-[#8f3f1d]"
              onClick={() => onCancelOrder(order)}
              type="button"
            >
              <RotateCcw className="h-4 w-4" />
              Cancel
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default MyOrderCard
