import {
  ArrowUpRight,
  BarChart3,
  CircleAlert,
  ClipboardList,
  CreditCard,
  FileClock,
  Home,
  MessageSquareText,
  PackagePlus,
  Palette,
  ReceiptText,
  Star,
  Tags,
  Truck,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import type {
  AdminDashboardStats,
  DashboardReview,
} from '../../../features/dashboard/dashboardApi'
import type { Order } from '../../../features/orders/orderApi'
import { getAdminOrderRouteRef } from '../../admin/orders/orderRouteState'
import {
  formatOrderDate,
  formatOrderId,
  formatOrderStatus,
  getOrderCustomer,
} from '../../../utils/orderDisplay'
import { formatCount, readNumericStat } from '../dashboardFormat'

type AdminOverviewSectionsProps = {
  hasOrdersError: boolean
  isOrdersLoading: boolean
  orders: Order[]
  stats: AdminDashboardStats | null
}

type AttentionItem = {
  detail: string
  href: string
  label: string
  tone: 'neutral' | 'urgent'
  value: string
}

type ActivityItem = {
  detail: string
  href: string
  icon: typeof ReceiptText
  label: string
}

const quickActions = [
  {
    href: '/dashboard/products/create',
    icon: PackagePlus,
    label: 'Create product',
  },
  {
    href: '/dashboard/admin/orders',
    icon: ReceiptText,
    label: 'Manage orders',
  },
  {
    href: '/dashboard/categories/create',
    icon: Tags,
    label: 'Add category',
  },
  {
    href: '/dashboard/admin/promo',
    icon: ClipboardList,
    label: 'Update promo',
  },
  {
    href: '/dashboard/admin/home-hero',
    icon: Home,
    label: 'Home banner',
  },
]

const secondaryActions = [
  {
    href: '/dashboard/admin/analytics',
    icon: BarChart3,
    label: 'Analytics',
  },
  {
    href: '/dashboard/users',
    icon: UsersRound,
    label: 'Users',
  },
  {
    href: '/dashboard/admin/payment-logs',
    icon: CreditCard,
    label: 'Payment logs',
  },
  {
    href: '/dashboard/admin/activity-logs',
    icon: FileClock,
    label: 'Activity logs',
  },
]

function getAttentionItems(
  stats: AdminDashboardStats | null,
  orders: Order[],
): AttentionItem[] {
  const pendingOrders =
    readNumericStat(stats, ['pendingOrders', 'awaitingFulfillment']) ??
    orders.filter((order) =>
      ['confirmed', 'pending', 'processing'].includes(order.orderStatus ?? ''),
    ).length
  const lowStockProducts = readNumericStat(stats, ['lowStockProducts'])
  const reviewCount = stats?.recentReviews?.length ?? 0
  const paymentIssues = orders.filter((order) =>
    ['failed', 'pending', 'unpaid'].includes(order.paymentStatus ?? ''),
  ).length

  return [
    {
      detail: 'Open fulfillment queue',
      href: '/dashboard/admin/orders',
      label: 'Orders need fulfillment',
      tone: pendingOrders > 0 ? 'urgent' : 'neutral',
      value: formatCount(pendingOrders, '0'),
    },
    {
      detail: 'Check stock levels',
      href: '/dashboard/products',
      label: 'Low-stock products',
      tone: (lowStockProducts ?? 0) > 0 ? 'urgent' : 'neutral',
      value: formatCount(lowStockProducts ?? 0, '0'),
    },
    {
      detail: 'Moderate recent feedback',
      href: '/dashboard/admin/reviews',
      label: 'Reviews to scan',
      tone: reviewCount > 0 ? 'urgent' : 'neutral',
      value: formatCount(reviewCount, '0'),
    },
    {
      detail: 'Review payment logs',
      href: '/dashboard/admin/payment-logs',
      label: 'Payment checks',
      tone: paymentIssues > 0 ? 'urgent' : 'neutral',
      value: formatCount(paymentIssues, '0'),
    },
  ]
}

function getReviewLabel(review: DashboardReview) {
  return review.product?.name ?? 'Product review'
}

function getActivityItems(
  orders: Order[],
  reviews: DashboardReview[],
): ActivityItem[] {
  const orderItems = orders.slice(0, 3).map((order) => ({
    detail: `${getOrderCustomer(order)} - ${formatOrderStatus(order.orderStatus)} - ${formatOrderDate(order.createdAt)}`,
    href: `/dashboard/admin/orders/${getAdminOrderRouteRef(order)}`,
    icon: Truck,
    label: `Order ${formatOrderId(order._id)}`,
  }))
  const reviewItems = reviews.slice(0, 2).map((review) => ({
    detail: `${review.rating ?? 0}/5 rating`,
    href: '/dashboard/admin/reviews',
    icon: Star,
    label: getReviewLabel(review),
  }))

  return [...orderItems, ...reviewItems].slice(0, 5)
}

function AdminOverviewSections({
  hasOrdersError,
  isOrdersLoading,
  orders,
  stats,
}: AdminOverviewSectionsProps) {
  const attentionItems = getAttentionItems(stats, orders)
  const activityItems = getActivityItems(orders, stats?.recentReviews ?? [])

  return (
    <section className="mt-6 grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <section className="border border-black/10 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Needs action</h2>
              <p className="mt-1 text-sm text-[#6b5f53]">
                Short queue for work that should move today.
              </p>
            </div>
            <span className="grid h-10 w-10 place-items-center bg-[#fff5ef] text-[#8f3f1d]">
              <CircleAlert className="h-5 w-5" />
            </span>
          </div>

          <div className="mt-5 divide-y divide-black/10">
            {attentionItems.map((item) => (
              <Link
                className="grid gap-3 py-4 transition hover:bg-[#f8f3ea] sm:grid-cols-[72px_1fr_auto] sm:items-center sm:px-2"
                key={item.label}
                to={item.href}
              >
                <span
                  className={`text-3xl font-bold ${
                    item.tone === 'urgent' ? 'text-[#8f3f1d]' : 'text-[#181512]'
                  }`}
                >
                  {item.value}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">
                    {item.label}
                  </span>
                  <span className="mt-1 block truncate text-xs font-semibold text-[#6b5f53]">
                    {item.detail}
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-[#7a3f1d]" />
              </Link>
            ))}
          </div>
        </section>

        <section className="border border-black/10 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Recent activity</h2>
              <p className="mt-1 text-sm text-[#6b5f53]">
                Latest orders and review signals, limited to five rows.
              </p>
            </div>
            <Link
              className="inline-flex items-center gap-2 border border-black/10 px-3 py-2 text-xs font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
              to="/dashboard/admin/activity-logs"
            >
              Full log
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {(isOrdersLoading || hasOrdersError) && (
            <div
              className={`mt-4 border border-black/10 px-4 py-3 text-sm font-semibold ${
                hasOrdersError
                  ? 'bg-[#fff5ef] text-[#8f3f1d]'
                  : 'bg-[#f8f3ea] text-[#6b5f53]'
              }`}
            >
              {hasOrdersError
                ? 'Recent activity unavailable.'
                : 'Loading activity...'}
            </div>
          )}

          <div className="mt-5 space-y-4">
            {activityItems.length ? (
              activityItems.map((item) => {
                const Icon = item.icon

                return (
                  <Link
                    className="flex gap-4 transition hover:bg-[#f8f3ea]"
                    key={`${item.label}-${item.detail}`}
                    to={item.href}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-bold">
                        {item.label}
                      </span>
                      <span className="mt-1 block truncate text-sm text-[#6b5f53]">
                        {item.detail}
                      </span>
                    </span>
                  </Link>
                )
              })
            ) : (
              <p className="border-t border-black/10 pt-4 text-sm font-semibold text-[#6b5f53]">
                No recent activity found.
              </p>
            )}
          </div>
        </section>
      </div>

      <aside className="flex h-fit flex-col border border-black/10 bg-[#181512] p-5 text-white 2xl:sticky 2xl:top-[132px] 2xl:max-h-[calc(100dvh-132px)] 2xl:self-start 2xl:overflow-y-auto">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center bg-white text-[#181512]">
              <Palette className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-2xl font-bold">Quick actions</h2>
              <p className="mt-1 text-sm text-white/65">
                Jump to dedicated admin pages.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon

              return (
                <Link
                  className="flex min-h-12 items-center justify-between border border-white/10 px-4 text-sm font-bold transition hover:border-[#f1c9a6] hover:bg-white/10"
                  key={action.href}
                  to={action.href}
                >
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <Icon className="h-4 w-4 text-[#f1c9a6]" />
                    <span className="truncate">{action.label}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-[#f1c9a6]" />
                </Link>
              )
            })}
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f1c9a6]">
              More admin links
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {secondaryActions.map((action) => {
                const Icon = action.icon

                return (
                  <Link
                    className="grid min-h-20 content-between border border-white/10 p-3 text-xs font-bold transition hover:border-[#f1c9a6] hover:bg-white/10"
                    key={action.href}
                    to={action.href}
                  >
                    <Icon className="h-4 w-4 text-[#f1c9a6]" />
                    <span className="truncate">{action.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-white/10 pt-5">
          <div className="flex items-start gap-3">
            <MessageSquareText className="mt-0.5 h-5 w-5 text-[#f1c9a6]" />
            <p className="text-sm leading-6 text-white/72">
              Keep this page for orientation. Use sidebar pages for full tables,
              edits, and audit detail.
            </p>
          </div>
        </div>
      </aside>
    </section>
  )
}

export default AdminOverviewSections
