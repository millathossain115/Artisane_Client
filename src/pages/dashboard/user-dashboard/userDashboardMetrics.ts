import { Heart, PackageCheck, ShoppingBag, Truck } from 'lucide-react'

import type { UserDashboardStats } from '../../../features/dashboard/dashboardApi'
import type { Order } from '../../../features/orders/orderApi'
import type { DashboardMetric } from '../DashboardMetricGrid'
import { formatCount, formatCurrency } from '../dashboardFormat'

function getStatusCount(stats: UserDashboardStats | null, status: string) {
  return (
    stats?.orderStatusSummary.find((item) => item._id === status)?.count ?? 0
  )
}

export function getUserMetrics(
  stats: UserDashboardStats | null,
  orders: Order[] = [],
  totalOrderCount?: number,
): DashboardMetric[] {
  const shouldUseOrdersFallback =
    orders.length > 0 && (!stats || stats.totalOrders === 0)
  const pendingOrders = getStatusCount(stats, 'pending')
  const shippedOrders = getStatusCount(stats, 'shipped')
  const activeOrders = orders.filter((order) =>
    ['pending', 'confirmed', 'processing', 'shipped'].includes(
      order.orderStatus ?? '',
    ),
  ).length
  const cancelledOrders = orders.filter(
    (order) => order.orderStatus === 'cancelled',
  ).length
  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === 'delivered',
  ).length
  const totalOrderValue = orders
    .filter((order) => order.orderStatus !== 'cancelled')
    .reduce((total, order) => total + (order.totalPrice ?? 0), 0)

  return [
    {
      label: 'Total orders',
      value: formatCount(
        shouldUseOrdersFallback
          ? (totalOrderCount ?? orders.length)
          : stats?.totalOrders,
      ),
      detail: shouldUseOrdersFallback
        ? `${formatCount(deliveredOrders)} delivered`
        : stats && stats.deliveredOrders > 0
          ? `${formatCount(stats.deliveredOrders)} delivered`
          : 'Start your first order',
      icon: ShoppingBag,
    },
    {
      label: 'Active orders',
      value: formatCount(
        shouldUseOrdersFallback ? activeOrders : stats?.activeOrders,
      ),
      detail: shouldUseOrdersFallback
        ? `${formatCount(activeOrders)} in progress`
        : shippedOrders > 0
          ? `${formatCount(shippedOrders)} shipped`
          : `${formatCount(pendingOrders)} pending`,
      icon: Truck,
    },
    {
      label: 'Order value',
      value: formatCurrency(
        shouldUseOrdersFallback ? totalOrderValue : stats?.totalOrderValue,
      ),
      detail: `${formatCount(
        shouldUseOrdersFallback ? cancelledOrders : stats?.cancelledOrders,
      )} cancelled orders`,
      icon: PackageCheck,
    },
    {
      label: 'Wishlist',
      value: formatCount(stats?.totalWishlistItems),
      detail:
        stats && stats.totalWishlistItems > 0
          ? 'Saved products ready to revisit'
          : 'Save products before buying',
      icon: Heart,
    },
  ]
}
