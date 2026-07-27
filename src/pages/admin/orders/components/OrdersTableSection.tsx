import { Link } from 'react-router-dom'
import { EmptyState, ErrorState, SkeletonTable } from '../../../../components/loaders'
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

      <div className="grid gap-3 border-b border-black/10 p-5 xl:grid-cols-[minmax(0,1fr)_auto_auto_auto] xl:items-end">
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
              setPaymentStatusFilter(event.target.value as 'all' | PaymentStatus)
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

        <button
          className="inline-flex min-h-12 items-center justify-center gap-2 border border-black/10 px-4 text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
          onClick={onResetFilters}
          type="button"
        >
          <RotateCcw className="h-4 w-4" />
          Reset filters
        </button>
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
            <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Shipment</th>
                <th className="px-5 py-3 text-center">Invoice</th>
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
                      to={getAdminOrderDetailUrl(order)}
                    >
                      {formatOrderId(order._id)}
                    </Link>
                    <p className="mt-1 text-xs font-semibold text-[#6b5f53]">
                      {formatOrderDate(order.createdAt)}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold">{getOrderCustomer(order)}</p>
                    <p className="mt-1 text-xs text-[#6b5f53]">
                      {getOrderCustomerEmail(order) || order.contactPhone}
                    </p>
                  </td>
                  <td className="max-w-[200px] px-5 py-4 text-[#6b5f53]">
                    <Link
                      className="block truncate hover:text-[#181512] hover:underline"
                      title={getOrderPrimaryItem(order)}
                      to={getAdminOrderDetailUrl(order)}
                    >
                      {getOrderPrimaryItem(order)}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <div className="grid gap-1.5">
                      <span className="w-fit bg-[#f1dfc8] px-2 py-1 text-xs font-bold text-[#7a3f1d]">
                        Order: {formatOrderStatus(order.orderStatus)}
                      </span>
                      <span className="w-fit bg-[#effaf3] px-2 py-1 text-xs font-bold text-[#1f6b43]">
                        Payment: {formatOrderStatus(order.paymentStatus)}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold">
                    {formatPrice(order.totalPrice ?? 0)}
                  </td>
                  <td className="max-w-[180px] px-5 py-4">
                    {order.courierProvider || order.trackingCode ? (
                      <div className="grid gap-1">
                        <span className="bg-[#eef3ff] px-2 py-1 text-xs font-bold text-[#27408b]">
                          {formatOrderStatus(
                            order.courierStatus ?? 'shipment_created',
                          )}
                        </span>
                        <span
                          className="block truncate text-xs font-semibold text-[#6b5f53]"
                          title={`${formatCourierProvider(order.courierProvider)}${order.trackingCode ? ` - ${order.trackingCode}` : ''}`}
                        >
                          {formatCourierProvider(order.courierProvider)}
                          {order.trackingCode ? ` - ${order.trackingCode}` : ''}
                        </span>
                      </div>
                    ) : (
                      <span className="bg-[#f8f3ea] px-2 py-1 text-xs font-bold text-[#6b5f53]">
                        Not created
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
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
                  <td className="px-5 py-4">
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
      )}

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
  )
}

export default OrdersTableSection
