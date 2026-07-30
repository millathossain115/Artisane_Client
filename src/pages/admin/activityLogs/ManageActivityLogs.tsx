import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Database,
  Eye,
  Filter,
  Laptop,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
  EmptyState,
  ErrorState,
  SkeletonTable,
} from '../../../components/loaders'
import {
  type ActivityActorRole,
  type ActivityLog,
  type ActivityModule,
  type ActivitySource,
  type ActivityStatus,
  useGetActivityLogsQuery,
  useGetActivityLogStatsQuery,
} from '../../../features/activityLogs/activityLogApi'
import { formatOrderDate } from '../../../utils/orderDisplay'
import { adminNavItems } from '../adminNavItems'

const pageSize = 15

const moduleOptions: ActivityModule[] = [
  'auth',
  'users',
  'orders',
  'products',
  'categories',
  'reviews',
  'payments',
  'shipping',
  'wishlist',
  'promo',
  'home_content',
]

const roleOptions: ActivityActorRole[] = [
  'admin',
  'super_admin',
  'user',
  'system',
]
const sourceOptions: ActivitySource[] = [
  'admin',
  'user',
  'system',
  'payment_gateway',
  'courier_webhook',
  'scheduler',
]
const statusOptions: ActivityStatus[] = ['success', 'warning', 'failed']

function formatLabel(value?: string) {
  return value
    ? value
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    : 'Not set'
}

