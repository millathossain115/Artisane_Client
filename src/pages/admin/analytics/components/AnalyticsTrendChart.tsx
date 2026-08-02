import type { AnalyticsTrendPoint } from '../../../../features/analytics/analyticsApi'
import { chartColors, formatCurrency } from '../adminAnalyticsUtils'

type AnalyticsTrendChartProps = {
  rows: AnalyticsTrendPoint[]
}

function AnalyticsTrendChart({ rows }: AnalyticsTrendChartProps) {
  const maxRevenue = Math.max(1, ...rows.map((row) => row.revenue))

  if (!rows.length) {
    return (
      <p className="py-8 text-sm font-semibold text-[#6b5f53]">
        No sales trend data found.
      </p>
    )
  }

  return (
    <div className="relative h-64 overflow-hidden border border-black/10 bg-[#f8fafc] px-3 pb-4 pt-5">
      <div
        className="pointer-events-none absolute inset-x-3 top-1/4 border-t"
        style={{ borderColor: chartColors.grid }}
      />
      <div
        className="pointer-events-none absolute inset-x-3 top-1/2 border-t"
        style={{ borderColor: chartColors.grid }}
      />
      <div
        className="pointer-events-none absolute inset-x-3 top-3/4 border-t"
        style={{ borderColor: chartColors.grid }}
      />
      <div className="relative flex h-full items-end gap-1.5">
        {rows.slice(-30).map((row) => (
          <div
            className="flex h-full min-w-4 flex-1 flex-col items-center gap-2"
            key={row.period}
          >
            <div className="flex h-full w-full items-end gap-1">
              <div
                className="w-full"
                style={{
                  backgroundColor: chartColors.revenue,
                  height: `${Math.max(4, (row.revenue / maxRevenue) * 100)}%`,
                }}
                title={`${row.period}: ${formatCurrency(row.revenue)}`}
              />
              <div
                className="w-full"
                style={{
                  backgroundColor: chartColors.paidRevenue,
                  height: `${Math.max(4, (row.paidRevenue / maxRevenue) * 100)}%`,
                }}
                title={`${row.period}: paid ${formatCurrency(row.paidRevenue)}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnalyticsTrendChart
