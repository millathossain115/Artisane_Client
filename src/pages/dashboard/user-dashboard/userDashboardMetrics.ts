import { Heart, PackageCheck, ShoppingBag, Star, Truck } from 'lucide-react'

import type { UserDashboardStats } from '../../../features/dashboard/dashboardApi'
import type { Order } from '../../../features/orders/orderApi'
import type { DashboardMetric } from '../DashboardMetricGrid'
import { formatCount } from '../dashboardFormat'

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
  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === 'delivered',
  ).length

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
      label: 'Delivered',
      value: formatCount(
        shouldUseOrdersFallback ? deliveredOrders : stats?.deliveredOrders,
      ),
      detail: 'Completed orders',
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
    {
      label: 'Reviews',
      value: formatCount(stats?.totalReviews),
      detail:
        stats && stats.totalReviews > 0
          ? 'Feedback shared'
          : 'Review purchased products',
      icon: Star,
    },
  ]
}
