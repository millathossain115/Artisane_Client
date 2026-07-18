import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Package,
  Search,
} from 'lucide-react'

import {
  type Product,
  useGetProductsQuery,
} from '../../../features/products/productApi'

type SortFilter = 'newest' | 'oldest' | 'name-asc' | 'name-desc'

const PAGE_SIZE_OPTIONS = [5, 10, 20]

function formatDate(value?: string) {
  if (!value) {
    return 'Not set'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Not set'
  }

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 2,
    style: 'currency',
  }).format(value)
}

function getCategoryName(category: Product['category']) {
  if (typeof category === 'string') {
    return category
  }

  return category.name
}

function getSortParams(sortFilter: SortFilter) {
  if (sortFilter === 'oldest') {
    return { sortBy: 'createdAt' as const, sortOrder: 'asc' as const }
  }

  if (sortFilter === 'name-asc') {
    return { sortBy: 'name' as const, sortOrder: 'asc' as const }
  }

  if (sortFilter === 'name-desc') {
    return { sortBy: 'name' as const, sortOrder: 'desc' as const }
  }

  return { sortBy: 'createdAt' as const, sortOrder: 'desc' as const }
}

function ProductTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortFilter, setSortFilter] = useState<SortFilter>('newest')
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [currentPage, setCurrentPage] = useState(1)
  const sortParams = getSortParams(sortFilter)
  const {
    data: productList,
    isError: hasProductsError,
    isLoading: isProductsLoading,
  } = useGetProductsQuery({
    limit: pageSize,
    page: currentPage,
    searchTerm: searchTerm.trim() || undefined,
    ...sortParams,
  })
  const products = productList?.data ?? []
  const productMeta = productList?.meta
  const totalProducts = productMeta?.total ?? products.length
  const totalPages = Math.max(1, productMeta?.totalPage ?? 1)
  const safeCurrentPage = Math.min(productMeta?.page ?? currentPage, totalPages)
  const resultStart = totalProducts
    ? (safeCurrentPage - 1) * (productMeta?.limit ?? pageSize) + 1
    : 0
  const resultEnd = Math.min(
    resultStart + (productMeta?.limit ?? pageSize) - 1,
    totalProducts,
  )

  return (
    <section className="mt-6 border border-black/10 bg-white" id="products">
      <div className="flex items-center gap-3 border-b border-black/10 p-5">
        <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
          <Package className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold">Current products</h2>
          <p className="mt-1 text-sm text-[#6b5f53]">
            Products currently stored in the marketplace database.
          </p>
        </div>
      </div>

      {(isProductsLoading || hasProductsError) && (
        <div
          className={`border-b border-black/10 px-5 py-3 text-sm font-semibold ${
            hasProductsError
              ? 'bg-[#fff5ef] text-[#8f3f1d]'
              : 'bg-[#f8f3ea] text-[#6b5f53]'
          }`}
        >
          {hasProductsError ? 'Failed to load products.' : 'Loading products...'}
        </div>
      )}

      <div className="grid gap-3 border-b border-black/10 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <label className="grid gap-2 text-sm font-bold">
          Search products
          <span className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b5f53]" />
            <input
              className="min-h-12 w-full border border-black/10 pl-10 pr-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
              onChange={(event) => {
                setSearchTerm(event.target.value)
                setCurrentPage(1)
              }}
              placeholder="Name, slug, brand, or description"
              type="search"
              value={searchTerm}
            />
          </span>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold">
            Sort
            <select
              className="min-h-12 w-full border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
              onChange={(event) => {
                setSortFilter(event.target.value as SortFilter)
                setCurrentPage(1)
              }}
              value={sortFilter}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name-asc">A to Z</option>
              <option value="name-desc">Z to A</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-bold">
            Rows
            <select
              className="min-h-12 w-full border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
              onChange={(event) => {
                setPageSize(Number(event.target.value))
                setCurrentPage(1)
              }}
              value={pageSize}
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[940px] border-collapse text-left text-sm">
          <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Brand</th>
              <th className="px-5 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {products.length ? (
              products.map((product) => {
                const imageUrl = product.images?.[0] ?? ''

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
                  </tr>
                )
              })
            ) : (
              <tr className="border-t border-black/10">
                <td
                  className="px-5 py-6 text-center font-semibold text-[#6b5f53]"
                  colSpan={6}
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
    </section>
  )
}

export default ProductTable
