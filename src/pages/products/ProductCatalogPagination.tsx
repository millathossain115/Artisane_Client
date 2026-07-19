import { ChevronLeft, ChevronRight } from 'lucide-react'

type ProductCatalogPaginationProps = {
  onPageChange: (page: number) => void
  pageItems: Array<number | string>
  resultEnd: number
  resultStart: number
  safeCurrentPage: number
  totalPages: number
  totalProducts: number
}

function ProductCatalogPagination({
  onPageChange,
  pageItems,
  resultEnd,
  resultStart,
  safeCurrentPage,
  totalPages,
  totalProducts,
}: ProductCatalogPaginationProps) {
  return (
    <div className="mt-8 flex flex-col gap-3 border-t border-black/10 pt-5 md:flex-row md:items-center md:justify-between">
      <p className="text-sm font-semibold text-[#6b5f53]">
        Showing {resultStart}-{resultEnd} of {totalProducts} products.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          aria-label="Previous page"
          className="inline-flex h-10 w-10 items-center justify-center border border-black/10 bg-white text-[#181512] transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={safeCurrentPage === 1}
          onClick={() => onPageChange(Math.max(1, safeCurrentPage - 1))}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pageItems.map((pageItem) =>
          typeof pageItem === 'number' ? (
            <button
              aria-current={pageItem === safeCurrentPage ? 'page' : undefined}
              className={`inline-flex h-10 min-w-10 items-center justify-center border px-3 text-sm font-bold transition ${
                pageItem === safeCurrentPage
                  ? 'border-[#181512] bg-[#181512] text-white'
                  : 'border-black/10 bg-white text-[#181512] hover:border-[#181512]'
              }`}
              key={pageItem}
              onClick={() => onPageChange(pageItem)}
              type="button"
            >
              {pageItem}
            </button>
          ) : (
            <span
              className="inline-flex h-10 min-w-8 items-center justify-center text-sm font-bold text-[#6b5f53]"
              key={pageItem}
            >
              ...
            </span>
          ),
        )}

        <button
          aria-label="Next page"
          className="inline-flex h-10 w-10 items-center justify-center border border-black/10 bg-white text-[#181512] transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={safeCurrentPage === totalPages}
          onClick={() =>
            onPageChange(Math.min(totalPages, safeCurrentPage + 1))
          }
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default ProductCatalogPagination
