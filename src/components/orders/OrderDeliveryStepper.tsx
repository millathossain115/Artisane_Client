import {
  AlertTriangle,
  Check,
  Clock3,
  ExternalLink,
  PackageCheck,
  RefreshCw,
  Truck,
} from 'lucide-react'

import type { Order } from '../../features/orders/orderApi'
import type {
  OrderTimelineStep,
  OrderTimelineStepState,
} from '../../utils/orderDisplay'
import {
  formatCourierProvider,
  formatOrderStatus,
  formatOrderTimelineDate,
  getDeliveryIssueLabel,
  getOrderTimelineSteps,
  getOrderTrackingUrl,
} from '../../utils/orderDisplay'

type OrderDeliveryStepperProps = {
  isRefreshing?: boolean
  onRefresh?: () => void
  order: Order
  variant?: 'admin' | 'customer'
}

type ShipmentFact = {
  href?: string
  label: string
  value: string
}

function getStateClasses(state: OrderTimelineStepState) {
  switch (state) {
    case 'active':
      return {
        dot: 'border-[#181512] bg-[#181512] text-white',
        icon: Truck,
        item: 'text-[#181512]',
        meta: 'text-[#6b5f53]',
        track: 'bg-[#181512]',
      }
    case 'cancelled':
      return {
        dot: 'border-[#c85f2f] bg-[#c85f2f] text-white',
        icon: AlertTriangle,
        item: 'text-[#8f3f1d]',
        meta: 'text-[#8f3f1d]/80',
        track: 'bg-[#c85f2f]',
      }
    case 'complete':
      return {
        dot: 'border-[#1f7a4d] bg-[#1f7a4d] text-white',
        icon: Check,
        item: 'text-[#1f6b43]',
        meta: 'text-[#1f6b43]/80',
        track: 'bg-[#1f7a4d]',
      }
    case 'issue':
      return {
        dot: 'border-[#c85f2f] bg-[#c85f2f] text-white',
        icon: AlertTriangle,
        item: 'text-[#8f3f1d]',
        meta: 'text-[#8f3f1d]/80',
        track: 'bg-[#c85f2f]',
      }
    case 'pending':
    default:
      return {
        dot: 'border-black/15 bg-white text-[#6b5f53]',
        icon: Clock3,
        item: 'text-[#6b5f53]',
        meta: 'text-[#8a7d71]',
        track: 'bg-black/10',
      }
  }
}

function getShipmentFacts(order: Order): ShipmentFact[] {
  const trackingCode = order.trackingCode?.trim() || 'Not set'
  const trackingUrl = getOrderTrackingUrl(order)

  return [
    {
      label: 'Placed',
      value: formatOrderTimelineDate(order.createdAt),
    },
    {
      label: 'Courier provider',
      value: order.courierProvider
        ? formatCourierProvider(order.courierProvider)
        : 'Not set',
    },
    {
      label: 'Courier status',
      value: order.courierStatus
        ? formatOrderStatus(order.courierStatus)
        : 'Not set',
    },
    {
      label: 'Courier order id',
      value: order.courierOrderId ?? 'Not set',
    },
    {
      href: trackingUrl || undefined,
      label: 'Tracking code',
      value: trackingCode,
    },
    {
      label: 'Shipment created',
      value: formatOrderTimelineDate(order.shipmentCreatedAt),
    },
    {
      label: 'Delivered',
      value: formatOrderTimelineDate(order.deliveredAt),
    },
    {
      label: 'Last courier sync',
      value: formatOrderTimelineDate(order.lastCourierSyncAt),
    },
  ]
}

