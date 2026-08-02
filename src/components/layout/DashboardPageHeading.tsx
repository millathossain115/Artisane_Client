import { Link } from 'react-router-dom'

import type { DashboardAction } from './dashboardLayoutTypes'

type DashboardPageHeadingProps = {
  actions: DashboardAction[]
  eyebrow: string
  subtitle: string
  title: string
}

function DashboardPageHeading({
  actions,
  eyebrow,
  subtitle,
  title,
}: DashboardPageHeadingProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end">
      <div>
        <p className="text-sm font-semibold text-[#7a3f1d]">{eyebrow}</p>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b5f53]">
          {subtitle}
        </p>
      </div>

      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => {
            const className =
              action.variant === 'primary' ? 'btn-primary' : 'btn-secondary'

            return action.to ? (
              <Link className={className} key={action.label} to={action.to}>
                {action.label}
              </Link>
            ) : (
              <button className={className} key={action.label} type="button">
                {action.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DashboardPageHeading
