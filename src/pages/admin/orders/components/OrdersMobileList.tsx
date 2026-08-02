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

type OrdersMobileListProps = {
  getDetailUrl: (order: Order) => string
  orders: Order[]
  setConfirmTarget: Dispatch<SetStateAction<ConfirmTarget | null>>
}

function OrdersMobileList({
  getDetailUrl,
  orders,
  setConfirmTarget,
}: OrdersMobileListProps) {
  return (
    <div className="grid gap-3 p-4 lg:hidden">
      {orders.map((order) => (
        <article className="border border-black/10 bg-white p-4" key={order._id}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                className="font-bold text-[#7a3f1d] hover:underline"
                to={getDetailUrl(order)}
              >
                {formatOrderId(order._id)}
              </Link>
              <p className="mt-1 text-xs font-semibold text-[#6b5f53]">
                {formatOrderDate(order.createdAt)}
              </p>
            </div>
            <OrderActionMenu
              detailUrl={getDetailUrl(order)}
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
              to={getDetailUrl(order)}
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
  )
}

export default OrdersMobileList