function truncateText(value: string, maxLength = 32) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 2)}..` : value
}

function normalizeIpAddress(value?: string) {
  if (!value) return 'Not captured'
  if (value === '::1' || value === '127.0.0.1') return 'Localhost'
  if (value.startsWith('::ffff:')) return value.replace('::ffff:', '')
  return value
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isObjectIdString(value: string) {
  return /^[a-f\d]{24}$/i.test(value)
}

function isTechnicalIdField(field: string) {
  return /(^_?id$|id$|Id$|hiddenBy|actorId|targetId)/.test(field)
}

function getReadableObjectValue(value: Record<string, unknown>) {
  const readableKeys = [
    'name',
    'title',
    'email',
    'slug',
    'label',
    'transactionId',
    'orderNumber',
    'code',
  ]

  for (const key of readableKeys) {
    const item = value[key]

    if (typeof item === 'string' && item.trim() && !isObjectIdString(item)) {
      return item
    }
  }

  if ('buffer' in value || '$oid' in value || '_id' in value) {
    return 'Record reference hidden'
  }

  return undefined
}

function sanitizeDisplayValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeDisplayValue)
  }

  if (!isRecord(value)) {
    return typeof value === 'string' && isObjectIdString(value)
      ? 'Record reference hidden'
      : value
  }

  const readableValue = getReadableObjectValue(value)

  if (readableValue) {
    return readableValue
  }

  return Object.entries(value).reduce<Record<string, unknown>>(
    (cleanValue, [key, item]) => {
      if (
        key === 'buffer' ||
        key === '_id' ||
        key === 'id' ||
        isTechnicalIdField(key)
      ) {
        return cleanValue
      }

      cleanValue[key] = sanitizeDisplayValue(item)
      return cleanValue
    },
    {},
  )
}

function formatValue(value: unknown) {
  const displayValue = sanitizeDisplayValue(value)

  if (displayValue === undefined) return 'Not set'
  if (displayValue === null) return 'None'
  if (typeof displayValue === 'string') return displayValue || 'Empty'
  if (typeof displayValue === 'number' || typeof displayValue === 'boolean') {
    return String(displayValue)
  }

  try {
    return JSON.stringify(displayValue, null, 2)
  } catch {
    return String(displayValue)
  }
}

function getFieldLabel(field: string) {
  const fieldLabels: Record<string, string> = {
    actorEmail: 'Actor email',
    actorId: 'Actor ID',
    actorName: 'Actor name',
    actorRole: 'Actor role',
    address: 'Address',
    alternativePhone: 'Alternative phone',
    autoplaySeconds: 'Autoplay seconds',
    avatar: 'Profile photo',
    bankTransactionId: 'Bank transaction',
    brand: 'Brand',
    cardType: 'Payment card type',
    category: 'Category',
    city: 'City',
    comment: 'Review comment',
    courierOrderId: 'Courier order ID',
    courierProvider: 'Courier provider',
    courierStatus: 'Courier status',
    deliveredAt: 'Delivered time',
    description: 'Description',
    email: 'Email',
    fadeMs: 'Fade speed',
    hiddenAt: 'Hidden time',
    hiddenBy: 'Hidden by',
    image: 'Image',
    images: 'Images',
    isActive: 'Active',
    isDefault: 'Default address',
    isDeleted: 'Deleted',
    isHidden: 'Hidden',
    label: 'Label',
    name: 'Name',
    orderStatus: 'Order status',
    paidAt: 'Paid time',
    paymentStatus: 'Payment status',
    phone: 'Phone',
    postalCode: 'Postal code',
    price: 'Price',
    rating: 'Rating',
    recipientName: 'Recipient',
    shippedAt: 'Shipped time',
    shipmentCreatedAt: 'Shipment created',
    slides: 'Hero slides',
    slug: 'URL slug',
    stock: 'Stock',
    streetAddress: 'Street address',
    trackingCode: 'Tracking code',
    trackingUrl: 'Tracking link',
  }

  return fieldLabels[field] ?? formatLabel(field)
}

function getActionLabel(action: string) {
  const actionLabels: Record<string, string> = {
    'address.created': 'Address added',
    'address.default_updated': 'Default address changed',
    'address.deleted': 'Address deleted',
    'address.updated': 'Address updated',
    'category.created': 'Category created',
    'category.deleted': 'Category deleted',
    'category.updated': 'Category updated',
    'home_content.created': 'Home hero created',
    'home_content.updated': 'Home hero updated',
    'order.cancelled': 'Order cancelled',
    'order.created': 'Order placed',
    'order.deleted': 'Order deleted',
    'order.status_updated': 'Order status changed',
    'payment.failed': 'Payment failed',
    'payment.paid': 'Payment paid',
    'product.created': 'Product created',
    'product.deleted': 'Product deleted',
    'product.updated': 'Product updated',
    'promo.created': 'Promo created',
    'promo.updated': 'Promo updated',
    'review.created': 'Review posted',
    'review.deleted': 'Review deleted',
    'review.hidden': 'Review hidden',
    'review.unhidden': 'Review restored',
    'review.updated': 'Review updated',
    'shipment.created': 'Shipment created',
    'shipment.scheduled_sync': 'Shipment auto-sync',
    'shipment.scheduled_sync_failed': 'Shipment auto-sync failed',
    'shipment.synced': 'Shipment synced',
    'shipment.webhook_received': 'Courier update received',
    'user.blocked': 'User blocked',
    'user.created': 'User created',
    'user.deleted': 'User deleted',
    'user.google_login': 'Google login',
    'user.google_login_failed': 'Google login failed',
    'user.login': 'Login',
    'user.login_failed': 'Login failed',
    'user.profile_updated': 'Profile updated',
    'user.registered': 'Account registered',
    'user.unblocked': 'User unblocked',
    'user.updated': 'User updated',
    'wishlist.added': 'Wishlist item added',
    'wishlist.cleared': 'Wishlist cleared',
    'wishlist.removed': 'Wishlist item removed',
  }

  return actionLabels[action] ?? formatLabel(action.replace('.', '_'))
}

function getResultLabel(status: ActivityStatus) {
  switch (status) {
    case 'failed':
      return 'Failed'
    case 'warning':
      return 'Needs review'
    default:
      return 'Done'
  }
}

function getStatusClass(status: ActivityStatus) {
  switch (status) {
    case 'failed':
      return 'bg-[#fff5ef] text-[#8f3f1d]'
    case 'warning':
      return 'bg-[#fbf4e6] text-[#784f17]'
    default:
      return 'bg-[#effaf3] text-[#1f6b43]'
  }
}

function getActorName(log: ActivityLog) {
  if (log.actorRole === 'system') return 'System'
  return log.actorName || log.actorEmail || 'Unknown actor'
}

function getDeviceLabel(log: ActivityLog) {
  const device = formatLabel(log.deviceType)
  const browser = log.browser && log.browser !== 'Other' ? log.browser : ''
  const os = log.os && log.os !== 'Other' ? log.os : ''

  return [device, browser, os].filter(Boolean).join(' / ')
}

function getTargetLabel(log: ActivityLog) {
  if (log.targetLabel && !isObjectIdString(log.targetLabel)) {
    return log.targetLabel
  }

  return log.targetType ? formatLabel(log.targetType) : 'Not set'
}

function getVisibleChanges(log: ActivityLog) {
  return (log.changes ?? []).filter((change) => {
    if (isTechnicalIdField(change.field)) return false

    const before = formatValue(change.before)
    const after = formatValue(change.after)

    return (
      before !== 'Record reference hidden' ||
      after !== 'Record reference hidden'
    )
  })
}

function ActivityLogDetailModal({
  log,
  onClose,
}: {
  log: ActivityLog
  onClose: () => void
}) {
  const visibleChanges = getVisibleChanges(log)

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close activity detail"
        className="absolute inset-0 bg-[#181512]/55"
        onClick={onClose}
        type="button"
      />
      <section className="absolute right-0 top-0 flex h-full w-[min(42rem,94vw)] flex-col bg-white text-[#181512] shadow-[0_0_60px_rgba(24,21,18,0.24)]">
        <div className="flex items-start justify-between gap-4 border-b border-black/10 p-5">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7a3f1d]">
              {formatLabel(log.module)} audit event
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              {getActionLabel(log.action)}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6b5f53]">
              {log.summary}
            </p>
          </div>
          <button
            aria-label="Close activity detail"
            className="grid h-10 w-10 shrink-0 place-items-center border border-black/10 transition hover:border-[#181512]"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="dashboard-sidebar-scroll flex-1 overflow-y-auto p-5">
          <dl className="divide-y divide-black/10 border-y border-black/10">
            {[
              ['Time', formatOrderDate(log.createdAt)],
              ['Person', getActorName(log)],
              ['Role', formatLabel(log.actorRole)],
              ['Source', formatLabel(log.source)],
              ['Area', formatLabel(log.module)],
              ['Target', getTargetLabel(log)],
              ['IP address', normalizeIpAddress(log.ipAddress)],
              ['Device', getDeviceLabel(log)],
              ['Result', getResultLabel(log.status)],
            ].map(([label, value]) => (
              <div
                className="grid gap-1 px-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4"
                key={label}
              >
                <dt className="text-xs font-bold uppercase tracking-wider text-[#7a3f1d]">
                  {label}
                </dt>
                <dd className="break-words text-sm font-bold">{value}</dd>
              </div>
            ))}
          </dl>

          <section className="mt-5">
            <h3 className="text-lg font-bold">Changed fields</h3>
            {!visibleChanges.length ? (
              <p className="mt-2 border border-black/10 bg-[#f8f3ea] p-4 text-sm font-semibold text-[#6b5f53]">
                No changed fields were captured for this event.
              </p>
            ) : (
              <div className="mt-3 divide-y divide-black/10 border border-black/10">
                {visibleChanges.map((change) => (
                  <article
                    className="grid gap-3 p-4 sm:grid-cols-[9rem_minmax(0,1fr)]"
                    key={change.field}
                  >
                    <h4 className="text-sm font-bold">
                      {getFieldLabel(change.field)}
                    </h4>
                    <div className="grid gap-3 lg:grid-cols-2">
                      {[
                        ['Before', change.before, 'text-[#6b5f53]'],
                        ['After', change.after, 'text-[#181512]'],
                      ].map(([label, value, colorClass]) => (
                        <div className="min-w-0" key={label as string}>
                          <p className="text-xs font-bold uppercase tracking-wider text-[#7a3f1d]">
                            {label as string}
                          </p>
                          <pre
                            className={`mt-2 max-h-36 overflow-auto whitespace-pre-wrap break-words bg-[#f8f3ea] p-3 text-xs leading-5 ${colorClass as string}`}
                          >
                            {formatValue(value)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <details className="mt-5 border border-black/10">
            <summary className="cursor-pointer bg-[#f8f3ea] px-4 py-3 text-sm font-bold">
              Technical details
            </summary>
            <pre className="max-h-72 overflow-auto bg-[#181512] p-4 text-xs leading-5 text-white">
              {formatValue({
                metadata: log.metadata ?? {},
                userAgent: log.userAgent || 'Not captured',
              })}
            </pre>
          </details>
        </div>
      </section>
    </div>
  )
}

