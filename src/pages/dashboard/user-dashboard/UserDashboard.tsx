import { useState } from 'react'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import { getStoredUser } from '../../../features/auth/authApi'
import { useGetMyDashboardStatsQuery } from '../../../features/dashboard/dashboardApi'
import { useGetMyOrdersQuery } from '../../../features/orders/orderApi'
import DashboardMetricGrid from '../DashboardMetricGrid'
import DashboardNotice from '../DashboardNotice'
import UserAccountOverview from './UserAccountOverview'
import UserSummaryTiles from './UserSummaryTiles'
import UserWishlistReviewsSection from './UserWishlistReviewsSection'
import { getUserMetrics } from './userDashboardMetrics'
import { userNavItems } from './userNavItems'

function UserDashboard() {
  const user = getStoredUser()
  const [isNoticeDismissed, setIsNoticeDismissed] = useState(false)
  const {
    data: userStats = null,
    isError: hasStatsError,
    isLoading: isStatsLoading,
  } = useGetMyDashboardStatsQuery()
  const { data: myOrderList } = useGetMyOrdersQuery(
    { limit: 100, page: 1 },
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
      helperText="Track orders, finish profile details, and keep an eye on saved artwork before it sells."
      sidebarItems={userNavItems}
      subtitle="Manage your orders, saved artwork, reviews, messages, and account details."
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
      <UserAccountOverview orders={myOrders} stats={userStats} />
      <UserWishlistReviewsSection stats={userStats} />
      <UserSummaryTiles />
    </DashboardLayout>
  )
}

export default UserDashboard
