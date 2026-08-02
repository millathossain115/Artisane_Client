import type { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { PackageCheck } from 'lucide-react'

import { EmptyState, ErrorState } from '../../../components/loaders'
import type { Order } from '../../../features/orders/orderApi'
import type { MyOrderTab, MyOrderTabKey } from '../myOrdersUtils'
import MyOrderCard from './MyOrderCard'
import MyOrdersCardSkeleton from './MyOrdersCardSkeleton'
import MyOrdersHeaderTabs from './MyOrdersHeaderTabs'
import MyOrdersPagination from './MyOrdersPagination'
import useOrderReorder from './useOrderReorder'

type MyOrdersCardSectionProps = {
  isError: boolean
  isLoading: boolean
  meta?: {
    limit: number
    page: number
    total: number
    totalPage: number
  }
  onCancelOrder: (order: Order) => void
  onPageChange: Dispatch<SetStateAction<number>>
  onTabChange: (value: MyOrderTabKey) => void
  orders: Order[]
  page: number
  selectedTabKey: MyOrderTabKey
  tabs: MyOrderTab[]
  visibleOrders: Order[]
}

function MyOrdersCardSection({
  isError,
  isLoading,
  meta,
  onCancelOrder,
  onPageChange,
  onTabChange,
  orders,
  page,
  selectedTabKey,
  tabs,
  visibleOrders,
}: MyOrdersCardSectionProps) {
  const { handleReorder, reorderingOrderId } = useOrderReorder()
  const activeTab = tabs.find((tab) => tab.key === selectedTabKey) ?? tabs[0]
  const currentPage = meta?.page ?? page
  const totalPage = meta?.totalPage ?? 1
  const totalOrders = meta?.total ?? orders.length
  const pageLimit = meta?.limit ?? visibleOrders.length
  const startOrder = totalOrders ? (currentPage - 1) * pageLimit + 1 : 0
  const endOrder = totalOrders
    ? Math.min(startOrder + visibleOrders.length - 1, totalOrders)
    : 0

  return (
    <section className="border border-black/10 bg-white">
      <MyOrdersHeaderTabs
        onTabChange={onTabChange}
        orderCount={meta?.total ?? orders.length}
        selectedTabKey={selectedTabKey}
        tabs={tabs}
      />

      {isError ? (
        <ErrorState
          className="mx-5"
          message="We encountered an issue fetching your orders. Please try again."
          onRetry={() => window.location.reload()}
          title="Could not retrieve order history"
        />
      ) : null}

      {isLoading ? (
        <MyOrdersCardSkeleton />
      ) : !visibleOrders.length ? (
        <EmptyState
          action={
            <Link
              className="inline-flex items-center justify-center bg-[#181512] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
              to="/products"
            >
              Explore products
            </Link>
          }
          icon={<PackageCheck className="h-7 w-7" />}
          message={activeTab.emptyMessage}
          title="No orders found"
        />
      ) : (
        <div className="grid gap-4 p-5">
          {visibleOrders.map((order) => (
            <MyOrderCard
              isReordering={reorderingOrderId === order._id}
              key={order._id}
              onCancelOrder={onCancelOrder}
              onReorder={handleReorder}
              order={order}
            />
          ))}
        </div>
      )}

      <MyOrdersPagination
        currentPage={currentPage}
        endOrder={endOrder}
        onPageChange={onPageChange}
        startOrder={startOrder}
        totalOrders={totalOrders}
        totalPage={totalPage}
      />
    </section>
  )
}

export default MyOrdersCardSection
