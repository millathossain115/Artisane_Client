import { Link, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Coins,
  CreditCard,
  LoaderCircle,
  Receipt,
  RefreshCw,
  ShieldCheck,
  UserRound,
  XCircle,
} from 'lucide-react'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import { ErrorState } from '../../../components/loaders'
import {
  useGetPaymentLogByRefQuery,
  type IPaymentLogItem,
} from '../../../features/paymentLog/paymentLogApi'
import { formatOrderDate } from '../../../utils/orderDisplay'
import { adminNavItems } from '../adminNavItems'
import { getPaymentLogLookupRef } from './paymentLogRouteState'

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

function getCustomerName(log?: IPaymentLogItem) {
  return log?.userId?.name || log?.orderId?.customerInfo?.name || 'Customer'
}

function getCustomerEmail(log?: IPaymentLogItem) {
  return log?.userId?.email || log?.orderId?.customerInfo?.email || ''
}

function getStatusBadge(status?: IPaymentLogItem['status']) {
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

function findMatchingLog(logs: IPaymentLogItem[], ref: string) {
  const normalizedRef = ref.trim().toLowerCase()

  return (
    logs.find(
      (log) =>
        log.transactionId.toLowerCase() === normalizedRef ||
        log.publicRef?.toLowerCase() === normalizedRef ||
        log.viewToken?.toLowerCase() === normalizedRef ||
        log.orderId?.orderNumber?.toLowerCase() === normalizedRef,
    ) ?? logs[0]
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-black/10 py-3 last:border-b-0">
      <p className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-bold text-[#181512]">
        {value || 'Not available'}
      </p>
    </div>
  )
}

function PaymentLogDetailPage() {
  const { ref = '' } = useParams<{ ref: string }>()
  const lookupRef = getPaymentLogLookupRef(ref) || ref
  const publicRef = lookupRef === ref ? ref : undefined
  const {
    data: log,
    isError,
    isLoading,
    refetch,
  } = useGetPaymentLogByRefQuery(
    { lookupRef, publicRef },
    { refetchOnMountOrArgChange: true, skip: !lookupRef },
  )
  const matchedLog = log ? findMatchingLog([log], lookupRef) : null

  return (
    <DashboardLayout
      actions={[{ label: 'All payment logs', to: '/dashboard/admin/payment-logs' }]}
      helperText="Review payment record details without exposing database identifiers in the URL."
      sidebarItems={adminNavItems}
      subtitle="Payment audit record by transaction reference."
      title="Payment log detail"
      workspaceLabel="Marketplace studio"
    >
      <div className="mb-4">
        <Link
          className="inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-2 text-sm font-bold text-[#181512] transition hover:border-[#181512]"
          to="/dashboard/admin/payment-logs"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to payment logs
        </Link>
      </div>

      {isLoading ? (
        <div className="border border-black/10 bg-white p-8 text-center font-semibold text-[#6b5f53]">
          <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-[#7a3f1d]" />
          <p className="mt-2">Loading payment log...</p>
        </div>
      ) : isError ? (
        <ErrorState
          message="Payment log lookup failed."
          onRetry={() => void refetch()}
          title="Could not load payment log"
        />
      ) : !matchedLog ? (
        <div className="border border-[#c85f2f]/30 bg-[#fff5ef] p-6 text-center text-[#8f3f1d]">
          <AlertCircle className="mx-auto h-7 w-7" />
          <h3 className="mt-2 text-xl font-bold">Payment log not found</h3>
          <p className="mt-2 text-sm font-medium">
            No payment record matched this transaction reference.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <section className="grid gap-3 md:grid-cols-4">
            <div className="border border-black/10 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">
                Amount
              </p>
              <p className="mt-3 flex items-center gap-2 text-2xl font-bold">
                <Coins className="h-5 w-5 text-[#7a3f1d]" />
                {formatPaymentAmount(matchedLog.amount, matchedLog.currency)}
              </p>
            </div>
            <div className="border border-black/10 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">
                Status
              </p>
              <div className="mt-3">{getStatusBadge(matchedLog.status)}</div>
            </div>
            <div className="border border-black/10 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">
                Method
              </p>
              <p className="mt-3 flex items-center gap-2 text-sm font-bold">
                <CreditCard className="h-4 w-4 text-[#7a3f1d]" />
                {formatPaymentMethod(matchedLog.paymentMethod)}
              </p>
            </div>
            <div className="border border-black/10 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">
                Source
              </p>
              <p className="mt-3 flex items-center gap-2 text-sm font-bold">
                <ShieldCheck className="h-4 w-4 text-[#7a3f1d]" />
                {matchedLog.source === 'order' ? 'Order' : 'Payment log'}
              </p>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="border border-black/10 bg-white">
              <div className="flex items-center gap-3 border-b border-black/10 p-5">
                <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                  <Receipt className="h-5 w-5" />
                </span>
                <h2 className="text-2xl font-bold">Payment reference</h2>
              </div>
              <div className="p-5">
                <DetailRow label="Transaction" value={matchedLog.transactionId} />
                <DetailRow
                  label="Order reference"
                  value={matchedLog.orderId?.orderNumber ?? ''}
                />
                <DetailRow label="Placed" value={formatOrderDate(matchedLog.createdAt)} />
                <DetailRow label="Currency" value={matchedLog.currency} />
                {matchedLog.errorMessage ? (
                  <DetailRow label="Error message" value={matchedLog.errorMessage} />
                ) : null}
              </div>
            </div>

            <div className="border border-black/10 bg-white">
              <div className="flex items-center gap-3 border-b border-black/10 p-5">
                <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                  <UserRound className="h-5 w-5" />
                </span>
                <h2 className="text-2xl font-bold">Customer</h2>
              </div>
              <div className="p-5">
                <DetailRow label="Name" value={getCustomerName(matchedLog)} />
                <DetailRow label="Email" value={getCustomerEmail(matchedLog)} />
              </div>
            </div>
          </section>
        </div>
      )}
    </DashboardLayout>
  )
}

export default PaymentLogDetailPage
