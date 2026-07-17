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
  }),
})

export const { useGetAdminStatsQuery } = dashboardApi
