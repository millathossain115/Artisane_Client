import { useMemo, useState, type ReactNode } from 'react'
import {
  AlertTriangle,
  BarChart3,
  CreditCard,
  PackageCheck,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShoppingBag,
  Star,
  Truck,
  UsersRound,
  Wallet,
} from 'lucide-react'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import { ErrorState, SkeletonCard } from '../../../components/loaders'
import {
  type AdminAnalyticsFilters,
  type AnalyticsNamedCount,
  useGetAdminAnalyticsQuery,
} from '../../../features/analytics/analyticsApi'
import { useGetCategoriesQuery } from '../../../features/categories/categoryApi'
import { formatCount } from '../../dashboard/dashboardFormat'
import { adminNavItems } from '../adminNavItems'

type FilterKey = keyof AdminAnalyticsFilters

const orderStatusOptions = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]
const paymentStatusOptions = ['unpaid', 'paid', 'failed', 'refunded']
const paymentMethodOptions = ['cod', 'sslcommerz', 'bkash', 'nagad', 'rocket']
const courierProviderOptions = ['steadfast']

function formatCurrency(value?: number) {
  return `৳${Math.round(value ?? 0).toLocaleString()}`
}

function formatLabel(value?: string) {
  return value
    ? value
        .split('_')
        .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
        .join(' ')
    : 'Not set'
}

