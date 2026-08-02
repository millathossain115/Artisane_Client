import type { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { Download } from 'lucide-react'

import type { Order } from '../../../../features/orders/orderApi'
import { downloadOrderInvoice } from '../../../../utils/invoicePdf'
import {
  formatCourierProvider,
  formatOrderDate,
  formatOrderId,
  formatOrderStatus,
  getOrderCustomer,
  getOrderCustomerEmail,
  getOrderPrimaryItem,
} from '../../../../utils/orderDisplay'
import { formatPrice } from '../../../../utils/productDisplay'
import type { ConfirmTarget } from '../orderAdminUtils'
import OrderActionMenu from './OrderActionMenu'

type OrdersDesktopTableProps = {
  getDetailUrl: (order: Order) => string
  orders: Order[]
  setConfirmTarget: Dispatch<SetStateAction<ConfirmTarget | null>>
}

function OrdersDesktopTable({
  getDetailUrl,
  orders,
  setConfirmTarget,
}: OrdersDesktopTableProps) {
  return (
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
            <th className="w-[9%] px-2 py-3 text-right 2xl:px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              className="border-t border-black/10 transition hover:bg-[#f8f3ea]"
              key={order._id}
            >
              <td className="min-w-0 px-3 py-4 font-bold 2xl:px-5">
                <Link
                  className="block truncate text-[#7a3f1d] hover:underline"
                  to={getDetailUrl(order)}
                >
                  {formatOrderId(order._id)}
                </Link>
                <p className="mt-1 text-xs font-semibold text-[#6b5f53]">
                  {formatOrderDate(order.createdAt)}
                </p>
              </td>
              <td className="min-w-0 px-3 py-4 2xl:px-5">
                <p className="truncate font-bold" title={getOrderCustomer(order)}>
                  {getOrderCustomer(order)}
                </p>
                <p
                  className="mt-1 truncate text-xs text-[#6b5f53]"
                  title={getOrderCustomerEmail(order) || order.contactPhone}
                >
                  {getOrderCustomerEmail(order) || order.contactPhone}
                </p>
              </td>
              <td className="min-w-0 px-3 py-4 text-[#6b5f53] 2xl:px-5">
                <Link
                  className="block truncate hover:text-[#181512] hover:underline"
                  title={getOrderPrimaryItem(order)}
                  to={getDetailUrl(order)}
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
                      {order.trackingCode ? ` - ${order.trackingCode}` : ''}
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
                  detailUrl={getDetailUrl(order)}
                  order={order}
                  setConfirmTarget={setConfirmTarget}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrdersDesktopTable
