import { ShieldAlert, Star, Truck } from 'lucide-react'

import type { AdminAnalytics } from '../../../../features/analytics/analyticsApi'
import { chartColors } from '../adminAnalyticsUtils'
import AnalyticsDataTable from './AnalyticsDataTable'
import AnalyticsMiniBarList from './AnalyticsMiniBarList'
import AnalyticsPanel from './AnalyticsPanel'
import AnalyticsSummaryCards from './AnalyticsSummaryCards'
import AnalyticsTrendChart from './AnalyticsTrendChart'

type AnalyticsDashboardContentProps = {
  analytics: AdminAnalytics
}

function AnalyticsDashboardContent({ analytics }: AnalyticsDashboardContentProps) {
  const kpis = analytics.kpis
  const topProductRows = analytics.products.topProducts.map((product) => ({
    label: product.name,
    metric: product.revenue,
    secondary: product.soldQuantity,
  }))
  const topCustomerRows = analytics.customers.highestSpend.map((customer) => ({
    detail: customer.email || 'No email',
    label: customer.name || customer.email || 'Customer',
    metric: customer.spend,
    secondary: customer.orders,
  }))

  return (
    <>
      <AnalyticsSummaryCards kpis={kpis} />

      <section className="grid gap-4 2xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
        <AnalyticsPanel title="Sales trend">
          <div className="mb-3 flex flex-wrap gap-4 text-xs font-bold text-[#6b5f53]">
            <span className="inline-flex items-center gap-2">
              <span
                className="h-2 w-5"
                style={{ backgroundColor: chartColors.revenue }}
              />
              Total revenue
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="h-2 w-5"
                style={{ backgroundColor: chartColors.paidRevenue }}
              />
              Paid revenue
            </span>
          </div>
          <AnalyticsTrendChart rows={analytics.sales.trend} />
        </AnalyticsPanel>

        <AnalyticsPanel title="Order health">
          <AnalyticsMiniBarList
            emptyText="No order status data found."
            rows={analytics.orders.statusSummary}
          />
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-black/10 pt-4 text-sm">
            <p>
              <span className="block text-xs font-bold uppercase text-[#6b5f53]">
                Cancellation rate
              </span>
              <span className="text-xl font-bold">
                {analytics.orders.cancellationRate}%
              </span>
            </p>
            <p>
              <span className="block text-xs font-bold uppercase text-[#6b5f53]">
                Fulfillment backlog
              </span>
              <span className="text-xl font-bold">
                {analytics.orders.fulfillmentBacklog}
              </span>
            </p>
          </div>
        </AnalyticsPanel>
      </section>

      <section className="grid gap-4 2xl:grid-cols-3">
        <AnalyticsPanel title="Payment results">
          <AnalyticsMiniBarList
            emptyText="No payment result data found."
            rows={analytics.payments.statusSummary}
          />
          <p className="mt-4 border-t border-black/10 pt-4 text-sm font-bold">
            Success rate: {analytics.payments.successRate}%
          </p>
        </AnalyticsPanel>
        <AnalyticsPanel title="Payment methods">
          <AnalyticsMiniBarList
            emptyText="No payment method data found."
            rows={analytics.payments.methodSummary}
          />
        </AnalyticsPanel>
        <AnalyticsPanel title="Shipping">
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            {[
              ['Created', analytics.shipping.shipmentsCreated],
              ['Shipped', analytics.shipping.shipped],
              ['Delivered', analytics.shipping.delivered],
            ].map(([label, value]) => (
              <div className="bg-[#f8f3ea] p-3" key={label as string}>
                <Truck className="mx-auto h-4 w-4 text-[#7a3f1d]" />
                <p className="mt-2 text-lg font-bold">
                  {value as number}
                </p>
                <p className="text-xs font-bold text-[#6b5f53]">
                  {label as string}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <AnalyticsMiniBarList
              emptyText="No courier status data found."
              rows={analytics.shipping.courierStatusSummary}
            />
          </div>
        </AnalyticsPanel>
      </section>

      <section className="grid gap-4 2xl:grid-cols-2">
        <AnalyticsPanel title="Top products">
          <AnalyticsDataTable
            emptyText="No product sales found."
            rows={topProductRows}
          />
        </AnalyticsPanel>
        <AnalyticsPanel title="Top customers">
          <AnalyticsDataTable
            emptyText="No customer spend found."
            rows={topCustomerRows}
          />
        </AnalyticsPanel>
      </section>

      <section className="grid gap-4 2xl:grid-cols-3">
        <AnalyticsPanel title="Top categories">
          <AnalyticsDataTable
            emptyText="No category sales found."
            rows={analytics.products.topCategories.map((category) => ({
              label: category.name,
              metric: category.revenue,
              secondary: category.soldQuantity,
            }))}
          />
        </AnalyticsPanel>
        <AnalyticsPanel title="Inventory watch">
          <AnalyticsDataTable
            emptyText="No low-stock products found."
            rows={analytics.products.lowStock.map((product) => ({
              detail: product.category || 'No category',
              label: product.name,
              metric: product.stock,
            }))}
            valueKind="count"
          />
          <p className="mt-4 border-t border-black/10 pt-4 text-sm font-bold">
            Out of stock: {analytics.products.outOfStock}
          </p>
        </AnalyticsPanel>
        <AnalyticsPanel title="Review quality">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f8f3ea] p-4">
              <Star className="h-5 w-5 text-[#7a3f1d]" />
              <p className="mt-3 text-2xl font-bold">
                {analytics.reviews.averageRating}
              </p>
              <p className="text-xs font-bold text-[#6b5f53]">
                Average rating
              </p>
            </div>
            <div className="bg-[#f8f3ea] p-4">
              <ShieldAlert className="h-5 w-5 text-[#8f3f1d]" />
              <p className="mt-3 text-2xl font-bold">
                {analytics.reviews.hiddenReviews}
              </p>
              <p className="text-xs font-bold text-[#6b5f53]">
                Hidden reviews
              </p>
            </div>
          </div>
          <div className="mt-4">
            <AnalyticsMiniBarList
              emptyText="No rating data found."
              rows={analytics.reviews.ratingSummary}
              valueLabel={(row) => `${row.count} reviews`}
            />
          </div>
        </AnalyticsPanel>
      </section>

      <AnalyticsPanel title="Activity and security">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ['Admin actions', analytics.activity.adminActions],
            ['Failed logins', analytics.activity.failedLogins],
            [
              'Warnings / failed',
              analytics.activity.warningOrFailedEvents,
            ],
            ['Shipping sync warnings', analytics.shipping.syncWarnings],
          ].map(([label, value]) => (
            <div
              className="border border-black/10 bg-[#f8f3ea] p-4"
              key={label as string}
            >
              <p className="text-xs font-bold uppercase text-[#6b5f53]">
                {label as string}
              </p>
              <p className="mt-3 text-2xl font-bold">{value as number}</p>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <AnalyticsDataTable
            emptyText="No admin activity found."
            rows={analytics.activity.mostActiveAdmins.map((admin) => ({
              detail: admin.email || 'No email',
              label: admin.name || admin.email || 'Admin',
              metric: admin.count,
            }))}
            valueKind="count"
          />
        </div>
      </AnalyticsPanel>
    </>
  )
}

export default AnalyticsDashboardContent
