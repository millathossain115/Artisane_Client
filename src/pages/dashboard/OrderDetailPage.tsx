import { useState } from 'react'
import {
  ArrowLeft,
  LoaderCircle,
  PackageCheck,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'

import DashboardLayout from '../../components/layout/DashboardLayout'
import OrderDeliveryStepper from '../../components/orders/OrderDeliveryStepper'
import {
  addToCart,
  createCartItem,
  createCartItemFromOrderItem,
} from '../../features/cart/cartSlice'
import {
  type OrderItem,
  useCancelOrderMutation,
  useGetOrderByIdQuery,
} from '../../features/orders/orderApi'
import { useLazyGetProductByIdQuery } from '../../features/products/productApi'
import {
  canCancelOrder,
  formatOrderDate,
  formatOrderId,
  formatOrderStatus,
  getOrderItemImage,
  getOrderItemName,
  getOrderItemUrl,
} from '../../utils/orderDisplay'
import { formatPrice, getAssetUrl } from '../../utils/productDisplay'
import MyOrdersCancelModal from './components/MyOrdersCancelModal'
import MyOrdersMessageBanner from './components/MyOrdersMessageBanner'
import { getApiErrorMessage, type OrderMessage } from './myOrdersUtils'
import { getDashboardOrderLookupRef } from './orderRouteState'
import { userNavItems } from './user-dashboard/userNavItems'
import { OrderDetailSkeleton } from './user-dashboard/UserDashboardSkeletons'

function OrderDetailPage() {
  const { id: routeRef = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [message, setMessage] = useState<OrderMessage | null>(null)
  const [isReorderingAll, setIsReorderingAll] = useState(false)
  const [reorderingItemId, setReorderingItemId] = useState<string | null>(null)
  const orderLookupRef = getDashboardOrderLookupRef(routeRef)

  const {
    data: order,
    isError,
    isLoading,
  } = useGetOrderByIdQuery(orderLookupRef, {
    skip: !orderLookupRef,
  })
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation()
  const [fetchProduct] = useLazyGetProductByIdQuery()

  async function confirmCancelOrder() {
    if (!order) {
      return
    }

    try {
      await cancelOrder(order._id).unwrap()
      setMessage({
        text: `${formatOrderId(order._id)} cancelled successfully.`,
        type: 'success',
      })
      setShowCancelModal(false)
    } catch (error) {
      setMessage({
        text: getApiErrorMessage(error, 'Failed to cancel order.'),
        type: 'error',
      })
    }
  }

  async function handleReorderAll() {
    if (!order || !order.items?.length) {
      return
    }

    setIsReorderingAll(true)
    let addedCount = 0
    let skippedCount = 0

    try {
      for (const item of order.items) {
        const productId =
          typeof item.product === 'object' && item.product
            ? item.product._id
            : typeof item.product === 'string'
              ? item.product
              : item._id || ''

        if (!productId) {
          skippedCount++
          continue
        }

        try {
          const freshProduct = await fetchProduct(productId).unwrap()
          if (
            freshProduct &&
            !freshProduct.isDeleted &&
            freshProduct.stock > 0
          ) {
            dispatch(
              addToCart(createCartItem(freshProduct, item.quantity ?? 1)),
            )
            addedCount++
          } else {
            skippedCount++
          }
        } catch {
          dispatch(addToCart(createCartItemFromOrderItem(item)))
          addedCount++
        }
      }

      if (addedCount > 0) {
        setMessage({
          text: `Added ${addedCount} item(s) to cart with live pricing. ${
            skippedCount > 0
              ? `${skippedCount} out-of-stock item(s) skipped.`
              : ''
          } Proceeding to checkout...`,
          type: 'success',
        })
        setTimeout(() => {
          navigate('/checkout')
        }, 800)
      } else {
        setMessage({
          text: 'Items in this order are currently out of stock or unavailable.',
          type: 'error',
        })
      }
    } finally {
      setIsReorderingAll(false)
    }
  }

  async function handleReorderSingle(item: OrderItem) {
    const productId =
      typeof item.product === 'object' && item.product
        ? item.product._id
        : typeof item.product === 'string'
          ? item.product
          : item._id || ''

    const itemKey = item._id || productId
    setReorderingItemId(itemKey)

    try {
      if (productId) {
        const freshProduct = await fetchProduct(productId).unwrap()
        if (freshProduct && !freshProduct.isDeleted && freshProduct.stock > 0) {
          dispatch(addToCart(createCartItem(freshProduct, item.quantity ?? 1)))
          setMessage({
            text: `"${freshProduct.name}" added to cart with current live price (${formatPrice(freshProduct.price)}).`,
            type: 'success',
          })
          return
        }
      }
    } catch {
      // fallback
    } finally {
      setReorderingItemId(null)
    }

    dispatch(addToCart(createCartItemFromOrderItem(item)))
    setMessage({
      text: `"${getOrderItemName(item)}" added to your cart.`,
      type: 'success',
    })
  }

  return (
    <DashboardLayout
      actions={[{ label: 'All orders', to: '/dashboard/orders' }]}
      eyebrow="Order management"
      helperText="Track delivery progress, shipping details, courier tracking, and itemized receipt."
      layoutVariant="customer"
      sidebarItems={userNavItems}
      subtitle={
        order
          ? `Order details for ${formatOrderId(order._id)}`
          : 'Order details'
      }
      title={order ? formatOrderId(order._id) : 'Order details'}
      workspaceLabel="Collector account"
    >
      {message ? (
        <MyOrdersMessageBanner
          message={message}
          onClose={() => setMessage(null)}
        />
      ) : null}

      <div className="mb-4">
        <Link
          className="inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-2 text-sm font-bold text-[#181512] transition hover:border-[#181512]"
          to="/dashboard/orders"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Orders
        </Link>
      </div>

      {isLoading ? (
        <OrderDetailSkeleton />
      ) : isError || !order ? (
        <div className="border border-[#c85f2f]/30 bg-[#fff5ef] p-6 text-center text-[#8f3f1d]">
          <h3 className="text-xl font-bold">Order not found</h3>
          <p className="mt-2 text-sm font-medium">
            Could not retrieve order details for this secure order reference.
          </p>
          <button
            className="mt-4 inline-flex min-h-10 items-center justify-center bg-[#181512] px-4 text-xs font-bold text-white transition hover:bg-[#7a3f1d]"
            onClick={() => navigate('/dashboard/orders')}
            type="button"
          >
            Return to orders list
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          <section className="border border-black/10 bg-white p-5">
            <div className="flex flex-col gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
                  Order summary
                </p>
                <h2 className="mt-1 text-2xl font-bold">
                  {formatOrderId(order._id)}
                </h2>
                <p className="mt-1 text-xs font-semibold text-[#6b5f53]">
                  Placed on {formatOrderDate(order.createdAt)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#f1dfc8] px-3 py-1.5 text-xs font-bold text-[#7a3f1d]">
                  Order: {formatOrderStatus(order.orderStatus)}
                </span>
                <span className="bg-[#effaf3] px-3 py-1.5 text-xs font-bold text-[#1f6b43]">
                  Payment: {formatOrderStatus(order.paymentStatus)}
                </span>
                <button
                  className="inline-flex min-h-9 items-center gap-1.5 border border-[#181512] bg-[#181512] px-3 text-xs font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isReorderingAll}
                  onClick={handleReorderAll}
                  type="button"
                >
                  {isReorderingAll ? (
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ShoppingBag className="h-3.5 w-3.5" />
                  )}
                  {isReorderingAll ? 'Checking live stock...' : 'Reorder all'}
                </button>
                {canCancelOrder(order) ? (
                  <button
                    className="inline-flex min-h-9 items-center gap-1.5 border border-[#c85f2f]/30 bg-[#fff5ef] px-3 text-xs font-bold text-[#8f3f1d] transition hover:border-[#8f3f1d]"
                    onClick={() => setShowCancelModal(true)}
                    type="button"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Cancel order
                  </button>
                ) : null}
              </div>
            </div>

            <div className="mt-5">
              <OrderDeliveryStepper order={order} />
            </div>

            <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div className="border border-black/10 p-3">
                <p className="text-xs font-bold uppercase text-[#7a3f1d]">
                  Shipping address
                </p>
                <p className="mt-1 font-bold">
                  {order.shippingAddress ?? 'Not set'}
                </p>
              </div>

              <div className="border border-black/10 p-3">
                <p className="text-xs font-bold uppercase text-[#7a3f1d]">
                  Contact phone
                </p>
                <p className="mt-1 font-bold">
                  {order.contactPhone ?? 'Not set'}
                </p>
              </div>
            </div>
          </section>

          <section className="border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <div className="flex items-center gap-2">
                <PackageCheck className="h-5 w-5 text-[#7a3f1d]" />
                <h3 className="text-lg font-bold">Ordered items</h3>
              </div>
              <button
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7a3f1d] hover:underline disabled:opacity-50"
                disabled={isReorderingAll}
                onClick={handleReorderAll}
                type="button"
              >
                {isReorderingAll ? (
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ShoppingBag className="h-3.5 w-3.5" />
                )}
                Reorder all items
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              {(order.items ?? []).map((item: OrderItem, index: number) => {
                const imageUrl = getAssetUrl(getOrderItemImage(item))
                const productId =
                  typeof item.product === 'object' && item.product
                    ? item.product._id
                    : typeof item.product === 'string'
                      ? item.product
                      : item._id || ''
                const itemKey = item._id || productId || String(index)
                const isItemReordering = reorderingItemId === itemKey

                const productUrl = getOrderItemUrl(item)

                return (
                  <article
                    className="grid grid-cols-[64px_1fr_auto_auto] items-center gap-4 border border-black/10 p-3 text-sm"
                    key={item._id ?? index}
                  >
                    {productUrl ? (
                      <Link
                        className="h-16 w-16 overflow-hidden bg-[#f8f3ea] transition hover:opacity-80"
                        to={productUrl}
                      >
                        {imageUrl ? (
                          <img
                            alt={getOrderItemName(item)}
                            className="h-full w-full object-cover"
                            src={imageUrl}
                          />
                        ) : null}
                      </Link>
                    ) : (
                      <div className="h-16 w-16 overflow-hidden bg-[#f8f3ea]">
                        {imageUrl ? (
                          <img
                            alt={getOrderItemName(item)}
                            className="h-full w-full object-cover"
                            src={imageUrl}
                          />
                        ) : null}
                      </div>
                    )}
                    <div>
                      {productUrl ? (
                        <Link
                          className="font-bold hover:underline"
                          to={productUrl}
                        >
                          {getOrderItemName(item)}
                        </Link>
                      ) : (
                        <p className="font-bold">{getOrderItemName(item)}</p>
                      )}
                      <p className="mt-1 text-xs font-semibold text-[#6b5f53]">
                        Quantity: {item.quantity ?? 1}
                      </p>
                    </div>
                    <p className="text-base font-bold text-[#181512]">
                      {formatPrice(item.subtotal ?? 0)}
                    </p>
                    <button
                      className="inline-flex min-h-8 items-center gap-1 border border-black/10 bg-white px-2.5 text-xs font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea] disabled:opacity-50"
                      disabled={isItemReordering}
                      onClick={() => handleReorderSingle(item)}
                      type="button"
                    >
                      {isItemReordering ? (
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin text-[#7a3f1d]" />
                      ) : (
                        <ShoppingBag className="h-3.5 w-3.5 text-[#7a3f1d]" />
                      )}
                      <span>Buy again</span>
                    </button>
                  </article>
                )
              })}
            </div>

            <div className="mt-5 flex justify-end border-t border-black/10 pt-4 text-right">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">
                  Total amount
                </p>
                <p className="mt-1 text-2xl font-bold text-[#7a3f1d]">
                  {formatPrice(order.totalPrice ?? 0)}
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {showCancelModal && order ? (
        <MyOrdersCancelModal
          isCancelling={isCancelling}
          onClose={() => setShowCancelModal(false)}
          onConfirm={confirmCancelOrder}
          order={order}
        />
      ) : null}
    </DashboardLayout>
  )
}

export default OrderDetailPage
