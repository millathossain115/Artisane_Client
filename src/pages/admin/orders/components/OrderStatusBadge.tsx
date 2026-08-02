import { formatOrderStatus } from '../../../../utils/orderDisplay'

type OrderStatusBadgeProps = {
  kind: 'order' | 'payment'
  value?: string
}

function OrderStatusBadge({ kind, value }: OrderStatusBadgeProps) {
  const isProblem =
    value === 'cancelled' || value === 'failed' || value === 'refunded'
  const isComplete = value === 'delivered' || value === 'paid'
  const className = isProblem
    ? 'bg-[#fff5ef] text-[#8f3f1d]'
    : isComplete
      ? 'bg-[#effaf3] text-[#1f6b43]'
      : kind === 'order'
        ? 'bg-[#f1dfc8] text-[#7a3f1d]'
        : 'bg-[#f8f3ea] text-[#6b5f53]'

  return (
    <span
      className={`inline-flex min-h-7 max-w-full items-center px-2.5 text-xs font-bold ${className}`}
    >
      <span className="truncate">{formatOrderStatus(value)}</span>
    </span>
  )
}

export default OrderStatusBadge
