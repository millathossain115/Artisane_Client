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
const chartColors = {
  grid: '#eadfce',
  paidRevenue: '#d59b6a',
  revenue: '#8f3f1d',
  track: '#f1dfc8',
}

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
          <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
            <span className="min-w-0 truncate font-bold">
              {formatLabel(row.label)}
            </span>
            <span className="shrink-0 text-xs font-bold text-[#6b5f53]">
              {valueLabel ? valueLabel(row) : formatCount(row.count)}
            </span>
          </div>
          <div
            className="h-2"
            style={{ backgroundColor: chartColors.track }}
          >
            <div
              className="h-2"
              style={{
                backgroundColor: chartColors.revenue,
                width: `${Math.max(5, (row.count / maxValue) * 100)}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function Panel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="overflow-hidden border border-black/10 bg-white shadow-sm">
      <div className="border-b border-black/10 px-4 py-3.5 sm:px-5">
        <h2 className="text-lg font-bold sm:text-xl">{title}</h2>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
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
    <div className="overflow-hidden">
      <table className="w-full table-fixed text-left text-sm">
        <colgroup>
          <col className="w-[58%]" />
          <col />
        </colgroup>
        <tbody>
          {rows.map((row) => (
            <tr
              className="border-b border-black/10 last:border-b-0"
              key={row.label}
            >
              <td className="py-3 pr-2 align-top">
                <p
                  className="min-w-0 truncate font-bold"
                  title={row.label}
                >
                  {truncateText(row.label, 32)}
                </p>
                {row.detail ? (
                  <p
                    className="mt-1 min-w-0 truncate text-xs text-[#6b5f53]"
                    title={row.detail}
                  >
                    {truncateText(row.detail, 34)}
                  </p>
                ) : null}
              </td>
              <td className="py-3 pl-2 text-right align-top">
                <div className="flex flex-col items-end gap-0.5">
                  <span className="whitespace-nowrap font-bold">
                    {valueKind === 'currency'
                      ? formatCurrency(row.metric)
                      : formatCount(row.metric)}
                  </span>
                  {row.secondary !== undefined ? (
                    <span className="whitespace-nowrap text-[11px] font-semibold text-[#6b5f53]">
                      {formatCount(row.secondary)} sold
                    </span>
                  ) : null}
                </div>
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
    <div className="relative h-64 overflow-hidden border border-black/10 bg-[#f8fafc] px-3 pb-4 pt-5">
      <div
        className="pointer-events-none absolute inset-x-3 top-1/4 border-t"
        style={{ borderColor: chartColors.grid }}
      />
      <div
        className="pointer-events-none absolute inset-x-3 top-1/2 border-t"
        style={{ borderColor: chartColors.grid }}
      />
      <div
        className="pointer-events-none absolute inset-x-3 top-3/4 border-t"
        style={{ borderColor: chartColors.grid }}
      />
      <div className="relative flex h-full items-end gap-1.5">
        {rows.slice(-30).map((row) => (
          <div
            className="flex h-full min-w-4 flex-1 flex-col items-center gap-2"
            key={row.period}
          >
            <div className="flex h-full w-full items-end gap-1">
              <div
                className="w-full"
                style={{
                  backgroundColor: chartColors.revenue,
                  height: `${Math.max(4, (row.revenue / maxRevenue) * 100)}%`,
                }}
                title={`${row.period}: ${formatCurrency(row.revenue)}`}
              />
              <div
                className="w-full"
                style={{
                  backgroundColor: chartColors.paidRevenue,
                  height: `${Math.max(4, (row.paidRevenue / maxRevenue) * 100)}%`,
                }}
                title={`${row.period}: paid ${formatCurrency(row.paidRevenue)}`}
              />
            </div>
          </div>
        ))}
      </div>
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
        <section className="border border-black/10 bg-white p-3 sm:p-4">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[repeat(7,minmax(0,1fr))_auto] xl:items-end">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold">From</span>
              <input
                className="min-h-9 border border-black/10 px-2 text-xs font-bold outline-none focus:border-[#181512]"
                onChange={(event) =>
                  updateFilter('dateFrom', event.target.value)
                }
                type="date"
                value={filters.dateFrom ?? ''}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold">To</span>
              <input
                className="min-h-9 border border-black/10 px-2 text-xs font-bold outline-none focus:border-[#181512]"
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
              <label className="grid gap-1.5" key={String(key)}>
                <span className="text-xs font-bold">{label as string}</span>
                <select
                  className="min-h-9 border border-black/10 bg-white px-2 text-xs font-bold outline-none focus:border-[#181512]"
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
            <label className="grid gap-1.5 sm:col-span-2 xl:col-span-1">
              <span className="text-xs font-bold">Category</span>
              <select
                className="min-h-9 border border-black/10 bg-white px-2 text-xs font-bold outline-none focus:border-[#181512]"
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
            <div className="grid gap-1.5">
              <span className="hidden text-xs font-bold xl:block">&nbsp;</span>
              <button
                className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-black/10 px-3 text-xs font-bold hover:border-[#181512] hover:bg-[#f8f3ea]"
                onClick={resetFilters}
                type="button"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>
          </div>
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

            <section className="grid gap-4 2xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
              <Panel title="Sales trend">
                <div className="mb-3 flex flex-wrap gap-4 text-xs font-bold text-[#6b5f53]">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2 w-5"
                      style={{ backgroundColor: chartColors.revenue }}
                    />
                    Total revenue
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2 w-5"
                      style={{ backgroundColor: chartColors.paidRevenue }}
                    />
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

            <section className="grid gap-4 2xl:grid-cols-3">
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

            <section className="grid gap-4 2xl:grid-cols-2">
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

            <section className="grid gap-4 2xl:grid-cols-3">
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
