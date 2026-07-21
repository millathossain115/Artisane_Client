import { useState } from 'react'
import { ArrowLeft, LoaderCircle } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
  useCancelOrderMutation,
  useCreateShipmentMutation,
  useDeleteOrderMutation,
  useGetOrderByIdQuery,
  useSyncShipmentMutation,
  useUpdateOrderStatusMutation,
} from '../../../features/orders/orderApi'
import { formatOrderId, getOrderTrackingUrl } from '../../../utils/orderDisplay'
import { adminNavItems } from '../adminNavItems'
import OrderConfirmModal from './components/OrderConfirmModal'
import OrderDetailPanel from './components/OrderDetailPanel'
import OrderMessageBanner from './components/OrderMessageBanner'
import ShipmentWarningModal from './components/ShipmentWarningModal'
import {
  type AdminOrderMessage,
  type ConfirmTarget,
  getApiErrorMessage,
  getEmptyShipmentForm,
  parseOptionalInteger,
  type ShipmentFormState,
  type StatusFormState,
} from './orderAdminUtils'

function AdminOrderDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
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
    data: selectedOrder,
    isError,
    isFetching: isFetchingOrderDetail,
    isLoading,
    refetch: refetchOrderDetail,
  } = useGetOrderByIdQuery(id, {
    skip: !id,
  })

  const [createShipment, { isLoading: isCreatingShipment }] =
    useCreateShipmentMutation()
  const [syncShipment, { isLoading: isSyncingShipment }] =
    useSyncShipmentMutation()
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation()
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation()
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation()

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
    if (selectedOrder) {
      setShipmentForm(getEmptyShipmentForm())
      setStatusForm({
        orderStatus: selectedOrder.orderStatus ?? '',
        paymentStatus: selectedOrder.paymentStatus ?? '',
      })
    }
  }

  function handleCloseDetail() {
    navigate('/dashboard/admin/orders')
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

      setMessage({
        text: `${formatOrderId(confirmTarget.order._id)} ${
          confirmTarget.type === 'cancel' ? 'cancelled' : 'deleted'
        }.`,
        type: 'success',
      })
      setConfirmTarget(null)
      if (confirmTarget.type === 'delete') {
        navigate('/dashboard/admin/orders')
      } else {
        await refetchOrderDetail()
      }
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
      actions={[{ label: 'All orders', to: '/dashboard/admin/orders' }]}
      eyebrow="Marketplace admin"
      helperText="Review order details, update fulfillment status, create courier shipments, and inspect fraud risk."
      sidebarItems={adminNavItems}
      subtitle={selectedOrder ? `Order management for ${formatOrderId(selectedOrder._id)}` : 'Admin order details'}
      title={selectedOrder ? formatOrderId(selectedOrder._id) : 'Admin order details'}
      workspaceLabel="Marketplace studio"
    >
      {message ? (
        <OrderMessageBanner
          message={message}
          onClose={() => setMessage(null)}
        />
      ) : null}

      <div className="mb-4">
        <Link
          className="inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-2 text-sm font-bold text-[#181512] transition hover:border-[#181512]"
          to="/dashboard/admin/orders"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Manage Orders
        </Link>
      </div>

      {isLoading ? (
        <div className="border border-black/10 bg-white p-8 text-center font-semibold text-[#6b5f53]">
          <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-[#7a3f1d]" />
          <p className="mt-2">Loading order details...</p>
        </div>
      ) : isError || !selectedOrder ? (
        <div className="border border-[#c85f2f]/30 bg-[#fff5ef] p-6 text-center text-[#8f3f1d]">
          <h3 className="text-xl font-bold">Order not found</h3>
          <p className="mt-2 text-sm font-medium">
            Could not retrieve order details for ID: {id}
          </p>
          <button
            className="mt-4 inline-flex min-h-10 items-center justify-center bg-[#181512] px-4 text-xs font-bold text-white transition hover:bg-[#7a3f1d]"
            onClick={() => navigate('/dashboard/admin/orders')}
            type="button"
          >
            Return to orders list
          </button>
        </div>
      ) : (
        <OrderDetailPanel
          fraudFlags={fraudFlags}
          fraudRisk={fraudRisk}
          isCreatingShipment={isCreatingShipment}
          isFetchingOrderDetail={isFetchingOrderDetail}
          isModal={false}
          isSyncingShipment={isSyncingShipment}
          isUpdatingStatus={isUpdatingStatus}
          onClose={handleCloseDetail}
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
      )}

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

export default AdminOrderDetailPage
