import type {
  ActivityActorRole,
  ActivityLog,
  ActivityModule,
  ActivitySource,
  ActivityStatus,
} from '../../../features/activityLogs/activityLogApi'

export const pageSize = 15

export const moduleOptions: ActivityModule[] = [
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

export const roleOptions: ActivityActorRole[] = [
  'admin',
  'super_admin',
  'user',
  'system',
]

export const sourceOptions: ActivitySource[] = [
  'admin',
  'user',
  'system',
  'payment_gateway',
  'courier_webhook',
  'scheduler',
]

export const statusOptions: ActivityStatus[] = ['success', 'warning', 'failed']

export function formatLabel(value?: string) {
  return value
    ? value
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    : 'Not set'
}

export function truncateText(value: string, maxLength = 32) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 2)}..` : value
}

export function normalizeIpAddress(value?: string) {
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

export function formatValue(value: unknown) {
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

export function getFieldLabel(field: string) {
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

export function getActionLabel(action: string) {
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

export function getResultLabel(status: ActivityStatus) {
  switch (status) {
    case 'failed':
      return 'Failed'
    case 'warning':
      return 'Needs review'
    default:
      return 'Done'
  }
}

export function getStatusClass(status: ActivityStatus) {
  switch (status) {
    case 'failed':
      return 'bg-[#fff5ef] text-[#8f3f1d]'
    case 'warning':
      return 'bg-[#fbf4e6] text-[#784f17]'
    default:
      return 'bg-[#effaf3] text-[#1f6b43]'
  }
}

export function getActorName(log: ActivityLog) {
  if (log.actorRole === 'system') return 'System'
  return log.actorName || log.actorEmail || 'Unknown actor'
}

export function getDeviceLabel(log: ActivityLog) {
  const device = formatLabel(log.deviceType)
  const browser = log.browser && log.browser !== 'Other' ? log.browser : ''
  const os = log.os && log.os !== 'Other' ? log.os : ''

  return [device, browser, os].filter(Boolean).join(' / ')
}

export function getTargetLabel(log: ActivityLog) {
  if (log.targetLabel && !isObjectIdString(log.targetLabel)) {
    return log.targetLabel
  }

  return log.targetType ? formatLabel(log.targetType) : 'Not set'
}

export function getVisibleChanges(log: ActivityLog) {
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
