import type { Order } from '../../features/orders/orderApi'

const ORDER_ROUTE_MAP_KEY = 'artisane_dashboard_order_route_map'

type OrderRouteSource =
  | Pick<Order, '_id' | 'publicRef' | 'viewToken'>
  | string
  | undefined

function canUseSessionStorage() {
  return typeof window !== 'undefined' && Boolean(window.sessionStorage)
}

function readRouteMap() {
  if (!canUseSessionStorage()) {
    return {} as Record<string, string>
  }

  try {
    const stored = window.sessionStorage.getItem(ORDER_ROUTE_MAP_KEY)
    return stored ? (JSON.parse(stored) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

function writeRouteMap(map: Record<string, string>) {
  if (!canUseSessionStorage()) {
    return
  }

  try {
    window.sessionStorage.setItem(ORDER_ROUTE_MAP_KEY, JSON.stringify(map))
  } catch {
    // Session storage can be unavailable in strict privacy contexts.
  }
}

function createOpaqueRef() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `ord_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`
}

export function getDashboardOrderRouteRef(source: OrderRouteSource) {
  const orderId = typeof source === 'string' ? source : source?._id
  const publicRef =
    typeof source === 'string' ? undefined : source?.publicRef || source?.viewToken

  if (publicRef) {
    const map = readRouteMap()
    if (orderId) {
      map[publicRef] = orderId
      writeRouteMap(map)
    }
    return publicRef
  }

  if (!orderId) {
    return ''
  }

  const map = readRouteMap()
  const existingRef = Object.entries(map).find(([, value]) => value === orderId)?.[0]

  if (existingRef) {
    return existingRef
  }

  const routeRef = createOpaqueRef()
  map[routeRef] = orderId
  writeRouteMap(map)

  return routeRef
}

export function getDashboardOrderLookupRef(routeRef: string) {
  if (!routeRef) {
    return ''
  }

  return readRouteMap()[routeRef] || routeRef
}
