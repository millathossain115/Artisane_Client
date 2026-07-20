import { useState } from 'react'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useGetCategoriesQuery } from '../../../features/categories/categoryApi'
import { useGetAdminStatsQuery } from '../../../features/dashboard/dashboardApi'
import { adminNavItems } from '../../admin/adminNavItems'
import DashboardMetricGrid from '../DashboardMetricGrid'
import DashboardNotice from '../DashboardNotice'
import AdminCategoriesSection from './AdminCategoriesSection'
import AdminOperationsSection from './AdminOperationsSection'
import AdminReviewActivitySection from './AdminReviewActivitySection'
import AdminSummaryTiles from './AdminSummaryTiles'
import { getAdminMetrics } from './adminDashboardMetrics'

function AdminDashboard() {
  const [isNoticeDismissed, setIsNoticeDismissed] = useState(false)
  const {
    data: adminStats = null,
    isError: hasStatsError,
    isLoading: isStatsLoading,
  } = useGetAdminStatsQuery()
  const {
    data: categoryList,
    isError: hasCategoriesError,
    isLoading: isCategoriesLoading,
  } = useGetCategoriesQuery({ limit: 5, page: 1 })
  const previewCategories = categoryList?.data ?? []
  const totalCategories = categoryList?.meta.total ?? previewCategories.length

  return (
    <DashboardLayout
      helperText="Review pending orders and low-stock handmade pieces before publishing new drops."
      sidebarItems={adminNavItems}
      subtitle="Monitor sales, orders, inventory, reviews, and marketplace tasks from one focused workspace."
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

      <AdminCategoriesSection
        categories={previewCategories}
        hasError={hasCategoriesError}
        isLoading={isCategoriesLoading}
        totalCategories={totalCategories}
      />
      <AdminOperationsSection />
      <AdminReviewActivitySection stats={adminStats} />
      <AdminSummaryTiles totalCategories={totalCategories} />
    </DashboardLayout>
  )
}

export default AdminDashboard
