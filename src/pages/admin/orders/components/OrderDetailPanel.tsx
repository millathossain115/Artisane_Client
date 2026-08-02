import { useState, type Dispatch, type SetStateAction } from 'react'

import OrderDeliveryStepper from '../../../../components/orders/OrderDeliveryStepper'
import type { Order } from '../../../../features/orders/orderApi'
import { formatPrice } from '../../../../utils/productDisplay'
import type {
  ShipmentFormState,
  StatusFormState,
} from '../orderAdminUtils'
import OrderCustomerReceipt from './OrderCustomerReceipt'
import OrderDetailHeader from './OrderDetailHeader'
import OrderFraudRiskSection from './OrderFraudRiskSection'
import OrderItemsSection from './OrderItemsSection'
import OrderShipmentSection from './OrderShipmentSection'
import OrderStatusConfirmModal from './OrderStatusConfirmModal'
import OrderStatusControl from './OrderStatusControl'

type OrderDetailPanelProps = {
  fraudFlags: string[]
  fraudRisk: string
  isCreatingShipment: boolean
  isFetchingOrderDetail: boolean
  isModal?: boolean
  isSyncingShipment: boolean
  isUpdatingStatus: boolean
  onClose: () => void
  onShipmentSync: () => void
  onShowShipmentWarning: () => void
  onStatusUpdate: () => void
  order: Order
  setShipmentForm: Dispatch<SetStateAction<ShipmentFormState>>
  setStatusForm: Dispatch<SetStateAction<StatusFormState>>
  shipmentActionAllowed: boolean
  shipmentExists: boolean
  shipmentForm: ShipmentFormState
  statusForm: StatusFormState
}

function OrderDetailPanelContent({
  fraudFlags,
  fraudRisk,
  isCreatingShipment,
  isFetchingOrderDetail,
  isModal = true,
  isSyncingShipment,
  isUpdatingStatus,
  onClose,
  onShipmentSync,
  onShowShipmentWarning,
  onStatusUpdate,
  order,
  setShipmentForm,
  setStatusForm,
  shipmentActionAllowed,
  shipmentExists,
  shipmentForm,
  statusForm,
}: OrderDetailPanelProps) {
  const [showStatusModal, setShowStatusModal] = useState(false)

  return (
    <div
      className={
        isModal
          ? 'max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]'
          : 'w-full border border-black/10 bg-white p-5 shadow-sm'
      }
    >
      <OrderDetailHeader
        isFetchingOrderDetail={isFetchingOrderDetail}
        isModal={isModal}
        onClose={onClose}
        order={order}
      />

      <OrderStatusControl
        isUpdatingStatus={isUpdatingStatus}
        onOpenConfirm={() => setShowStatusModal(true)}
        order={order}
        setStatusForm={setStatusForm}
        statusForm={statusForm}
      />

      {showStatusModal ? (
        <OrderStatusConfirmModal
          onCancel={() => setShowStatusModal(false)}
          onConfirm={() => {
            setShowStatusModal(false)
            onStatusUpdate()
          }}
          order={order}
          statusForm={statusForm}
        />
      ) : null}

      <div className="mt-5">
        <OrderDeliveryStepper
          isRefreshing={isSyncingShipment}
          onRefresh={shipmentExists ? onShipmentSync : undefined}
          order={order}
          variant="admin"
        />
      </div>

      <OrderShipmentSection
        isCreatingShipment={isCreatingShipment}
        onShowShipmentWarning={onShowShipmentWarning}
        order={order}
        setShipmentForm={setShipmentForm}
        shipmentActionAllowed={shipmentActionAllowed}
        shipmentExists={shipmentExists}
        shipmentForm={shipmentForm}
      />

      <OrderFraudRiskSection fraudFlags={fraudFlags} fraudRisk={fraudRisk} />

      <OrderCustomerReceipt order={order} />

      <OrderItemsSection order={order} />

      <div className="mt-5 flex flex-col justify-between gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center">
        <p className="text-xl font-bold">
          Total {formatPrice(order.totalPrice ?? 0)}
        </p>
      </div>
    </div>
  )
}

function OrderDetailPanel(props: OrderDetailPanelProps) {
  if (props.isModal === false) {
    return <OrderDetailPanelContent {...props} />
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/60 px-4 py-6"
      onClick={props.onClose}
      role="presentation"
    >
      <div onClick={(event) => event.stopPropagation()} role="dialog">
        <OrderDetailPanelContent {...props} />
      </div>
    </div>
  )
}

export default OrderDetailPanel
