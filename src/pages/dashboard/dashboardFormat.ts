export function formatCount(value: null | number | undefined, fallback = '0') {
  if (value === null || value === undefined) {
    return fallback
  }

  return new Intl.NumberFormat('en-US').format(value)
}

export function formatCurrency(
  value: null | number | undefined,
  fallback = '$0',
) {
  if (value === null || value === undefined) {
    return fallback
  }

  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)
}

export function formatGrowth(value: null | number, fallback: string) {
  if (value === null) {
    return fallback
  }

  return `${value > 0 ? '+' : ''}${value}% this month`
}

export function formatDate(
  value?: string,
  fallback = 'Recent',
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
  },
) {
  if (!value) {
    return fallback
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return fallback
  }

  return date.toLocaleDateString('en-US', options)
}

export function formatStatus(value?: string) {
  if (!value) {
    return 'Pending'
  }

  return value
    .split('_')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

export function formatOrderId(id: string) {
  return `#${id.slice(-6).toUpperCase()}`
}

export function readNumericStat(
  stats: null | Record<string, unknown>,
  keys: string[],
) {
  if (!stats) {
    return null
  }

  for (const key of keys) {
    const value = stats[key]
    const numericValue =
      typeof value === 'number'
        ? value
        : typeof value === 'string'
          ? Number(value.replace(/[^0-9.-]/g, ''))
          : Number.NaN

    if (Number.isFinite(numericValue)) {
      return numericValue
    }
  }

  return null
}
