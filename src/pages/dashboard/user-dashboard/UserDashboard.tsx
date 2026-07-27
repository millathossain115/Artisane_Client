import { useState } from 'react'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import { getStoredUser } from '../../../features/auth/authApi'
import { useGetMyDashboardStatsQuery } from '../../../features/dashboard/dashboardApi'
import { useGetMyOrdersQuery } from '../../../features/orders/orderApi'
import DashboardMetricGrid from '../DashboardMetricGrid'
import DashboardNotice from '../DashboardNotice'
import { getUserMetrics } from './userDashboardMetrics'
import { userNavItems } from './userNavItems'
import UserOverviewSections from './UserOverviewSections'

function UserDashboard() {
  const user = getStoredUser()
  const [isNoticeDismissed, setIsNoticeDismissed] = useState(false)
  const {
    data: userStats = null,
    isError: hasStatsError,
    isLoading: isStatsLoading,
  } = useGetMyDashboardStatsQuery()
  const { data: myOrderList } = useGetMyOrdersQuery(
    { limit: 3, page: 1 },
    { refetchOnMountOrArgChange: true },
  )
  const myOrders = myOrderList?.data ?? []
  const shouldShowStatsNotice =
    (isStatsLoading || (hasStatsError && myOrders.length === 0)) &&
    !isNoticeDismissed

  return (
    <DashboardLayout
      actions={[
        { label: 'Continue shopping', to: '/' },
        { label: 'Track order', to: '/dashboard/orders', variant: 'primary' },
      ]}
      eyebrow="My account"
      helperText="Check your current order, saved products, and account shortcuts."
      layoutVariant="customer"
      sidebarItems={userNavItems}
      subtitle="A simple account overview for orders, wishlist, addresses, and support."
      title={`Welcome${user?.name ? `, ${user.name.split(' ')[0]}` : ''}`}
      workspaceLabel="Collector account"
    >
      <DashboardNotice
        errorText={
          hasStatsError
            ? 'Failed to load your dashboard stats. Showing saved account sections.'
            : ''
        }
        loadingText="Loading your dashboard stats..."
        onClose={() => setIsNoticeDismissed(true)}
        show={shouldShowStatsNotice}
      />

      <DashboardMetricGrid
        metrics={getUserMetrics(userStats, myOrders, myOrderList?.meta.total)}
      />
      <UserOverviewSections orders={myOrders} stats={userStats} />
    </DashboardLayout>
  )
}

export default UserDashboard
