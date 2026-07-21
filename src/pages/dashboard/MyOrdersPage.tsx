import { useMemo, useState } from 'react'

import DashboardLayout from '../../components/layout/DashboardLayout'
import {
  type Order,
  type OrderStatus,
  useCancelOrderMutation,
  useGetMyOrdersQuery,
} from '../../features/orders/orderApi'
import { formatOrderId } from '../../utils/orderDisplay'
import { userNavItems } from './user-dashboard/userNavItems'
import MyOrdersCancelModal from './components/MyOrdersCancelModal'
import MyOrdersDetailModal from './components/MyOrdersDetailModal'
import MyOrdersMessageBanner from './components/MyOrdersMessageBanner'
import MyOrdersTableSection from './components/MyOrdersTableSection'
import { getApiErrorMessage, orderStatusOptions, type OrderMessage } from './myOrdersUtils'

function MyOrdersPage() {
  const [page, setPage] = useState(1)
  const [orderStatusFilter, setOrderStatusFilter] = useState<
    'all' | OrderStatus
  >('all')
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null)
  const [message, setMessage] = useState<OrderMessage | null>(null)
  const {
    data: orderList,
    isError,
    isLoading,
  } = useGetMyOrdersQuery(
    {
      limit: 10,
      page,
      status: orderStatusFilter === 'all' ? undefined : orderStatusFilter,
    },
    { refetchOnMountOrArgChange: true },
  )
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation()

  const orders = orderList?.data ?? []
  const selectedOrder = useMemo(
    () => orders.find((order) => order._id === selectedOrderId) ?? null,
    [orders, selectedOrderId],
  )
  const visibleOrders = orders.filter(
    (order) =>
      orderStatusFilter === 'all' || order.orderStatus === orderStatusFilter,
  )
  const meta = orderList?.meta

  async function confirmCancelOrder() {
    if (!cancelTarget) {
      return
    }

    try {
      await cancelOrder(cancelTarget._id).unwrap()
      setMessage({
        text: `${formatOrderId(cancelTarget._id)} cancelled.`,
        type: 'success',
      })
      setCancelTarget(null)
    } catch (error) {
      setMessage({
        text: getApiErrorMessage(error, 'Failed to cancel order.'),
        type: 'error',
      })
    }
  }

  return (
    <DashboardLayout
      helperText="Review order status and cancel orders before shipping starts."
      sidebarItems={userNavItems}
      subtitle="Track placed orders, payment status, delivery address, and item details."
      title="My orders"
      workspaceLabel="Collector account"
    >
      {message ? (
        <MyOrdersMessageBanner message={message} onClose={() => setMessage(null)} />
      ) : null}

      <MyOrdersTableSection
        isError={isError}
        isLoading={isLoading}
        meta={meta}
        onCancelOrder={setCancelTarget}
        onPageChange={setPage}
        onStatusFilterChange={(value) => {
          setOrderStatusFilter(value)
          setPage(1)
        }}
        orderStatusFilter={orderStatusFilter}
        orderStatusOptions={orderStatusOptions}
        page={page}
        orders={orders}
        visibleOrders={visibleOrders}
      />

      {selectedOrder ? (
        <MyOrdersDetailModal
          onClose={() => setSelectedOrderId('')}
          order={selectedOrder}
        />
      ) : null}

      {cancelTarget ? (
        <MyOrdersCancelModal
          isCancelling={isCancelling}
          onClose={() => setCancelTarget(null)}
          onConfirm={confirmCancelOrder}
          order={cancelTarget}
        />
      ) : null}
    </DashboardLayout>
  )
}

export default MyOrdersPage
