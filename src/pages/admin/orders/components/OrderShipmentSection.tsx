import { PackagePlus } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

import type { Order } from '../../../../features/orders/orderApi'
import { formatOrderStatus } from '../../../../utils/orderDisplay'
import {
  getEmptyShipmentForm,
  type ShipmentFormState,
} from '../orderAdminUtils'

type OrderShipmentSectionProps = {
  isCreatingShipment: boolean
  onShowShipmentWarning: () => void
  order: Order
  setShipmentForm: Dispatch<SetStateAction<ShipmentFormState>>
  shipmentActionAllowed: boolean
  shipmentExists: boolean
  shipmentForm: ShipmentFormState
}

function OrderShipmentSection({
  isCreatingShipment,
  onShowShipmentWarning,
  order,
  setShipmentForm,
  shipmentActionAllowed,
  shipmentExists,
  shipmentForm,
}: OrderShipmentSectionProps) {
  return (
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
  )
}

export default OrderShipmentSection
