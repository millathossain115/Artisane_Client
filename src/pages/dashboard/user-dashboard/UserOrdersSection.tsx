import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import type {
  DashboardOrder,
  UserDashboardStats,
} from '../../../features/dashboard/dashboardApi'
import type { Order } from '../../../features/orders/orderApi'
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

const RECENT_ORDER_LIMIT = 6

function getPrimaryOrderItem(order: DashboardOrder | Order) {
  const firstItem = order.items?.[0]

  if (!firstItem) {
    return 'Order items'
  }

  const itemName = firstItem.productName ?? 'Order item'
  const extraItems = (order.items?.length ?? 0) - 1

  return extraItems > 0 ? `${itemName} +${extraItems} more` : itemName
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

      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left text-sm">
          <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Artwork</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Placed</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length ? (
              recentOrders.map((order) => (
                <tr
                  className="border-t border-black/10 transition hover:bg-[#f8f3ea]"
                  key={order._id}
                >
                  <td className="px-5 py-4 font-bold">
                    {formatOrderId(order._id)}
                  </td>
                  <td className="px-5 py-4 text-[#6b5f53]">
                    {getPrimaryOrderItem(order)}
                  </td>
                  <td className="px-5 py-4">
                    <span className="bg-[#f1dfc8] px-2 py-1 text-xs font-bold text-[#7a3f1d]">
                      {formatStatus(order.orderStatus)}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="px-5 py-4 text-[#6b5f53]">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-black/10">
                <td
                  className="px-5 py-6 text-center font-semibold text-[#6b5f53]"
                  colSpan={5}
                >
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserOrdersSection
