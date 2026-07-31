import {
  AlertTriangle,
  ClipboardCheck,
  PackagePlus,
  ShieldCheck,
  ShoppingBag,
  UserRound,
  X,
} from 'lucide-react'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { Link } from 'react-router-dom'

import OrderDeliveryStepper from '../../../../components/orders/OrderDeliveryStepper'
import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from '../../../../features/orders/orderApi'
import { formatPrice, getAssetUrl } from '../../../../utils/productDisplay'
import {
  formatOrderDate,
  formatOrderId,
  formatOrderStatus,
  getOrderCustomer,
  getOrderItemImage,
  getOrderItemName,
  getOrderItemUrl,
} from '../../../../utils/orderDisplay'
import {
  getEmptyShipmentForm,
  orderStatusOptions,
  paymentStatusOptions,
  type ShipmentFormState,
  type StatusFormState,
} from '../orderAdminUtils'

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

function StatusBadge({
  kind,
  value,
}: {
  kind: 'order' | 'payment'
  value?: string
}) {
  const isProblem =
    value === 'cancelled' || value === 'failed' || value === 'refunded'
  const isComplete = value === 'delivered' || value === 'paid'
  const className = isProblem
    ? 'bg-[#fff5ef] text-[#8f3f1d]'
    : isComplete
      ? 'bg-[#effaf3] text-[#1f6b43]'
      : kind === 'order'
        ? 'bg-[#f1dfc8] text-[#7a3f1d]'
        : 'bg-[#f8f3ea] text-[#6b5f53]'

  return (
    <span
      className={`inline-flex min-h-7 max-w-full items-center px-2.5 text-xs font-bold ${className}`}
    >
      <span className="truncate">{formatOrderStatus(value)}</span>
    </span>
  )
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
            Order detail
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            {formatOrderId(order._id)}
          </h2>
          {isFetchingOrderDetail ? (
            <p className="mt-2 text-sm font-semibold text-[#6b5f53]">
              Loading latest order data...
            </p>
          ) : null}
        </div>
        {isModal ? (
          <button
            aria-label="Close order detail"
            className="grid h-10 w-10 place-items-center border border-black/10 transition hover:border-[#181512]"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <section className="mt-4 border border-[#181512]/15 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#181512] px-3 py-2 text-white">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center bg-white/10">
              <ClipboardCheck className="h-3.5 w-3.5" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em]">
              Status control
            </p>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/65">
            Current & update
          </span>
        </div>

        <div className="flex flex-col justify-between gap-3 bg-[#fdfaf5] p-3 lg:flex-row lg:items-end">
          <div className="grid flex-1 gap-3 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="flex min-w-0 flex-wrap items-center justify-between gap-2 text-sm font-bold">
                Order status
                <StatusBadge kind="order" value={order.orderStatus} />
              </span>
              <select
                className="min-h-10 w-full border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
                onChange={(event) =>
                  setStatusForm((current) => ({
                    ...current,
                    orderStatus: event.target.value as OrderStatus | '',
                  }))
                }
                value={statusForm.orderStatus}
              >
                <option value="">Do not change order status</option>
                {orderStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {formatOrderStatus(status)}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="flex min-w-0 flex-wrap items-center justify-between gap-2 text-sm font-bold">
                Payment status
                <StatusBadge kind="payment" value={order.paymentStatus} />
              </span>
              <select
                className="min-h-10 w-full border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
                onChange={(event) =>
                  setStatusForm((current) => ({
                    ...current,
                    paymentStatus: event.target.value as PaymentStatus | '',
                  }))
                }
                value={statusForm.paymentStatus}
              >
                <option value="">Do not change payment status</option>
                {paymentStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {formatOrderStatus(status)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            className="inline-flex min-h-10 w-full items-center justify-center bg-[#181512] px-4 text-xs font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto lg:mb-0"
            disabled={
              isUpdatingStatus ||
              (!statusForm.orderStatus && !statusForm.paymentStatus)
            }
            onClick={() => setShowStatusModal(true)}
            type="button"
          >
            {isUpdatingStatus ? 'Saving changes...' : 'Save status changes'}
          </button>
        </div>
      </section>

      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setShowStatusModal(false)}
          />
          <div className="relative w-full max-w-md border border-black/10 bg-[#f6f0e5] p-6 text-[#181512] shadow-2xl">
            <button
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center border border-black/10 bg-white text-[#181512] transition hover:bg-[#181512] hover:text-white"
              onClick={() => setShowStatusModal(false)}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#8f3f1d] text-white">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Update Order Status?</h3>
                <p className="text-xs text-[#6b5f53]">
                  Changes will update order records for{' '}
                  {formatOrderId(order._id)}.
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-black/10 pt-4 text-xs space-y-2">
              {statusForm.orderStatus ? (
                <div className="flex justify-between border-b border-black/5 pb-2">
                  <span className="font-bold">Order status:</span>
                  <span className="font-semibold text-[#8f3f1d]">
                    {formatOrderStatus(order.orderStatus)} &rarr;{' '}
                    {formatOrderStatus(statusForm.orderStatus)}
                  </span>
                </div>
              ) : null}
              {statusForm.paymentStatus ? (
                <div className="flex justify-between pb-1">
                  <span className="font-bold">Payment status:</span>
                  <span className="font-semibold text-[#8f3f1d]">
                    {formatOrderStatus(order.paymentStatus)} &rarr;{' '}
                    {formatOrderStatus(statusForm.paymentStatus)}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
                onClick={() => setShowStatusModal(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#8f3f1d] px-4 text-sm font-bold text-white transition hover:bg-[#181512]"
                onClick={() => {
                  setShowStatusModal(false)
                  onStatusUpdate()
                }}
                type="button"
              >
                Confirm changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5">
        <OrderDeliveryStepper
          isRefreshing={isSyncingShipment}
          onRefresh={shipmentExists ? onShipmentSync : undefined}
          order={order}
          variant="admin"
        />
      </div>

      <section className="mt-5 border border-[#7a3f1d]/20 bg-[#fbf7ef] shadow-[inset_4px_0_0_#7a3f1d]">
        <div className="flex flex-col justify-between gap-3 px-3 py-3 sm:flex-row sm:items-center">
          <div className="flex items-start gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center bg-[#7a3f1d] text-white">
              <PackagePlus className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
                Fulfillment & Courier Integration
              </p>
              <p className="mt-1 text-sm text-[#6b5f53]">
                Automated Steadfast/Pathao courier shipment creation.
              </p>
            </div>
          </div>
        </div>

        {shipmentExists ? (
          <p className="border-t border-[#7a3f1d]/15 bg-white px-3 py-3 text-sm font-semibold text-[#6b5f53]">
            Shipment exists. Use the delivery tracker above for courier facts
            and live sync.
          </p>
        ) : (
          <div className="border-t border-[#7a3f1d]/15 bg-white p-3">
            <p className="text-sm font-bold text-[#181512]">
              No courier shipment created yet.
            </p>
            <p className="mt-1 text-xs text-[#6b5f53]">
              Required order status: confirmed or processing. Current status:{' '}
              <span className="font-bold text-[#7a3f1d]">
                {formatOrderStatus(order.orderStatus)}
              </span>
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-xs font-bold">Item description</span>
                <input
                  className="min-h-10 border border-black/10 px-3 text-xs font-medium outline-none focus:border-[#181512]"
                  onChange={(event) =>
                    setShipmentForm((current) => ({
                      ...current,
                      itemDescription: event.target.value,
                    }))
                  }
                  placeholder="Defaults to ordered items summary"
                  value={shipmentForm.itemDescription}
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-bold">Alternative phone</span>
                <input
                  className="min-h-10 border border-black/10 px-3 text-xs font-medium outline-none focus:border-[#181512]"
                  onChange={(event) =>
                    setShipmentForm((current) => ({
                      ...current,
                      alternativePhone: event.target.value,
                    }))
                  }
                  placeholder="Optional secondary phone"
                  value={shipmentForm.alternativePhone}
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-bold">Recipient email</span>
                <input
                  className="min-h-10 border border-black/10 px-3 text-xs font-medium outline-none focus:border-[#181512]"
                  onChange={(event) =>
                    setShipmentForm((current) => ({
                      ...current,
                      recipientEmail: event.target.value,
                    }))
                  }
                  placeholder="Optional recipient email"
                  value={shipmentForm.recipientEmail}
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-bold">Delivery type</span>
                <select
                  className="min-h-10 border border-black/10 bg-white px-3 text-xs font-bold outline-none focus:border-[#181512]"
                  onChange={(event) =>
                    setShipmentForm((current) => ({
                      ...current,
                      deliveryType: event.target.value,
                    }))
                  }
                  value={shipmentForm.deliveryType}
                >
                  <option value="0">Home delivery (0)</option>
                  <option value="1">Point delivery (1)</option>
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-bold">Total lot</span>
                <input
                  className="min-h-10 border border-black/10 px-3 text-xs font-medium outline-none focus:border-[#181512]"
                  onChange={(event) =>
                    setShipmentForm((current) => ({
                      ...current,
                      totalLot: event.target.value,
                    }))
                  }
                  type="number"
                  value={shipmentForm.totalLot}
                />
              </label>

              <label className="grid gap-1 md:col-span-2">
                <span className="text-xs font-bold">Delivery note</span>
                <input
                  className="min-h-10 border border-black/10 px-3 text-xs font-medium outline-none focus:border-[#181512]"
                  onChange={(event) =>
                    setShipmentForm((current) => ({
                      ...current,
                      note: event.target.value,
                    }))
                  }
                  placeholder="Special instructions for courier rider"
                  value={shipmentForm.note}
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                className="inline-flex min-h-11 items-center justify-center bg-[#7a3f1d] px-4 text-xs font-bold text-white transition hover:bg-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={!shipmentActionAllowed || isCreatingShipment}
                onClick={onShowShipmentWarning}
                type="button"
              >
                {isCreatingShipment
                  ? 'Creating shipment...'
                  : 'Create Steadfast shipment'}
              </button>

              <button
                className="inline-flex min-h-11 items-center justify-center border border-black/10 px-4 text-xs font-bold text-[#6b5f53] transition hover:border-[#181512]"
                onClick={() => setShipmentForm(getEmptyShipmentForm())}
                type="button"
              >
                Reset form
              </button>
            </div>
          </div>
        )}
      </section>

      <section
        className={`mt-5 border p-3 ${
          fraudRisk === 'high'
            ? 'border-[#c85f2f]/30 bg-[#fff5ef]'
            : fraudRisk === 'medium'
              ? 'border-[#8a6d00]/25 bg-[#fff9e6]'
              : 'border-[#1f7a4d]/20 bg-[#effaf3]'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`grid h-8 w-8 place-items-center text-white ${
                fraudRisk === 'high'
                  ? 'bg-[#8f3f1d]'
                  : fraudRisk === 'medium'
                    ? 'bg-[#8a6d00]'
                    : 'bg-[#1f6b43]'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#181512]">
              Fraud Risk & Security Verification
            </p>
          </div>

          <span
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              fraudRisk === 'high'
                ? 'bg-[#fff5ef] text-[#8f3f1d]'
                : fraudRisk === 'medium'
                  ? 'bg-[#fff9e6] text-[#8a6d00]'
                  : 'bg-[#effaf3] text-[#1f6b43]'
            }`}
          >
            {fraudRisk}
          </span>
        </div>

        {fraudFlags.length ? (
          <div className="mt-3 grid gap-2">
            <span className="text-xs font-bold text-[#6b5f53]">
              Risk indicators flagged:
            </span>
            <ul className="grid gap-1.5 pl-4 text-xs font-semibold text-[#8f3f1d]">
              {fraudFlags.map((flag, index) => (
                <li className="list-disc" key={index}>
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-3 text-xs font-semibold text-[#1f6b43]">
            No fraud warnings or anomalies flagged for this order.
          </p>
        )}
      </section>

      <section className="mt-5 border border-black/10 bg-white">
        <div className="flex items-center gap-2 border-b border-black/10 bg-[#f8f3ea] px-3 py-2">
          <span className="grid h-7 w-7 place-items-center bg-white text-[#7a3f1d]">
            <UserRound className="h-3.5 w-3.5" />
          </span>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
            Customer receipt
          </p>
        </div>

        <div className="grid gap-x-4 gap-y-2 px-3 pb-3 pt-1 text-sm md:grid-cols-2">
          <p className="border-t border-black/10 pt-2">
            <span className="font-bold">Customer:</span>{' '}
            {getOrderCustomer(order)}
          </p>
          <p className="border-t border-black/10 pt-2">
            <span className="font-bold">Contact phone:</span>{' '}
            {order.contactPhone ?? 'Not set'}
          </p>
          <p className="border-t border-black/10 pt-2">
            <span className="font-bold">Shipping address:</span>{' '}
            {order.shippingAddress ?? 'Not set'}
          </p>
          <p className="border-t border-black/10 pt-2">
            <span className="font-bold">Payment method:</span>{' '}
            {order.paymentMethod
              ? order.paymentMethod.toUpperCase()
              : 'Not set'}
          </p>
          <p className="border-t border-black/10 pt-2">
            <span className="font-bold">Placed on:</span>{' '}
            {formatOrderDate(order.createdAt)}
          </p>
          {order.notes ? (
            <p className="border-t border-black/10 pt-2 md:col-span-2">
              <span className="font-bold">Customer notes:</span> {order.notes}
            </p>
          ) : null}
        </div>
      </section>

      <section className="mt-5 border border-black/10 bg-[#fdfaf5]">
        <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-white px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center bg-[#181512] text-white">
              <ShoppingBag className="h-3.5 w-3.5" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
              Order items
            </p>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b5f53]">
            Manifest
          </span>
        </div>

        <div className="grid gap-2 p-3">
          {(order.items ?? []).map((item, index) => {
            const imageUrl = getAssetUrl(getOrderItemImage(item))
            const productUrl = getOrderItemUrl(item)

            return (
              <article
                className="grid grid-cols-[56px_1fr_auto] gap-3 border border-black/10 bg-white p-2.5 text-sm"
                key={item._id ?? index}
              >
                {productUrl ? (
                  <Link
                    className="h-14 overflow-hidden bg-[#f8f3ea] transition hover:opacity-80"
                    to={productUrl}
                  >
                    {imageUrl ? (
                      <img
                        alt={getOrderItemName(item)}
                        className="h-full w-full object-cover"
                        src={imageUrl}
                      />
                    ) : null}
                  </Link>
                ) : (
                  <div className="h-14 overflow-hidden bg-[#f8f3ea]">
                    {imageUrl ? (
                      <img
                        alt={getOrderItemName(item)}
                        className="h-full w-full object-cover"
                        src={imageUrl}
                      />
                    ) : null}
                  </div>
                )}
                <div>
                  {productUrl ? (
                    <Link className="font-bold hover:underline" to={productUrl}>
                      {getOrderItemName(item)}
                    </Link>
                  ) : (
                    <p className="font-bold">{getOrderItemName(item)}</p>
                  )}
                  <p className="mt-1 text-[#6b5f53]">
                    Qty {item.quantity ?? 1}
                  </p>
                </div>
                <p className="font-bold">{formatPrice(item.subtotal ?? 0)}</p>
              </article>
            )
          })}
        </div>
      </section>

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
