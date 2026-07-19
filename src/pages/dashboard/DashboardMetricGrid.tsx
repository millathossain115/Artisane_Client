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
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon

        return (
          <article
            className="border border-black/10 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(24,21,18,0.08)]"
            key={metric.label}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-[#6b5f53]">
                {metric.label}
              </span>
              <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-5 text-3xl font-bold">{metric.value}</p>
            <p className="mt-2 text-sm text-[#6b5f53]">{metric.detail}</p>
          </article>
        )
      })}
    </section>
  )
}

export default DashboardMetricGrid
