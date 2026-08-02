import type { Dispatch, SetStateAction } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { OrderListMeta } from '../../../../features/orders/orderApi'

type OrdersTablePaginationProps = {
  meta?: OrderListMeta
  page: number
  setPage: Dispatch<SetStateAction<number>>
}

function OrdersTablePagination({
  meta,
  page,
  setPage,
}: OrdersTablePaginationProps) {
  return (
    <div className="flex flex-col gap-2 border-t border-black/10 px-4 py-3 md:flex-row md:items-center md:justify-between">
      <p className="text-xs font-semibold text-[#6b5f53]">
        Page {meta?.page ?? page} of {meta?.totalPage ?? 1}
      </p>
      <div className="flex gap-2">
        <button
          className="inline-flex h-8 w-8 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={page <= 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          className="inline-flex h-8 w-8 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={page >= (meta?.totalPage ?? 1)}
          onClick={() => setPage((current) => current + 1)}
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default OrdersTablePagination
