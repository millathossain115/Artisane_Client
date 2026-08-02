import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import { ErrorState, SkeletonCard } from '../../../components/loaders'
import {
  type AdminAnalyticsFilters,
  useGetAdminAnalyticsQuery,
} from '../../../features/analytics/analyticsApi'
import { useGetCategoriesQuery } from '../../../features/categories/categoryApi'
import { adminNavItems } from '../adminNavItems'
import type { FilterKey } from './adminAnalyticsUtils'
import AnalyticsDashboardContent from './components/AnalyticsDashboardContent'
import AnalyticsFilters from './components/AnalyticsFilters'

function AdminAnalytics() {
  const [filters, setFilters] = useState<AdminAnalyticsFilters>({})
  const { data: categoryList } = useGetCategoriesQuery({ limit: 100, page: 1 })
  const {
    data: analytics,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAdminAnalyticsQuery(filters, { refetchOnMountOrArgChange: true })

  const categories = categoryList?.data ?? []

  function updateFilter(key: FilterKey, value: string) {
    setFilters((current) => ({
      ...current,
      [key]: value || undefined,
    }))
  }

  function resetFilters() {
    setFilters({})
  }

  return (
    <DashboardLayout
      eyebrow="Analytics"
      helperText="Track sales, payment, inventory, customer, shipping, and activity health from live store data."
      sidebarItems={adminNavItems}
      subtitle="Use filters to compare operational performance across time, fulfillment, payment, and catalog segments."
      title="Admin analytics"
      workspaceLabel="Marketplace studio"
    >
      <div className="space-y-5">
        <AnalyticsFilters
          categories={categories}
          filters={filters}
          onChange={updateFilter}
          onReset={resetFilters}
        />

        {isError ? (
          <ErrorState
            message="Analytics could not be loaded."
            onRetry={() => void refetch()}
            title="Could not load analytics"
          />
        ) : null}

        {isLoading ? (
          <SkeletonCard
            count={8}
            gridCols="grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4"
          />
        ) : analytics ? (
          <AnalyticsDashboardContent analytics={analytics} />
        ) : null}

        {isFetching && !isLoading ? (
          <p className="text-sm font-bold text-[#6b5f53]">
            Refreshing analytics...
          </p>
        ) : null}

        <button
          className="inline-flex min-h-10 items-center justify-center gap-2 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
          onClick={() => void refetch()}
          type="button"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
          />
          Refresh analytics
        </button>
      </div>
    </DashboardLayout>
  )
}

export default AdminAnalytics
