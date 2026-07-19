import type { UserDashboardStats } from '../../../features/dashboard/dashboardApi'
import UserOrdersSection from './UserOrdersSection'
import UserSidebar from './UserSidebar'

type UserAccountOverviewProps = {
  stats: UserDashboardStats | null
}

function UserAccountOverview({ stats }: UserAccountOverviewProps) {
  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
      <UserOrdersSection stats={stats} />
      <UserSidebar />
    </section>
  )
}

export default UserAccountOverview
