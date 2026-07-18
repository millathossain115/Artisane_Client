import { baseApi } from '../../redux/api/baseApi'
import type { Product } from '../products/productApi'
import type { AdminUser } from '../users/userApi'

type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
  meta?: OrderListMeta
  errorSources?: { path: string; message: string }[]
}

export type PaymentMethod = 'bkash' | 'cod' | 'nagad' | 'rocket' | 'sslcommerz'

export type OrderStatus =
  | 'cancelled'
  | 'confirmed'
  | 'delivered'
  | 'pending'
  | 'processing'
  | 'shipped'

export type PaymentStatus = 'failed' | 'paid' | 'pending' | 'refunded' | 'unpaid'

export type OrderItem = {
  _id?: string
  category?: string
  image?: string
  price?: number
  product?: Product | string
  productName?: string
  productSlug?: string
  quantity?: number
  subtotal?: number
}

export type Order = {
  _id: string
  contactPhone?: string
  createdAt?: string
  discount?: number
  items?: OrderItem[]
  notes?: string
  orderStatus?: OrderStatus
  paymentMethod?: PaymentMethod
  paymentStatus?: PaymentStatus
  shippingAddress?: string
  shippingCharge?: number
  subtotal?: number
  totalPrice?: number
  updatedAt?: string
  user?: AdminUser | string
}

export type CreateOrderPayload = {
  contactPhone: string
  items: {
    product: string
    quantity: number
  }[]
  notes?: string
  paymentMethod: PaymentMethod
  shippingAddress: string
}

export type OrderPaymentSession = {
  gatewayPageUrl?: string
  paymentUrl?: string
  sessionKey?: string
}

export type CreateOrderResult = {
  order: Order | null
  payment: null | OrderPaymentSession
}

export type OrderListMeta = {
  limit: number
  page: number
  total: number
  totalPage: number
}

export type OrderListResult = {
  data: Order[]
  meta: OrderListMeta
}

export type OrderQueryParams = {
  limit?: number
  page?: number
  paymentStatus?: PaymentStatus
  searchTerm?: string
  sortBy?: 'createdAt' | 'totalPrice' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  status?: OrderStatus
}

export type UpdateOrderStatusPayload = {
  id: string
  orderStatus?: OrderStatus
  paymentStatus?: PaymentStatus
}

function createOrderParams(params?: OrderQueryParams | void) {
  if (!params) {
    return undefined
  }

  const searchParams: Record<string, number | string> = {}

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams[key] = value
    }
  })

  return searchParams
}

function createOrderListResult(
  response: ApiResponse<Order[]>,
  params?: OrderQueryParams | void,
): OrderListResult {
  const data = response.data ?? []
  const page = (params && params.page) ?? 1
  const limit = (params && params.limit) ?? data.length
  const total = response.meta?.total ?? data.length
  const totalPage =
    response.meta?.totalPage ?? Math.max(1, Math.ceil(total / (limit || 1)))

  return {
    data,
    meta: {
      limit: response.meta?.limit ?? limit,
      page: response.meta?.page ?? page,
      total,
      totalPage,
    },
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function createOrderResult(
  response: ApiResponse<CreateOrderResult | Order>,
): CreateOrderResult | null {
  const data = response.data

  if (!data) {
    return null
  }

  if (isObject(data) && ('order' in data || 'payment' in data)) {
    return data as CreateOrderResult
  }

  return {
    order: data as Order,
    payment: null,
  }
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    cancelOrder: builder.mutation<Order | null, string>({
      invalidatesTags: ['Order', 'Dashboard', 'Product'],
      query: (id) => ({
        method: 'PATCH',
        url: `/orders/${id}/cancel`,
      }),
      transformResponse: (response: ApiResponse<Order>) =>
        response.data ?? null,
    }),
    createOrder: builder.mutation<CreateOrderResult | null, CreateOrderPayload>({
      invalidatesTags: ['Order', 'Dashboard', 'Product'],
      query: (body) => ({
        body,
        method: 'POST',
        url: '/orders/create-order',
      }),
      transformResponse: (response: ApiResponse<CreateOrderResult | Order>) =>
        createOrderResult(response),
    }),
    deleteOrder: builder.mutation<ApiResponse<null>, string>({
      invalidatesTags: ['Order', 'Dashboard'],
      query: (id) => ({
        method: 'DELETE',
        url: `/orders/${id}`,
      }),
    }),
    getAllOrders: builder.query<OrderListResult, OrderQueryParams | void>({
      providesTags: ['Order'],
      query: (params) => ({
        params: createOrderParams(params ?? undefined),
        url: '/orders',
      }),
      transformResponse: (response: ApiResponse<Order[]>, _meta, params) =>
        createOrderListResult(response, params ?? undefined),
    }),
    getMyOrders: builder.query<OrderListResult, OrderQueryParams | void>({
      providesTags: ['Order'],
      query: (params) => ({
        params: createOrderParams(params ?? undefined),
        url: '/orders/my-orders',
      }),
      transformResponse: (response: ApiResponse<Order[]>, _meta, params) =>
        createOrderListResult(response, params ?? undefined),
    }),
    getOrderById: builder.query<Order | null, string>({
      providesTags: (_result, _error, id) => [{ id, type: 'Order' }],
      query: (id) => `/orders/${id}`,
      transformResponse: (response: ApiResponse<Order>) =>
        response.data ?? null,
    }),
    updateOrderStatus: builder.mutation<Order | null, UpdateOrderStatusPayload>(
      {
        invalidatesTags: (_result, _error, { id }) => [
          'Order',
          'Dashboard',
          { id, type: 'Order' },
        ],
        query: ({ id, ...body }) => ({
          body,
          method: 'PATCH',
          url: `/orders/${id}/status`,
        }),
        transformResponse: (response: ApiResponse<Order>) =>
          response.data ?? null,
      },
    ),
  }),
})

export const {
  useCancelOrderMutation,
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = orderApi
