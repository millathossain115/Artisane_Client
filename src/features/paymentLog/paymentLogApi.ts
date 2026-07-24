import type {
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from '@reduxjs/toolkit/query'

import { baseApi } from '../../redux/api/baseApi'
import type { Order, OrderListMeta, PaymentStatus } from '../orders/orderApi'

type FetchResult = QueryReturnValue<
  unknown,
  FetchBaseQueryError,
  FetchBaseQueryMeta
>

type FetchWithBQ = (arg: string | FetchArgs) => FetchResult | PromiseLike<FetchResult>

type PaymentLogStatus = 'Pending' | 'Paid' | 'Failed' | 'Cancelled' | 'Refunded'

type ApiResponse<T> = {
  success: boolean
  message: string
  meta?: OrderListMeta
  data?: T
}

export interface IPaymentLogItem {
  _id: string
  orderId?: {
    _id: string
    orderNumber?: string
    grandTotal?: number
    customerInfo?: {
      name?: string
      email?: string
    }
  }
  userId?: {
    _id: string
    name?: string
    email?: string
  }
  transactionId: string
  amount: number
  currency: string
  paymentMethod: string
  publicRef?: string
  status: PaymentLogStatus
  gatewayResponse?: Record<string, unknown>
  errorMessage?: string
  createdAt: string
  source?: 'order' | 'payment-log'
  viewToken?: string
}

export interface IPaymentLogStats {
  totalLogs: number
  paidLogs: number
  failedLogs: number
  refundedLogs: number
  totalRevenue: number
  successRate: number
}

export interface IPaymentLogResponse {
  success: boolean
  message: string
  meta?: {
    page: number
    limit: number
    total: number
    totalPage: number
  }
  data: IPaymentLogItem[]
}

export interface IPaymentLogStatsResponse {
  success: boolean
  message: string
  data: IPaymentLogStats
}

export interface IPaymentLogDetailResponse {
  success: boolean
  message: string
  data: IPaymentLogItem
}

export type PaymentLogQueryParams = {
  page?: number
  limit?: number
  search?: string
  status?: string
  paymentMethod?: string
}

export type PaymentLogSyncResponse = {
  success: boolean
  message: string
  data?: {
    created?: number
    skipped?: number
    updated?: number
  }
}

const paymentLogEndpoints = ['/payment-logs']
const paymentLogSyncEndpoints = [
  '/payment-logs/sync-from-orders',
  '/payment-logs/sync',
]

const paymentStatusMap: Record<PaymentStatus, PaymentLogStatus> = {
  failed: 'Failed',
  paid: 'Paid',
  pending: 'Pending',
  refunded: 'Refunded',
  unpaid: 'Pending',
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizePaymentMethod(value?: string) {
  return (value || 'cod').toLowerCase()
}

function getOrderCustomerName(order: Order) {
  if (order.customerInfo?.name) {
    return order.customerInfo.name
  }

  if (order.user && typeof order.user !== 'string') {
    return order.user.name || order.user.email || 'Customer'
  }

  return 'Customer'
}

function getOrderCustomerEmail(order: Order) {
  if (order.customerInfo?.email) {
    return order.customerInfo.email
  }

  if (order.user && typeof order.user !== 'string') {
    return order.user.email || ''
  }

  return ''
}

function getOrderGatewayResponse(order: Order) {
  if (isObject(order.gatewayResponse)) {
    return order.gatewayResponse
  }

  if (isObject(order.paymentGatewayData)) {
    return order.paymentGatewayData
  }

  return undefined
}

function getOrderAmount(order: Order) {
  if (typeof order.totalPrice === 'number') {
    return order.totalPrice
  }

  const subtotal = order.subtotal ?? 0
  const shippingCharge = order.shippingCharge ?? 0
  const discount = order.discount ?? 0

  return Math.max(0, subtotal + shippingCharge - discount)
}

function getOrderUser(order: Order): IPaymentLogItem['userId'] {
  if (!order.user) {
    return undefined
  }

  if (typeof order.user === 'string') {
    return { _id: order.user }
  }

  return {
    _id: order.user._id,
    email: order.user.email,
    name: order.user.name,
  }
}

function createLogFromOrder(order: Order): IPaymentLogItem {
  const shortOrderId = order._id.slice(-8).toUpperCase()

  return {
    _id: `order-${order._id}`,
    amount: getOrderAmount(order),
    createdAt: order.createdAt ?? new Date().toISOString(),
    currency: order.currency ?? 'BDT',
    gatewayResponse: getOrderGatewayResponse(order),
    orderId: {
      _id: order._id,
      customerInfo: {
        email: getOrderCustomerEmail(order),
        name: getOrderCustomerName(order),
      },
      grandTotal: getOrderAmount(order),
      orderNumber: `#${shortOrderId}`,
    },
    paymentMethod: normalizePaymentMethod(order.paymentMethod),
    publicRef: order.publicRef,
    source: 'order',
    status: paymentStatusMap[order.paymentStatus ?? 'pending'],
    transactionId: order.transactionId || `ORDER-${shortOrderId}`,
    userId: getOrderUser(order),
    viewToken: order.viewToken,
  }
}

function normalizePaymentLog(log: IPaymentLogItem): IPaymentLogItem {
  return {
    ...log,
    paymentMethod: normalizePaymentMethod(log.paymentMethod),
    source: log.source ?? 'payment-log',
  }
}

function filterPaymentLogs(
  logs: IPaymentLogItem[],
  params: PaymentLogQueryParams,
) {
  const search = params.search?.trim().toLowerCase()
  const status = params.status?.trim().toLowerCase()
  const paymentMethod = params.paymentMethod?.trim().toLowerCase()

  return logs.filter((log) => {
    const matchesSearch = !search
      ? true
      : [
          log.transactionId,
          log.publicRef,
          log.orderId?._id,
          log.orderId?.orderNumber,
          log.orderId?.customerInfo?.name,
          log.orderId?.customerInfo?.email,
          log.userId?.name,
          log.userId?.email,
          log.errorMessage,
          log.viewToken,
        ]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(search))

    return (
      matchesSearch &&
      (!status || log.status.toLowerCase() === status) &&
      (!paymentMethod || log.paymentMethod.toLowerCase() === paymentMethod)
    )
  })
}

function paginatePaymentLogs(
  logs: IPaymentLogItem[],
  params: PaymentLogQueryParams,
): IPaymentLogResponse {
  const page = Math.max(1, params.page ?? 1)
  const limit = Math.max(1, params.limit ?? 15)
  const filteredLogs = filterPaymentLogs(logs, params)
  const total = filteredLogs.length
  const totalPage = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit

  return {
    data: filteredLogs.slice(start, start + limit),
    message: 'Payment logs loaded from orders.',
    meta: {
      limit,
      page,
      total,
      totalPage,
    },
    success: true,
  }
}

function createStats(logs: IPaymentLogItem[]): IPaymentLogStats {
  const paidLogs = logs.filter((log) => log.status === 'Paid')
  const failedLogs = logs.filter((log) => log.status === 'Failed')
  const refundedLogs = logs.filter((log) => log.status === 'Refunded')
  const totalLogs = logs.length

  return {
    failedLogs: failedLogs.length,
    paidLogs: paidLogs.length,
    refundedLogs: refundedLogs.length,
    successRate: totalLogs ? Math.round((paidLogs.length / totalLogs) * 100) : 0,
    totalLogs,
    totalRevenue: paidLogs.reduce((sum, log) => sum + log.amount, 0),
  }
}

async function fetchPaymentLogsFromEndpoint(
  fetchWithBQ: FetchWithBQ,
  params: PaymentLogQueryParams,
) {
  for (const url of paymentLogEndpoints) {
    const result = await fetchWithBQ({
      method: 'GET',
      params,
      url,
    })

    if (!result.error && result.data) {
      const response = result.data as IPaymentLogResponse

      return {
        ...response,
        data: (response.data ?? []).map(normalizePaymentLog),
      }
    }
  }

  return null
}

async function fetchOrderDerivedLogs(fetchWithBQ: FetchWithBQ) {
  const result = await fetchWithBQ({
    params: {
      limit: 1000,
      page: 1,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
    url: '/orders',
  })

  if (result.error) {
    return { error: result.error }
  }

  const response = result.data as ApiResponse<Order[]>
  const logs = (response.data ?? []).map(createLogFromOrder)

  return { data: logs }
}

export const paymentLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentLogs: builder.query<IPaymentLogResponse, PaymentLogQueryParams | void>({
      async queryFn(params, _api, _extraOptions, fetchWithBQ) {
        const queryParams = params ?? {}
        const paymentLogResponse = await fetchPaymentLogsFromEndpoint(
          fetchWithBQ,
          queryParams,
        )

        if (paymentLogResponse?.data.length) {
          return { data: paymentLogResponse }
        }

        const orderLogs = await fetchOrderDerivedLogs(fetchWithBQ)

        if (orderLogs.error) {
          if (paymentLogResponse) {
            return { data: paymentLogResponse }
          }

          return { error: orderLogs.error }
        }

        return {
          data: paginatePaymentLogs(orderLogs.data ?? [], queryParams),
        }
      },
      providesTags: ['PaymentLogs'],
    }),
    getPaymentLogStats: builder.query<IPaymentLogStatsResponse, void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        for (const endpoint of paymentLogEndpoints) {
          const result = await fetchWithBQ(`${endpoint}/stats`)

          if (!result.error && result.data) {
            const response = result.data as IPaymentLogStatsResponse

            if (response.data.totalLogs > 0) {
              return { data: response }
            }
          }
        }

        const orderLogs = await fetchOrderDerivedLogs(fetchWithBQ)

        if (orderLogs.error) {
          return { error: orderLogs.error }
        }

        return {
          data: {
            data: createStats(orderLogs.data ?? []),
            message: 'Payment stats loaded from orders.',
            success: true,
          },
        }
      },
      providesTags: ['PaymentLogs'],
    }),
    getPaymentLogByRef: builder.query<
      IPaymentLogItem | null,
      { lookupRef: string; publicRef?: string }
    >({
      async queryFn({ lookupRef, publicRef }, _api, _extraOptions, fetchWithBQ) {
        if (publicRef) {
          const directResult = await fetchWithBQ(
            `/payment-logs/${encodeURIComponent(publicRef)}`,
          )

          if (!directResult.error && directResult.data) {
            const response = directResult.data as IPaymentLogDetailResponse

            return { data: normalizePaymentLog(response.data) }
          }
        }

        const listResponse = await fetchPaymentLogsFromEndpoint(fetchWithBQ, {
          limit: 10,
          page: 1,
          search: lookupRef,
        })

        if (listResponse?.data.length) {
          return { data: listResponse.data[0] }
        }

        const orderLogs = await fetchOrderDerivedLogs(fetchWithBQ)

        if (orderLogs.error) {
          return { error: orderLogs.error }
        }

        const matchedLog =
          filterPaymentLogs(orderLogs.data ?? [], { search: lookupRef })[0] ??
          null

        return { data: matchedLog }
      },
      providesTags: (_result, _error, { lookupRef }) => [
        'PaymentLogs',
        { id: lookupRef, type: 'PaymentLogs' },
      ],
    }),
    syncPaymentLogsFromOrders: builder.mutation<PaymentLogSyncResponse, void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        let lastError: FetchBaseQueryError | undefined

        for (const url of paymentLogSyncEndpoints) {
          const result = await fetchWithBQ({
            method: 'POST',
            url,
          })

          if (!result.error && result.data) {
            return { data: result.data as PaymentLogSyncResponse }
          }

          lastError = result.error
        }

        return {
          error:
            lastError ??
            ({
              error: 'Payment log sync endpoint not found.',
              status: 'CUSTOM_ERROR',
            } as FetchBaseQueryError),
        }
      },
      invalidatesTags: ['PaymentLogs', 'Order'],
    }),
  }),
})

export const {
  useGetPaymentLogByRefQuery,
  useGetPaymentLogsQuery,
  useGetPaymentLogStatsQuery,
  useSyncPaymentLogsFromOrdersMutation,
} = paymentLogApi
