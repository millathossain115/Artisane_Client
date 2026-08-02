import type { AnalyticsNamedCount } from '../../../../features/analytics/analyticsApi'
import { formatCount } from '../../../dashboard/dashboardFormat'
import {
  chartColors,
  formatLabel,
  getMaxValue,
} from '../adminAnalyticsUtils'

type AnalyticsMiniBarListProps = {
  emptyText: string
  rows: AnalyticsNamedCount[]
  valueLabel?: (row: AnalyticsNamedCount) => string
}

function AnalyticsMiniBarList({
  emptyText,
  rows,
  valueLabel,
}: AnalyticsMiniBarListProps) {
  const maxValue = getMaxValue(rows)

  if (!rows.length) {
    return (
      <p className="py-8 text-sm font-semibold text-[#6b5f53]">{emptyText}</p>
    )
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
            <span className="min-w-0 truncate font-bold">
              {formatLabel(row.label)}
            </span>
            <span className="shrink-0 text-xs font-bold text-[#6b5f53]">
              {valueLabel ? valueLabel(row) : formatCount(row.count)}
            </span>
          </div>
          <div
            className="h-2"
            style={{ backgroundColor: chartColors.track }}
          >
            <div
              className="h-2"
              style={{
                backgroundColor: chartColors.revenue,
                width: `${Math.max(5, (row.count / maxValue) * 100)}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnalyticsMiniBarList
