import type { Dispatch, SetStateAction } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { getPaginationItems } from './myOrdersCardUtils'

type MyOrdersPaginationProps = {
  currentPage: number
  endOrder: number
  onPageChange: Dispatch<SetStateAction<number>>
  startOrder: number
  totalOrders: number
  totalPage: number
}

function MyOrdersPagination({
  currentPage,
  endOrder,
  onPageChange,
  startOrder,
  totalOrders,
  totalPage,
}: MyOrdersPaginationProps) {
  const paginationItems = getPaginationItems(currentPage, totalPage)

  return (
    <div className="flex flex-col gap-3 border-t border-black/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
      <p className="text-sm font-semibold text-[#6b5f53]">
        {totalOrders
          ? `Showing ${startOrder}-${endOrder} of ${totalOrders}`
          : 'No orders to show'}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          className="inline-flex h-10 w-10 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={currentPage <= 1}
          onClick={() => onPageChange((current) => Math.max(1, current - 1))}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {paginationItems.map((item) => (
          <button
            className={`inline-flex h-10 min-w-10 items-center justify-center border px-3 text-sm font-bold transition ${
              item === currentPage
                ? 'border-[#181512] bg-[#181512] text-white'
                : 'border-black/10 bg-white text-[#181512] hover:border-[#181512] hover:bg-[#f8f3ea]'
            }`}
            key={item}
            onClick={() => onPageChange(item)}
            type="button"
          >
            {item}
          </button>
        ))}
        <button
          className="inline-flex h-10 w-10 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={currentPage >= totalPage}
          onClick={() =>
            onPageChange((current) => Math.min(totalPage, current + 1))
          }
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default MyOrdersPagination
