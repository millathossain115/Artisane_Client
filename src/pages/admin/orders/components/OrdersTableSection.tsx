import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

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

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1220px] border-collapse text-left text-sm">
          <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Order status</th>
              <th className="px-5 py-3">Payment</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Shipment</th>
              <th className="px-5 py-3">Placed</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr className="border-t border-black/10" key={index}>
                  <td className="px-5 py-5" colSpan={9}>
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
                    <Link
                      className="text-[#7a3f1d] hover:underline"
                      to={`/dashboard/admin/orders/${order._id}`}
                    >
                      {formatOrderId(order._id)}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold">{getOrderCustomer(order)}</p>
                    <p className="mt-1 text-xs text-[#6b5f53]">
                      {getOrderCustomerEmail(order) || order.contactPhone}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-[#6b5f53]">
                    <Link
                      className="hover:text-[#181512] hover:underline"
                      to={`/dashboard/admin/orders/${order._id}`}
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
                  <td className="px-5 py-4 font-bold">
                    {formatPrice(order.totalPrice ?? 0)}
                  </td>
                  <td className="px-5 py-4">
                    {order.courierProvider || order.trackingCode ? (
                      <div className="grid gap-1">
                        <span className="bg-[#eef3ff] px-2 py-1 text-xs font-bold text-[#27408b]">
                          {formatOrderStatus(
                            order.courierStatus ?? 'shipment_created',
                          )}
                        </span>
                        <span className="text-xs font-semibold text-[#6b5f53]">
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
                  <td className="px-5 py-4 text-[#6b5f53]">
                    {formatOrderDate(order.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        aria-label={`View ${formatOrderId(order._id)}`}
                        className="inline-flex min-h-9 items-center gap-1.5 border border-black/10 bg-white px-3 text-xs font-bold text-[#181512] transition hover:border-[#181512]"
                        to={`/dashboard/admin/orders/${order._id}`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Details</span>
                      </Link>
                      <button
                        aria-label={`Cancel ${formatOrderId(order._id)}`}
                        className="grid h-9 w-9 place-items-center border border-[#c85f2f]/25 text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef] disabled:cursor-not-allowed disabled:opacity-45"
                        disabled={!canCancelOrder(order)}
                        onClick={() => setConfirmTarget({ order, type: 'cancel' })}
                        type="button"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <button
                        aria-label={`Delete ${formatOrderId(order._id)}`}
                        className="grid h-9 w-9 place-items-center border border-[#c85f2f]/25 text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef]"
                        onClick={() => setConfirmTarget({ order, type: 'delete' })}
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
                  colSpan={9}
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
  )
}

export default OrdersTableSection
