import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Pencil,
  Trash2,
} from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

import type { Product } from '../../../../features/products/productApi'
import {
  formatCurrency,
  formatDate,
  getCategoryName,
  getProductImageUrl,
} from '../productTableUtils'

type ProductRowsTableProps = {
  onDelete: (product: Product) => void
  onEdit: (product: Product) => void
  products: Product[]
  resultEnd: number
  resultStart: number
  safeCurrentPage: number
  setCurrentPage: Dispatch<SetStateAction<number>>
  totalPages: number
  totalProducts: number
}

function ProductRowsTable({
  onDelete,
  onEdit,
  products,
  resultEnd,
  resultStart,
  safeCurrentPage,
  setCurrentPage,
  totalPages,
  totalProducts,
}: ProductRowsTableProps) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
          <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Brand</th>
              <th className="px-5 py-3">Created</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length ? (
              products.map((product) => {
                const imageUrl = getProductImageUrl(product.images?.[0])

                return (
                  <tr
                    className="border-t border-black/10 transition hover:bg-[#f8f3ea]"
                    key={product._id}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden bg-[#f8f3ea] text-[#7a3f1d]">
                          {imageUrl ? (
                            <img
                              alt=""
                              className="h-full w-full object-cover"
                              src={imageUrl}
                            />
                          ) : (
                            <ImageOff className="h-5 w-5" />
                          )}
                        </span>
                        <span>
                          <span className="block font-bold">
                            {product.name}
                          </span>
                          <span className="mt-1 block text-xs font-semibold text-[#6b5f53]">
                            {product.slug}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#7a3f1d]">
                      {getCategoryName(product.category)}
                    </td>
                    <td className="px-5 py-4 font-bold">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-5 py-4 text-[#6b5f53]">
                      {product.stock}
                    </td>
                    <td className="px-5 py-4 text-[#6b5f53]">
                      {product.brand || 'No brand'}
                    </td>
                    <td className="px-5 py-4 text-[#6b5f53]">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          aria-label={`Update ${product.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center border border-black/10 text-[#181512] transition hover:border-[#181512] hover:bg-white"
                          onClick={() => onEdit(product)}
                          type="button"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          aria-label={`Delete ${product.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center border border-[#c85f2f]/25 text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef]"
                          onClick={() => onDelete(product)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr className="border-t border-black/10">
                <td
                  className="px-5 py-6 text-center font-semibold text-[#6b5f53]"
                  colSpan={7}
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-black/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-semibold text-[#6b5f53]">
          Showing {resultStart}-{resultEnd} of {totalProducts} products.
        </p>

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous page"
            className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-[#181512] transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={safeCurrentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-24 text-center text-sm font-bold">
            Page {safeCurrentPage} of {totalPages}
          </span>
          <button
            aria-label="Next page"
            className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-[#181512] transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={safeCurrentPage === totalPages}
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  )
}

export default ProductRowsTable
