import { Banknote, Smartphone } from 'lucide-react'

import type { CreateOrderResult, PaymentMethod } from '../../features/orders/orderApi'

export const paymentOptions: {
  accentClass: string
  detail: string
  icon: typeof Banknote
  label: string
  logo: string
  value: PaymentMethod
}[] = [
  {
    accentClass: 'bg-[#181512] text-white',
    detail: 'Pay when product arrives',
    icon: Banknote,
    label: 'Cash on delivery',
    logo: 'COD',
    value: 'cod',
  },
  {
    accentClass: 'bg-[#e2136e] text-white',
    detail: 'Mobile wallet payment',
    icon: Smartphone,
    label: 'bKash',
    logo: 'bKash',
    value: 'bkash',
  },
  {
    accentClass: 'bg-[#f58220] text-white',
    detail: 'Mobile wallet payment',
    icon: Smartphone,
    label: 'Nagad',
    logo: 'Nagad',
    value: 'nagad',
  },
  {
    accentClass: 'bg-[#7b1fa2] text-white',
    detail: 'Mobile wallet payment',
    icon: Smartphone,
    label: 'Rocket',
    logo: 'Rocket',
    value: 'rocket',
  },
]

export const PAYMENT_REDIRECT_TIMEOUT_MS = 25_000
export const CHECKOUT_MESSAGE_SCROLL_OFFSET = 32

export type CheckoutMessage = {
  text: string
  type: 'error' | 'success'
}

export type PendingCheckoutOrder = {
  contactPhone: string
  districtId: string
  districtName: string
  fullAddress: string
  notes?: string
  paymentMethod: PaymentMethod
  recipientName: string
  recipientPhone: string
  shippingAddress: string
  zoneId: string
  zoneName: string
}

export function getPaymentRedirectUrl(orderResult: CreateOrderResult | null) {
  const redirectUrl =
    orderResult?.payment?.paymentUrl ?? orderResult?.payment?.gatewayPageUrl

  return typeof redirectUrl === 'string' && redirectUrl.trim()
    ? redirectUrl
    : null
}

export function getCheckoutErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof error.data === 'object' &&
    error.data !== null &&
    'message' in error.data &&
    typeof error.data.message === 'string'
  ) {
    return error.data.message
  }

  return 'Failed to place order.'
}

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string,
) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    }),
  ])
}
