import { Activity, AlertTriangle, Clock, ShieldCheck } from 'lucide-react'

import type { ActivityLogStats } from '../../../../features/activityLogs/activityLogApi'

type ActivityLogStatsGridProps = {
  isStatsLoading: boolean
  stats?: ActivityLogStats
}

function ActivityLogStatsGrid({
  isStatsLoading,
  stats,
}: ActivityLogStatsGridProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
      {[
        {
          icon: Activity,
          label: 'Total events',
          value: stats?.totalLogs ?? 0,
        },
        {
          icon: Clock,
          label: 'Today',
          value: stats?.todayLogs ?? 0,
        },
        {
          icon: ShieldCheck,
          label: 'User events',
          value: stats?.userLogs ?? 0,
        },
        {
          icon: AlertTriangle,
          label: 'Warnings / failed',
          value: `${stats?.warningLogs ?? 0} / ${stats?.failedLogs ?? 0}`,
        },
      ].map((kpi) => {
        const Icon = kpi.icon

        return (
          <div className="border border-black/10 bg-white p-5" key={kpi.label}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">
                {kpi.label}
              </p>
              <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                <Icon className="h-5 w-5" />
              </span>
            </div>
            {isStatsLoading ? (
              <div className="mt-4 h-8 w-20 animate-pulse bg-[#f1dfc8]" />
            ) : (
              <p className="mt-4 truncate text-3xl font-bold" title={String(kpi.value)}>
                {kpi.value}
              </p>
            )}
          </div>
        )
      })}
    </section>
  )
}

export default ActivityLogStatsGrid
