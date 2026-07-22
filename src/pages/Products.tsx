import { useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

import { ErrorState, SkeletonCard } from '../components/loaders'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import ProductTile from '../components/product/ProductTile'
import { useGetCategoryByIdQuery } from '../features/categories/categoryApi'
import { useGetProductsQuery } from '../features/products/productApi'
import ProductCatalogEmptyState from './products/ProductCatalogEmptyState'
import ProductCatalogFilters from './products/ProductCatalogFilters'
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
  type ProductFilterState,
  type SortOption,
  type StockFilter,
} from './products/productCatalog'

function getStockFilter(value: string | null): StockFilter {
  if (value === 'in-stock' || value === 'out-of-stock') {
    return value
  }

  return 'all'
}

function getNumericFilter(value: string) {
  const numberValue = Number(value)

  if (!value || Number.isNaN(numberValue)) {
    return undefined
  }

  return numberValue
}

function Products() {
  const productGridRef = useRef<HTMLDivElement | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const searchTerm = searchParams.get('search')?.trim() ?? ''
  const categoryFilter = searchParams.get('category') ?? ''
  const minPrice = searchParams.get('minPrice') ?? ''
  const maxPrice = searchParams.get('maxPrice') ?? ''
  const stockFilter = getStockFilter(searchParams.get('stock'))
  const minRating = searchParams.get('minRating') ?? ''
  const brandFilter = searchParams.get('brand')?.trim() ?? ''
  const sortOption = getSortOption(searchParams.get('sort'))
  const currentPage = getPageNumber(searchParams.get('page'))
  const sortParams = getSortParams(sortOption)
  const filters: ProductFilterState = {
    brand: brandFilter,
    maxPrice,
    minPrice,
    minRating,
    stock: stockFilter,
  }
  const hasActiveFilters = Boolean(
    searchTerm ||
      categoryFilter ||
      minPrice ||
      maxPrice ||
      stockFilter !== 'all' ||
      minRating ||
      brandFilter ||
      sortOption !== DEFAULT_SORT,
  )
  const {
    data: productList,
    isError: hasProductsError,
    isLoading: isProductsLoading,
  } = useGetProductsQuery({
    limit: DEFAULT_LIMIT,
    page: currentPage,
    brand: brandFilter || undefined,
    category: categoryFilter || undefined,
    maxPrice: getNumericFilter(maxPrice),
    minPrice: getNumericFilter(minPrice),
    minRating: getNumericFilter(minRating),
    searchTerm: searchTerm || undefined,
    stock: stockFilter === 'all' ? undefined : stockFilter,
    ...sortParams,
  })
  const { data: activeCategory } = useGetCategoryByIdQuery(categoryFilter, {
    skip: !categoryFilter,
  })
  const products = productList?.data ?? []
  const brandOptions = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((product) => product.brand?.trim())
            .filter((brand): brand is string => Boolean(brand)),
        ),
      ).sort((firstBrand, secondBrand) =>
        firstBrand.localeCompare(secondBrand),
      ),
    [products],
  )
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
      filters?: Partial<ProductFilterState>
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
    const currentFilters = {
      ...filters,
      ...(updates.filters ?? {}),
    }
    const currentSortOption = updates.sort ?? sortOption
    const currentPageValue = updates.page ?? currentPage

    if (currentSearchTerm) {
      nextSearchParams.set('search', currentSearchTerm)
    }

    if (currentCategory) {
      nextSearchParams.set('category', currentCategory)
    }

    if (currentFilters.minPrice.trim()) {
      nextSearchParams.set('minPrice', currentFilters.minPrice.trim())
    }

    if (currentFilters.maxPrice.trim()) {
      nextSearchParams.set('maxPrice', currentFilters.maxPrice.trim())
    }

    if (currentFilters.stock !== 'all') {
      nextSearchParams.set('stock', currentFilters.stock)
    }

    if (currentFilters.minRating.trim()) {
      nextSearchParams.set('minRating', currentFilters.minRating.trim())
    }

    if (currentFilters.brand.trim()) {
      nextSearchParams.set('brand', currentFilters.brand.trim())
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

  function handlePageChange(page: number) {
    updateCatalogParams({ page }, { resetPage: false })
    window.setTimeout(() => {
      productGridRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 0)
  }

  return (
    <div className="min-h-screen bg-[#f6f0e5] text-[#181512]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ProductCatalogHeader
          categoryName={activeCategory?.name}
          resultEnd={resultEnd}
          resultStart={resultStart}
          searchTerm={searchTerm}
          totalProducts={totalProducts}
        />

        {hasProductsError ? (
          <ErrorState
            title="Unable to load catalog"
            message="We encountered an issue retrieving the products catalog. Please check your connection or try again."
            onRetry={() => window.location.reload()}
          />
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <ProductCatalogFilters
            brandOptions={brandOptions}
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
            onFilterChange={(nextFilters) =>
              updateCatalogParams({ filters: nextFilters })
            }
            onSortChange={(nextSortOption) =>
              updateCatalogParams({ sort: nextSortOption })
            }
            sortOption={sortOption}
          />

          <div className="min-w-0" ref={productGridRef}>
            {isProductsLoading ? (
              <SkeletonCard count={DEFAULT_LIMIT} gridCols="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductTile key={product._id} product={product} />
                ))}
              </div>
            )}

            {!isProductsLoading && !products.length ? (
              <ProductCatalogEmptyState
                hasActiveFilters={hasActiveFilters}
                onClearFilters={handleClearFilters}
              />
            ) : null}

            <ProductCatalogPagination
              onPageChange={handlePageChange}
              pageItems={pageItems}
              resultEnd={resultEnd}
              resultStart={resultStart}
              safeCurrentPage={safeCurrentPage}
              totalPages={totalPages}
              totalProducts={totalProducts}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Products
