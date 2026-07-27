import { useState } from 'react'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useGetAdminStatsQuery } from '../../../features/dashboard/dashboardApi'
import { useGetAllOrdersQuery } from '../../../features/orders/orderApi'
import { adminNavItems } from '../../admin/adminNavItems'
import DashboardMetricGrid from '../DashboardMetricGrid'
import DashboardNotice from '../DashboardNotice'
import { getAdminMetrics } from './adminDashboardMetrics'
import AdminOverviewSections from './AdminOverviewSections'

function AdminDashboard() {
  const [isNoticeDismissed, setIsNoticeDismissed] = useState(false)
  const {
    data: adminStats = null,
    isError: hasStatsError,
    isLoading: isStatsLoading,
  } = useGetAdminStatsQuery()
  const {
    data: orderList,
    isError: hasOrdersError,
    isLoading: isOrdersLoading,
  } = useGetAllOrdersQuery({ limit: 5, page: 1 })
  const previewOrders = orderList?.data ?? []

  return (
    <DashboardLayout
      helperText="Scan priority work, then jump into the dedicated admin pages for detail."
      sidebarItems={adminNavItems}
      subtitle="A compact overview for orders, catalog signals, reviews, and admin shortcuts."
      title="Admin dashboard"
      workspaceLabel="Marketplace studio"
    >
      <DashboardNotice
        errorText={
          hasStatsError
            ? 'Failed to load admin stats. Showing sample stats.'
            : ''
        }
        loadingText="Loading live dashboard stats..."
        onClose={() => setIsNoticeDismissed(true)}
        show={(isStatsLoading || hasStatsError) && !isNoticeDismissed}
      />

      <DashboardMetricGrid metrics={getAdminMetrics(adminStats)} />

      <AdminOverviewSections
        hasOrdersError={hasOrdersError}
        isOrdersLoading={isOrdersLoading}
        orders={previewOrders}
        stats={adminStats}
      />
    </DashboardLayout>
  )
}

export default AdminDashboard