function StepItem({
  isLast,
  step,
}: {
  isLast: boolean
  step: OrderTimelineStep
}) {
  const stateClasses = getStateClasses(step.state)
  const Icon = stateClasses.icon
  const isCurrent = step.state === 'active' || step.state === 'issue'

  return (
    <li
      aria-current={isCurrent ? 'step' : undefined}
      className={`relative flex min-w-0 gap-3 ${stateClasses.item}`}
    >
      {!isLast ? (
        <span
          aria-hidden="true"
          className={`absolute left-8 top-4 hidden h-px w-[calc(100%-1.5rem)] md:block ${stateClasses.track}`}
        />
      ) : null}
      <div className="flex shrink-0 flex-col items-center">
        <span
          className={`relative z-10 grid h-8 w-8 place-items-center border ${stateClasses.dot}`}
        >
          <Icon className="h-4 w-4" />
        </span>
        {!isLast ? (
          <span
            aria-hidden="true"
            className={`mt-1 h-full min-h-7 w-px md:hidden ${stateClasses.track}`}
          />
        ) : null}
      </div>
      <div className="min-w-0 pb-1 md:pb-0">
        <h4 className="text-sm font-bold">{step.label}</h4>
        <p className={`mt-0.5 text-xs font-semibold ${stateClasses.meta}`}>
          {formatOrderTimelineDate(step.date)}
        </p>
        <p
          className={`mt-1 text-xs font-medium leading-4 ${stateClasses.meta}`}
        >
          {step.description}
        </p>
      </div>
    </li>
  )
}

function ShipmentFactItem({ fact }: { fact: ShipmentFact }) {
  const value =
    fact.href && fact.value !== 'Not set' ? (
      <a
        className="inline-flex min-w-0 items-center gap-1 font-bold text-[#7a3f1d] underline"
        href={fact.href}
        rel="noreferrer"
        target="_blank"
      >
        <span className="truncate">{fact.value}</span>
        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
      </a>
    ) : (
      fact.value
    )

  return (
    <div className="min-w-0 border-t border-black/10 pt-2">
      <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7a3f1d]">
        {fact.label}
      </dt>
      <dd className="mt-1 min-w-0 truncate text-sm font-bold text-[#181512]">
        {value}
      </dd>
    </div>
  )
}

function OrderDeliveryStepper({
  isRefreshing = false,
  onRefresh,
  order,
  variant = 'customer',
}: OrderDeliveryStepperProps) {
  const steps = getOrderTimelineSteps(order)
  const issueLabel = getDeliveryIssueLabel(order)
  const facts = getShipmentFacts(order)
  const canRefresh = variant === 'admin' && onRefresh

  return (
    <section className="border-b border-black/10 pb-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center border border-black/10 bg-[#f8f3ea] text-[#7a3f1d]">
            <PackageCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
              Delivery tracker
            </p>
            <p className="mt-1 text-sm font-semibold text-[#6b5f53]">
              Latest order and courier status from saved order data.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {issueLabel ? (
            <span className="inline-flex min-h-9 items-center gap-2 bg-[#fff5ef] px-3 text-xs font-bold text-[#8f3f1d]">
              <AlertTriangle className="h-4 w-4" />
              {issueLabel}
            </span>
          ) : null}
          {canRefresh ? (
            <button
              className="inline-flex min-h-9 items-center justify-center gap-2 border border-black/10 bg-white px-3 text-xs font-bold transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={isRefreshing}
              onClick={onRefresh}
              type="button"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              {isRefreshing ? 'Syncing...' : 'Sync courier status'}
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="border border-[#7a3f1d]/25 bg-[#f8f3ea] p-3 shadow-[inset_4px_0_0_#7a3f1d]">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center bg-[#7a3f1d] text-white">
              <Truck className="h-3.5 w-3.5" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
              Delivery progress
            </p>
          </div>
          <ol className="mt-3 grid gap-2 md:grid-cols-4">
            {steps.map((step, index) => (
              <StepItem
                isLast={index === steps.length - 1}
                key={step.key}
                step={step}
              />
            ))}
          </ol>
        </div>

        <div className="border border-black/10 bg-white p-0">
          <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-[#181512] px-3 py-2 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.14em]">
              Courier details
            </p>
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/70">
              Ledger
            </span>
          </div>
          <dl className="grid gap-x-4 gap-y-2 px-3 pb-3 pt-1 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact) => (
              <ShipmentFactItem fact={fact} key={fact.label} />
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

export default OrderDeliveryStepper
