import { X } from 'lucide-react'

import type { ActivityLog } from '../../../../features/activityLogs/activityLogApi'
import { formatOrderDate } from '../../../../utils/orderDisplay'
import {
  formatLabel,
  formatValue,
  getActionLabel,
  getActorName,
  getDeviceLabel,
  getFieldLabel,
  getResultLabel,
  getTargetLabel,
  getVisibleChanges,
  normalizeIpAddress,
} from '../activityLogUtils'

type ActivityLogDetailModalProps = {
  log: ActivityLog
  onClose: () => void
}

function ActivityLogDetailModal({ log, onClose }: ActivityLogDetailModalProps) {
  const visibleChanges = getVisibleChanges(log)

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close activity detail"
        className="absolute inset-0 bg-[#181512]/55"
        onClick={onClose}
        type="button"
      />
      <section className="absolute right-0 top-0 flex h-full w-[min(42rem,94vw)] flex-col bg-white text-[#181512] shadow-[0_0_60px_rgba(24,21,18,0.24)]">
        <div className="flex items-start justify-between gap-4 border-b border-black/10 p-5">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7a3f1d]">
              {formatLabel(log.module)} audit event
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              {getActionLabel(log.action)}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6b5f53]">
              {log.summary}
            </p>
          </div>
          <button
            aria-label="Close activity detail"
            className="grid h-10 w-10 shrink-0 place-items-center border border-black/10 transition hover:border-[#181512]"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="dashboard-sidebar-scroll flex-1 overflow-y-auto p-5">
          <dl className="divide-y divide-black/10 border-y border-black/10">
            {[
              ['Time', formatOrderDate(log.createdAt)],
              ['Person', getActorName(log)],
              ['Role', formatLabel(log.actorRole)],
              ['Source', formatLabel(log.source)],
              ['Area', formatLabel(log.module)],
              ['Target', getTargetLabel(log)],
              ['IP address', normalizeIpAddress(log.ipAddress)],
              ['Device', getDeviceLabel(log)],
              ['Result', getResultLabel(log.status)],
            ].map(([label, value]) => (
              <div
                className="grid gap-1 px-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4"
                key={label}
              >
                <dt className="text-xs font-bold uppercase tracking-wider text-[#7a3f1d]">
                  {label}
                </dt>
                <dd className="break-words text-sm font-bold">{value}</dd>
              </div>
            ))}
          </dl>

          <section className="mt-5">
            <h3 className="text-lg font-bold">Changed fields</h3>
            {!visibleChanges.length ? (
              <p className="mt-2 border border-black/10 bg-[#f8f3ea] p-4 text-sm font-semibold text-[#6b5f53]">
                No changed fields were captured for this event.
              </p>
            ) : (
              <div className="mt-3 divide-y divide-black/10 border border-black/10">
                {visibleChanges.map((change) => (
                  <article
                    className="grid gap-3 p-4 sm:grid-cols-[9rem_minmax(0,1fr)]"
                    key={change.field}
                  >
                    <h4 className="text-sm font-bold">
                      {getFieldLabel(change.field)}
                    </h4>
                    <div className="grid gap-3 lg:grid-cols-2">
                      {[
                        ['Before', change.before, 'text-[#6b5f53]'],
                        ['After', change.after, 'text-[#181512]'],
                      ].map(([label, value, colorClass]) => (
                        <div className="min-w-0" key={label as string}>
                          <p className="text-xs font-bold uppercase tracking-wider text-[#7a3f1d]">
                            {label as string}
                          </p>
                          <pre
                            className={`mt-2 max-h-36 overflow-auto whitespace-pre-wrap break-words bg-[#f8f3ea] p-3 text-xs leading-5 ${colorClass as string}`}
                          >
                            {formatValue(value)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <details className="mt-5 border border-black/10">
            <summary className="cursor-pointer bg-[#f8f3ea] px-4 py-3 text-sm font-bold">
              Technical details
            </summary>
            <pre className="max-h-72 overflow-auto bg-[#181512] p-4 text-xs leading-5 text-white">
              {formatValue({
                metadata: log.metadata ?? {},
                userAgent: log.userAgent || 'Not captured',
              })}
            </pre>
          </details>
        </div>
      </section>
    </div>
  )
}

export default ActivityLogDetailModal
