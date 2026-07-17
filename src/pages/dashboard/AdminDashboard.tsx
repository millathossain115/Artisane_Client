import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  DollarSign,
  Package,
  Palette,
  Star,
  Truck,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../components/layout/DashboardLayout'
import {
  type AdminDashboardStats,
  useGetAdminStatsQuery,
} from '../../features/dashboard/dashboardApi'
import { adminNavItems } from './adminNavItems'

const orders = [
  {
    id: '#AR-1048',
    customer: 'Nadia Rahman',
    item: 'Signed Figure Study Print',
    status: 'Paid',
    total: '$58',
    time: '12 min ago',
  },
  {
    id: '#AR-1047',
    customer: 'Farhan Ahmed',
    item: 'Studio Brush Set',
    status: 'Packing',
    total: '$48',
    time: '34 min ago',
  },
  {
    id: '#AR-1046',
    customer: 'Mina Chowdhury',
    item: 'Oil Color Starter Kit',
    status: 'Needs review',
    total: '$36',
    time: '1 hr ago',
  },
]

const inventory = [
  'Handmade Color Palette: 4 left',
  'Studio Brush Set: 7 left',
  'Ceramic glaze samples: 2 left',
]

const activity = [
  {
    title: 'New review received',
    detail: '5 stars for Studio Brush Set',
    icon: Star,
  },
  {
    title: 'Shipment prepared',
    detail: 'Order #AR-1044 marked ready',
    icon: Truck,
  },
  {
    title: 'Product approved',
    detail: 'Art Prints collection updated',
    icon: CheckCircle2,
  },
]

function readStat(stats: AdminDashboardStats | null, keys: string[]) {
  if (!stats) {
    return null
  }

  for (const key of keys) {
    const value = stats[key]
    const numericValue =
      typeof value === 'number'
        ? value
        : typeof value === 'string'
          ? Number(value.replace(/[^0-9.-]/g, ''))
          : Number.NaN

    if (Number.isFinite(numericValue)) {
      return numericValue
    }
  }

  return null
}

function formatCount(value: number | null, fallback: string) {
  if (value === null) {
    return fallback
  }

  return new Intl.NumberFormat('en-US').format(value)
}

function formatCurrency(value: number | null, fallback: string) {
  if (value === null) {
    return fallback
  }

  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)
}

function formatGrowth(value: number | null, fallback: string) {
  if (value === null) {
    return fallback
  }

  return `${value > 0 ? '+' : ''}${value}% this month`
}

function getMetrics(stats: AdminDashboardStats | null) {
  const revenue = readStat(stats, [
    'revenue',
    'totalRevenue',
    'monthlyRevenue',
    'totalSales',
  ])
  const revenueGrowth = readStat(stats, ['revenueGrowth', 'monthlyGrowth'])
  const totalOrders = readStat(stats, ['orders', 'totalOrders'])
  const pendingOrders = readStat(stats, [
    'pendingOrders',
    'awaitingFulfillment',
  ])
  const activeProducts = readStat(stats, [
    'activeProducts',
    'products',
    'totalProducts',
  ])
  const lowStockProducts = readStat(stats, ['lowStockProducts'])
  const customers = readStat(stats, [
    'customers',
    'totalCustomers',
    'users',
    'totalUsers',
  ])
  const newCustomers = readStat(stats, [
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

function AdminDashboard() {
  const {
    data: adminStats = null,
    isError: hasStatsError,
    isLoading: isStatsLoading,
  } = useGetAdminStatsQuery()
  const statsError = hasStatsError ? 'Failed to load admin stats' : ''
  const metrics = getMetrics(adminStats)

  return (
    <DashboardLayout
      actions={[
        { label: 'Export' },
        {
          label: 'Add category',
          to: '/dashboard/categories/create',
          variant: 'primary',
        },
      ]}
      helperText="Review pending orders and low-stock handmade pieces before publishing new drops."
      searchPlaceholder="Search orders, products, customers"
      sidebarItems={adminNavItems}
      subtitle="Monitor sales, orders, inventory, reviews, and marketplace tasks from one focused workspace."
      title="Admin dashboard"
      workspaceLabel="Marketplace studio"
    >
      {(isStatsLoading || statsError) && (
        <div
          className={`mb-4 border px-4 py-3 text-sm font-semibold ${
            statsError
              ? 'border-[#c85f2f]/30 bg-[#fff5ef] text-[#8f3f1d]'
              : 'border-black/10 bg-white text-[#6b5f53]'
          }`}
        >
          {statsError
            ? `${statsError}. Showing sample stats.`
            : 'Loading live dashboard stats...'}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon

          return (
            <article
              className="border border-black/10 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(24,21,18,0.08)]"
              key={metric.label}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-[#6b5f53]">
                  {metric.label}
                </span>
                <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-5 text-3xl font-bold">{metric.value}</p>
              <p className="mt-2 text-sm text-[#6b5f53]">{metric.detail}</p>
            </article>
          )
        })}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="border border-black/10 bg-white" id="orders">
          <div className="flex items-center justify-between gap-4 border-b border-black/10 p-5">
            <div>
              <h2 className="text-2xl font-bold">Recent orders</h2>
              <p className="mt-1 text-sm text-[#6b5f53]">
                Latest paid and fulfillment activity.
              </p>
            </div>
            <button
              className="inline-flex items-center gap-2 border border-black/10 px-3 py-2 text-sm font-bold transition hover:border-[#181512]"
              type="button"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Item</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    className="border-t border-black/10 transition hover:bg-[#f8f3ea]"
                    key={order.id}
                  >
                    <td className="px-5 py-4 font-bold">{order.id}</td>
                    <td className="px-5 py-4">{order.customer}</td>
                    <td className="px-5 py-4 text-[#6b5f53]">{order.item}</td>
                    <td className="px-5 py-4">
                      <span className="bg-[#f1dfc8] px-2 py-1 text-xs font-bold text-[#7a3f1d]">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold">{order.total}</td>
                    <td className="px-5 py-4 text-[#6b5f53]">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="grid gap-6">
          <section
            className="border border-black/10 bg-[#181512] p-5 text-white"
            id="products"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center bg-white text-[#181512]">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-2xl font-bold">Inventory alerts</h2>
                <p className="mt-1 text-sm text-white/65">
                  Restock these before the next drop.
                </p>
              </div>
            </div>
            <ul className="mt-5 space-y-3 text-sm">
              {inventory.map((item) => (
                <li
                  className="flex items-center justify-between gap-3 border-t border-white/10 pt-3"
                  key={item}
                >
                  <span>{item}</span>
                  <button
                    className="text-xs font-bold text-[#f1c9a6]"
                    type="button"
                  >
                    Restock
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-black/10 bg-white p-5">
            <h2 className="text-2xl font-bold">Quick actions</h2>
            <div className="mt-4 grid gap-2">
              {[
                { label: 'Create product' },
                { label: 'Add category', to: '/dashboard/categories/create' },
                { label: 'Review refunds' },
                { label: 'Publish collection' },
              ].map((action) =>
                action.to ? (
                  <Link
                    className="flex items-center justify-between border border-black/10 px-4 py-3 text-left text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                    key={action.label}
                    to={action.to}
                  >
                    {action.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <button
                    className="flex items-center justify-between border border-black/10 px-4 py-3 text-left text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                    key={action.label}
                    type="button"
                  >
                    {action.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                ),
              )}
            </div>
          </section>
        </aside>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="border border-black/10 bg-white p-5" id="reviews">
          <h2 className="text-2xl font-bold">Review queue</h2>
          <p className="mt-1 text-sm text-[#6b5f53]">
            Product feedback needing moderation.
          </p>
          <div className="mt-5 space-y-3">
            {[
              'Brush Set review has an image',
              'Palette review mentions delivery',
              'Print review pending reply',
            ].map((item) => (
              <div
                className="flex items-center justify-between gap-4 border-t border-black/10 pt-3 text-sm"
                key={item}
              >
                <span>{item}</span>
                <button className="font-bold text-[#7a3f1d]" type="button">
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-black/10 bg-white p-5" id="analytics">
          <h2 className="text-2xl font-bold">Activity timeline</h2>
          <p className="mt-1 text-sm text-[#6b5f53]">
            Recent marketplace changes and signals.
          </p>
          <div className="mt-5 space-y-4">
            {activity.map((item) => {
              const Icon = item.icon

              return (
                <div className="flex gap-4" key={item.title}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold">{item.title}</p>
                    <p className="mt-1 text-sm text-[#6b5f53]">{item.detail}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-3">
        {[
          [
            'Categories',
            '18 active categories',
            'Audit empty or duplicate collections.',
          ],
          [
            'Customers',
            '42 high-value buyers',
            'Segment by spend and recent activity.',
          ],
          [
            'Messages',
            '9 unread messages',
            'Reply to customer and artisan notes.',
          ],
        ].map(([title, value, detail]) => (
          <article
            className="border border-black/10 bg-white p-5"
            id={title.toLowerCase()}
            key={title}
          >
            <p className="text-sm font-bold text-[#7a3f1d]">{title}</p>
            <h2 className="mt-2 text-2xl font-bold">{value}</h2>
            <p className="mt-3 text-sm leading-6 text-[#6b5f53]">{detail}</p>
          </article>
        ))}
      </section>
    </DashboardLayout>
  )
}

export default AdminDashboard
