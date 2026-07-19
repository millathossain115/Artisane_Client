import { useSearchParams } from 'react-router-dom'

import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import ProductTile from '../components/product/ProductTile'
import { useGetCategoryByIdQuery } from '../features/categories/categoryApi'
import { useGetProductsQuery } from '../features/products/productApi'
import ProductCatalogEmptyState from './products/ProductCatalogEmptyState'
import ProductCatalogHeader from './products/ProductCatalogHeader'
import ProductCatalogPagination from './products/ProductCatalogPagination'
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  DEFAULT_SORT,
  getPageItems,
  getPageNumber,
  getSortOption,
  getSortParams,
  type SortOption,
} from './products/productCatalog'

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchTerm = searchParams.get('search')?.trim() ?? ''
  const categoryFilter = searchParams.get('category') ?? ''
  const sortOption = getSortOption(searchParams.get('sort'))
  const currentPage = getPageNumber(searchParams.get('page'))
  const sortParams = getSortParams(sortOption)
  const hasActiveFilters = Boolean(
    searchTerm || categoryFilter || sortOption !== DEFAULT_SORT,
  )
  const {
    data: productList,
    isError: hasProductsError,
    isLoading: isProductsLoading,
  } = useGetProductsQuery({
    limit: DEFAULT_LIMIT,
    page: currentPage,
    category: categoryFilter || undefined,
    searchTerm: searchTerm || undefined,
    ...sortParams,
  })
  const { data: activeCategory } = useGetCategoryByIdQuery(categoryFilter, {
    skip: !categoryFilter,
  })
  const products = productList?.data ?? []
  const productMeta = productList?.meta
  const totalProducts = productMeta?.total ?? products.length
  const totalPages = Math.max(1, productMeta?.totalPage ?? 1)
  const safeCurrentPage = Math.min(productMeta?.page ?? currentPage, totalPages)
  const resultStart = products.length
    ? (safeCurrentPage - 1) * (productMeta?.limit ?? DEFAULT_LIMIT) + 1
    : 0
  const resultEnd = products.length
    ? Math.min(resultStart + products.length - 1, totalProducts)
    : 0
  const pageItems = getPageItems(safeCurrentPage, totalPages)

  function updateCatalogParams(
    updates: {
      category?: string
      page?: number
      search?: string
      sort?: SortOption
    },
    options: { resetPage?: boolean } = {},
  ) {
    const nextSearchParams = new URLSearchParams()
    const shouldResetPage = options.resetPage ?? true
    const currentSearchTerm =
      updates.search !== undefined ? updates.search.trim() : searchTerm
    const currentCategory =
      updates.category !== undefined ? updates.category.trim() : categoryFilter
    const currentSortOption = updates.sort ?? sortOption
    const currentPageValue = updates.page ?? currentPage

    if (currentSearchTerm) {
      nextSearchParams.set('search', currentSearchTerm)
    }

    if (currentCategory) {
      nextSearchParams.set('category', currentCategory)
    }

    if (currentSortOption !== DEFAULT_SORT) {
      nextSearchParams.set('sort', currentSortOption)
    }

    if (!shouldResetPage && currentPageValue > DEFAULT_PAGE) {
      nextSearchParams.set('page', String(currentPageValue))
    }

    setSearchParams(nextSearchParams)
  }

  function handleClearFilters() {
    setSearchParams(new URLSearchParams())
  }

  return (
    <div className="min-h-screen bg-[#f6f0e5] text-[#181512]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ProductCatalogHeader
          categoryName={activeCategory?.name}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onSortChange={(nextSortOption) =>
            updateCatalogParams({ sort: nextSortOption })
          }
          resultEnd={resultEnd}
          resultStart={resultStart}
          searchTerm={searchTerm}
          sortOption={sortOption}
          totalProducts={totalProducts}
        />

        {hasProductsError ? (
          <div className="mt-6 border border-[#c85f2f]/30 bg-[#fff5ef] px-5 py-4 text-sm font-bold text-[#8f3f1d]">
            Could not load products.
          </div>
        ) : null}

        <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {isProductsLoading
            ? Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
                <div
                  className="h-52 animate-pulse bg-white sm:h-[472px]"
                  key={index}
                />
              ))
            : products.map((product) => (
                <ProductTile key={product._id} product={product} />
              ))}
        </div>

        {!isProductsLoading && !products.length ? (
          <ProductCatalogEmptyState
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        ) : null}

        <ProductCatalogPagination
          onPageChange={(page) =>
            updateCatalogParams({ page }, { resetPage: false })
          }
          pageItems={pageItems}
          resultEnd={resultEnd}
          resultStart={resultStart}
          safeCurrentPage={safeCurrentPage}
          totalPages={totalPages}
          totalProducts={totalProducts}
        />
      </main>

      <Footer />
    </div>
  )
}

export default Products
