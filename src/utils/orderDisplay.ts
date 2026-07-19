import type { Order, OrderItem } from '../features/orders/orderApi'
import type { Product } from '../features/products/productApi'

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
