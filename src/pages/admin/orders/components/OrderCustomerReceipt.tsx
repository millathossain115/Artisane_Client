import { UserRound } from 'lucide-react'

import type { Order } from '../../../../features/orders/orderApi'
import {
  formatOrderDate,
  getOrderCustomer,
} from '../../../../utils/orderDisplay'

type OrderCustomerReceiptProps = {
  order: Order
}

function OrderCustomerReceipt({ order }: OrderCustomerReceiptProps) {
  return (
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
          {order.paymentMethod ? order.paymentMethod.toUpperCase() : 'Not set'}
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
  )
}

export default OrderCustomerReceipt