function truncateText(value: string, maxLength = 30) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 2)}..` : value
}

function getMaxValue(
  rows: Array<{ count?: number; revenue?: number; soldQuantity?: number }>,
) {
  return Math.max(
    1,
    ...rows.map((row) => row.revenue ?? row.soldQuantity ?? row.count ?? 0),
  )
}

function MiniBarList({
  emptyText,
  rows,
  valueLabel,
}: {
  emptyText: string
  rows: AnalyticsNamedCount[]
  valueLabel?: (row: AnalyticsNamedCount) => string
}) {
  const maxValue = getMaxValue(rows)

  if (!rows.length) {
    return (
      <p className="py-8 text-sm font-semibold text-[#6b5f53]">{emptyText}</p>
    )
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="font-bold">{formatLabel(row.label)}</span>
            <span className="text-xs font-bold text-[#6b5f53]">
              {valueLabel ? valueLabel(row) : formatCount(row.count)}
            </span>
          </div>
          <div className="h-2 bg-[#f1dfc8]">
            <div
              className="h-2 bg-[#7a3f1d]"
              style={{ width: `${Math.max(5, (row.count / maxValue) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function Panel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="border border-black/10 bg-white">
      <div className="border-b border-black/10 px-5 py-4">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

function DataTable({
  emptyText,
  rows,
  valueKind = 'currency',
}: {
  emptyText: string
  rows: Array<{
    detail?: string
    label: string
    metric: number
    secondary?: number
  }>
  valueKind?: 'count' | 'currency'
}) {
  if (!rows.length) {
    return (
      <p className="py-8 text-sm font-semibold text-[#6b5f53]">{emptyText}</p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-left text-sm">
        <tbody>
          {rows.map((row) => (
            <tr
              className="border-b border-black/10 last:border-b-0"
              key={row.label}
            >
              <td className="py-3 pr-3">
                <p
                  className="max-w-[16rem] truncate font-bold"
                  title={row.label}
                >
                  {truncateText(row.label, 34)}
                </p>
                {row.detail ? (
                  <p
                    className="mt-1 max-w-[16rem] truncate text-xs text-[#6b5f53]"
                    title={row.detail}
                  >
                    {truncateText(row.detail, 36)}
                  </p>
                ) : null}
              </td>
              <td className="py-3 text-right font-bold">
                {valueKind === 'currency'
                  ? formatCurrency(row.metric)
                  : formatCount(row.metric)}
                {row.secondary !== undefined ? (
                  <span className="ml-2 text-xs text-[#6b5f53]">
                    {formatCount(row.secondary)} sold
                  </span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TrendChart({
  rows,
}: {
  rows: Array<{
    orders: number
    paidRevenue: number
    period: string
    revenue: number
  }>
}) {
  const maxRevenue = Math.max(1, ...rows.map((row) => row.revenue))

  if (!rows.length) {
    return (
      <p className="py-8 text-sm font-semibold text-[#6b5f53]">
        No sales trend data found.
      </p>
    )
  }

  return (
    <div className="flex h-64 items-end gap-2 border-b border-l border-black/10 px-2 pt-4">
      {rows.slice(-30).map((row) => (
        <div
          className="flex min-w-6 flex-1 flex-col items-center gap-2"
          key={row.period}
        >
          <div className="flex h-48 w-full items-end gap-1">
            <div
              className="w-full bg-[#7a3f1d]"
              style={{
                height: `${Math.max(4, (row.revenue / maxRevenue) * 100)}%`,
              }}
              title={`${row.period}: ${formatCurrency(row.revenue)}`}
            />
            <div
              className="w-full bg-[#2d5a27]"
              style={{
                height: `${Math.max(4, (row.paidRevenue / maxRevenue) * 100)}%`,
              }}
              title={`${row.period}: paid ${formatCurrency(row.paidRevenue)}`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

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
  const kpis = analytics?.kpis
  const topProductRows = useMemo(
    () =>
      analytics?.products.topProducts.map((product) => ({
        label: product.name,
        metric: product.revenue,
        secondary: product.soldQuantity,
      })) ?? [],
    [analytics],
  )
  const topCustomerRows = useMemo(
    () =>
      analytics?.customers.highestSpend.map((customer) => ({
        detail: customer.email || 'No email',
        label: customer.name || customer.email || 'Customer',
        metric: customer.spend,
        secondary: customer.orders,
      })) ?? [],
    [analytics],
  )

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
        <section className="border border-black/10 bg-white p-5">
          <div className="grid gap-3 2xl:grid-cols-[repeat(6,minmax(0,1fr))_auto] 2xl:items-end">
            <label className="grid gap-2">
              <span className="text-sm font-bold">From</span>
              <input
                className="min-h-11 border border-black/10 px-3 text-sm font-bold outline-none focus:border-[#181512]"
                onChange={(event) =>
                  updateFilter('dateFrom', event.target.value)
                }
                type="date"
                value={filters.dateFrom ?? ''}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold">To</span>
              <input
                className="min-h-11 border border-black/10 px-3 text-sm font-bold outline-none focus:border-[#181512]"
                onChange={(event) => updateFilter('dateTo', event.target.value)}
                type="date"
                value={filters.dateTo ?? ''}
              />
            </label>
            {[
              ['Order state', 'orderStatus', orderStatusOptions],
              ['Payment result', 'paymentStatus', paymentStatusOptions],
              ['Payment method', 'paymentMethod', paymentMethodOptions],
              ['Courier', 'courierProvider', courierProviderOptions],
            ].map(([label, key, options]) => (
              <label className="grid gap-2" key={String(key)}>
                <span className="text-sm font-bold">{label as string}</span>
                <select
                  className="min-h-11 border border-black/10 bg-white px-3 text-sm font-bold outline-none focus:border-[#181512]"
                  onChange={(event) =>
                    updateFilter(key as FilterKey, event.target.value)
                  }
                  value={filters[key as FilterKey] ?? ''}
                >
                  <option value="">All</option>
                  {(options as string[]).map((option) => (
                    <option key={option} value={option}>
                      {formatLabel(option)}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <div className="grid gap-2">
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-black/10 px-4 text-sm font-bold hover:border-[#181512] hover:bg-[#f8f3ea]"
                onClick={resetFilters}
                type="button"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
          <label className="mt-3 grid gap-2 md:max-w-sm">
            <span className="text-sm font-bold">Category</span>
            <select
              className="min-h-11 border border-black/10 bg-white px-3 text-sm font-bold outline-none focus:border-[#181512]"
              onChange={(event) => updateFilter('category', event.target.value)}
              value={filters.category ?? ''}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </section>

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
          <>
            <section className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
              {[
                ['Total revenue', formatCurrency(kpis?.totalRevenue), Wallet],
                ['Paid revenue', formatCurrency(kpis?.paidRevenue), CreditCard],
                ['Orders', formatCount(kpis?.totalOrders), ShoppingBag],
                [
                  'Avg. order value',
                  formatCurrency(kpis?.averageOrderValue),
                  BarChart3,
                ],
                [
                  'Payment success',
                  `${kpis?.conversionProxy ?? 0}%`,
                  PackageCheck,
                ],
                ['New customers', formatCount(kpis?.newCustomers), UsersRound],
                [
                  'Repeat customers',
                  formatCount(kpis?.repeatCustomers),
                  UsersRound,
                ],
                [
                  'Failed / refunded',
                  formatCount(kpis?.failedOrRefundedPayments),
                  AlertTriangle,
                ],
              ].map(([label, value, Icon]) => (
                <div
                  className="border border-black/10 bg-white p-5"
                  key={label as string}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">
                      {label as string}
                    </p>
                    <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="mt-4 text-2xl font-bold">{value as string}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-5 2xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
              <Panel title="Sales trend">
                <div className="mb-3 flex flex-wrap gap-4 text-xs font-bold text-[#6b5f53]">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-5 bg-[#7a3f1d]" />
                    Total revenue
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-5 bg-[#2d5a27]" />
                    Paid revenue
                  </span>
                </div>
                <TrendChart rows={analytics.sales.trend} />
              </Panel>

              <Panel title="Order health">
                <MiniBarList
                  emptyText="No order status data found."
                  rows={analytics.orders.statusSummary}
                />
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-black/10 pt-4 text-sm">
                  <p>
                    <span className="block text-xs font-bold uppercase text-[#6b5f53]">
                      Cancellation rate
                    </span>
                    <span className="text-xl font-bold">
                      {analytics.orders.cancellationRate}%
                    </span>
                  </p>
                  <p>
                    <span className="block text-xs font-bold uppercase text-[#6b5f53]">
                      Fulfillment backlog
                    </span>
                    <span className="text-xl font-bold">
                      {analytics.orders.fulfillmentBacklog}
                    </span>
                  </p>
                </div>
              </Panel>
            </section>

            <section className="grid gap-5 2xl:grid-cols-3">
              <Panel title="Payment results">
                <MiniBarList
                  emptyText="No payment result data found."
                  rows={analytics.payments.statusSummary}
                />
                <p className="mt-4 border-t border-black/10 pt-4 text-sm font-bold">
                  Success rate: {analytics.payments.successRate}%
                </p>
              </Panel>
              <Panel title="Payment methods">
                <MiniBarList
                  emptyText="No payment method data found."
                  rows={analytics.payments.methodSummary}
                />
              </Panel>
              <Panel title="Shipping">
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  {[
                    ['Created', analytics.shipping.shipmentsCreated],
                    ['Shipped', analytics.shipping.shipped],
                    ['Delivered', analytics.shipping.delivered],
                  ].map(([label, value]) => (
                    <div className="bg-[#f8f3ea] p-3" key={label as string}>
                      <Truck className="mx-auto h-4 w-4 text-[#7a3f1d]" />
                      <p className="mt-2 text-lg font-bold">
                        {value as number}
                      </p>
                      <p className="text-xs font-bold text-[#6b5f53]">
                        {label as string}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <MiniBarList
                    emptyText="No courier status data found."
                    rows={analytics.shipping.courierStatusSummary}
                  />
                </div>
              </Panel>
            </section>

            <section className="grid gap-5 2xl:grid-cols-2">
              <Panel title="Top products">
                <DataTable
                  emptyText="No product sales found."
                  rows={topProductRows}
                />
              </Panel>
              <Panel title="Top customers">
                <DataTable
                  emptyText="No customer spend found."
                  rows={topCustomerRows}
                />
              </Panel>
            </section>

            <section className="grid gap-5 2xl:grid-cols-3">
              <Panel title="Top categories">
                <DataTable
                  emptyText="No category sales found."
                  rows={analytics.products.topCategories.map((category) => ({
                    label: category.name,
                    metric: category.revenue,
                    secondary: category.soldQuantity,
                  }))}
                />
              </Panel>
              <Panel title="Inventory watch">
                <DataTable
                  emptyText="No low-stock products found."
                  rows={analytics.products.lowStock.map((product) => ({
                    detail: product.category || 'No category',
                    label: product.name,
                    metric: product.stock,
                  }))}
                  valueKind="count"
                />
                <p className="mt-4 border-t border-black/10 pt-4 text-sm font-bold">
                  Out of stock: {analytics.products.outOfStock}
                </p>
              </Panel>
              <Panel title="Review quality">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#f8f3ea] p-4">
                    <Star className="h-5 w-5 text-[#7a3f1d]" />
                    <p className="mt-3 text-2xl font-bold">
                      {analytics.reviews.averageRating}
                    </p>
                    <p className="text-xs font-bold text-[#6b5f53]">
                      Average rating
                    </p>
                  </div>
                  <div className="bg-[#f8f3ea] p-4">
                    <ShieldAlert className="h-5 w-5 text-[#8f3f1d]" />
                    <p className="mt-3 text-2xl font-bold">
                      {analytics.reviews.hiddenReviews}
                    </p>
                    <p className="text-xs font-bold text-[#6b5f53]">
                      Hidden reviews
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <MiniBarList
                    emptyText="No rating data found."
                    rows={analytics.reviews.ratingSummary}
                    valueLabel={(row) => `${row.count} reviews`}
                  />
                </div>
              </Panel>
            </section>

            <Panel title="Activity and security">
              <div className="grid gap-3 md:grid-cols-4">
                {[
                  ['Admin actions', analytics.activity.adminActions],
                  ['Failed logins', analytics.activity.failedLogins],
                  [
                    'Warnings / failed',
                    analytics.activity.warningOrFailedEvents,
                  ],
                  ['Shipping sync warnings', analytics.shipping.syncWarnings],
                ].map(([label, value]) => (
                  <div
                    className="border border-black/10 bg-[#f8f3ea] p-4"
                    key={label as string}
                  >
                    <p className="text-xs font-bold uppercase text-[#6b5f53]">
                      {label as string}
                    </p>
                    <p className="mt-3 text-2xl font-bold">{value as number}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <DataTable
                  emptyText="No admin activity found."
                  rows={analytics.activity.mostActiveAdmins.map((admin) => ({
                    detail: admin.email || 'No email',
                    label: admin.name || admin.email || 'Admin',
                    metric: admin.count,
                  }))}
                  valueKind="count"
                />
              </div>
            </Panel>
          </>
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
