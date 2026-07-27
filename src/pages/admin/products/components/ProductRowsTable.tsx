import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Pencil,
  Trash2,
} from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'

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
    <div>
      <div className="grid gap-3 p-4 lg:hidden">
        {products.length ? (
          products.map((product) => {
            const imageUrl = getProductImageUrl(product.images?.[0])
            const productUrl = `/products/${product._id}`

            return (
              <article
                className="border border-black/10 bg-white p-4"
                key={product._id}
              >
                <div className="flex items-start gap-3">
                  <Link
                    aria-label={`View ${product.name}`}
                    className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden border border-black/10 bg-[#f8f3ea] text-[#6b5f53]"
                    to={productUrl}
                  >
                    {imageUrl ? (
                      <img
                        alt=""
                        className="h-full w-full object-cover"
                        src={imageUrl}
                      />
                    ) : (
                      <ImageOff className="h-5 w-5" />
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      className="line-clamp-2 font-bold text-[#181512] hover:text-[#7a3f1d] hover:underline"
                      to={productUrl}
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 truncate text-xs font-semibold text-[#6b5f53]">
                      {product.brand || 'Artisane'}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="bg-[#f1dfc8] px-2 py-1 text-xs font-bold text-[#7a3f1d]">
                        {getCategoryName(product.category)}
                      </span>
                      <span className="bg-[#f8f3ea] px-2 py-1 text-xs font-bold text-[#181512]">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-3">
                  {product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1.5 bg-[#effaf3] px-2 py-1 text-xs font-bold text-[#1f6b43]">
                      <span className="h-1.5 w-1.5 bg-[#1f6b43]" />
                      {product.stock} in stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-[#fff5ef] px-2 py-1 text-xs font-bold text-[#8f3f1d]">
                      <span className="h-1.5 w-1.5 bg-[#8f3f1d]" />
                      Out of stock
                    </span>
                  )}

                  <div className="flex gap-2">
                    <button
                      aria-label={`Edit ${product.name}`}
                      className="grid h-9 w-9 place-items-center border border-black/10 bg-white text-[#181512] transition hover:border-[#181512]"
                      onClick={() => onEdit(product)}
                      type="button"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      aria-label={`Delete ${product.name}`}
                      className="grid h-9 w-9 place-items-center border border-[#c85f2f]/25 bg-white text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef]"
                      onClick={() => onDelete(product)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            )
          })
        ) : (
          <p className="border border-black/10 bg-[#f8f3ea] p-5 text-center text-sm font-semibold text-[#6b5f53]">
            No products match your current search or category filter.
          </p>
        )}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
          <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Brand</th>
              <th className="px-5 py-3">Created</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length ? (
              products.map((product) => {
                const imageUrl = getProductImageUrl(product.images?.[0])
                const productUrl = `/products/${product._id}`

                return (
                  <tr
                    className="border-t border-black/10 transition hover:bg-[#f8f3ea]"
                    key={product._id}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          aria-label={`View ${product.name}`}
                          className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden border border-black/10 bg-[#f8f3ea] text-[#6b5f53] transition hover:border-[#181512]"
                          to={productUrl}
                        >
                          {imageUrl ? (
                            <img
                              alt=""
                              className="h-full w-full object-cover"
                              src={imageUrl}
                            />
                          ) : (
                            <ImageOff className="h-5 w-5" />
                          )}
                        </Link>
                        <div>
                          <Link
                            className="block font-bold text-[#181512] hover:text-[#7a3f1d] hover:underline"
                            to={productUrl}
                          >
                            {product.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-[#f1dfc8] px-2 py-1 text-xs font-bold text-[#7a3f1d]">
                        {getCategoryName(product.category)}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-[#181512]">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-5 py-4">
                      {product.stock > 0 ? (
                        <span className="inline-flex items-center gap-1.5 bg-[#effaf3] px-2 py-1 text-xs font-bold text-[#1f6b43]">
                          <span className="h-1.5 w-1.5 bg-[#1f6b43]" />
                          {product.stock} in stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-[#fff5ef] px-2 py-1 text-xs font-bold text-[#8f3f1d]">
                          <span className="h-1.5 w-1.5 bg-[#8f3f1d]" />
                          Out of stock
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-[#6b5f53]">
                      {product.brand || 'Artisane'}
                    </td>
                    <td className="px-5 py-4 text-[#6b5f53]">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="inline-flex min-h-9 items-center gap-1.5 border border-black/10 bg-white px-3 text-xs font-bold text-[#181512] transition hover:border-[#181512]"
                          onClick={() => onEdit(product)}
                          type="button"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          className="inline-flex min-h-9 items-center gap-1.5 border border-[#c85f2f]/25 bg-white px-3 text-xs font-bold text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef]"
                          onClick={() => onDelete(product)}
                          type="button"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td className="px-5 py-12 text-center text-sm font-semibold text-[#6b5f53]" colSpan={7}>
                  No products match your current search or category filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalProducts > 0 && (
        <div className="flex flex-col gap-3 border-t border-black/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-[#6b5f53]">
            Showing <strong className="font-bold text-[#181512]">{resultStart}</strong> to{' '}
            <strong className="font-bold text-[#181512]">{resultEnd}</strong> of{' '}
            <strong className="font-bold text-[#181512]">{totalProducts}</strong> products
          </p>
          <div className="flex gap-2">
            <button
              className="inline-flex h-10 w-10 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="inline-flex h-10 w-10 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={safeCurrentPage >= totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductRowsTable
