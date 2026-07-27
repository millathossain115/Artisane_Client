import { baseApi } from '../../redux/api/baseApi'

type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
  meta?: ActivityLogListMeta
  errorSources?: { path: string; message: string }[]
}

export type ActivityActorRole = 'admin' | 'system' | 'user'
export type ActivitySource =
  | 'admin'
  | 'courier_webhook'
  | 'payment_gateway'
  | 'scheduler'
  | 'system'
  | 'user'
export type ActivityModule =
  | 'auth'
  | 'categories'
  | 'home_content'
  | 'orders'
  | 'payments'
  | 'products'
  | 'promo'
  | 'reviews'
  | 'shipping'
  | 'users'
  | 'wishlist'
export type ActivityStatus = 'failed' | 'success' | 'warning'
export type ActivitySeverity = 'high' | 'low' | 'medium'
export type ActivityDeviceType = 'desktop' | 'mobile' | 'tablet' | 'unknown'

export type ActivityLogChange = {
  after?: unknown
  before?: unknown
  field: string
}

export type ActivityLog = {
  _id: string
  actorEmail?: string
  actorId?: string
  actorName?: string
  actorRole: ActivityActorRole
  action: string
  browser?: string
  changes?: ActivityLogChange[]
  createdAt: string
  deviceType?: ActivityDeviceType
  ipAddress?: string
  metadata?: Record<string, unknown>
  module: ActivityModule
  os?: string
  severity: ActivitySeverity
  source: ActivitySource
  status: ActivityStatus
  summary: string
  targetId?: string
  targetLabel?: string
  targetType?: string
  updatedAt?: string
  userAgent?: string
}

export type ActivityLogListMeta = {
  limit: number
  page: number
  total: number
  totalPage: number
}

export type ActivityLogListResult = {
  data: ActivityLog[]
  meta: ActivityLogListMeta
}

export type ActivityLogStats = {
  adminLogs: number
  failedLogs: number
  moduleSummary?: { _id: ActivityModule; count: number }[]
  systemLogs: number
  todayLogs: number
  totalLogs: number
  userLogs: number
  warningLogs: number
}

export type ActivityLogQueryParams = {
  action?: string
  actorId?: string
  actorRole?: ActivityActorRole
  dateFrom?: string
  dateTo?: string
  limit?: number
  module?: ActivityModule
  page?: number
  searchTerm?: string
  severity?: ActivitySeverity
  sortOrder?: 'asc' | 'desc'
  source?: ActivitySource
  status?: ActivityStatus
  targetId?: string
  targetType?: string
}

function createActivityLogParams(params?: ActivityLogQueryParams | void) {
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

function createActivityLogListResult(
  response: ApiResponse<ActivityLog[]>,
  params?: ActivityLogQueryParams | void,
): ActivityLogListResult {
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

export const activityLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogById: builder.query<ActivityLog | null, string>({
      providesTags: (_result, _error, id) => [{ id, type: 'ActivityLog' }],
      query: (id) => `/activity-logs/${id}`,
      transformResponse: (response: ApiResponse<ActivityLog>) =>
        response.data ?? null,
    }),
    getActivityLogStats: builder.query<ActivityLogStats, void>({
      providesTags: ['ActivityLog'],
      query: () => '/activity-logs/stats',
      transformResponse: (response: ApiResponse<ActivityLogStats>) =>
        response.data ?? {
          adminLogs: 0,
          failedLogs: 0,
          systemLogs: 0,
          todayLogs: 0,
          totalLogs: 0,
          userLogs: 0,
          warningLogs: 0,
        },
    }),
    getActivityLogs: builder.query<
      ActivityLogListResult,
      ActivityLogQueryParams | void
    >({
      providesTags: (result) => [
        'ActivityLog',
        ...(result?.data.map((log) => ({
          id: log._id,
          type: 'ActivityLog' as const,
        })) ?? []),
      ],
      query: (params) => ({
        params: createActivityLogParams(params ?? undefined),
        url: '/activity-logs',
      }),
      transformResponse: (
        response: ApiResponse<ActivityLog[]>,
        _meta,
        params,
      ) => createActivityLogListResult(response, params ?? undefined),
    }),
  }),
})

export const {
  useGetActivityLogByIdQuery,
  useGetActivityLogStatsQuery,
  useGetActivityLogsQuery,
} = activityLogApi
