import { RefreshCw, X } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from '../../../../features/orders/orderApi'
import { formatPrice, getAssetUrl } from '../../../../utils/productDisplay'
import {
  formatCourierProvider,
  formatOrderDate,
  formatOrderId,
  formatOrderStatus,
  getOrderCustomer,
  getOrderItemImage,
  getOrderItemName,
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
  isSyncingShipment: boolean
  isUpdatingStatus: boolean
  onClose: () => void
  onShipmentSync: () => void
  onShowShipmentWarning: () => void
  onStatusUpdate: () => void
  order: Order
  selectedOrderTrackingUrl: string
  setShipmentForm: Dispatch<SetStateAction<ShipmentFormState>>
  setStatusForm: Dispatch<SetStateAction<StatusFormState>>
  shipmentActionAllowed: boolean
  shipmentExists: boolean
  shipmentForm: ShipmentFormState
  statusForm: StatusFormState
}

function OrderDetailPanel({
  fraudFlags,
  fraudRisk,
  isCreatingShipment,
  isFetchingOrderDetail,
  isSyncingShipment,
  isUpdatingStatus,
  onClose,
  onShipmentSync,
  onShowShipmentWarning,
  onStatusUpdate,
  order,
  selectedOrderTrackingUrl,
  setShipmentForm,
  setStatusForm,
  shipmentActionAllowed,
  shipmentExists,
  shipmentForm,
  statusForm,
}: OrderDetailPanelProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/60 px-4 py-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
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
          <button
            aria-label="Close order detail"
            className="grid h-10 w-10 place-items-center border border-black/10 transition hover:border-[#181512]"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 border-y border-black/10 py-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold">Order status</p>
            <p className="mt-2 inline-flex min-h-11 items-center bg-[#f1dfc8] px-3 text-sm font-bold text-[#7a3f1d]">
              {formatOrderStatus(order.orderStatus)}
            </p>
          </div>

          <div>
            <p className="text-sm font-bold">Payment status</p>
            <p className="mt-2 inline-flex min-h-11 items-center bg-[#effaf3] px-3 text-sm font-bold text-[#1f6b43]">
              {formatOrderStatus(order.paymentStatus)}
            </p>
          </div>

          <div>
            <p className="text-sm font-bold">Shipment state</p>
            <p className="mt-2 inline-flex min-h-11 items-center bg-[#eef3ff] px-3 text-sm font-bold text-[#27408b]">
              {shipmentExists
                ? `${formatCourierProvider(order.courierProvider)} - ${formatOrderStatus(order.courierStatus ?? 'shipment_created')}`
                : 'Not created yet'}
            </p>
          </div>
        </div>

        <div className="mt-5 border-b border-black/10 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
                Status controls
              </p>
              <p className="mt-1 text-sm text-[#6b5f53]">
                Update order flow and payment state.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-bold">Order status</span>
              <select
                className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
                onChange={(event) =>
                  setStatusForm((current) => ({
                    ...current,
                    orderStatus: event.target.value as OrderStatus | '',
                  }))
                }
                value={statusForm.orderStatus}
              >
                <option value="">Keep current</option>
                {orderStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {formatOrderStatus(status)}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold">Payment status</span>
              <select
                className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
                onChange={(event) =>
                  setStatusForm((current) => ({
                    ...current,
                    paymentStatus: event.target.value as PaymentStatus | '',
                  }))
                }
                value={statusForm.paymentStatus}
              >
                <option value="">Keep current</option>
                {paymentStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {formatOrderStatus(status)}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex justify-end md:col-span-2">
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isUpdatingStatus}
                onClick={onStatusUpdate}
                type="button"
              >
                {isUpdatingStatus ? 'Updating...' : 'Save status'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 border-y border-black/10 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
                Shipment
              </p>
              <p className="mt-1 text-sm text-[#6b5f53]">
                Create courier record and move order to processing.
              </p>
            </div>
            {shipmentExists ? (
              <p className="inline-flex min-h-10 items-center bg-[#eef3ff] px-3 text-xs font-bold text-[#27408b]">
                Saved
              </p>
            ) : null}
          </div>

          {shipmentExists ? (
            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <p>
                <span className="font-bold">Courier:</span>{' '}
                {formatCourierProvider(order.courierProvider)}
              </p>
              <p>
                <span className="font-bold">Courier order id:</span>{' '}
                {order.courierOrderId ?? 'Not set'}
              </p>
              <p>
                <span className="font-bold">Tracking code:</span>{' '}
                {order.trackingCode ?? 'Not set'}
              </p>
              <p>
                <span className="font-bold">Tracking URL:</span>{' '}
                {selectedOrderTrackingUrl ? (
                  <a
                    className="font-bold text-[#7a3f1d] underline"
                    href={selectedOrderTrackingUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open tracking
                  </a>
                ) : (
                  'Not set'
                )}
              </p>
              <p>
                <span className="font-bold">Created:</span>{' '}
                {formatOrderDate(order.shipmentCreatedAt)}
              </p>
              <p>
                <span className="font-bold">Last sync:</span>{' '}
                {order.lastCourierSyncAt
                  ? formatOrderDate(order.lastCourierSyncAt)
                  : 'Not synced'}
              </p>
              <div className="md:col-span-2">
                <button
                  className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSyncingShipment}
                  onClick={onShipmentSync}
                  type="button"
                >
                  <RefreshCw className="h-4 w-4" />
                  {isSyncingShipment ? 'Syncing...' : 'Sync status'}
                </button>
              </div>
            </div>
          ) : shipmentActionAllowed ? (
            <div className="mt-4 grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                <p className="inline-flex min-h-12 items-center border border-black/10 bg-[#f8f3ea] px-3 text-sm font-bold text-[#7a3f1d] md:col-span-2">
                  Courier provider: Steadfast
                </p>

                <label className="grid gap-2">
                  <span className="text-sm font-bold">Alternative phone</span>
                  <input
                    className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                    onChange={(event) =>
                      setShipmentForm((current) => ({
                        ...current,
                        alternativePhone: event.target.value,
                      }))
                    }
                    placeholder="01800000000"
                    type="tel"
                    value={shipmentForm.alternativePhone}
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-bold">Delivery type</span>
                  <select
                    className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
                    onChange={(event) =>
                      setShipmentForm((current) => ({
                        ...current,
                        deliveryType: event.target.value,
                      }))
                    }
                    value={shipmentForm.deliveryType}
                  >
                    <option value="">Default</option>
                    <option value="0">Home delivery</option>
                    <option value="1">Steadfast hub pickup</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-bold">Total lot</span>
                  <input
                    className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                    min={1}
                    onChange={(event) =>
                      setShipmentForm((current) => ({
                        ...current,
                        totalLot: event.target.value,
                      }))
                    }
                    placeholder="1"
                    type="number"
                    value={shipmentForm.totalLot}
                  />
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-bold">Item description</span>
                  <input
                    className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                    onChange={(event) =>
                      setShipmentForm((current) => ({
                        ...current,
                        itemDescription: event.target.value,
                      }))
                    }
                    placeholder="Artisane product"
                    value={shipmentForm.itemDescription}
                  />
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-bold">Note</span>
                  <textarea
                    className="min-h-24 resize-y border border-black/10 px-3 py-3 text-sm font-medium leading-6 outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                    onChange={(event) =>
                      setShipmentForm((current) => ({
                        ...current,
                        note: event.target.value,
                      }))
                    }
                    placeholder="Handle carefully"
                    value={shipmentForm.note}
                  />
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-bold">Recipient email</span>
                  <input
                    className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                    onChange={(event) =>
                      setShipmentForm((current) => ({
                        ...current,
                        recipientEmail: event.target.value,
                      }))
                    }
                    placeholder="customer@example.com"
                    type="email"
                    value={shipmentForm.recipientEmail}
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
                  onClick={() => setShipmentForm(getEmptyShipmentForm())}
                  type="button"
                >
                  Reset
                </button>
                <button
                  className="min-h-11 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isCreatingShipment}
                  onClick={onShowShipmentWarning}
                  type="button"
                >
                  {isCreatingShipment ? 'Creating...' : 'Create shipment'}
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm font-semibold text-[#6b5f53]">
              Shipment can be created for confirmed or processing orders.
            </p>
          )}
        </div>

        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          {fraudRisk !== 'low' ? (
            <div className="border border-[#c85f2f]/30 bg-[#fff5ef] p-4 text-[#8f3f1d] md:col-span-2">
              <p className="text-sm font-bold uppercase tracking-[0.14em]">
                Fraud check
              </p>
              <p className="mt-1 text-sm font-semibold">
                Risk level: {fraudRisk}
              </p>
              {fraudFlags.length ? (
                <ul className="mt-2 list-disc pl-5 text-sm leading-6">
                  {fraudFlags.map((flag) => (
                    <li key={flag}>{flag}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <p>
            <span className="font-bold">Customer:</span>{' '}
            {getOrderCustomer(order)}
          </p>
          <p>
            <span className="font-bold">Phone:</span>{' '}
            {order.contactPhone ?? 'Not set'}
          </p>
          <p>
            <span className="font-bold">Shipping:</span>{' '}
            {order.shippingAddress ?? 'Not set'}
          </p>
          <p>
            <span className="font-bold">Payment method:</span>{' '}
            {formatOrderStatus(order.paymentMethod)}
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          {(order.items ?? []).map((item, index) => {
            const imageUrl = getAssetUrl(getOrderItemImage(item))

            return (
              <article
                className="grid grid-cols-[64px_1fr_auto] gap-3 border border-black/10 p-3 text-sm"
                key={item._id ?? index}
              >
                <div className="h-16 overflow-hidden bg-[#f8f3ea]">
                  {imageUrl ? (
                    <img
                      alt={getOrderItemName(item)}
                      className="h-full w-full object-cover"
                      src={imageUrl}
                    />
                  ) : null}
                </div>
                <div>
                  <p className="font-bold">{getOrderItemName(item)}</p>
                  <p className="mt-1 text-[#6b5f53]">
                    Qty {item.quantity ?? 1}
                  </p>
                </div>
                <p className="font-bold">{formatPrice(item.subtotal ?? 0)}</p>
              </article>
            )
          })}
        </div>

        <div className="mt-5 flex flex-col justify-between gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center">
          <p className="text-xl font-bold">
            Total {formatPrice(order.totalPrice ?? 0)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPanel
