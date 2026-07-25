import type { Order, OrderItem } from '../features/orders/orderApi'
import type { Product } from '../features/products/productApi'
import { getDashboardOrderRouteRef } from '../pages/dashboard/orderRouteState'

export type OrderTimelineStepKey =
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'

export type OrderTimelineStepState =
  | 'active'
  | 'cancelled'
  | 'complete'
  | 'issue'
  | 'pending'

export type OrderTimelineStep = {
  date?: string
  description: string
  key: OrderTimelineStepKey
  label: string
  state: OrderTimelineStepState
}

export function formatOrderId(id: string) {
  return `#${id.slice(-6).toUpperCase()}`
}

export function formatOrderDate(value?: string) {
  if (!value) {
    return 'Recent'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Recent'
  }

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatOrderTimelineDate(value?: string) {
  if (!value) {
    return 'Not set'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Not set'
  }

  return date.toLocaleString('en-US', {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatOrderStatus(value?: string) {
  if (!value) {
    return 'Pending'
  }

  return value
    .split('_')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

export function formatCourierProvider(value?: string) {
  if (!value) {
    return 'Courier'
  }

  switch (value) {
    case 'pathao':
      return 'Pathao'
    case 'redx':
      return 'RedX'
    case 'steadfast':
      return 'Steadfast'
    default:
      return formatOrderStatus(value)
  }
}

export function getOrderCustomer(order: Order) {
  if (!order.user || typeof order.user === 'string') {
    return 'Customer'
  }

  return order.user.name || order.user.email || 'Customer'
}

export function getOrderCustomerEmail(order: Order) {
  if (!order.user || typeof order.user === 'string') {
    return ''
  }

  return order.user.email ?? ''
}

export function getOrderItemName(item?: OrderItem) {
  if (!item) {
    return 'Order item'
  }

  if (item.productName) {
    return item.productName
  }

  if (item.product && typeof item.product !== 'string') {
    return item.product.name
  }

  return 'Order item'
}

export function getOrderPrimaryItem(order: Order) {
  const firstItem = order.items?.[0]
  const itemName = getOrderItemName(firstItem)
  const extraItems = (order.items?.length ?? 0) - 1

  return extraItems > 0 ? `${itemName} +${extraItems} more` : itemName
}

export function getOrderItemImage(item?: OrderItem) {
  if (!item) {
    return undefined
  }

  if (item.image) {
    return item.image
  }

  if (item.product && typeof item.product !== 'string') {
    return (item.product as Product).images?.[0]
  }

  return undefined
}

export function getOrderItemUrl(item?: OrderItem) {
  if (!item) {
    return undefined
  }

  if (item.productSlug) {
    return `/products/${item.productSlug}`
  }

  if (item.product) {
    if (typeof item.product === 'object' && item.product) {
      return `/products/${item.product.slug || item.product._id}`
    }
    if (typeof item.product === 'string' && item.product) {
      return `/products/${item.product}`
    }
  }

  if (item._id) {
    return `/products/${item._id}`
  }

  return undefined
}

export function canCancelOrder(order: Order) {
  return ['pending', 'confirmed'].includes(order.orderStatus ?? '')
}

export function hasDeliveryIssue(order: Order) {
  const status = `${order.courierStatus ?? ''}`.toLowerCase()

  return ['failed', 'cancelled', 'returned', 'rto', 'lost'].some((item) =>
    status.includes(item),
  )
}

export function getOrderProgressIndex(order: Order) {
  if (order.orderStatus === 'cancelled') {
    return -1
  }

  if (order.orderStatus === 'delivered') {
    return 3
  }

  if (order.orderStatus === 'shipped') {
    return 2
  }

  if (order.orderStatus === 'processing') {
    return 1
  }

  return 0
}

export function getDeliveryIssueLabel(order: Order) {
  if (order.orderStatus === 'cancelled') {
    return 'Order cancelled'
  }

  if (hasDeliveryIssue(order)) {
    return formatOrderStatus(order.courierStatus)
  }

  return ''
}

function getTimelineStepState(
  order: Order,
  stepIndex: number,
): OrderTimelineStepState {
  if (order.orderStatus === 'cancelled') {
    return 'cancelled'
  }

  if (hasDeliveryIssue(order)) {
    return stepIndex <= getOrderProgressIndex(order) ? 'issue' : 'pending'
  }

  const progressIndex = getOrderProgressIndex(order)

  if (stepIndex < progressIndex) {
    return 'complete'
  }

  if (stepIndex === progressIndex) {
    return 'active'
  }

  return 'pending'
}

export function getOrderTimelineSteps(order: Order): OrderTimelineStep[] {
  const steps = [
    {
      date: order.createdAt,
      description: 'Order accepted and queued for fulfillment.',
      key: 'confirmed',
      label: 'Confirmed',
    },
    {
      description: 'Studio team prepares and packs ordered pieces.',
      key: 'processing',
      label: 'Processing',
    },
    {
      date: order.shippedAt || order.shipmentCreatedAt,
      description: 'Courier shipment created and moving to destination.',
      key: 'shipped',
      label: 'Shipped',
    },
    {
      date: order.deliveredAt,
      description: 'Shipment completed at delivery address.',
      key: 'delivered',
      label: 'Delivered',
    },
  ] as const

  return steps.map((step, index) => ({
    ...step,
    state: getTimelineStepState(order, index),
  }))
}

export function getOrderTrackingUrl(order: Order) {
  const trackingUrl = order.trackingUrl?.trim()

  if (trackingUrl) {
    return trackingUrl
  }

  const trackingCode = order.trackingCode?.trim()

  if (order.courierProvider === 'steadfast' && trackingCode) {
    return `https://steadfast.com.bd/t/${encodeURIComponent(trackingCode)}`
  }

  return ''
}

export function getOrderUrl(
  order:
    | { _id: string; publicRef?: string; transactionId?: string; viewToken?: string }
    | string
    | undefined,
) {
  const ref = getDashboardOrderRouteRef(order)
  return ref ? `/dashboard/orders/${ref}` : '/dashboard/orders'
}
