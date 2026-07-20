import { type OrderStatus } from '../../features/orders/orderApi'

export type OrderMessage = {
  text: string
  type: 'error' | 'success'
}

export const orderStatusOptions: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

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
