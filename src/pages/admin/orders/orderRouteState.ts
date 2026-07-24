import type { Order } from '../../../features/orders/orderApi'

const ADMIN_ORDER_ROUTE_MAP_KEY = 'artisane_admin_order_route_map'

function readRouteMap() {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    return JSON.parse(
      window.sessionStorage.getItem(ADMIN_ORDER_ROUTE_MAP_KEY) ?? '{}',
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
    ADMIN_ORDER_ROUTE_MAP_KEY,
    JSON.stringify(routeMap),
  )
}

function createRouteRef() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export function getAdminOrderRouteRef(order: Order) {
  const routeMap = readRouteMap()
  const stablePublicRef = order.publicRef || order.viewToken
  const existingRef = Object.entries(routeMap).find(
    ([, value]) => value === order._id,
  )?.[0]
  const routeRef = stablePublicRef || existingRef || createRouteRef()

  routeMap[routeRef] = order._id
  writeRouteMap(routeMap)

  return routeRef
}

export function getAdminOrderLookupRef(routeRef: string) {
  return readRouteMap()[routeRef] ?? routeRef
}
