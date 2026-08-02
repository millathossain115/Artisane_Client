import {
  AlertTriangle,
  BarChart3,
  CreditCard,
  PackageCheck,
  ShoppingBag,
  UsersRound,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

import type { AdminAnalytics } from '../../../../features/analytics/analyticsApi'
import { formatCount } from '../../../dashboard/dashboardFormat'
import { formatCurrency } from '../adminAnalyticsUtils'

type AnalyticsSummaryCardsProps = {
  kpis?: AdminAnalytics['kpis']
}

function AnalyticsSummaryCards({ kpis }: AnalyticsSummaryCardsProps) {
  const cards: Array<[string, string, LucideIcon]> = [
    ['Total revenue', formatCurrency(kpis?.totalRevenue), Wallet],
    ['Paid revenue', formatCurrency(kpis?.paidRevenue), CreditCard],
    ['Orders', formatCount(kpis?.totalOrders), ShoppingBag],
    ['Avg. order value', formatCurrency(kpis?.averageOrderValue), BarChart3],
    ['Payment success', `${kpis?.conversionProxy ?? 0}%`, PackageCheck],
    ['New customers', formatCount(kpis?.newCustomers), UsersRound],
    ['Repeat customers', formatCount(kpis?.repeatCustomers), UsersRound],
    [
      'Failed / refunded',
      formatCount(kpis?.failedOrRefundedPayments),
      AlertTriangle,
    ],
  ]

  return (
    <section className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
      {cards.map(([label, value, Icon]) => (
        <div
          className="border border-black/10 bg-white p-5"
          key={label}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">
              {label}
            </p>
            <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
              <Icon className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-4 text-2xl font-bold">{value}</p>
        </div>
      ))}
    </section>
  )
}

export default AnalyticsSummaryCards
