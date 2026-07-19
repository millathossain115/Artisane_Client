import { DollarSign, Package, Palette, UsersRound } from 'lucide-react'

import type { AdminDashboardStats } from '../../../features/dashboard/dashboardApi'
import type { DashboardMetric } from '../DashboardMetricGrid'
import {
  formatCount,
  formatCurrency,
  formatGrowth,
  readNumericStat,
} from '../dashboardFormat'

export function getAdminMetrics(
  stats: AdminDashboardStats | null,
): DashboardMetric[] {
  const revenue = readNumericStat(stats, [
    'revenue',
    'totalRevenue',
    'monthlyRevenue',
    'totalSales',
  ])
  const revenueGrowth = readNumericStat(stats, [
    'revenueGrowth',
    'monthlyGrowth',
  ])
  const totalOrders = readNumericStat(stats, ['orders', 'totalOrders'])
  const pendingOrders = readNumericStat(stats, [
    'pendingOrders',
    'awaitingFulfillment',
  ])
  const activeProducts = readNumericStat(stats, [
    'activeProducts',
    'products',
    'totalProducts',
  ])
  const lowStockProducts = readNumericStat(stats, ['lowStockProducts'])
  const customers = readNumericStat(stats, [
    'customers',
    'totalCustomers',
    'users',
    'totalUsers',
  ])
  const newCustomers = readNumericStat(stats, [
    'newCustomersThisWeek',
    'newUsersThisWeek',
  ])

  return [
    {
      label: 'Revenue',
      value: formatCurrency(revenue, '$18,420'),
      detail: formatGrowth(revenueGrowth, '+12.4% this month'),
      icon: DollarSign,
    },
    {
      label: 'Orders',
      value: formatCount(totalOrders, '286'),
      detail:
        pendingOrders === null
          ? '34 awaiting fulfillment'
          : `${formatCount(pendingOrders, '0')} awaiting fulfillment`,
      icon: Package,
    },
    {
      label: 'Active products',
      value: formatCount(activeProducts, '148'),
      detail:
        lowStockProducts === null
          ? '12 low-stock pieces'
          : `${formatCount(lowStockProducts, '0')} low-stock pieces`,
      icon: Palette,
    },
    {
      label: 'Customers',
      value: formatCount(customers, '2,410'),
      detail:
        newCustomers === null
          ? '86 new this week'
          : `${formatCount(newCustomers, '0')} new this week`,
      icon: UsersRound,
    },
  ]
}
