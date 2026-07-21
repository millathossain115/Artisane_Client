import { useState } from 'react'
import {
  ArrowLeft,
  ExternalLink,
  LoaderCircle,
  PackageCheck,
  RotateCcw,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import DashboardLayout from '../../components/layout/DashboardLayout'
import {
  type Order,
  type OrderItem,
  useCancelOrderMutation,
  useGetOrderByIdQuery,
} from '../../features/orders/orderApi'
import {
  canCancelOrder,
  formatCourierProvider,
  formatOrderDate,
  formatOrderId,
  formatOrderStatus,
  getDeliveryIssueLabel,
  getOrderItemImage,
  getOrderItemName,
  getOrderProgressIndex,
  getOrderTrackingUrl,
} from '../../utils/orderDisplay'
import { formatPrice, getAssetUrl } from '../../utils/productDisplay'
import MyOrdersCancelModal from './components/MyOrdersCancelModal'
import MyOrdersMessageBanner from './components/MyOrdersMessageBanner'
import { getApiErrorMessage, type OrderMessage } from './myOrdersUtils'
import { userNavItems } from './user-dashboard/userNavItems'

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

function OrderDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [message, setMessage] = useState<OrderMessage | null>(null)

  const {
    data: order,
    isError,
    isLoading,
  } = useGetOrderByIdQuery(id, {
    skip: !id,
  })
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation()

  const orderProgressSteps = [
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ] as const

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

  return (
    <DashboardLayout
      actions={[{ label: 'All orders', to: '/dashboard/orders' }]}
      eyebrow="Order management"
      helperText="Track delivery progress, shipping details, courier tracking, and itemized receipt."
      sidebarItems={userNavItems}
      subtitle={order ? `Order details for ${formatOrderId(order._id)}` : 'Order details'}
      title={order ? formatOrderId(order._id) : 'Order details'}
      workspaceLabel="Collector account"
    >
      {message ? (
        <MyOrdersMessageBanner message={message} onClose={() => setMessage(null)} />
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
        <div className="border border-black/10 bg-white p-8 text-center font-semibold text-[#6b5f53]">
          <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-[#7a3f1d]" />
          <p className="mt-2">Loading order details...</p>
        </div>
      ) : isError || !order ? (
        <div className="border border-[#c85f2f]/30 bg-[#fff5ef] p-6 text-center text-[#8f3f1d]">
          <h3 className="text-xl font-bold">Order not found</h3>
          <p className="mt-2 text-sm font-medium">
            Could not retrieve order details for ID: {id}
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
                <h2 className="mt-1 text-2xl font-bold">{formatOrderId(order._id)}</h2>
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

            <div className="mt-5 border-b border-black/10 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
                    Delivery tracker
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#6b5f53]">
                    Live status from courier dispatch network.
                  </p>
                </div>
                {getDeliveryIssueLabel(order) ? (
                  <span className="inline-flex min-h-9 items-center bg-[#fff5ef] px-3 text-xs font-bold text-[#8f3f1d]">
                    {getDeliveryIssueLabel(order)}
                  </span>
                ) : null}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {orderProgressSteps.map((step, index) => {
                  const progressIndex = getOrderProgressIndex(order)
                  const done =
                    progressIndex >= index && order.orderStatus !== 'cancelled'
                  const active =
                    progressIndex === index && order.orderStatus !== 'cancelled'

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

            <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 md:grid-cols-4">
              <div className="border border-black/10 p-3">
                <p className="text-xs font-bold uppercase text-[#7a3f1d]">
                  Shipping address
                </p>
                <p className="mt-1 font-bold">{order.shippingAddress ?? 'Not set'}</p>
              </div>

              <div className="border border-black/10 p-3">
                <p className="text-xs font-bold uppercase text-[#7a3f1d]">
                  Contact phone
                </p>
                <p className="mt-1 font-bold">{order.contactPhone ?? 'Not set'}</p>
              </div>

              <div className="border border-black/10 p-3">
                <p className="text-xs font-bold uppercase text-[#7a3f1d]">
                  Courier provider
                </p>
                <p className="mt-1 font-bold">
                  {formatCourierProvider(order.courierProvider)}
                </p>
              </div>

              <div className="border border-black/10 p-3">
                <p className="text-xs font-bold uppercase text-[#7a3f1d]">
                  Tracking code
                </p>
                <p className="mt-1 font-bold">
                  <TrackingCodeLink order={order} />
                </p>
              </div>
            </div>
          </section>

          <section className="border border-black/10 bg-white p-5">
            <div className="flex items-center gap-2 border-b border-black/10 pb-3">
              <PackageCheck className="h-5 w-5 text-[#7a3f1d]" />
              <h3 className="text-lg font-bold">Ordered items</h3>
            </div>

            <div className="mt-4 grid gap-3">
              {(order.items ?? []).map((item: OrderItem, index: number) => {
                const imageUrl = getAssetUrl(getOrderItemImage(item))

                return (
                  <article
                    className="grid grid-cols-[64px_1fr_auto] items-center gap-4 border border-black/10 p-3 text-sm"
                    key={item._id ?? index}
                  >
                    <div className="h-16 w-16 overflow-hidden bg-[#f8f3ea]">
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
                      <p className="mt-1 text-xs font-semibold text-[#6b5f53]">
                        Quantity: {item.quantity ?? 1}
                      </p>
                    </div>
                    <p className="text-base font-bold text-[#181512]">
                      {formatPrice(item.subtotal ?? 0)}
                    </p>
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
