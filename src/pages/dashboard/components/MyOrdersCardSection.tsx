import { EmptyState, ErrorState } from '../../../components/loaders'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  ImageOff,
  LoaderCircle,
  PackageCheck,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react'

import {
  addToCart,
  createCartItem,
  createCartItemFromOrderItem,
} from '../../../features/cart/cartSlice'
import type { Order, OrderItem } from '../../../features/orders/orderApi'
import { useLazyGetProductByIdQuery } from '../../../features/products/productApi'
import {
  formatOrderDate,
  formatOrderId,
  formatOrderStatus,
  getOrderItemImage,
  getOrderItemName,
  getOrderItemUrl,
  getOrderTrackingUrl,
  getOrderUrl,
  canCancelOrder,
} from '../../../utils/orderDisplay'
import { formatPrice, getAssetUrl } from '../../../utils/productDisplay'
import type { MyOrderTab, MyOrderTabKey } from '../myOrdersUtils'

type MyOrdersCardSectionProps = {
  isError: boolean
  isLoading: boolean
  meta?: {
    limit: number
    page: number
    total: number
    totalPage: number
  }
  onCancelOrder: (order: Order) => void
  onPageChange: Dispatch<SetStateAction<number>>
  onTabChange: (value: MyOrderTabKey) => void
  orders: Order[]
  page: number
  selectedTabKey: MyOrderTabKey
  tabs: MyOrderTab[]
  visibleOrders: Order[]
}

