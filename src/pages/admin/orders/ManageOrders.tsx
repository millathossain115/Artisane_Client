import { useEffect, useMemo, useState } from 'react'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
  type OrderStatus,
  type PaymentStatus,
  useCancelOrderMutation,
  useCreateShipmentMutation,
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useSyncShipmentMutation,
  useUpdateOrderStatusMutation,
} from '../../../features/orders/orderApi'
import { formatOrderId, getOrderTrackingUrl } from '../../../utils/orderDisplay'
import { adminNavItems } from '../adminNavItems'
import OrderConfirmModal from './components/OrderConfirmModal'
import OrderDetailPanel from './components/OrderDetailPanel'
import OrderMessageBanner from './components/OrderMessageBanner'
import OrdersTableSection from './components/OrdersTableSection'
import ShipmentWarningModal from './components/ShipmentWarningModal'
import {
  type AdminOrderMessage,
  type ConfirmTarget,
  getApiErrorMessage,
  getEmptyShipmentForm,
  matchesSearch,
  parseOptionalInteger,
  type ShipmentFormState,
  type StatusFormState,
} from './orderAdminUtils'

function ManageOrders() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState<
    'all' | OrderStatus
  >('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    'all' | PaymentStatus
  >('all')
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget | null>(null)
  const [message, setMessage] = useState<AdminOrderMessage | null>(null)
  const [showShipmentWarning, setShowShipmentWarning] = useState(false)
  const [shipmentForm, setShipmentForm] = useState<ShipmentFormState>(
    getEmptyShipmentForm(),
  )
  const [statusForm, setStatusForm] = useState<StatusFormState>({
    orderStatus: '',
    paymentStatus: '',
  })

  const {
    data: orderList,
    isError,
    isLoading,
    refetch: refetchOrders,
  } = useGetAllOrdersQuery(
    {
      limit: 10,
      page,
    },
    { refetchOnMountOrArgChange: true },
  )
  const {
    data: orderDetail,
    isFetching: isFetchingOrderDetail,
    refetch: refetchOrderDetail,
  } = useGetOrderByIdQuery(selectedOrderId, {
    skip: !selectedOrderId,
  })
  const [createShipment, { isLoading: isCreatingShipment }] =
    useCreateShipmentMutation()
  const [syncShipment, { isLoading: isSyncingShipment }] =
    useSyncShipmentMutation()
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation()
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation()
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation()

  const orders = useMemo(() => orderList?.data ?? [], [orderList?.data])
  const meta = orderList?.meta
  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) {
      return null
    }

    return (
      orderDetail ??
      orders.find((order) => order._id === selectedOrderId) ??
      null
    )
  }, [orderDetail, orders, selectedOrderId])
  const visibleOrders = orders.filter(
    (order) =>
      matchesSearch(order, searchTerm) &&
      (orderStatusFilter === 'all' ||
        order.orderStatus === orderStatusFilter) &&
      (paymentStatusFilter === 'all' ||
        order.paymentStatus === paymentStatusFilter),
  )
  const shipmentExists = Boolean(
    selectedOrder?.courierProvider ||
      selectedOrder?.courierOrderId ||
      selectedOrder?.trackingCode,
  )
  const shipmentActionAllowed =
    selectedOrder?.orderStatus === 'confirmed' ||
    selectedOrder?.orderStatus === 'processing'
  const selectedOrderTrackingUrl = selectedOrder
    ? getOrderTrackingUrl(selectedOrder)
    : ''
  const fraudRisk = selectedOrder?.fraudRisk ?? 'low'
  const fraudFlags = selectedOrder?.fraudFlags ?? []

  const [prevSelectedOrder, setPrevSelectedOrder] = useState(selectedOrder)
  if (selectedOrder !== prevSelectedOrder) {
    setPrevSelectedOrder(selectedOrder)
    if (!selectedOrder) {
      setShowShipmentWarning(false)
      setShipmentForm(getEmptyShipmentForm())
      setStatusForm({
        orderStatus: '',
        paymentStatus: '',
      })
    } else {
      setShipmentForm(getEmptyShipmentForm())
      setStatusForm({
        orderStatus: selectedOrder.orderStatus ?? '',
        paymentStatus: selectedOrder.paymentStatus ?? '',
      })
    }
  }

  function resetFilters() {
    setSearchTerm('')
    setOrderStatusFilter('all')
    setPaymentStatusFilter('all')
    setPage(1)
  }

  function closeOrderDetail() {
    setShowShipmentWarning(false)
    setSelectedOrderId('')
  }

  async function confirmOrderAction() {
    if (!confirmTarget) {
      return
    }

    try {
      if (confirmTarget.type === 'cancel') {
        await cancelOrder(confirmTarget.order._id).unwrap()
      } else {
        await deleteOrder(confirmTarget.order._id).unwrap()
      }

      await refetchOrders()
      setMessage({
        text: `${formatOrderId(confirmTarget.order._id)} ${
          confirmTarget.type === 'cancel' ? 'cancelled' : 'deleted'
        }.`,
        type: 'success',
      })
      setConfirmTarget(null)
      setSelectedOrderId('')
    } catch (error) {
      setMessage({
        text: getApiErrorMessage(
          error,
          `Failed to ${confirmTarget.type} order.`,
        ),
        type: 'error',
      })
    }
  }

  async function confirmShipmentAction() {
    if (!selectedOrder) {
      return
    }

    const deliveryType = parseOptionalInteger(shipmentForm.deliveryType, 0, 1)
    const totalLot = parseOptionalInteger(shipmentForm.totalLot, 1, 9999)

    if (deliveryType === null || totalLot === null) {
      setMessage({
        text: 'Delivery type must be 0 or 1 and total lot must be a whole number.',
        type: 'error',
      })
      return
    }

    try {
      await createShipment({
        alternativePhone: shipmentForm.alternativePhone.trim() || undefined,
        deliveryType,
        id: selectedOrder._id,
        itemDescription: shipmentForm.itemDescription.trim() || undefined,
        note: shipmentForm.note.trim() || undefined,
        recipientEmail: shipmentForm.recipientEmail.trim() || undefined,
        totalLot,
      }).unwrap()

      setMessage({
        text: `${formatOrderId(selectedOrder._id)} shipment created.`,
        type: 'success',
      })
      await refetchOrders()
      await refetchOrderDetail()
      setShowShipmentWarning(false)
    } catch (error) {
      setMessage({
        text: getApiErrorMessage(error, 'Failed to create shipment.'),
        type: 'error',
      })
    }
  }

  async function confirmShipmentSync() {
    if (!selectedOrder) {
      return
    }

    try {
      await syncShipment(selectedOrder._id).unwrap()

      setMessage({
        text: `${formatOrderId(selectedOrder._id)} shipment synced.`,
        type: 'success',
      })
      await refetchOrders()
      await refetchOrderDetail()
    } catch (error) {
      setMessage({
        text: getApiErrorMessage(error, 'Failed to sync shipment.'),
        type: 'error',
      })
    }
  }

  async function confirmStatusUpdate() {
    if (!selectedOrder) {
      return
    }

    if (!statusForm.orderStatus && !statusForm.paymentStatus) {
      return
    }

    try {
      await updateOrderStatus({
        id: selectedOrder._id,
        orderStatus: statusForm.orderStatus || undefined,
        paymentStatus: statusForm.paymentStatus || undefined,
      }).unwrap()

      setMessage({
        text: `${formatOrderId(selectedOrder._id)} status updated.`,
        type: 'success',
      })
      await refetchOrders()
      await refetchOrderDetail()
    } catch (error) {
      setMessage({
        text: getApiErrorMessage(error, 'Failed to update order status.'),
        type: 'error',
      })
    }
  }

  return (
    <DashboardLayout
      helperText="Review new orders, confirm payments, update fulfillment status, and remove invalid records."
      sidebarItems={adminNavItems}
      subtitle="Manage customer orders, payment state, cancellation, and fulfillment progress."
      title="Manage orders"
      workspaceLabel="Marketplace studio"
    >
      {message ? (
        <OrderMessageBanner
          message={message}
          onClose={() => setMessage(null)}
        />
      ) : null}

      <OrdersTableSection
        isError={isError}
        isLoading={isLoading}
        meta={meta}
        onResetFilters={resetFilters}
        orders={orders}
        orderStatusFilter={orderStatusFilter}
        page={page}
        paymentStatusFilter={paymentStatusFilter}
        searchTerm={searchTerm}
        setConfirmTarget={setConfirmTarget}
        setOrderStatusFilter={setOrderStatusFilter}
        setPage={setPage}
        setPaymentStatusFilter={setPaymentStatusFilter}
        setSearchTerm={setSearchTerm}
        setSelectedOrderId={setSelectedOrderId}
        visibleOrders={visibleOrders}
      />

      {selectedOrder ? (
        <OrderDetailPanel
          fraudFlags={fraudFlags}
          fraudRisk={fraudRisk}
          isCreatingShipment={isCreatingShipment}
          isFetchingOrderDetail={isFetchingOrderDetail}
          isSyncingShipment={isSyncingShipment}
          isUpdatingStatus={isUpdatingStatus}
          onClose={closeOrderDetail}
          onShipmentSync={confirmShipmentSync}
          onShowShipmentWarning={() => setShowShipmentWarning(true)}
          onStatusUpdate={confirmStatusUpdate}
          order={selectedOrder}
          selectedOrderTrackingUrl={selectedOrderTrackingUrl}
          setShipmentForm={setShipmentForm}
          setStatusForm={setStatusForm}
          shipmentActionAllowed={shipmentActionAllowed}
          shipmentExists={shipmentExists}
          shipmentForm={shipmentForm}
          statusForm={statusForm}
        />
      ) : null}

      {showShipmentWarning && selectedOrder ? (
        <ShipmentWarningModal
          fraudFlags={fraudFlags}
          fraudRisk={fraudRisk}
          isCreatingShipment={isCreatingShipment}
          onClose={() => setShowShipmentWarning(false)}
          onConfirm={confirmShipmentAction}
          order={selectedOrder}
        />
      ) : null}

      {confirmTarget ? (
        <OrderConfirmModal
          confirmTarget={confirmTarget}
          isWorking={isCancelling || isDeleting}
          onClose={() => setConfirmTarget(null)}
          onConfirm={confirmOrderAction}
        />
      ) : null}
    </DashboardLayout>
  )
}

export default ManageOrders
