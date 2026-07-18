import { baseApi } from '../../redux/api/baseApi'

type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
  errorSources?: { path: string; message: string }[]
}

export type AdminDashboardStats = Record<string, unknown> & {
  revenue?: number | string
  totalRevenue?: number | string
  monthlyRevenue?: number | string
  totalSales?: number | string
  revenueGrowth?: number | string
  monthlyGrowth?: number | string
  orders?: number | string
  totalOrders?: number | string
  pendingOrders?: number | string
  awaitingFulfillment?: number | string
  products?: number | string
  totalProducts?: number | string
  activeProducts?: number | string
  lowStockProducts?: number | string
  customers?: number | string
  users?: number | string
  totalCustomers?: number | string
  totalUsers?: number | string
  newCustomersThisWeek?: number | string
  newUsersThisWeek?: number | string
}

export type DashboardOrder = {
  _id: string
  items?: {
    productName?: string
    quantity?: number
    subtotal?: number
  }[]
  totalPrice?: number
  orderStatus?: string
  paymentStatus?: string
  createdAt?: string
}

export type DashboardReview = {
  _id: string
  rating?: number
  comment?: string
  createdAt?: string
  product?: {
    name?: string
    slug?: string
  }
}

export type UserDashboardStats = {
  totalOrders: number
  activeOrders: number
  deliveredOrders: number
  cancelledOrders: number
  totalOrderValue: number
  totalReviews: number
  averageRating: number
  orderStatusSummary: { _id: string; count: number }[]
  recentOrders: DashboardOrder[]
  recentReviews: DashboardReview[]
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<AdminDashboardStats | null, void>({
      providesTags: ['Dashboard'],
      query: () => ({
        method: 'GET',
        url: '/dashboard/admin-stats',
      }),
      transformResponse: (response: ApiResponse<AdminDashboardStats>) =>
        response.data ?? null,
    }),
    getUserStats: builder.query<UserDashboardStats | null, void>({
      providesTags: ['Dashboard'],
      query: () => ({
        method: 'GET',
        url: '/dashboard/my-stats',
      }),
      transformResponse: (response: ApiResponse<UserDashboardStats>) =>
        response.data ?? null,
    }),
  }),
})

export const { useGetAdminStatsQuery, useGetUserStatsQuery } = dashboardApi
