const PAYMENT_LOG_ROUTE_MAP_KEY = 'artisane_payment_log_route_map'

function readRouteMap() {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    return JSON.parse(
      window.sessionStorage.getItem(PAYMENT_LOG_ROUTE_MAP_KEY) ?? '{}',
    ) as Record<string, string>
  } catch {
    return {}
  }
}

function writeRouteMap(routeMap: Record<string, string>) {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(
    PAYMENT_LOG_ROUTE_MAP_KEY,
    JSON.stringify(routeMap),
  )
}

function createRouteRef() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export function getPaymentLogRouteRef(
  transactionId: string,
  stablePublicRef?: string,
) {
  const routeMap = readRouteMap()
  const existingRef = Object.entries(routeMap).find(
    ([, value]) => value === transactionId,
  )?.[0]

  const routeRef = stablePublicRef || existingRef || createRouteRef()

  routeMap[routeRef] = transactionId
  writeRouteMap(routeMap)

  return routeRef
}

export function getPaymentLogLookupRef(routeRef: string) {
  return readRouteMap()[routeRef] ?? ''
}
