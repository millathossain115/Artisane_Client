import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from '../../../features/orders/orderApi'
import {
  getOrderCustomer,
  getOrderCustomerEmail,
  getOrderPrimaryItem,
} from '../../../utils/orderDisplay'

export const orderStatusOptions: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

export const paymentStatusOptions: PaymentStatus[] = [
  'unpaid',
  'pending',
  'paid',
  'failed',
  'refunded',
]

export type AdminOrderMessage = {
  text: string
  type: 'error' | 'success'
}

export type ConfirmTarget = {
  order: Order
  type: 'cancel' | 'delete'
}

export type ShipmentFormState = {
  alternativePhone: string
  deliveryType: string
  itemDescription: string
  note: string
  recipientEmail: string
  totalLot: string
}

export type StatusFormState = {
  orderStatus: OrderStatus | ''
  paymentStatus: PaymentStatus | ''
}

export function getEmptyShipmentForm(): ShipmentFormState {
  return {
    alternativePhone: '',
    deliveryType: '',
    itemDescription: '',
    note: '',
    recipientEmail: '',
    totalLot: '',
  }
}

export function getApiErrorMessage(error: unknown, fallback: string) {
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

export function parseOptionalInteger(value: string, min: number, max: number) {
  const trimmed = value.trim()

  if (!trimmed) {
    return undefined
  }

  const parsed = Number(trimmed)

  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    return null
  }

  return parsed
}

export function matchesSearch(order: Order, searchTerm: string) {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  if (!normalizedSearch) {
    return true
  }

  return [
    order._id,
    getOrderCustomer(order),
    getOrderCustomerEmail(order),
    order.contactPhone,
    getOrderPrimaryItem(order),
  ]
    .filter(Boolean)
    .some((value) => value?.toLowerCase().includes(normalizedSearch))
}
