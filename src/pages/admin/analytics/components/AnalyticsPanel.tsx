import type { ReactNode } from 'react'

type AnalyticsPanelProps = {
  children: ReactNode
  title: string
}

function AnalyticsPanel({ children, title }: AnalyticsPanelProps) {
  return (
    <section className="overflow-hidden border border-black/10 bg-white shadow-sm">
      <div className="border-b border-black/10 px-4 py-3.5 sm:px-5">
        <h2 className="text-lg font-bold sm:text-xl">{title}</h2>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  )
}

export default AnalyticsPanel
