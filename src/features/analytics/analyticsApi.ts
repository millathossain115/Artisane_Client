import { baseApi } from '../../redux/api/baseApi'

type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
}

export type AnalyticsNamedCount = {
  count: number
  label: string
}

export type AnalyticsTrendPoint = {
  averageOrderValue: number
  orders: number
  paidRevenue: number
  period: string
  revenue: number
}

export type AdminAnalyticsFilters = {
  category?: string
  courierProvider?: string
  dateFrom?: string
  dateTo?: string
  orderStatus?: string
  paymentMethod?: string
  paymentStatus?: string
}

export type AdminAnalytics = {
  activity: {
    adminActions: number
    failedLogins: number
    mostActiveAdmins: { count: number; email?: string; name?: string }[]
    warningOrFailedEvents: number
  }
  customers: {
    highestSpend: { email?: string; name?: string; orders: number; spend: number }[]
    mostOrders: { email?: string; name?: string; orders: number; spend: number }[]
    newCustomers: number
    repeatCustomers: number
    totalActiveCustomers: number
    trend: AnalyticsNamedCount[]
  }
  kpis: {
    averageOrderValue: number
    conversionProxy: number
    failedOrRefundedPayments: number
    newCustomers: number
    paidRevenue: number
    repeatCustomers: number
    totalOrders: number
    totalRevenue: number
  }
  orders: {
    cancellationRate: number
    fulfillmentBacklog: number
    statusSummary: AnalyticsNamedCount[]
  }
  payments: {
    failedTrend: AnalyticsNamedCount[]
    methodSummary: AnalyticsNamedCount[]
    statusSummary: AnalyticsNamedCount[]
    successRate: number
  }
  products: {
    lowStock: { category?: string; name: string; stock: number }[]
    outOfStock: number
    slowMoving: { name: string; soldQuantity: number }[]
    topCategories: { name: string; revenue: number; soldQuantity: number }[]
    topProducts: { name: string; revenue: number; soldQuantity: number }[]
  }
  reviews: {
    averageRating: number
    hiddenReviews: number
    negativeReviews: { comment?: string; product?: string; rating: number; user?: string }[]
    ratingSummary: AnalyticsNamedCount[]
  }
  sales: {
    trend: AnalyticsTrendPoint[]
  }
  shipping: {
    courierStatusSummary: AnalyticsNamedCount[]
    delivered: number
    shipped: number
    shipmentsCreated: number
    syncWarnings: number
  }
}

function createAnalyticsParams(params?: AdminAnalyticsFilters) {
  if (!params) return undefined

  const searchParams: Record<string, string> = {}

  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams[key] = value
  })

  return searchParams
}

const emptyAnalytics: AdminAnalytics = {
  activity: {
    adminActions: 0,
    failedLogins: 0,
    mostActiveAdmins: [],
    warningOrFailedEvents: 0,
  },
  customers: {
    highestSpend: [],
    mostOrders: [],
    newCustomers: 0,
    repeatCustomers: 0,
    totalActiveCustomers: 0,
    trend: [],
  },
  kpis: {
    averageOrderValue: 0,
    conversionProxy: 0,
    failedOrRefundedPayments: 0,
    newCustomers: 0,
    paidRevenue: 0,
    repeatCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  },
  orders: {
    cancellationRate: 0,
    fulfillmentBacklog: 0,
    statusSummary: [],
  },
  payments: {
    failedTrend: [],
    methodSummary: [],
    statusSummary: [],
    successRate: 0,
  },
  products: {
    lowStock: [],
    outOfStock: 0,
    slowMoving: [],
    topCategories: [],
    topProducts: [],
  },
  reviews: {
    averageRating: 0,
    hiddenReviews: 0,
    negativeReviews: [],
    ratingSummary: [],
  },
  sales: {
    trend: [],
  },
  shipping: {
    courierStatusSummary: [],
    delivered: 0,
    shipped: 0,
    shipmentsCreated: 0,
    syncWarnings: 0,
  },
}

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAnalytics: builder.query<AdminAnalytics, AdminAnalyticsFilters | void>({
      providesTags: ['Analytics'],
      query: (params) => ({
        params: createAnalyticsParams(params ?? undefined),
        url: '/analytics/admin',
      }),
      transformResponse: (response: ApiResponse<AdminAnalytics>) =>
        response.data ?? emptyAnalytics,
    }),
  }),
})

export const { useGetAdminAnalyticsQuery } = analyticsApi
