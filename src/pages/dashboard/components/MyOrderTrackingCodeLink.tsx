import { ExternalLink } from 'lucide-react'

import type { Order } from '../../../features/orders/orderApi'
import { getOrderTrackingUrl } from '../../../utils/orderDisplay'

function MyOrderTrackingCodeLink({ order }: { order: Order }) {
  const trackingCode = order.trackingCode?.trim()
  const trackingUrl = getOrderTrackingUrl(order)

  if (!trackingCode) {
    return <span>Tracking not set</span>
  }

  if (!trackingUrl) {
    return <span className="font-bold">{trackingCode}</span>
  }

  return (
    <a
      className="inline-flex min-w-0 items-center gap-1 font-bold text-[#7a3f1d] underline"
      href={trackingUrl}
      rel="noreferrer"
      target="_blank"
      title={trackingCode}
    >
      <span className="truncate">{trackingCode}</span>
      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
    </a>
  )
}

export default MyOrderTrackingCodeLink
