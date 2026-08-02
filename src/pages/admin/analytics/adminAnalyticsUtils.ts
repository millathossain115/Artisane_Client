import type { AdminAnalyticsFilters } from '../../../features/analytics/analyticsApi'

export type FilterKey = keyof AdminAnalyticsFilters

export type AnalyticsTableRow = {
  detail?: string
  label: string
  metric: number
  secondary?: number
}

export const orderStatusOptions = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

export const paymentStatusOptions = ['unpaid', 'paid', 'failed', 'refunded']
export const paymentMethodOptions = ['cod', 'sslcommerz', 'bkash', 'nagad', 'rocket']
export const courierProviderOptions = ['steadfast']

export const chartColors = {
  grid: '#eadfce',
  paidRevenue: '#d59b6a',
  revenue: '#8f3f1d',
  track: '#f1dfc8',
}

export function formatCurrency(value?: number) {
  return `৳${Math.round(value ?? 0).toLocaleString()}`
}

export function formatLabel(value?: string) {
  return value
    ? value
        .split('_')
        .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
        .join(' ')
    : 'Not set'
}

export function truncateText(value: string, maxLength = 30) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 2)}..` : value
}

export function getMaxValue(
  rows: Array<{ count?: number; revenue?: number; soldQuantity?: number }>,
) {
  return Math.max(
    1,
    ...rows.map((row) => row.revenue ?? row.soldQuantity ?? row.count ?? 0),
  )
}
