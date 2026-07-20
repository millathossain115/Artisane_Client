import { type Dispatch, type SetStateAction } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  ExternalLink,
  RotateCcw,
} from 'lucide-react'

import type { Order, OrderStatus } from '../../../features/orders/orderApi'
import { formatPrice } from '../../../utils/productDisplay'
import {
  canCancelOrder,
  formatOrderDate,
  formatOrderId,
  formatOrderStatus,
  getOrderPrimaryItem,
  getOrderTrackingUrl,
} from '../../../utils/orderDisplay'

type MyOrdersTableSectionProps = {
  isError: boolean
  isLoading: boolean
  meta?: {
    page: number
    total: number
    totalPage: number
  }
  onCancelOrder: (order: Order) => void
  onOpenOrder: (orderId: string) => void
  onPageChange: Dispatch<SetStateAction<number>>
  onStatusFilterChange: (value: 'all' | OrderStatus) => void
  orderStatusFilter: 'all' | OrderStatus
  orderStatusOptions: OrderStatus[]
  page: number
  orders: Order[]
  visibleOrders: Order[]
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

function MyOrdersTableSection({
  isError,
  isLoading,
  meta,
  onCancelOrder,
  onOpenOrder,
  onPageChange,
  onStatusFilterChange,
  orderStatusFilter,
  orderStatusOptions,
  page,
  orders,
  visibleOrders,
}: MyOrdersTableSectionProps) {
  return (
    <section className="border border-black/10 bg-white">
      <div className="flex flex-col gap-4 border-b border-black/10 p-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold">Order history</h2>
            <p className="mt-1 text-sm text-[#6b5f53]">
              {meta?.total ?? orders.length} orders found.
            </p>
          </div>
        </div>

        <label className="grid gap-2 sm:w-72">
          <span className="text-sm font-bold">Order status</span>
          <select
            className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
            onChange={(event) =>
              onStatusFilterChange(event.target.value as 'all' | OrderStatus)
            }
            value={orderStatusFilter}
          >
            <option value="all">All orders</option>
            {orderStatusOptions.map((status) => (
              <option key={status} value={status}>
                {formatOrderStatus(status)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isError ? (
        <div className="border-b border-[#c85f2f]/30 bg-[#fff5ef] px-5 py-3 text-sm font-bold text-[#8f3f1d]">
          Failed to load orders.
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left text-sm">
          <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Order status</th>
              <th className="px-5 py-3">Payment</th>
              <th className="px-5 py-3">Tracking</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Placed</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr className="border-t border-black/10" key={index}>
                  <td className="px-5 py-5" colSpan={8}>
                    <div className="h-5 animate-pulse bg-[#f8f3ea]" />
                  </td>
                </tr>
              ))
            ) : visibleOrders.length ? (
              visibleOrders.map((order) => (
                <tr
                  className="border-t border-black/10 transition hover:bg-[#f8f3ea]"
                  key={order._id}
                >
                  <td className="px-5 py-4 font-bold">
                    {formatOrderId(order._id)}
                  </td>
                  <td className="px-5 py-4 text-[#6b5f53]">
                    {getOrderPrimaryItem(order)}
                  </td>
                  <td className="px-5 py-4">
                    <span className="bg-[#f1dfc8] px-2 py-1 text-xs font-bold text-[#7a3f1d]">
                      {formatOrderStatus(order.orderStatus)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="bg-[#effaf3] px-2 py-1 text-xs font-bold text-[#1f6b43]">
                      {formatOrderStatus(order.paymentStatus)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <TrackingCodeLink order={order} />
                  </td>
                  <td className="px-5 py-4 font-bold">
                    {formatPrice(order.totalPrice ?? 0)}
                  </td>
                  <td className="px-5 py-4 text-[#6b5f53]">
                    {formatOrderDate(order.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        aria-label={`View ${formatOrderId(order._id)}`}
                        className="grid h-9 w-9 place-items-center border border-black/10 transition hover:border-[#181512] hover:bg-white"
                        onClick={() => onOpenOrder(order._id)}
                        type="button"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        aria-label={`Cancel ${formatOrderId(order._id)}`}
                        className="grid h-9 w-9 place-items-center border border-[#c85f2f]/25 text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef] disabled:cursor-not-allowed disabled:opacity-45"
                        disabled={!canCancelOrder(order)}
                        onClick={() => onCancelOrder(order)}
                        type="button"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-black/10">
                <td
                  className="px-5 py-8 text-center font-semibold text-[#6b5f53]"
                  colSpan={8}
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-black/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-semibold text-[#6b5f53]">
          Page {meta?.page ?? page} of {meta?.totalPage ?? 1}
        </p>
        <div className="flex gap-2">
          <button
            className="inline-flex h-10 w-10 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={page <= 1}
            onClick={() => onPageChange((current) => Math.max(1, current - 1))}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            className="inline-flex h-10 w-10 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={page >= (meta?.totalPage ?? 1)}
            onClick={() => onPageChange((current) => current + 1)}
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default MyOrdersTableSection
