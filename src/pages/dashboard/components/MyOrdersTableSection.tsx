import { EmptyState, ErrorState, SkeletonTable } from '../../../components/loaders'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  ExternalLink,
  LoaderCircle,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react'

import {
  addToCart,
  createCartItem,
  createCartItemFromOrderItem,
} from '../../../features/cart/cartSlice'

import type { Order, OrderStatus } from '../../../features/orders/orderApi'
import { useLazyGetProductByIdQuery } from '../../../features/products/productApi'
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
  onPageChange,
  onStatusFilterChange,
  orderStatusFilter,
  orderStatusOptions,
  page,
  orders,
  visibleOrders,
}: Omit<MyOrdersTableSectionProps, 'onOpenOrder'>) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [fetchProduct] = useLazyGetProductByIdQuery()
  const [reorderingOrderId, setReorderingOrderId] = useState<string | null>(null)

  async function handleReorder(order: Order) {
    if (!order.items?.length) {
      return
    }

    setReorderingOrderId(order._id)

    try {
      let added = false
      for (const item of order.items) {
        const productId =
          typeof item.product === 'object' && item.product
            ? item.product._id
            : typeof item.product === 'string'
              ? item.product
              : item._id || ''

        try {
          if (productId) {
            const freshProduct = await fetchProduct(productId).unwrap()
            if (
              freshProduct &&
              !freshProduct.isDeleted &&
              freshProduct.stock > 0
            ) {
              dispatch(
                addToCart(createCartItem(freshProduct, item.quantity ?? 1)),
              )
              added = true
              continue
            }
          }
        } catch {
          // fallback to item snapshot
        }

        dispatch(addToCart(createCartItemFromOrderItem(item)))
        added = true
      }

      if (added) {
        navigate('/checkout')
      }
    } finally {
      setReorderingOrderId(null)
    }
  }
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
        <ErrorState
          title="Could not retrieve order history"
          message="We encountered an issue fetching your orders. Please try again."
          onRetry={() => window.location.reload()}
          className="mx-5"
        />
      ) : null}

      {isLoading ? (
        <div className="p-5">
          <SkeletonTable rows={5} cols={8} />
        </div>
      ) : !visibleOrders.length ? (
        <EmptyState
          title="No orders found"
          message={
            orderStatusFilter !== 'all'
              ? 'No orders match the selected status filter.'
              : 'You have not placed any orders yet. Browse our artisan collection!'
          }
          icon={<ShoppingBag className="h-7 w-7" />}
          action={
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-xl bg-[#5c3d2e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d1810]"
            >
              Explore Shop
            </Link>
          }
        />
      ) : (
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
              {visibleOrders.map((order) => (
                <tr
                  className="border-t border-black/10 transition hover:bg-[#f8f3ea]"
                  key={order._id}
                >
                  <td className="px-5 py-4 font-bold">
                    <Link
                      className="text-[#7a3f1d] hover:underline"
                      to={`/dashboard/orders/${order._id}`}
                    >
                      {formatOrderId(order._id)}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-[#6b5f53]">
                    <Link
                      className="hover:text-[#181512] hover:underline"
                      to={`/dashboard/orders/${order._id}`}
                    >
                      {getOrderPrimaryItem(order)}
                    </Link>
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
                      <Link
                        aria-label={`View ${formatOrderId(order._id)}`}
                        className="inline-flex min-h-9 items-center gap-1.5 border border-black/10 bg-white px-3 text-xs font-bold text-[#181512] transition hover:border-[#181512]"
                        to={`/dashboard/orders/${order._id}`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Details</span>
                      </Link>
                      <button
                        aria-label={`Reorder ${formatOrderId(order._id)}`}
                        className="inline-flex min-h-9 items-center gap-1.5 border border-black/10 bg-white px-3 text-xs font-bold text-[#181512] transition hover:border-[#181512] hover:bg-[#f8f3ea] disabled:opacity-50"
                        disabled={reorderingOrderId === order._id}
                        onClick={() => handleReorder(order)}
                        title="Buy items again"
                        type="button"
                      >
                        {reorderingOrderId === order._id ? (
                          <LoaderCircle className="h-3.5 w-3.5 animate-spin text-[#7a3f1d]" />
                        ) : (
                          <ShoppingBag className="h-3.5 w-3.5 text-[#7a3f1d]" />
                        )}
                        <span>{reorderingOrderId === order._id ? 'Fetching...' : 'Reorder'}</span>
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
              ))}
            </tbody>
          </table>
        </div>
      )}

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
