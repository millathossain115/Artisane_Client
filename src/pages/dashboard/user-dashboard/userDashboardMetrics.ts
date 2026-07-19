import { PackageCheck, ShoppingBag, Star, Truck } from 'lucide-react'

import type { UserDashboardStats } from '../../../features/dashboard/dashboardApi'
import type { DashboardMetric } from '../DashboardMetricGrid'
import { formatCount, formatCurrency } from '../dashboardFormat'

function getStatusCount(stats: UserDashboardStats | null, status: string) {
  return (
    stats?.orderStatusSummary.find((item) => item._id === status)?.count ?? 0
  )
}

export function getUserMetrics(
  stats: UserDashboardStats | null,
): DashboardMetric[] {
  const pendingOrders = getStatusCount(stats, 'pending')
  const shippedOrders = getStatusCount(stats, 'shipped')

  return [
    {
      label: 'Total orders',
      value: formatCount(stats?.totalOrders),
      detail:
        stats && stats.deliveredOrders > 0
          ? `${formatCount(stats.deliveredOrders)} delivered`
          : 'Start your first order',
      icon: ShoppingBag,
    },
    {
      label: 'Active orders',
      value: formatCount(stats?.activeOrders),
      detail:
        shippedOrders > 0
          ? `${formatCount(shippedOrders)} shipped`
          : `${formatCount(pendingOrders)} pending`,
      icon: Truck,
    },
    {
      label: 'Order value',
      value: formatCurrency(stats?.totalOrderValue),
      detail: `${formatCount(stats?.cancelledOrders)} cancelled orders`,
      icon: PackageCheck,
    },
    {
      label: 'Reviews',
      value: formatCount(stats?.totalReviews),
      detail:
        stats && stats.averageRating > 0
          ? `${stats.averageRating.toFixed(1)} average rating`
          : 'Share feedback after delivery',
      icon: Star,
    },
  ]
}
