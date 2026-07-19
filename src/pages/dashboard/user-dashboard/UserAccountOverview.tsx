import type { UserDashboardStats } from '../../../features/dashboard/dashboardApi'
import type { Order } from '../../../features/orders/orderApi'
import UserOrdersSection from './UserOrdersSection'
import UserSidebar from './UserSidebar'

type UserAccountOverviewProps = {
  orders: Order[]
  stats: UserDashboardStats | null
}

function UserAccountOverview({ orders, stats }: UserAccountOverviewProps) {
  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
      <UserOrdersSection orders={orders} stats={stats} />
      <UserSidebar />
    </section>
  )
}

export default UserAccountOverview