function ManageActivityLogs() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [moduleFilter, setModuleFilter] = useState<ActivityModule | ''>('')
  const [roleFilter, setRoleFilter] = useState<ActivityActorRole | ''>('')
  const [sourceFilter, setSourceFilter] = useState<ActivitySource | ''>('')
  const [statusFilter, setStatusFilter] = useState<ActivityStatus | ''>('')
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)

  const {
    data: logsResponse,
    isError,
    isFetching,
    isLoading,
    refetch: refetchLogs,
  } = useGetActivityLogsQuery(
    {
      actorRole: roleFilter || undefined,
      limit: pageSize,
      module: moduleFilter || undefined,
      page,
      searchTerm: searchTerm.trim() || undefined,
      source: sourceFilter || undefined,
      status: statusFilter || undefined,
    },
    { refetchOnMountOrArgChange: true },
  )
  const {
    data: stats,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useGetActivityLogStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const logs = logsResponse?.data ?? []
  const meta = logsResponse?.meta
  const totalPages = Math.max(1, meta?.totalPage ?? 1)

  function resetFilters() {
    setSearchTerm('')
    setModuleFilter('')
    setRoleFilter('')
    setSourceFilter('')
    setStatusFilter('')
    setPage(1)
  }

  async function handleRefresh() {
    await Promise.all([refetchLogs(), refetchStats()])
  }

  return (
    <DashboardLayout
      eyebrow="Audit trail"
      helperText="Review admin, user, and system events with actor, device, IP, and changed-field context."
      sidebarItems={adminNavItems}
      subtitle="Monitor important sitewide actions across orders, payments, users, catalog, content, shipping, and reviews."
      title="Activity logs"
      workspaceLabel="Marketplace studio"
    >
      <div className="space-y-5">
        <section className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          {[
            {
              icon: Activity,
              label: 'Total events',
              value: stats?.totalLogs ?? 0,
            },
            {
              icon: Clock,
              label: 'Today',
              value: stats?.todayLogs ?? 0,
            },
            {
              icon: ShieldCheck,
              label: 'User events',
              value: stats?.userLogs ?? 0,
            },
            {
              icon: AlertTriangle,
              label: 'Warnings / failed',
              value: `${stats?.warningLogs ?? 0} / ${stats?.failedLogs ?? 0}`,
            },
          ].map((kpi) => {
            const Icon = kpi.icon

            return (
              <div
                className="border border-black/10 bg-white p-5"
                key={kpi.label}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">
                    {kpi.label}
                  </p>
                  <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                {isStatsLoading ? (
                  <div className="mt-4 h-8 w-20 animate-pulse bg-[#f1dfc8]" />
                ) : (
                  <p
                    className="mt-4 truncate text-3xl font-bold"
                    title={String(kpi.value)}
                  >
                    {kpi.value}
                  </p>
                )}
              </div>
            )
          })}
        </section>

        <section className="border border-black/10 bg-white">
          <div className="flex flex-col gap-3 border-b border-black/10 px-4 py-3.5 sm:px-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                <Database className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-xl font-bold">Sitewide audit trail</h2>
                <p className="mt-0.5 text-xs font-semibold text-[#6b5f53]">
                  {meta?.total ?? logs.length} events found.
                </p>
              </div>
            </div>

            <button
              className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-black/10 bg-white px-3 text-xs font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea] disabled:cursor-wait disabled:opacity-60"
              disabled={isFetching}
              onClick={() => void handleRefresh()}
              type="button"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`}
              />
              Refresh
            </button>
          </div>

          <div className="grid gap-2 border-b border-black/10 p-3 sm:grid-cols-2 sm:p-4 xl:grid-cols-[minmax(18rem,1fr)_repeat(4,minmax(8rem,0.34fr))_auto] xl:items-end">
            <label className="grid gap-1.5 sm:col-span-2 xl:col-span-1">
              <span className="text-xs font-bold">Search activity</span>
              <span className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7a3f1d]" />
                <input
                  className="min-h-9 w-full border border-black/10 pl-8 pr-2 text-xs font-semibold outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                  onChange={(event) => {
                    setSearchTerm(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Person, activity, target, IP"
                  value={searchTerm}
                />
              </span>
            </label>

            {[
              {
                label: 'Module',
                onChange: (value: string) =>
                  setModuleFilter(value as ActivityModule | ''),
                options: moduleOptions,
                value: moduleFilter,
              },
              {
                label: 'Role',
                onChange: (value: string) =>
                  setRoleFilter(value as ActivityActorRole | ''),
                options: roleOptions,
                value: roleFilter,
              },
              {
                label: 'Source',
                onChange: (value: string) =>
                  setSourceFilter(value as ActivitySource | ''),
                options: sourceOptions,
                value: sourceFilter,
              },
              {
                label: 'Status',
                onChange: (value: string) =>
                  setStatusFilter(value as ActivityStatus | ''),
                options: statusOptions,
                value: statusFilter,
              },
            ].map((filterItem) => (
              <label className="grid gap-1.5" key={filterItem.label}>
                <span className="text-xs font-bold">{filterItem.label}</span>
                <select
                  className="min-h-9 border border-black/10 bg-white px-2 text-xs font-bold outline-none transition focus:border-[#181512]"
                  onChange={(event) => {
                    filterItem.onChange(event.target.value)
                    setPage(1)
                  }}
                  value={filterItem.value}
                >
                  <option value="">All {filterItem.label.toLowerCase()}</option>
                  {filterItem.options.map((option) => (
                    <option key={option} value={option}>
                      {formatLabel(option)}
                    </option>
                  ))}
                </select>
              </label>
            ))}

            <div className="grid gap-1.5">
              <span className="hidden text-xs font-bold xl:block">&nbsp;</span>
              <button
                className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-black/10 px-3 text-xs font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                onClick={resetFilters}
                type="button"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>
          </div>

          {isError ? (
            <ErrorState
              className="mx-5"
              message="Activity log data could not be loaded."
              onRetry={() => void handleRefresh()}
              title="Could not load activity logs"
            />
          ) : isLoading ? (
            <div className="p-5">
              <SkeletonTable cols={9} rows={7} />
            </div>
          ) : !logs.length ? (
            <EmptyState
              action={
                <button
                  className="btn-secondary"
                  onClick={resetFilters}
                  type="button"
                >
                  Reset Filters
                </button>
              }
              icon={<Filter className="h-7 w-7" />}
              message="No audit events match the current filters."
              title="No activity logs found"
            />
          ) : (
            <div className="divide-y divide-black/10">
              {logs.map((log) => {
                const actorName = getActorName(log)
                const actorEmail = log.actorEmail || 'No email'
                const actionLabel = getActionLabel(log.action)
                const targetLabel = getTargetLabel(log)
                const deviceLabel = getDeviceLabel(log)
                const ipAddress = normalizeIpAddress(log.ipAddress)

                return (
                  <article
                    className="grid gap-4 px-4 py-4 transition hover:bg-[#f8f3ea] md:grid-cols-[9rem_minmax(0,1fr)] md:px-5 lg:grid-cols-[9rem_minmax(0,1fr)_13rem_2.75rem] lg:items-center 2xl:grid-cols-[10rem_minmax(0,1fr)_15rem_2.75rem]"
                    key={log._id}
                  >
                    <div className="flex min-w-0 items-center justify-between gap-3 md:block">
                      <p className="text-xs font-bold text-[#6b5f53]">
                        {formatOrderDate(log.createdAt)}
                      </p>
                      <span
                        className={`inline-flex max-w-full shrink-0 items-center gap-1.5 px-2 py-1 text-xs font-bold md:mt-3 ${getStatusClass(
                          log.status,
                        )}`}
                      >
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {getResultLabel(log.status)}
                        </span>
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <h3
                            className="truncate text-sm font-bold text-[#181512]"
                            title={actionLabel}
                          >
                            {actionLabel}
                          </h3>
                          <p
                            className="mt-1 line-clamp-2 text-sm text-[#6b5f53] lg:line-clamp-1"
                            title={log.summary}
                          >
                            {log.summary}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-[17rem] lg:justify-end">
                          <span
                            className="max-w-full truncate bg-[#f1dfc8] px-2 py-1 text-xs font-bold text-[#7a3f1d]"
                            title={formatLabel(log.module)}
                          >
                            {truncateText(formatLabel(log.module), 18)}
                          </span>
                          <span
                            className="max-w-full truncate bg-white px-2 py-1 text-xs font-bold text-[#181512]"
                            title={formatLabel(log.actorRole)}
                          >
                            {truncateText(formatLabel(log.actorRole), 16)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-2 border-t border-black/10 pt-3 text-xs text-[#6b5f53] sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                        <div className="min-w-0">
                          <p
                            className="truncate font-bold text-[#181512]"
                            title={actorName}
                          >
                            {actorName}
                          </p>
                          <p className="truncate" title={actorEmail}>
                            {actorEmail}
                          </p>
                        </div>

                        <div className="min-w-0 sm:text-right lg:text-left">
                          <p
                            className="truncate font-bold text-[#181512]"
                            title={targetLabel}
                          >
                            {targetLabel}
                          </p>
                          <p className="truncate">
                            {formatLabel(log.targetType)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid min-w-0 gap-1 text-xs font-semibold text-[#6b5f53] md:col-start-2 lg:col-start-auto">
                      <span
                        className="inline-flex min-w-0 items-center gap-1.5"
                        title={deviceLabel}
                      >
                        <Laptop className="h-3.5 w-3.5 shrink-0 text-[#7a3f1d]" />
                        <span className="truncate">{deviceLabel}</span>
                      </span>
                      <span className="truncate font-mono" title={ipAddress}>
                        {ipAddress}
                      </span>
                    </div>

                    <button
                      aria-label={`View activity ${log.action}`}
                      className="inline-grid h-10 w-full place-items-center border border-black/10 transition hover:border-[#181512] hover:bg-white md:col-start-2 md:w-10 lg:col-start-auto"
                      onClick={() => setSelectedLog(log)}
                      type="button"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </article>
                )
              })}
            </div>
          )}

          <div className="flex flex-col gap-2 border-t border-black/10 px-4 py-3 md:flex-row md:items-center md:justify-between">
            <p className="text-xs font-semibold text-[#6b5f53]">
              Page {meta?.page ?? page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                className="inline-flex h-8 w-8 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                className="inline-flex h-8 w-8 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {selectedLog ? (
        <ActivityLogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      ) : null}
    </DashboardLayout>
  )
}

export default ManageActivityLogs
