import { useState } from 'react'
import { ChevronLeft, ChevronRight, Database, RefreshCw } from 'lucide-react'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
  type ActivityActorRole,
  type ActivityLog,
  type ActivityModule,
  type ActivitySource,
  type ActivityStatus,
  useGetActivityLogsQuery,
  useGetActivityLogStatsQuery,
} from '../../../features/activityLogs/activityLogApi'
import { adminNavItems } from '../adminNavItems'
import { pageSize } from './activityLogUtils'
import ActivityLogDetailModal from './components/ActivityLogDetailModal'
import ActivityLogFilters from './components/ActivityLogFilters'
import ActivityLogList from './components/ActivityLogList'
import ActivityLogStatsGrid from './components/ActivityLogStatsGrid'

function ManageActivityLogs() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [moduleFilter, setModuleFilter] = useState<ActivityModule | ''>('')
  const [roleFilter, setRoleFilter] = useState<ActivityActorRole | ''>('')
  const [sourceFilter, setSourceFilter] = useState<ActivitySource | ''>('')
  const [statusFilter, setStatusFilter] = useState<ActivityStatus | ''>('')
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)

  const {
    data: logsResponse,
    isError,
    isFetching,
    isLoading,
    refetch: refetchLogs,
  } = useGetActivityLogsQuery(
    {
      actorRole: roleFilter || undefined,
      limit: pageSize,
      module: moduleFilter || undefined,
      page,
      searchTerm: searchTerm.trim() || undefined,
      source: sourceFilter || undefined,
      status: statusFilter || undefined,
    },
    { refetchOnMountOrArgChange: true },
  )
  const {
    data: stats,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useGetActivityLogStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const logs = logsResponse?.data ?? []
  const meta = logsResponse?.meta
  const totalPages = Math.max(1, meta?.totalPage ?? 1)

  function resetFilters() {
    setSearchTerm('')
    setModuleFilter('')
    setRoleFilter('')
    setSourceFilter('')
    setStatusFilter('')
    setPage(1)
  }

  async function handleRefresh() {
    await Promise.all([refetchLogs(), refetchStats()])
  }

  return (
    <DashboardLayout
      eyebrow="Audit trail"
      helperText="Review admin, user, and system events with actor, device, IP, and changed-field context."
      sidebarItems={adminNavItems}
      subtitle="Monitor important sitewide actions across orders, payments, users, catalog, content, shipping, and reviews."
      title="Activity logs"
      workspaceLabel="Marketplace studio"
    >
      <div className="space-y-5">
        <ActivityLogStatsGrid isStatsLoading={isStatsLoading} stats={stats} />

        <section className="border border-black/10 bg-white">
          <div className="flex flex-col gap-3 border-b border-black/10 px-4 py-3.5 sm:px-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                <Database className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-xl font-bold">Sitewide audit trail</h2>
                <p className="mt-0.5 text-xs font-semibold text-[#6b5f53]">
                  {meta?.total ?? logs.length} events found.
                </p>
              </div>
            </div>

            <button
              className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-black/10 bg-white px-3 text-xs font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea] disabled:cursor-wait disabled:opacity-60"
              disabled={isFetching}
              onClick={() => void handleRefresh()}
              type="button"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`}
              />
              Refresh
            </button>
          </div>

          <ActivityLogFilters
            moduleFilter={moduleFilter}
            onModuleFilterChange={(value) => {
              setModuleFilter(value)
              setPage(1)
            }}
            onResetFilters={resetFilters}
            onRoleFilterChange={(value) => {
              setRoleFilter(value)
              setPage(1)
            }}
            onSearchTermChange={(value) => {
              setSearchTerm(value)
              setPage(1)
            }}
            onSourceFilterChange={(value) => {
              setSourceFilter(value)
              setPage(1)
            }}
            onStatusFilterChange={(value) => {
              setStatusFilter(value)
              setPage(1)
            }}
            roleFilter={roleFilter}
            searchTerm={searchTerm}
            sourceFilter={sourceFilter}
            statusFilter={statusFilter}
          />

          <ActivityLogList
            isError={isError}
            isLoading={isLoading}
            logs={logs}
            onRefresh={() => void handleRefresh()}
            onResetFilters={resetFilters}
            onSelectLog={setSelectedLog}
          />

          <div className="flex flex-col gap-2 border-t border-black/10 px-4 py-3 md:flex-row md:items-center md:justify-between">
            <p className="text-xs font-semibold text-[#6b5f53]">
              Page {meta?.page ?? page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                className="inline-flex h-8 w-8 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                className="inline-flex h-8 w-8 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {selectedLog ? (
        <ActivityLogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      ) : null}
    </DashboardLayout>
  )
}

export default ManageActivityLogs
