import type { LucideIcon } from 'lucide-react'

type UserStatsCardsProps = {
  isLoading: boolean
  kpis: {
    icon: LucideIcon
    label: string
    value: number
  }[]
}

function UserStatsCards({ isLoading, kpis }: UserStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((item) => {
        const Icon = item.icon

        return (
          <div className="border border-black/10 bg-white p-5" key={item.label}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-[#6b5f53]">
                {item.label}
              </span>
              <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-4xl font-bold">
              {isLoading ? '...' : item.value}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default UserStatsCards
