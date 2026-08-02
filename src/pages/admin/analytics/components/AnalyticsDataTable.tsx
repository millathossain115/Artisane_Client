import { formatCount } from '../../../dashboard/dashboardFormat'
import {
  formatCurrency,
  truncateText,
  type AnalyticsTableRow,
} from '../adminAnalyticsUtils'

type AnalyticsDataTableProps = {
  emptyText: string
  rows: AnalyticsTableRow[]
  valueKind?: 'count' | 'currency'
}

function AnalyticsDataTable({
  emptyText,
  rows,
  valueKind = 'currency',
}: AnalyticsDataTableProps) {
  if (!rows.length) {
    return (
      <p className="py-8 text-sm font-semibold text-[#6b5f53]">{emptyText}</p>
    )
  }

  return (
    <div className="overflow-hidden">
      <table className="w-full table-fixed text-left text-sm">
        <colgroup>
          <col className="w-[58%]" />
          <col />
        </colgroup>
        <tbody>
          {rows.map((row) => (
            <tr
              className="border-b border-black/10 last:border-b-0"
              key={row.label}
            >
              <td className="py-3 pr-2 align-top">
                <p
                  className="min-w-0 truncate font-bold"
                  title={row.label}
                >
                  {truncateText(row.label, 32)}
                </p>
                {row.detail ? (
                  <p
                    className="mt-1 min-w-0 truncate text-xs text-[#6b5f53]"
                    title={row.detail}
                  >
                    {truncateText(row.detail, 34)}
                  </p>
                ) : null}
              </td>
              <td className="py-3 pl-2 text-right align-top">
                <div className="flex flex-col items-end gap-0.5">
                  <span className="whitespace-nowrap font-bold">
                    {valueKind === 'currency'
                      ? formatCurrency(row.metric)
                      : formatCount(row.metric)}
                  </span>
                  {row.secondary !== undefined ? (
                    <span className="whitespace-nowrap text-[11px] font-semibold text-[#6b5f53]">
                      {formatCount(row.secondary)} sold
                    </span>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AnalyticsDataTable
