import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Coins,
  CreditCard,
  Database,
  Receipt,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react'

import {
  EmptyState,
  ErrorState,
  SkeletonTable,
} from '../../../components/loaders'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
  useGetPaymentLogsQuery,
  useGetPaymentLogStatsQuery,
  useSyncPaymentLogsFromOrdersMutation,
  type IPaymentLogItem,
} from '../../../features/paymentLog/paymentLogApi'
import { formatOrderDate } from '../../../utils/orderDisplay'
import { adminNavItems } from '../adminNavItems'
import { getPaymentLogRouteRef } from './paymentLogRouteState'

type MessageState = {
  text: string
  type: 'error' | 'success'
}

const statusOptions: IPaymentLogItem['status'][] = [
  'Paid',
  'Pending',
  'Failed',
  'Refunded',
  'Cancelled',
]

const paymentMethodOptions = ['sslcommerz', 'cod', 'bkash', 'nagad', 'rocket']

function formatPaymentAmount(value?: number, currency = 'BDT') {
  const safeValue = typeof value === 'number' && !Number.isNaN(value) ? value : 0
  const symbol = currency.toUpperCase() === 'BDT' ? '৳' : `${currency} `

  return `${symbol}${safeValue.toLocaleString()}`
}

function formatPaymentMethod(method?: string) {
  switch (method?.toLowerCase()) {
    case 'sslcommerz':
      return 'SSLCommerz'
    case 'cod':
      return 'Cash on delivery'
    case 'bkash':
      return 'bKash'
    case 'nagad':
      return 'Nagad'
    case 'rocket':
      return 'Rocket'
    default:
      return method ? method.toUpperCase() : 'Not set'
  }
}

function getPaymentErrorMessage(error: unknown, fallback: string) {
  const apiError = error as {
    data?: {
      errorSources?: { message: string }[]
      message?: string
    }
    message?: string
  }

  return (
    apiError.data?.errorSources?.[0]?.message ??
    apiError.data?.message ??
    apiError.message ??
    fallback
  )
}

function getStatusBadge(status: IPaymentLogItem['status']) {
  switch (status) {
    case 'Paid':
      return (
        <span className="inline-flex items-center gap-1.5 bg-[#effaf3] px-2 py-1 text-xs font-bold text-[#1f6b43]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Paid
        </span>
      )
    case 'Failed':
    case 'Cancelled':
      return (
        <span className="inline-flex items-center gap-1.5 bg-[#fff5ef] px-2 py-1 text-xs font-bold text-[#8f3f1d]">
          <XCircle className="h-3.5 w-3.5" />
          {status}
        </span>
      )
    case 'Refunded':
      return (
        <span className="inline-flex items-center gap-1.5 bg-[#eef3ff] px-2 py-1 text-xs font-bold text-[#27408b]">
          <RefreshCw className="h-3.5 w-3.5" />
          Refunded
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1.5 bg-[#f1dfc8] px-2 py-1 text-xs font-bold text-[#7a3f1d]">
          <Clock className="h-3.5 w-3.5" />
          Pending
        </span>
      )
  }
}

function getCustomerName(log: IPaymentLogItem) {
  return log.userId?.name || log.orderId?.customerInfo?.name || 'Customer'
}

function getCustomerEmail(log: IPaymentLogItem) {
  return log.userId?.email || log.orderId?.customerInfo?.email || ''
}

function getPaymentLogDetailUrl(log: IPaymentLogItem) {
  const routeRef = getPaymentLogRouteRef(
    log.transactionId,
    log.publicRef || log.viewToken,
  )

  return `/dashboard/admin/payment-logs/${routeRef}`
}

function ManagePaymentLogs() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('')
  const [message, setMessage] = useState<MessageState | null>(null)

  const {
    data: logsResponse,
    isError,
    isFetching,
    isLoading,
    refetch: refetchLogs,
  } = useGetPaymentLogsQuery(
    {
      limit: 15,
      page,
      paymentMethod: paymentMethodFilter || undefined,
      search: search.trim() || undefined,
      status: statusFilter || undefined,
    },
    { refetchOnMountOrArgChange: true },
  )

  const {
    data: statsResponse,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useGetPaymentLogStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const [syncPaymentLogs, { isLoading: isSyncing }] =
    useSyncPaymentLogsFromOrdersMutation()

  const logs = logsResponse?.data ?? []
  const meta = logsResponse?.meta
  const stats = statsResponse?.data

  function resetFilters() {
    setSearch('')
    setStatusFilter('')
    setPaymentMethodFilter('')
    setPage(1)
  }

  async function handleRefresh() {
    await Promise.all([refetchLogs(), refetchStats()])
  }

  async function handleSync() {
    try {
      const result = await syncPaymentLogs().unwrap()

      await handleRefresh()
      setMessage({
        text: result.message || 'Payment logs synced from orders.',
        type: 'success',
      })
    } catch (error) {
      await handleRefresh()
      setMessage({
        text: getPaymentErrorMessage(
          error,
          'Backend sync endpoint is not available yet. Showing order-derived logs.',
        ),
        type: 'error',
      })
    }
  }

  return (
    <DashboardLayout
      helperText="Keep payment audit records aligned with order payment state."
      sidebarItems={adminNavItems}
      subtitle="Review order payment status, methods, revenue, and synced payment audit records."
      title="Payment logs"
      workspaceLabel="Marketplace studio"
    >
      <div className="space-y-5">
        {message ? (
          <div
            className={`flex items-start justify-between gap-3 border px-5 py-3 text-sm font-bold ${
              message.type === 'success'
                ? 'border-[#1f6b43]/25 bg-[#effaf3] text-[#1f6b43]'
                : 'border-[#c85f2f]/30 bg-[#fff5ef] text-[#8f3f1d]'
            }`}
          >
            <span>{message.text}</span>
            <button
              aria-label="Dismiss message"
              className="grid h-7 w-7 shrink-0 place-items-center border border-current/20"
              onClick={() => setMessage(null)}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">
                Tracked payments
              </p>
              <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                <Receipt className="h-5 w-5" />
              </span>
            </div>
            {isStatsLoading ? (
              <div className="mt-4 h-8 w-20 animate-pulse bg-[#f1dfc8]" />
            ) : (
              <p className="mt-4 text-3xl font-bold">{stats?.totalLogs ?? 0}</p>
            )}
            <p className="mt-1 text-sm text-[#6b5f53]">
              Rows from logs or orders.
            </p>
          </div>

          <div className="border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">
                Paid revenue
              </p>
              <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                <Coins className="h-5 w-5" />
              </span>
            </div>
            {isStatsLoading ? (
              <div className="mt-4 h-8 w-28 animate-pulse bg-[#f1dfc8]" />
            ) : (
              <p className="mt-4 text-3xl font-bold">
                {formatPaymentAmount(stats?.totalRevenue ?? 0)}
              </p>
            )}
            <p className="mt-1 text-sm text-[#6b5f53]">Paid orders only.</p>
          </div>

          <div className="border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">
                Success rate
              </p>
              <span className="grid h-10 w-10 place-items-center bg-[#effaf3] text-[#1f6b43]">
                <ShieldCheck className="h-5 w-5" />
              </span>
            </div>
            {isStatsLoading ? (
              <div className="mt-4 h-8 w-24 animate-pulse bg-[#f1dfc8]" />
            ) : (
              <p className="mt-4 text-3xl font-bold text-[#1f6b43]">
                {stats?.successRate ?? 0}%
              </p>
            )}
            <p className="mt-1 text-sm text-[#6b5f53]">
              {stats?.paidLogs ?? 0} paid records.
            </p>
          </div>

          <div className="border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">
                Failed attempts
              </p>
              <span className="grid h-10 w-10 place-items-center bg-[#fff5ef] text-[#8f3f1d]">
                <AlertCircle className="h-5 w-5" />
              </span>
            </div>
            {isStatsLoading ? (
              <div className="mt-4 h-8 w-20 animate-pulse bg-[#f1dfc8]" />
            ) : (
              <p className="mt-4 text-3xl font-bold text-[#8f3f1d]">
                {stats?.failedLogs ?? 0}
              </p>
            )}
            <p className="mt-1 text-sm text-[#6b5f53]">
              Refunded: {stats?.refundedLogs ?? 0}
            </p>
          </div>
        </section>

        <section className="border border-black/10 bg-white">
          <div className="flex flex-col gap-4 border-b border-black/10 p-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                <Database className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-2xl font-bold">Payment audit</h2>
                <p className="mt-1 text-sm text-[#6b5f53]">
                  {meta?.total ?? logs.length} payment records found.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex min-h-10 items-center justify-center gap-2 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea] disabled:cursor-wait disabled:opacity-60"
                disabled={isFetching || isSyncing}
                onClick={handleRefresh}
                type="button"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
                />
                Refresh
              </button>
              <button
                className="btn-primary min-h-10"
                disabled={isSyncing}
                onClick={handleSync}
                type="button"
              >
                <Database className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                Sync from orders
              </button>
            </div>
          </div>

          {isError ? (
            <div className="border-b border-[#c85f2f]/30 bg-[#fff5ef] px-5 py-3 text-sm font-bold text-[#8f3f1d]">
              Failed to load payment logs.
            </div>
          ) : null}

          <div className="grid gap-3 border-b border-black/10 p-5 xl:grid-cols-[minmax(0,1fr)_auto_auto_auto] xl:items-end">
            <label className="grid gap-2">
              <span className="text-sm font-bold">Search payments</span>
              <span className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a3f1d]" />
                <input
                  className="min-h-12 w-full border border-black/10 pl-10 pr-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Transaction, order, customer"
                  value={search}
                />
              </span>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold">Payment status</span>
              <select
                className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
                onChange={(event) => {
                  setStatusFilter(event.target.value)
                  setPage(1)
                }}
                value={statusFilter}
              >
                <option value="">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold">Payment method</span>
              <select
                className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
                onChange={(event) => {
                  setPaymentMethodFilter(event.target.value)
                  setPage(1)
                }}
                value={paymentMethodFilter}
              >
                <option value="">All methods</option>
                {paymentMethodOptions.map((method) => (
                  <option key={method} value={method}>
                    {formatPaymentMethod(method)}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-black/10 px-4 text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
              onClick={resetFilters}
              type="button"
            >
              <RotateCcw className="h-4 w-4" />
              Reset filters
            </button>
          </div>

          {isError ? (
            <ErrorState
              className="mx-5"
              message="Payment logs and order fallback both failed."
              onRetry={() => void handleRefresh()}
              title="Could not load payment records"
            />
          ) : null}

          {isError ? null : isLoading ? (
            <div className="p-5">
              <SkeletonTable cols={7} rows={6} />
            </div>
          ) : !logs.length ? (
            <EmptyState
              action={
                <button className="btn-secondary" onClick={resetFilters} type="button">
                  Reset Filters
                </button>
              }
              icon={<Receipt className="h-7 w-7" />}
              message="No payment records match current filters."
              title="No payment logs found"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
                  <tr>
                    <th className="px-5 py-3">Transaction</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Method</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Placed</th>
                    <th className="px-5 py-3">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr
                      className="border-t border-black/10 transition hover:bg-[#f8f3ea]"
                      key={log._id}
                    >
                      <td className="px-5 py-4">
                        <Link
                          className="font-mono text-xs font-bold text-[#181512] hover:text-[#7a3f1d] hover:underline"
                          to={getPaymentLogDetailUrl(log)}
                        >
                          {log.transactionId}
                        </Link>
                        {log.orderId?.orderNumber ? (
                          <Link
                            className="mt-1 block text-xs font-bold text-[#7a3f1d] hover:underline"
                            to={getPaymentLogDetailUrl(log)}
                          >
                            {log.orderId.orderNumber}
                          </Link>
                        ) : null}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold">{getCustomerName(log)}</p>
                        <p className="mt-1 text-xs text-[#6b5f53]">
                          {getCustomerEmail(log) || 'No email'}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#181512]">
                          <CreditCard className="h-3.5 w-3.5 text-[#7a3f1d]" />
                          {formatPaymentMethod(log.paymentMethod)}
                        </span>
                      </td>
                      <td className="px-5 py-4">{getStatusBadge(log.status)}</td>
                      <td className="px-5 py-4 font-bold">
                        {formatPaymentAmount(log.amount, log.currency)}
                      </td>
                      <td className="px-5 py-4 text-[#6b5f53]">
                        {formatOrderDate(log.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="bg-[#f1dfc8] px-2 py-1 text-xs font-bold text-[#7a3f1d]">
                          {log.source === 'order' ? 'Order' : 'Payment log'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-black/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-semibold text-[#6b5f53]">
              Page {meta?.page ?? page} of {meta?.totalPage ?? 1}
            </p>
            <div className="flex gap-2">
              <button
                className="inline-flex h-10 w-10 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                className="inline-flex h-10 w-10 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={page >= (meta?.totalPage ?? 1)}
                onClick={() => setPage((current) => current + 1)}
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default ManagePaymentLogs
