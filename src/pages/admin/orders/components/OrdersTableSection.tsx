import { Link } from 'react-router-dom'
import {
  EmptyState,
  ErrorState,
  SkeletonTable,
} from '../../../../components/loaders'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  EllipsisVertical,
  Eye,
  Package,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'

import { downloadOrderInvoice } from '../../../../utils/invoicePdf'
import type {
  Order,
  OrderListMeta,
  OrderStatus,
  PaymentStatus,
} from '../../../../features/orders/orderApi'
import { formatPrice } from '../../../../utils/productDisplay'
import {
  canCancelOrder,
  formatCourierProvider,
  formatOrderDate,
  formatOrderId,
  formatOrderStatus,
  getOrderCustomer,
  getOrderCustomerEmail,
  getOrderPrimaryItem,
} from '../../../../utils/orderDisplay'
import {
  type ConfirmTarget,
  orderStatusOptions,
  paymentStatusOptions,
} from '../orderAdminUtils'
import { getAdminOrderRouteRef } from '../orderRouteState'

type OrdersTableSectionProps = {
  isError: boolean
  isLoading: boolean
  meta?: OrderListMeta
  onResetFilters: () => void
  orders: Order[]
  orderStatusFilter: 'all' | OrderStatus
  page: number
  paymentStatusFilter: 'all' | PaymentStatus
  searchTerm: string
  setConfirmTarget: Dispatch<SetStateAction<ConfirmTarget | null>>
  setOrderStatusFilter: Dispatch<SetStateAction<'all' | OrderStatus>>
  setPage: Dispatch<SetStateAction<number>>
  setPaymentStatusFilter: Dispatch<SetStateAction<'all' | PaymentStatus>>
  setSearchTerm: Dispatch<SetStateAction<string>>
  setSelectedOrderId: Dispatch<SetStateAction<string>>
  visibleOrders: Order[]
}

type OrderActionMenuProps = {
  detailUrl: string
  order: Order
  setConfirmTarget: Dispatch<SetStateAction<ConfirmTarget | null>>
}

