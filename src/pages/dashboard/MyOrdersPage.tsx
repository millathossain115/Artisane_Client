import { useMemo, useState } from 'react'

import DashboardLayout from '../../components/layout/DashboardLayout'
import {
  type Order,
  useCancelOrderMutation,
  useGetMyOrdersQuery,
} from '../../features/orders/orderApi'
import { formatOrderId } from '../../utils/orderDisplay'
import { userNavItems } from './user-dashboard/userNavItems'
import MyOrdersCancelModal from './components/MyOrdersCancelModal'
import MyOrdersCardSection from './components/MyOrdersCardSection'
import MyOrdersMessageBanner from './components/MyOrdersMessageBanner'
import {
  getApiErrorMessage,
  getMyOrderTab,
  matchesMyOrderTab,
  myOrderTabs,
  type MyOrderTabKey,
  type OrderMessage,
} from './myOrdersUtils'

function MyOrdersPage() {
  const [page, setPage] = useState(1)
  const [selectedTabKey, setSelectedTabKey] = useState<MyOrderTabKey>('all')
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null)
  const [message, setMessage] = useState<OrderMessage | null>(null)
  const selectedTab = getMyOrderTab(selectedTabKey)
  const {
    data: orderList,
    isError,
    isLoading,
  } = useGetMyOrdersQuery(
    {
      limit: 10,
      page,
      paymentStatus: selectedTab.paymentStatus,
      status: selectedTab.orderStatus,
    },
    { refetchOnMountOrArgChange: true },
  )
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation()

  const orders = useMemo(() => orderList?.data ?? [], [orderList?.data])
  const visibleOrders = useMemo(
    () => orders.filter((order) => matchesMyOrderTab(order, selectedTab)),
    [orders, selectedTab],
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
      layoutVariant="customer"
      sidebarItems={userNavItems}
      subtitle="Track placed orders, payment status, delivery address, and item details."
      title="My orders"
      workspaceLabel="Collector account"
    >
      {message ? (
        <MyOrdersMessageBanner message={message} onClose={() => setMessage(null)} />
      ) : null}

      <MyOrdersCardSection
        isError={isError}
        isLoading={isLoading}
        meta={meta}
        onCancelOrder={setCancelTarget}
        onPageChange={setPage}
        onTabChange={(value) => {
          setSelectedTabKey(value)
          setPage(1)
        }}
        orders={orders}
        page={page}
        selectedTabKey={selectedTabKey}
        tabs={myOrderTabs}
        visibleOrders={visibleOrders}
      />

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
