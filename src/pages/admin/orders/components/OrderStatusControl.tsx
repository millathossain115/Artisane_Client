import { ClipboardCheck } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from '../../../../features/orders/orderApi'
import { formatOrderStatus } from '../../../../utils/orderDisplay'
import {
  orderStatusOptions,
  paymentStatusOptions,
  type StatusFormState,
} from '../orderAdminUtils'
import OrderStatusBadge from './OrderStatusBadge'

type OrderStatusControlProps = {
  isUpdatingStatus: boolean
  onOpenConfirm: () => void
  order: Order
  setStatusForm: Dispatch<SetStateAction<StatusFormState>>
  statusForm: StatusFormState
}

function OrderStatusControl({
  isUpdatingStatus,
  onOpenConfirm,
  order,
  setStatusForm,
  statusForm,
}: OrderStatusControlProps) {
  return (
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
              <OrderStatusBadge kind="order" value={order.orderStatus} />
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
              <OrderStatusBadge kind="payment" value={order.paymentStatus} />
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
          onClick={onOpenConfirm}
          type="button"
        >
          {isUpdatingStatus ? 'Saving changes...' : 'Save status changes'}
        </button>
      </div>
    </section>
  )
}

export default OrderStatusControl
