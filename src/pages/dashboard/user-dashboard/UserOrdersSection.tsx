import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import type {
  DashboardOrder,
  UserDashboardStats,
} from '../../../features/dashboard/dashboardApi'
import type { Order } from '../../../features/orders/orderApi'
import { getOrderUrl } from '../../../utils/orderDisplay'
import {
  formatCurrency,
  formatDate,
  formatOrderId,
  formatStatus,
} from '../dashboardFormat'

type UserOrdersSectionProps = {
  orders: Order[]
  stats: UserDashboardStats | null
}

const RECENT_ORDER_LIMIT = 4

function getPrimaryOrderItem(order: DashboardOrder | Order) {
  const firstItem = order.items?.[0]

  if (!firstItem) {
    return 'Order items'
  }

  const itemName = firstItem.productName ?? 'Order item'
  const extraItems = (order.items?.length ?? 0) - 1

  return extraItems > 0 ? `${itemName} +${extraItems} more` : itemName
}

function getPrimaryOrderImage(order: DashboardOrder | Order) {
  const firstItem = order.items?.[0]

  if (!firstItem || !('image' in firstItem)) {
    return ''
  }

  return typeof firstItem.image === 'string' ? firstItem.image : ''
}

function UserOrdersSection({ orders, stats }: UserOrdersSectionProps) {
  const recentOrders = (
    orders.length ? orders : (stats?.recentOrders ?? [])
  ).slice(0, RECENT_ORDER_LIMIT)

  return (
    <div className="border border-black/10 bg-white" id="orders">
      <div className="flex items-center justify-between gap-4 border-b border-black/10 p-5">
        <div>
          <h2 className="text-2xl font-bold">My orders</h2>
          <p className="mt-1 text-sm text-[#6b5f53]">
            Latest {RECENT_ORDER_LIMIT} orders for your account.
          </p>
        </div>
        <Link
          className="inline-flex items-center gap-2 border border-black/10 px-3 py-2 text-sm font-bold transition hover:border-[#181512]"
          to="/dashboard/orders"
        >
          View all
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="p-4">
        {recentOrders.length ? (
          <div className="flex flex-col gap-2.5">
            {recentOrders.map((order) => (
              <div
                className="flex items-center justify-between gap-3 border border-black/10 bg-[#FAF7F2] px-3.5 py-2.5 transition hover:border-black/30"
                key={order._id}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Link
                    className="group flex items-center gap-3 min-w-0 flex-1"
                    to={getOrderUrl(order)}
                  >
                    {getPrimaryOrderImage(order) ? (
                      <img
                        alt={getPrimaryOrderItem(order)}
                        className="h-10 w-10 flex-shrink-0 border border-black/10 object-cover transition group-hover:border-[#7a3f1d]"
                        src={getPrimaryOrderImage(order)}
                      />
                    ) : (
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-black/10 bg-[#f1dfc8]/40 text-[10px] font-bold text-[#7a3f1d] transition group-hover:border-[#7a3f1d]">
                        ART
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#181512]">
                          {formatOrderId(order._id)}
                        </span>
                        <span className="bg-[#f1dfc8] px-1.5 py-0.5 text-[10px] font-bold text-[#7a3f1d]">
                          {formatStatus(order.orderStatus)}
                        </span>
                      </div>
                      <p className="truncate text-xs font-medium text-[#6b5f53] transition group-hover:text-[#7a3f1d] group-hover:underline">
                        {getPrimaryOrderItem(order)}
                      </p>
                    </div>
                  </Link>
                </div>

                <div className="flex flex-col items-end flex-shrink-0 border-l border-black/10 pl-3">
                  <span className="text-xs font-bold text-[#181512]">
                    {formatCurrency(order.totalPrice)}
                  </span>
                  <span className="text-[10px] text-[#6b5f53]">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-sm font-semibold text-[#6b5f53]">
            No orders yet.
          </div>
        )}
      </div>
    </div>
  )
}

export default UserOrdersSection