function getPaginationItems(currentPage: number, totalPage: number) {
  const safeTotalPage = Math.max(1, totalPage)
  const start = Math.max(1, Math.min(currentPage - 1, safeTotalPage - 2))
  const end = Math.min(safeTotalPage, start + 2)

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

function getOrderStatusBadgeClass(status?: string) {
  switch (status) {
    case 'cancelled':
      return 'bg-[#fff5ef] text-[#8f3f1d]'
    case 'delivered':
      return 'bg-[#effaf3] text-[#1f6b43]'
    case 'shipped':
      return 'bg-[#eef5ff] text-[#235a8f]'
    case 'processing':
      return 'bg-[#fff9e6] text-[#8a6d00]'
    default:
      return 'bg-[#f1dfc8] text-[#7a3f1d]'
  }
}

function getPaymentStatusBadgeClass(status?: string) {
  switch (status) {
    case 'paid':
      return 'bg-[#effaf3] text-[#1f6b43]'
    case 'failed':
    case 'unpaid':
      return 'bg-[#fff5ef] text-[#8f3f1d]'
    case 'refunded':
      return 'bg-[#eef5ff] text-[#235a8f]'
    default:
      return 'bg-[#fff9e6] text-[#8a6d00]'
  }
}

function TrackingCodeLink({ order }: { order: Order }) {
  const trackingCode = order.trackingCode?.trim()
  const trackingUrl = getOrderTrackingUrl(order)

  if (!trackingCode) {
    return <span>Tracking not set</span>
  }

  if (!trackingUrl) {
    return <span className="font-bold">{trackingCode}</span>
  }

  return (
    <a
      className="inline-flex min-w-0 items-center gap-1 font-bold text-[#7a3f1d] underline"
      href={trackingUrl}
      rel="noreferrer"
      target="_blank"
      title={trackingCode}
    >
      <span className="truncate">{trackingCode}</span>
      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
    </a>
  )
}

function OrderItemRow({ item }: { item: OrderItem }) {
  const imageUrl = getAssetUrl(getOrderItemImage(item))
  const productUrl = getOrderItemUrl(item)
  const name = getOrderItemName(item)
  const image = (
    <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden bg-[#f8f3ea] text-[#7a3f1d]">
      {imageUrl ? (
        <img alt={name} className="h-full w-full object-cover" src={imageUrl} />
      ) : (
        <ImageOff className="h-5 w-5" />
      )}
    </span>
  )

  return (
    <div className="grid gap-3 border-t border-black/10 py-3 text-sm sm:grid-cols-[1fr_auto_auto] sm:items-center">
      <div className="flex min-w-0 gap-3">
        {productUrl ? (
          <Link
            aria-label={`View ${name}`}
            className="shrink-0 transition hover:opacity-80"
            to={productUrl}
          >
            {image}
          </Link>
        ) : (
          image
        )}
        <div className="min-w-0">
          {productUrl ? (
            <Link
              className="line-clamp-2 font-bold text-[#181512] hover:underline"
              to={productUrl}
            >
              {name}
            </Link>
          ) : (
            <p className="line-clamp-2 font-bold text-[#181512]">{name}</p>
          )}
          <p className="mt-1 text-xs font-semibold text-[#6b5f53]">
            Quantity: {item.quantity ?? 1}
          </p>
        </div>
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6b5f53] sm:text-right">
        Item total
      </p>
      <p className="text-base font-bold text-[#7a3f1d] sm:min-w-24 sm:text-right">
        {formatPrice(item.subtotal ?? item.price ?? 0)}
      </p>
    </div>
  )
}

function OrderCard({
  isReordering,
  onCancelOrder,
  onReorder,
  order,
}: {
  isReordering: boolean
  onCancelOrder: (order: Order) => void
  onReorder: (order: Order) => void
  order: Order
}) {
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
              <TrackingCodeLink order={order} />
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
            <OrderItemRow item={item} key={item._id ?? index} />
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

function MyOrdersCardSkeleton() {
  return (
    <div className="grid gap-4 p-5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className="animate-pulse border border-black/10 bg-white p-5"
          key={index}
        >
          <div className="flex flex-col gap-3 border-b border-black/10 pb-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-4 w-16 bg-[#e8ded5]" />
                <div className="h-5 w-36 bg-[#e8ded5]" />
                <div className="h-4 w-20 bg-[#f0e8e0]" />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                <div className="h-4 w-36 bg-[#f0e8e0]" />
                <div className="h-4 w-32 bg-[#f0e8e0]" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <div className="h-8 w-28 bg-[#effaf3]" />
              <div className="h-8 w-28 bg-[#f1dfc8]" />
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 2 }).map((_, itemIndex) => (
              <div
                className="grid gap-3 border-t border-black/10 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                key={itemIndex}
              >
                <div className="flex min-w-0 gap-3">
                  <div className="h-16 w-16 shrink-0 bg-[#f8f3ea]" />
                  <div className="min-w-0 flex-1">
                    <div className="h-4 w-52 max-w-full bg-[#e8ded5]" />
                    <div className="mt-2 h-3 w-20 bg-[#f0e8e0]" />
                  </div>
                </div>
                <div className="h-3 w-20 bg-[#f0e8e0]" />
                <div className="h-5 w-16 bg-[#e8ded5]" />
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t border-black/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-8 w-32 bg-[#e8ded5]" />
            <div className="flex flex-wrap gap-2">
              <div className="h-10 w-24 bg-[#f0e8e0]" />
              <div className="h-10 w-24 bg-[#f0e8e0]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function MyOrdersCardSection({
  isError,
  isLoading,
  meta,
  onCancelOrder,
  onPageChange,
  onTabChange,
  orders,
  page,
  selectedTabKey,
  tabs,
  visibleOrders,
}: MyOrdersCardSectionProps) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [fetchProduct] = useLazyGetProductByIdQuery()
  const [reorderingOrderId, setReorderingOrderId] = useState<string | null>(
    null,
  )
  const activeTab = tabs.find((tab) => tab.key === selectedTabKey) ?? tabs[0]
  const currentPage = meta?.page ?? page
  const totalPage = meta?.totalPage ?? 1
  const totalOrders = meta?.total ?? orders.length
  const pageLimit = meta?.limit ?? visibleOrders.length
  const startOrder = totalOrders ? (currentPage - 1) * pageLimit + 1 : 0
  const endOrder = totalOrders
    ? Math.min(startOrder + visibleOrders.length - 1, totalOrders)
    : 0
  const paginationItems = getPaginationItems(currentPage, totalPage)

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
      <div className="border-b border-black/10 px-5 pt-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">My Orders</h2>
            <p className="mt-1 text-sm text-[#6b5f53]">
              {meta?.total ?? orders.length} orders found.
            </p>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
            Order history
          </p>
        </div>

        <div
          aria-label="Order status filters"
          className="category-craft-scroll -mx-5 mt-5 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain border-t border-black/10 px-5 pt-3 pb-1 touch-pan-x sm:mx-0 sm:px-0"
          role="tablist"
        >
          {tabs.map((tab) => {
            const isActive = tab.key === selectedTabKey

            return (
              <button
                aria-selected={isActive}
                className={`relative min-h-11 shrink-0 snap-start px-4 text-sm font-bold transition ${
                  isActive
                    ? 'bg-[#f8f3ea] text-[#7a3f1d]'
                    : 'text-[#6b5f53] hover:bg-[#f8f3ea] hover:text-[#181512]'
                }`}
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                role="tab"
                type="button"
              >
                {tab.label}
                {isActive ? (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#7a3f1d]" />
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      {isError ? (
        <ErrorState
          className="mx-5"
          message="We encountered an issue fetching your orders. Please try again."
          onRetry={() => window.location.reload()}
          title="Could not retrieve order history"
        />
      ) : null}

      {isLoading ? (
        <MyOrdersCardSkeleton />
      ) : !visibleOrders.length ? (
        <EmptyState
          action={
            <Link
              className="inline-flex items-center justify-center bg-[#181512] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
              to="/products"
            >
              Explore products
            </Link>
          }
          icon={<PackageCheck className="h-7 w-7" />}
          message={activeTab.emptyMessage}
          title="No orders found"
        />
      ) : (
        <div className="grid gap-4 p-5">
          {visibleOrders.map((order) => (
            <OrderCard
              isReordering={reorderingOrderId === order._id}
              key={order._id}
              onCancelOrder={onCancelOrder}
              onReorder={handleReorder}
              order={order}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-black/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-semibold text-[#6b5f53]">
          {totalOrders
            ? `Showing ${startOrder}-${endOrder} of ${totalOrders}`
            : 'No orders to show'}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex h-10 w-10 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={currentPage <= 1}
            onClick={() => onPageChange((current) => Math.max(1, current - 1))}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {paginationItems.map((item) => (
            <button
              className={`inline-flex h-10 min-w-10 items-center justify-center border px-3 text-sm font-bold transition ${
                item === currentPage
                  ? 'border-[#181512] bg-[#181512] text-white'
                  : 'border-black/10 bg-white text-[#181512] hover:border-[#181512] hover:bg-[#f8f3ea]'
              }`}
              key={item}
              onClick={() => onPageChange(item)}
              type="button"
            >
              {item}
            </button>
          ))}
          <button
            className="inline-flex h-10 w-10 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={currentPage >= totalPage}
            onClick={() =>
              onPageChange((current) => Math.min(totalPage, current + 1))
            }
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default MyOrdersCardSection