function OrderActionMenu({
  detailUrl,
  order,
  setConfirmTarget,
}: OrderActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const orderLabel = formatOrderId(order._id)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  function handleConfirm(type: ConfirmTarget['type']) {
    setIsOpen(false)
    setConfirmTarget({ order, type })
  }

  return (
    <div className="relative flex justify-end" ref={menuRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Open actions for ${orderLabel}`}
        className="grid h-9 w-9 place-items-center border border-black/10 bg-white text-[#181512] transition hover:border-[#181512] hover:bg-[#f8f3ea]"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <EllipsisVertical className="h-4 w-4" />
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 top-10 z-30 min-w-40 border border-black/10 bg-white p-1 shadow-[0_18px_38px_rgba(24,21,18,0.16)]"
          role="menu"
        >
          <Link
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-bold text-[#181512] transition hover:bg-[#f8f3ea]"
            onClick={() => setIsOpen(false)}
            role="menuitem"
            to={detailUrl}
          >
            <Eye className="h-3.5 w-3.5" />
            Details
          </Link>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-bold text-[#8f3f1d] transition hover:bg-[#fff5ef] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!canCancelOrder(order)}
            onClick={() => handleConfirm('cancel')}
            role="menuitem"
            type="button"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Cancel order
          </button>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-bold text-[#8f3f1d] transition hover:bg-[#fff5ef]"
            onClick={() => handleConfirm('delete')}
            role="menuitem"
            type="button"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete order
          </button>
        </div>
      ) : null}
    </div>
  )
}

function OrdersTableSection({
  isError,
  isLoading,
  meta,
  onResetFilters,
  orders,
  orderStatusFilter,
  page,
  paymentStatusFilter,
  searchTerm,
  setConfirmTarget,
  setOrderStatusFilter,
  setPage,
  setPaymentStatusFilter,
  setSearchTerm,
  visibleOrders,
}: Omit<OrdersTableSectionProps, 'setSelectedOrderId'>) {
  function getAdminOrderDetailUrl(order: Order) {
    return `/dashboard/admin/orders/${getAdminOrderRouteRef(order)}`
  }

  return (
    <section className="border border-black/10 bg-white">
      <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3.5 sm:px-5">
        <span className="grid h-9 w-9 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
          <Package className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-xl font-bold">Orders</h2>
          <p className="mt-0.5 text-xs font-semibold text-[#6b5f53]">
            {meta?.total ?? orders.length} orders in database.
          </p>
        </div>
      </div>

      {isError ? (
        <div className="border-b border-[#c85f2f]/30 bg-[#fff5ef] px-5 py-3 text-sm font-bold text-[#8f3f1d]">
          Failed to load orders.
        </div>
      ) : null}

      <div className="grid gap-2 border-b border-black/10 p-3 sm:grid-cols-2 sm:p-4 xl:grid-cols-[minmax(18rem,1fr)_minmax(10rem,0.45fr)_minmax(10rem,0.45fr)_auto] xl:items-end">
        <label className="grid gap-1.5 sm:col-span-2 xl:col-span-1">
          <span className="text-xs font-bold">Search current page</span>
          <span className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7a3f1d]" />
            <input
              className="min-h-9 w-full border border-black/10 pl-8 pr-2 text-xs font-semibold outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Order id, customer, phone"
              value={searchTerm}
            />
          </span>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-bold">Order status</span>
          <select
            className="min-h-9 border border-black/10 bg-white px-2 text-xs font-bold outline-none transition focus:border-[#181512]"
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

        <label className="grid gap-1.5">
          <span className="text-xs font-bold">Payment status</span>
          <select
            className="min-h-9 border border-black/10 bg-white px-2 text-xs font-bold outline-none transition focus:border-[#181512]"
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

        <div className="grid gap-1.5">
          <span className="hidden text-xs font-bold xl:block">&nbsp;</span>
          <button
            className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-black/10 px-3 text-xs font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
            onClick={onResetFilters}
            type="button"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      {isError ? (
        <ErrorState
          title="Could not load admin orders"
          message="An error occurred while communicating with orders database."
          onRetry={() => window.location.reload()}
          className="mx-5"
        />
      ) : null}

      {isLoading ? (
        <div className="p-5">
          <SkeletonTable rows={6} cols={8} />
        </div>
      ) : !visibleOrders.length ? (
        <EmptyState
          title="No orders found"
          message="No customer orders match the current search query or filter parameters."
          icon={<Package className="h-7 w-7" />}
          action={
            <button
              onClick={onResetFilters}
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-[#5c3d2e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d1810]"
            >
              Reset Filters
            </button>
          }
        />
      ) : (
        <>
          <div className="grid gap-3 p-4 lg:hidden">
            {visibleOrders.map((order) => (
              <article
                className="border border-black/10 bg-white p-4"
                key={order._id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      className="font-bold text-[#7a3f1d] hover:underline"
                      to={getAdminOrderDetailUrl(order)}
                    >
                      {formatOrderId(order._id)}
                    </Link>
                    <p className="mt-1 text-xs font-semibold text-[#6b5f53]">
                      {formatOrderDate(order.createdAt)}
                    </p>
                  </div>
                  <OrderActionMenu
                    detailUrl={getAdminOrderDetailUrl(order)}
                    order={order}
                    setConfirmTarget={setConfirmTarget}
                  />
                </div>

                <div className="mt-3 grid gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#8a7d71]">
                      Customer
                    </p>
                    <p className="mt-1 truncate text-sm font-bold">
                      {getOrderCustomer(order)}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[#6b5f53]">
                      {getOrderCustomerEmail(order) || order.contactPhone}
                    </p>
                  </div>

                  <Link
                    className="line-clamp-2 text-sm font-semibold text-[#4f463d] hover:text-[#181512] hover:underline"
                    to={getAdminOrderDetailUrl(order)}
                  >
                    {getOrderPrimaryItem(order)}
                  </Link>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="bg-[#f1dfc8] px-2 py-1 text-xs font-bold text-[#7a3f1d]">
                    Order: {formatOrderStatus(order.orderStatus)}
                  </span>
                  <span className="bg-[#effaf3] px-2 py-1 text-xs font-bold text-[#1f6b43]">
                    Payment: {formatOrderStatus(order.paymentStatus)}
                  </span>
                  <span className="bg-[#f8f3ea] px-2 py-1 text-xs font-bold text-[#181512]">
                    {formatPrice(order.totalPrice ?? 0)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-black/10 pt-3">
                  <div className="min-w-0">
                    {order.courierProvider || order.trackingCode ? (
                      <>
                        <p className="truncate text-xs font-bold text-[#27408b]">
                          {formatCourierProvider(order.courierProvider)}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-[#6b5f53]">
                          {order.trackingCode || 'Tracking pending'}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs font-bold text-[#6b5f53]">
                        Shipment not created
                      </p>
                    )}
                  </div>
                  <button
                    aria-label={`Download invoice for ${formatOrderId(order._id)}`}
                    className="grid h-9 w-9 shrink-0 place-items-center border border-black/10 bg-white text-[#181512] transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                    onClick={() => downloadOrderInvoice(order)}
                    type="button"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden lg:block">
            <table className="w-full table-fixed border-collapse text-left text-sm">
              <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
                <tr>
                  <th className="w-[12%] px-3 py-3 2xl:px-5">Order</th>
                  <th className="w-[17%] px-3 py-3 2xl:px-5">Customer</th>
                  <th className="w-[17%] px-3 py-3 2xl:px-5">Items</th>
                  <th className="w-[15%] px-3 py-3 2xl:px-5">Status</th>
                  <th className="w-[9%] px-2 py-3 2xl:px-4">Total</th>
                  <th className="w-[13%] px-2 py-3 2xl:px-4">Shipment</th>
                  <th className="w-[8%] px-2 py-3 text-center 2xl:px-4">
                    Invoice
                  </th>
                  <th className="w-[9%] px-2 py-3 text-right 2xl:px-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map((order) => (
                  <tr
                    className="border-t border-black/10 transition hover:bg-[#f8f3ea]"
                    key={order._id}
                  >
                    <td className="min-w-0 px-3 py-4 font-bold 2xl:px-5">
                      <Link
                        className="block truncate text-[#7a3f1d] hover:underline"
                        to={getAdminOrderDetailUrl(order)}
                      >
                        {formatOrderId(order._id)}
                      </Link>
                      <p className="mt-1 text-xs font-semibold text-[#6b5f53]">
                        {formatOrderDate(order.createdAt)}
                      </p>
                    </td>
                    <td className="min-w-0 px-3 py-4 2xl:px-5">
                      <p
                        className="truncate font-bold"
                        title={getOrderCustomer(order)}
                      >
                        {getOrderCustomer(order)}
                      </p>
                      <p
                        className="mt-1 truncate text-xs text-[#6b5f53]"
                        title={
                          getOrderCustomerEmail(order) || order.contactPhone
                        }
                      >
                        {getOrderCustomerEmail(order) || order.contactPhone}
                      </p>
                    </td>
                    <td className="min-w-0 px-3 py-4 text-[#6b5f53] 2xl:px-5">
                      <Link
                        className="block truncate hover:text-[#181512] hover:underline"
                        title={getOrderPrimaryItem(order)}
                        to={getAdminOrderDetailUrl(order)}
                      >
                        {getOrderPrimaryItem(order)}
                      </Link>
                    </td>
                    <td className="px-3 py-4 2xl:px-5">
                      <div className="grid gap-1.5">
                        <span
                          className="block truncate bg-[#f1dfc8] px-2 py-1 text-xs font-bold text-[#7a3f1d]"
                          title={`Order: ${formatOrderStatus(order.orderStatus)}`}
                        >
                          <span className="hidden 2xl:inline">Order: </span>
                          {formatOrderStatus(order.orderStatus)}
                        </span>
                        <span
                          className="block truncate bg-[#effaf3] px-2 py-1 text-xs font-bold text-[#1f6b43]"
                          title={`Payment: ${formatOrderStatus(order.paymentStatus)}`}
                        >
                          <span className="hidden 2xl:inline">Payment: </span>
                          {formatOrderStatus(order.paymentStatus)}
                        </span>
                      </div>
                    </td>
                    <td className="truncate px-2 py-4 font-bold 2xl:px-4">
                      {formatPrice(order.totalPrice ?? 0)}
                    </td>
                    <td className="min-w-0 px-2 py-4 2xl:px-4">
                      {order.courierProvider || order.trackingCode ? (
                        <div className="grid gap-1">
                          <span className="block truncate bg-[#eef3ff] px-2 py-1 text-xs font-bold text-[#27408b]">
                            {formatOrderStatus(
                              order.courierStatus ?? 'shipment_created',
                            )}
                          </span>
                          <span
                            className="block truncate text-xs font-semibold text-[#6b5f53]"
                            title={`${formatCourierProvider(order.courierProvider)}${order.trackingCode ? ` - ${order.trackingCode}` : ''}`}
                          >
                            {formatCourierProvider(order.courierProvider)}
                            {order.trackingCode
                              ? ` - ${order.trackingCode}`
                              : ''}
                          </span>
                        </div>
                      ) : (
                        <span className="bg-[#f8f3ea] px-2 py-1 text-xs font-bold text-[#6b5f53]">
                          Not created
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-4 2xl:px-4">
                      <div className="flex justify-center">
                        <button
                          aria-label={`Download invoice for ${formatOrderId(order._id)}`}
                          className="grid h-9 w-9 place-items-center border border-black/10 bg-white text-[#181512] transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                          onClick={() => downloadOrderInvoice(order)}
                          type="button"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-2 py-4 2xl:px-4">
                      <OrderActionMenu
                        detailUrl={getAdminOrderDetailUrl(order)}
                        order={order}
                        setConfirmTarget={setConfirmTarget}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="flex flex-col gap-2 border-t border-black/10 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs font-semibold text-[#6b5f53]">
          Page {meta?.page ?? page} of {meta?.totalPage ?? 1}
        </p>
        <div className="flex gap-2">
          <button
            className="inline-flex h-8 w-8 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            className="inline-flex h-8 w-8 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={page >= (meta?.totalPage ?? 1)}
            onClick={() => setPage((current) => current + 1)}
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default OrdersTableSection
