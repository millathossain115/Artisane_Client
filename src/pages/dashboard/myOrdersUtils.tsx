import {
  type Order,
  type OrderStatus,
  type PaymentStatus,
} from '../../features/orders/orderApi'

export type OrderMessage = {
  text: string
  type: 'error' | 'success'
}

export type MyOrderTabKey =
  | 'all'
  | 'cancelled'
  | 'confirmed'
  | 'delivered'
  | 'pending'
  | 'shipped'
  | 'toPay'
  | 'toShip'

export type MyOrderTab = {
  emptyMessage: string
  key: MyOrderTabKey
  label: string
  orderStatus?: OrderStatus
  paymentStatus?: PaymentStatus
}

export const myOrderTabs: MyOrderTab[] = [
  {
    emptyMessage: 'You have not placed any orders yet.',
    key: 'all',
    label: 'All',
  },
  {
    emptyMessage: 'No unpaid orders need attention.',
    key: 'toPay',
    label: 'To Pay',
    paymentStatus: 'unpaid',
  },
  {
    emptyMessage: 'No pending orders right now.',
    key: 'pending',
    label: 'Pending',
    orderStatus: 'pending',
  },
  {
    emptyMessage: 'No confirmed orders right now.',
    key: 'confirmed',
    label: 'Confirmed',
    orderStatus: 'confirmed',
  },
  {
    emptyMessage: 'No orders are being prepared for shipping.',
    key: 'toShip',
    label: 'To Ship',
    orderStatus: 'processing',
  },
  {
    emptyMessage: 'No shipped orders right now.',
    key: 'shipped',
    label: 'Shipped',
    orderStatus: 'shipped',
  },
  {
    emptyMessage: 'No delivered orders yet.',
    key: 'delivered',
    label: 'Delivered',
    orderStatus: 'delivered',
  },
  {
    emptyMessage: 'No cancelled orders.',
    key: 'cancelled',
    label: 'Cancelled',
    orderStatus: 'cancelled',
  },
]

export function getMyOrderTab(key: MyOrderTabKey) {
  return myOrderTabs.find((tab) => tab.key === key) ?? myOrderTabs[0]
}

export function matchesMyOrderTab(order: Order, tab: MyOrderTab) {
  return (
    (!tab.orderStatus || order.orderStatus === tab.orderStatus) &&
    (!tab.paymentStatus || order.paymentStatus === tab.paymentStatus)
  )
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
