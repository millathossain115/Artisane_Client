import { useMemo, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
  type Order,
  type OrderStatus,
  type PaymentStatus,
  useCancelOrderMutation,
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
} from '../../../features/orders/orderApi'
import { formatPrice, getAssetUrl } from '../../../utils/productDisplay'
import {
  canCancelOrder,
  formatOrderDate,
  formatOrderId,
  formatOrderStatus,
  getOrderCustomer,
  getOrderCustomerEmail,
  getOrderItemImage,
  getOrderItemName,
  getOrderPrimaryItem,
} from '../../../utils/orderDisplay'
import { adminNavItems } from '../../dashboard/adminNavItems'

const orderStatusOptions: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

const paymentStatusOptions: PaymentStatus[] = [
  'unpaid',
  'pending',
  'paid',
  'failed',
  'refunded',
]

function getApiErrorMessage(error: unknown, fallback: string) {
  const apiError = error as {
    data?: {
      errorSources?: { message: string }[]
      message?: string
    }
    message?: string
  }

  return (
    apiError.data?.errorSources?.[0]?.message ??
    apiError.data?.message ??
    apiError.message ??
    fallback
  )
}

function matchesSearch(order: Order, searchTerm: string) {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  if (!normalizedSearch) {
    return true
  }

  return [
    order._id,
    getOrderCustomer(order),
    getOrderCustomerEmail(order),
    order.contactPhone,
    getOrderPrimaryItem(order),
  ]
    .filter(Boolean)
    .some((value) => value?.toLowerCase().includes(normalizedSearch))
}

function ManageOrders() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>(
    'all',
  )
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    'all' | PaymentStatus
  >('all')
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [confirmTarget, setConfirmTarget] = useState<{
    order: Order
    type: 'cancel' | 'delete'
  } | null>(null)
  const [message, setMessage] = useState<{
    text: string
    type: 'error' | 'success'
  } | null>(null)

  const { data: orderList, isError, isLoading } = useGetAllOrdersQuery({
    limit: 10,
    page,
  })
  const { data: orderDetail, isFetching: isFetchingOrderDetail } =
    useGetOrderByIdQuery(selectedOrderId, {
      skip: !selectedOrderId,
    })
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation()
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation()

  const orders = useMemo(() => orderList?.data ?? [], [orderList?.data])
  const meta = orderList?.meta
  const selectedOrder = useMemo(
    () => {
      if (!selectedOrderId) {
        return null
      }

      return (
        orderDetail ??
        orders.find((order) => order._id === selectedOrderId) ??
        null
      )
    },
    [orderDetail, orders, selectedOrderId],
  )
  const visibleOrders = orders.filter(
    (order) =>
      matchesSearch(order, searchTerm) &&
      (orderStatusFilter === 'all' ||
        order.orderStatus === orderStatusFilter) &&
      (paymentStatusFilter === 'all' ||
        order.paymentStatus === paymentStatusFilter),
  )

  async function confirmOrderAction() {
    if (!confirmTarget) {
      return
    }

    try {
      if (confirmTarget.type === 'cancel') {
        await cancelOrder(confirmTarget.order._id).unwrap()
      } else {
        await deleteOrder(confirmTarget.order._id).unwrap()
      }

      setMessage({
        text: `${formatOrderId(confirmTarget.order._id)} ${confirmTarget.type === 'cancel' ? 'cancelled' : 'deleted'}.`,
        type: 'success',
      })
      setConfirmTarget(null)
      setSelectedOrderId('')
    } catch (error) {
      setMessage({
        text: getApiErrorMessage(error, `Failed to ${confirmTarget.type} order.`),
        type: 'error',
      })
    }
  }

  return (
    <DashboardLayout
      helperText="Review new orders, confirm payments, update fulfillment status, and remove invalid records."
      sidebarItems={adminNavItems}
      subtitle="Manage customer orders, payment state, cancellation, and fulfillment progress."
      title="Manage orders"
      workspaceLabel="Marketplace studio"
    >
      {message ? (
        <div
          className={`mb-5 flex items-start justify-between gap-3 border px-4 py-3 text-sm font-bold ${
            message.type === 'error'
              ? 'border-[#c85f2f]/30 bg-[#fff5ef] text-[#8f3f1d]'
              : 'border-[#1f7a4d]/20 bg-[#effaf3] text-[#1f6b43]'
          }`}
        >
          <span className="flex items-center gap-2">
            {message.type === 'error' ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {message.text}
          </span>
          <button
            aria-label="Close order message"
            className="grid h-7 w-7 shrink-0 place-items-center border border-current/20"
            onClick={() => setMessage(null)}
            type="button"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      <section className="border border-black/10 bg-white">
        <div className="flex items-center gap-3 border-b border-black/10 p-5">
          <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
            <Package className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-2xl font-bold">Orders</h2>
            <p className="mt-1 text-sm text-[#6b5f53]">
              {meta?.total ?? orders.length} orders in database.
            </p>
          </div>
        </div>

        {isError ? (
          <div className="border-b border-[#c85f2f]/30 bg-[#fff5ef] px-5 py-3 text-sm font-bold text-[#8f3f1d]">
            Failed to load orders.
          </div>
        ) : null}

        <div className="grid gap-3 border-b border-black/10 p-5 xl:grid-cols-[minmax(0,1fr)_auto_auto] xl:items-end">
          <label className="grid gap-2">
            <span className="text-sm font-bold">Search current page</span>
            <span className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a3f1d]" />
              <input
                className="min-h-12 w-full border border-black/10 pl-10 pr-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Order id, customer, phone"
                value={searchTerm}
              />
            </span>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold">Order status</span>
            <select
              className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
              onChange={(event) =>
                setOrderStatusFilter(event.target.value as 'all' | OrderStatus)
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

          <label className="grid gap-2">
            <span className="text-sm font-bold">Payment status</span>
            <select
              className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
              onChange={(event) =>
                setPaymentStatusFilter(
                  event.target.value as 'all' | PaymentStatus,
                )
              }
              value={paymentStatusFilter}
            >
              <option value="all">All payments</option>
              {paymentStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {formatOrderStatus(status)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
            <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Order status</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Placed</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
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
                    <td className="px-5 py-4">
                      <p className="font-bold">{getOrderCustomer(order)}</p>
                      <p className="mt-1 text-xs text-[#6b5f53]">
                        {getOrderCustomerEmail(order) || order.contactPhone}
                      </p>
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
                          onClick={() => setSelectedOrderId(order._id)}
                          type="button"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          aria-label={`Cancel ${formatOrderId(order._id)}`}
                          className="grid h-9 w-9 place-items-center border border-[#c85f2f]/25 text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef] disabled:cursor-not-allowed disabled:opacity-45"
                          disabled={!canCancelOrder(order)}
                          onClick={() =>
                            setConfirmTarget({ order, type: 'cancel' })
                          }
                          type="button"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          aria-label={`Delete ${formatOrderId(order._id)}`}
                          className="grid h-9 w-9 place-items-center border border-[#c85f2f]/25 text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef]"
                          onClick={() =>
                            setConfirmTarget({ order, type: 'delete' })
                          }
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
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
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="inline-flex h-10 w-10 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={page >= (meta?.totalPage ?? 1)}
              onClick={() => setPage((current) => current + 1)}
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {selectedOrder ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/60 px-4 py-6"
          onClick={() => setSelectedOrderId('')}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
                  Order detail
                </p>
                <h2 className="mt-2 text-3xl font-bold">
                  {formatOrderId(selectedOrder._id)}
                </h2>
                {isFetchingOrderDetail ? (
                  <p className="mt-2 text-sm font-semibold text-[#6b5f53]">
                    Loading latest order data...
                  </p>
                ) : null}
              </div>
              <button
                aria-label="Close order detail"
                className="grid h-10 w-10 place-items-center border border-black/10 transition hover:border-[#181512]"
                onClick={() => setSelectedOrderId('')}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-4 border-y border-black/10 py-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-bold">Order status</p>
                <p className="mt-2 inline-flex min-h-11 items-center bg-[#f1dfc8] px-3 text-sm font-bold text-[#7a3f1d]">
                  {formatOrderStatus(selectedOrder.orderStatus)}
                </p>
              </div>

              <div>
                <p className="text-sm font-bold">Payment status</p>
                <p className="mt-2 inline-flex min-h-11 items-center bg-[#effaf3] px-3 text-sm font-bold text-[#1f6b43]">
                  {formatOrderStatus(selectedOrder.paymentStatus)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <p>
                <span className="font-bold">Customer:</span>{' '}
                {getOrderCustomer(selectedOrder)}
              </p>
              <p>
                <span className="font-bold">Phone:</span>{' '}
                {selectedOrder.contactPhone ?? 'Not set'}
              </p>
              <p>
                <span className="font-bold">Shipping:</span>{' '}
                {selectedOrder.shippingAddress ?? 'Not set'}
              </p>
              <p>
                <span className="font-bold">Payment method:</span>{' '}
                {formatOrderStatus(selectedOrder.paymentMethod)}
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              {(selectedOrder.items ?? []).map((item, index) => {
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
                      <p className="mt-1 text-[#6b5f53]">
                        Qty {item.quantity ?? 1}
                      </p>
                    </div>
                    <p className="font-bold">
                      {formatPrice(item.subtotal ?? 0)}
                    </p>
                  </article>
                )
              })}
            </div>

            <div className="mt-5 flex flex-col justify-between gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center">
              <p className="text-xl font-bold">
                Total {formatPrice(selectedOrder.totalPrice ?? 0)}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {confirmTarget ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/60 px-4">
          <div className="w-full max-w-md border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]">
            <h2 className="text-2xl font-bold">
              {confirmTarget.type === 'cancel'
                ? 'Cancel order?'
                : 'Delete order?'}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#6b5f53]">
              {formatOrderId(confirmTarget.order._id)} will be{' '}
              {confirmTarget.type === 'cancel' ? 'cancelled' : 'deleted'}.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
                onClick={() => setConfirmTarget(null)}
                type="button"
              >
                Keep order
              </button>
              <button
                className="min-h-11 bg-[#8f3f1d] px-4 text-sm font-bold text-white transition hover:bg-[#6f2f15] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isCancelling || isDeleting}
                onClick={confirmOrderAction}
                type="button"
              >
                {isCancelling || isDeleting
                  ? 'Working...'
                  : confirmTarget.type === 'cancel'
                    ? 'Cancel order'
                    : 'Delete order'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  )
}

export default ManageOrders
