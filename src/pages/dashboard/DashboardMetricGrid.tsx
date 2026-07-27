import type { LucideIcon } from 'lucide-react'

export type DashboardMetric = {
  detail: string
  icon: LucideIcon
  label: string
  value: string
}

type DashboardMetricGridProps = {
  metrics: DashboardMetric[]
}

function DashboardMetricGrid({ metrics }: DashboardMetricGridProps) {
  const desktopGridClass =
    metrics.length === 5 ? 'xl:grid-cols-5' : 'xl:grid-cols-4'

  return (
    <section className={`grid gap-4 md:grid-cols-2 ${desktopGridClass}`}>
      {metrics.map((metric) => {
        const Icon = metric.icon

        return (
          <article
            className="border border-black/10 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(24,21,18,0.08)]"
            key={metric.label}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-[#6b5f53]">
                {metric.label}
              </span>
              <span className="grid h-8 w-8 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold">{metric.value}</p>
            <p className="mt-1 text-xs font-semibold text-[#6b5f53]">
              {metric.detail}
            </p>
          </article>
        )
      })}
    </section>
  )
}

export default DashboardMetricGrid
