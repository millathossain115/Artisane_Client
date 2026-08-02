import { Eye, Filter, Laptop, ShieldCheck } from 'lucide-react'

import {
  EmptyState,
  ErrorState,
  SkeletonTable,
} from '../../../../components/loaders'
import type { ActivityLog } from '../../../../features/activityLogs/activityLogApi'
import { formatOrderDate } from '../../../../utils/orderDisplay'
import {
  formatLabel,
  getActionLabel,
  getActorName,
  getDeviceLabel,
  getResultLabel,
  getStatusClass,
  getTargetLabel,
  normalizeIpAddress,
  truncateText,
} from '../activityLogUtils'

type ActivityLogListProps = {
  isError: boolean
  isLoading: boolean
  logs: ActivityLog[]
  onRefresh: () => void
  onResetFilters: () => void
  onSelectLog: (log: ActivityLog) => void
}

function ActivityLogList({
  isError,
  isLoading,
  logs,
  onRefresh,
  onResetFilters,
  onSelectLog,
}: ActivityLogListProps) {
  if (isError) {
    return (
      <ErrorState
        className="mx-5"
        message="Activity log data could not be loaded."
        onRetry={onRefresh}
        title="Could not load activity logs"
      />
    )
  }

  if (isLoading) {
    return (
      <div className="p-5">
        <SkeletonTable cols={9} rows={7} />
      </div>
    )
  }

  if (!logs.length) {
    return (
      <EmptyState
        action={
          <button className="btn-secondary" onClick={onResetFilters} type="button">
            Reset Filters
          </button>
        }
        icon={<Filter className="h-7 w-7" />}
        message="No audit events match the current filters."
        title="No activity logs found"
      />
    )
  }

  return (
    <div className="divide-y divide-black/10">
      {logs.map((log) => {
        const actorName = getActorName(log)
        const actorEmail = log.actorEmail || 'No email'
        const actionLabel = getActionLabel(log.action)
        const targetLabel = getTargetLabel(log)
        const deviceLabel = getDeviceLabel(log)
        const ipAddress = normalizeIpAddress(log.ipAddress)

        return (
          <article
            className="grid gap-4 px-4 py-4 transition hover:bg-[#f8f3ea] md:grid-cols-[9rem_minmax(0,1fr)] md:px-5 lg:grid-cols-[9rem_minmax(0,1fr)_13rem_2.75rem] lg:items-center 2xl:grid-cols-[10rem_minmax(0,1fr)_15rem_2.75rem]"
            key={log._id}
          >
            <div className="flex min-w-0 items-center justify-between gap-3 md:block">
              <p className="text-xs font-bold text-[#6b5f53]">
                {formatOrderDate(log.createdAt)}
              </p>
              <span
                className={`inline-flex max-w-full shrink-0 items-center gap-1.5 px-2 py-1 text-xs font-bold md:mt-3 ${getStatusClass(
                  log.status,
                )}`}
              >
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{getResultLabel(log.status)}</span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <h3
                    className="truncate text-sm font-bold text-[#181512]"
                    title={actionLabel}
                  >
                    {actionLabel}
                  </h3>
                  <p
                    className="mt-1 line-clamp-2 text-sm text-[#6b5f53] lg:line-clamp-1"
                    title={log.summary}
                  >
                    {log.summary}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-[17rem] lg:justify-end">
                  <span
                    className="max-w-full truncate bg-[#f1dfc8] px-2 py-1 text-xs font-bold text-[#7a3f1d]"
                    title={formatLabel(log.module)}
                  >
                    {truncateText(formatLabel(log.module), 18)}
                  </span>
                  <span
                    className="max-w-full truncate bg-white px-2 py-1 text-xs font-bold text-[#181512]"
                    title={formatLabel(log.actorRole)}
                  >
                    {truncateText(formatLabel(log.actorRole), 16)}
                  </span>
                </div>
              </div>

              <div className="mt-3 grid gap-2 border-t border-black/10 pt-3 text-xs text-[#6b5f53] sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div className="min-w-0">
                  <p
                    className="truncate font-bold text-[#181512]"
                    title={actorName}
                  >
                    {actorName}
                  </p>
                  <p className="truncate" title={actorEmail}>
                    {actorEmail}
                  </p>
                </div>

                <div className="min-w-0 sm:text-right lg:text-left">
                  <p
                    className="truncate font-bold text-[#181512]"
                    title={targetLabel}
                  >
                    {targetLabel}
                  </p>
                  <p className="truncate">{formatLabel(log.targetType)}</p>
                </div>
              </div>
            </div>

            <div className="grid min-w-0 gap-1 text-xs font-semibold text-[#6b5f53] md:col-start-2 lg:col-start-auto">
              <span
                className="inline-flex min-w-0 items-center gap-1.5"
                title={deviceLabel}
              >
                <Laptop className="h-3.5 w-3.5 shrink-0 text-[#7a3f1d]" />
                <span className="truncate">{deviceLabel}</span>
              </span>
              <span className="truncate font-mono" title={ipAddress}>
                {ipAddress}
              </span>
            </div>

            <button
              aria-label={`View activity ${log.action}`}
              className="inline-grid h-10 w-full place-items-center border border-black/10 transition hover:border-[#181512] hover:bg-white md:col-start-2 md:w-10 lg:col-start-auto"
              onClick={() => onSelectLog(log)}
              type="button"
            >
              <Eye className="h-4 w-4" />
            </button>
          </article>
        )
      })}
    </div>
  )
}

export default ActivityLogList
