import type { Dispatch, SetStateAction } from 'react'
import { Package } from 'lucide-react'

import {
  EmptyState,
  ErrorState,
  SkeletonTable,
} from '../../../../components/loaders'
import type {
  Order,
  OrderListMeta,
  OrderStatus,
  PaymentStatus,
} from '../../../../features/orders/orderApi'
import type { ConfirmTarget } from '../orderAdminUtils'
import { getAdminOrderRouteRef } from '../orderRouteState'
import OrdersDesktopTable from './OrdersDesktopTable'
import OrdersMobileList from './OrdersMobileList'
import OrdersTableHeaderFilters from './OrdersTableHeaderFilters'
import OrdersTablePagination from './OrdersTablePagination'

type OrdersTableSectionProps = {
  isError: boolean
  isLoading: boolean
  meta?: OrderListMeta
  onResetFilters: () => void
  orders: Order[]
  orderStatusFilter: 'all' | OrderStatus
  page: number
  paymentStatusFilter: 'all' | PaymentStatus
  searchTerm: string
  setConfirmTarget: Dispatch<SetStateAction<ConfirmTarget | null>>
  setOrderStatusFilter: Dispatch<SetStateAction<'all' | OrderStatus>>
  setPage: Dispatch<SetStateAction<number>>
  setPaymentStatusFilter: Dispatch<SetStateAction<'all' | PaymentStatus>>
  setSearchTerm: Dispatch<SetStateAction<string>>
  visibleOrders: Order[]
}

function OrdersTableSection({
  isError,
  isLoading,
  meta,
  onResetFilters,
  orders,
  orderStatusFilter,
  page,
  paymentStatusFilter,
  searchTerm,
  setConfirmTarget,
  setOrderStatusFilter,
  setPage,
  setPaymentStatusFilter,
  setSearchTerm,
  visibleOrders,
}: OrdersTableSectionProps) {
  function getAdminOrderDetailUrl(order: Order) {
    return `/dashboard/admin/orders/${getAdminOrderRouteRef(order)}`
  }

  return (
    <section className="border border-black/10 bg-white">
      <OrdersTableHeaderFilters
        meta={meta}
        onResetFilters={onResetFilters}
        orders={orders}
        orderStatusFilter={orderStatusFilter}
        paymentStatusFilter={paymentStatusFilter}
        searchTerm={searchTerm}
        setOrderStatusFilter={setOrderStatusFilter}
        setPaymentStatusFilter={setPaymentStatusFilter}
        setSearchTerm={setSearchTerm}
      />

      {isError ? (
        <div className="border-b border-[#c85f2f]/30 bg-[#fff5ef] px-5 py-3 text-sm font-bold text-[#8f3f1d]">
          Failed to load orders.
        </div>
      ) : null}

      {isError ? (
        <ErrorState
          title="Could not load admin orders"
          message="An error occurred while communicating with orders database."
          onRetry={() => window.location.reload()}
          className="mx-5"
        />
      ) : null}

      {isLoading ? (
        <div className="p-5">
          <SkeletonTable rows={6} cols={8} />
        </div>
      ) : !visibleOrders.length ? (
        <EmptyState
          title="No orders found"
          message="No customer orders match the current search query or filter parameters."
          icon={<Package className="h-7 w-7" />}
          action={
            <button
              onClick={onResetFilters}
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-[#5c3d2e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d1810]"
            >
              Reset Filters
            </button>
          }
        />
      ) : (
        <>
          <OrdersMobileList
            getDetailUrl={getAdminOrderDetailUrl}
            orders={visibleOrders}
            setConfirmTarget={setConfirmTarget}
          />
          <OrdersDesktopTable
            getDetailUrl={getAdminOrderDetailUrl}
            orders={visibleOrders}
            setConfirmTarget={setConfirmTarget}
          />
        </>
      )}

      <OrdersTablePagination meta={meta} page={page} setPage={setPage} />
    </section>
  )
}

export default OrdersTableSection
