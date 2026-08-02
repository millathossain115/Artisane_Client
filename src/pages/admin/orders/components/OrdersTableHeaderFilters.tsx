import type { Dispatch, SetStateAction } from 'react'
import { Package, RotateCcw, Search } from 'lucide-react'

import type {
  Order,
  OrderListMeta,
  OrderStatus,
  PaymentStatus,
} from '../../../../features/orders/orderApi'
import { formatOrderStatus } from '../../../../utils/orderDisplay'
import { orderStatusOptions, paymentStatusOptions } from '../orderAdminUtils'

type OrdersTableHeaderFiltersProps = {
  meta?: OrderListMeta
  onResetFilters: () => void
  orders: Order[]
  orderStatusFilter: 'all' | OrderStatus
  paymentStatusFilter: 'all' | PaymentStatus
  searchTerm: string
  setOrderStatusFilter: Dispatch<SetStateAction<'all' | OrderStatus>>
  setPaymentStatusFilter: Dispatch<SetStateAction<'all' | PaymentStatus>>
  setSearchTerm: Dispatch<SetStateAction<string>>
}

function OrdersTableHeaderFilters({
  meta,
  onResetFilters,
  orders,
  orderStatusFilter,
  paymentStatusFilter,
  searchTerm,
  setOrderStatusFilter,
  setPaymentStatusFilter,
  setSearchTerm,
}: OrdersTableHeaderFiltersProps) {
  return (
    <>
      <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3.5 sm:px-5">
        <span className="grid h-9 w-9 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
          <Package className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-xl font-bold">Orders</h2>
          <p className="mt-0.5 text-xs font-semibold text-[#6b5f53]">
            {meta?.total ?? orders.length} orders in database.
          </p>
        </div>
      </div>

      <div className="grid gap-2 border-b border-black/10 p-3 sm:grid-cols-2 sm:p-4 xl:grid-cols-[minmax(18rem,1fr)_minmax(10rem,0.45fr)_minmax(10rem,0.45fr)_auto] xl:items-end">
        <label className="grid gap-1.5 sm:col-span-2 xl:col-span-1">
          <span className="text-xs font-bold">Search current page</span>
          <span className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7a3f1d]" />
            <input
              className="min-h-9 w-full border border-black/10 pl-8 pr-2 text-xs font-semibold outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Order id, customer, phone"
              value={searchTerm}
            />
          </span>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-bold">Order status</span>
          <select
            className="min-h-9 border border-black/10 bg-white px-2 text-xs font-bold outline-none transition focus:border-[#181512]"
            onChange={(event) =>
              setOrderStatusFilter(event.target.value as 'all' | OrderStatus)
            }
            value={orderStatusFilter}
          >
            <option value="all">All orders</option>
            {orderStatusOptions.map((status) => (
              <option key={status} value={status}>
                {formatOrderStatus(status)}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-bold">Payment status</span>
          <select
            className="min-h-9 border border-black/10 bg-white px-2 text-xs font-bold outline-none transition focus:border-[#181512]"
            onChange={(event) =>
              setPaymentStatusFilter(
                event.target.value as 'all' | PaymentStatus,
              )
            }
            value={paymentStatusFilter}
          >
            <option value="all">All payments</option>
            {paymentStatusOptions.map((status) => (
              <option key={status} value={status}>
                {formatOrderStatus(status)}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-1.5">
          <span className="hidden text-xs font-bold xl:block">&nbsp;</span>
          <button
            className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-black/10 px-3 text-xs font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
            onClick={onResetFilters}
            type="button"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>
    </>
  )
}

export default OrdersTableHeaderFilters
