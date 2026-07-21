import { useState } from 'react'
import { ArrowUpRight, ChevronDown, Globe2, ImageOff } from 'lucide-react'
import { Link } from 'react-router-dom'

import { API_BASE_URL } from '../../../config/api'
import {
  type Category,
  useGetCategoriesQuery,
} from '../../../features/categories/categoryApi'
import { useGetProductsQuery } from '../../../features/products/productApi'
import { formatPrice, getProductImage } from '../../../utils/productDisplay'

const FEATURED_CATEGORY_LIMIT = 6

function getCategoryUrl(categoryId: string) {
  return `/products?category=${encodeURIComponent(categoryId)}`
}

function getCategoryImageUrl(image?: string) {
  if (!image) {
    return ''
  }

  if (image.startsWith('http')) {
    return image
  }

  return `${API_BASE_URL.replace('/api/v1', '')}${image}`
}

function formatProductCount(productCount: number) {
  return `${productCount} ${productCount === 1 ? 'product' : 'products'}`
}

function CategoryProductCount({ categoryId }: { categoryId: string }) {
  const {
    data: productList,
    isError,
    isLoading,
  } = useGetProductsQuery({
    category: categoryId,
    limit: 1,
    page: 1,
  })
  const productCount = productList?.meta.total ?? productList?.data.length ?? 0

  if (isLoading) {
    return (
      <span className="text-[11px] font-semibold text-[#8a7d71]">
        Loading count
      </span>
    )
  }

  if (isError) {
    return (
      <span className="text-[11px] font-semibold text-[#8f3f1d]">
        Count unavailable
      </span>
    )
  }

  return (
    <span className="text-[11px] font-bold text-[#7a3f1d]">
      {formatProductCount(productCount)}
    </span>
  )
}

function NavbarCategoryNav() {
  const [activePanel, setActivePanel] = useState('')
  const activeCategoryId =
    activePanel && activePanel !== 'all-categories' ? activePanel : ''
  const { data: categoryList, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery({
      limit: 100,
      page: 1,
      sortBy: 'name',
      sortOrder: 'asc',
    })
  const { data: categoryProductList, isFetching: isCategoryProductsFetching } =
    useGetProductsQuery(
      {
        category: activeCategoryId,
        limit: 4,
        page: 1,
      },
      { skip: !activeCategoryId },
    )
  const categories: Category[] = (categoryList?.data ?? []).filter(
    (category) => category.isActive !== false,
  )
  const featuredCategories = categories.slice(0, FEATURED_CATEGORY_LIMIT)
  const categoryProducts = categoryProductList?.data ?? []
  const activeCategoryProductCount =
    categoryProductList?.meta.total ?? categoryProducts.length
  const activeCategory = categories.find(
    (category) => category._id === activeCategoryId,
  )

  return (
    <div
      className="relative hidden border-t border-black/10 bg-[#eee2d3]/70 sm:block"
      onMouseLeave={() => setActivePanel('')}
    >
      <nav className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 sm:overflow-x-auto sm:px-6 lg:px-8">
        <Link
          className="inline-flex shrink-0 items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-[#4f463d] transition hover:bg-white hover:text-[#181512]"
          onClick={() => setActivePanel('')}
          onFocus={() => setActivePanel('all-categories')}
          onMouseEnter={() => setActivePanel('all-categories')}
          to="/categories"
        >
          Categories
          <ChevronDown className="h-4 w-4" />
        </Link>

        {isCategoriesLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <span
                className="hidden h-9 w-24 shrink-0 animate-pulse bg-white/70 sm:block"
                key={index}
              />
            ))
          : featuredCategories.map((category) => (
              <Link
                className="hidden shrink-0 px-3 py-2 text-sm font-bold text-[#4f463d] transition hover:bg-white hover:text-[#181512] sm:block"
                key={category._id}
                onClick={() => setActivePanel('')}
                onFocus={() => setActivePanel(category._id)}
                onMouseEnter={() => setActivePanel(category._id)}
                to={getCategoryUrl(category._id)}
              >
                {category.name}
              </Link>
            ))}
      </nav>

      {activePanel === 'all-categories' ? (
        <div className="absolute left-0 right-0 top-full z-40 hidden border-t border-black/10 bg-white shadow-[0_28px_60px_rgba(24,21,18,0.18)] backdrop-blur-sm sm:block">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7a3f1d]">
                  Artisane Catalog
                </p>
                <h3 className="text-lg font-bold text-[#181512]">
                  Explore All Categories
                </h3>
              </div>
              <Link
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#7a3f1d] transition hover:text-[#181512]"
                onClick={() => setActivePanel('')}
                to="/categories"
              >
                View all page <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.length ? (
                categories.map((category) => {
                  const imageUrl = getCategoryImageUrl(category.image)

                  return (
                    <Link
                      className="group flex items-center gap-3.5 border border-black/10 bg-white p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#181512] hover:bg-[#f8f3ea] hover:shadow-sm"
                      key={category._id}
                      onClick={() => setActivePanel('')}
                      to={getCategoryUrl(category._id)}
                    >
                      <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden bg-[#f8f3ea] text-[#7a3f1d] transition-transform duration-300 group-hover:scale-105">
                        {imageUrl ? (
                          <img
                            alt={category.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            src={imageUrl}
                          />
                        ) : (
                          <Globe2 className="h-5 w-5" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-1">
                          <span className="block truncate text-sm font-bold text-[#181512] transition-colors group-hover:text-[#7a3f1d]">
                            {category.name}
                          </span>
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity duration-200 text-[#7a3f1d] group-hover:opacity-100" />
                        </span>
                        <CategoryProductCount categoryId={category._id} />
                      </span>
                    </Link>
                  )
                })
              ) : (
                <p className="col-span-full py-4 text-center text-sm font-semibold text-[#6b5f53]">
                  No categories available.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {activeCategory ? (
        <div className="absolute left-0 right-0 top-full z-40 hidden border-t border-black/10 bg-white/95 shadow-[0_20px_40px_rgba(24,21,18,0.15)] backdrop-blur-md sm:block">
          <div className="mx-auto flex flex-col gap-4 px-4 py-3.5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex shrink-0 items-center gap-3 lg:border-r lg:border-black/10 lg:pr-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden border border-black/10 bg-[#f8f3ea] text-[#7a3f1d]">
                {getCategoryImageUrl(activeCategory.image) ? (
                  <img
                    alt={activeCategory.name}
                    className="h-full w-full object-cover"
                    src={getCategoryImageUrl(activeCategory.image)}
                  />
                ) : (
                  <Globe2 className="h-6 w-6 text-[#7a3f1d]" />
                )}
              </span>
              <div>
                <span className="block text-xs font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
                  {activeCategory.name}
                </span>
                <span className="mt-0.5 block text-xs font-semibold text-[#6b5f53]">
                  {isCategoryProductsFetching
                    ? 'Loading products...'
                    : formatProductCount(activeCategoryProductCount)}
                </span>
              </div>
              <Link
                className="ml-auto inline-flex min-h-8 items-center gap-1 bg-[#181512] px-3 text-xs font-bold text-white transition hover:bg-[#7a3f1d] lg:ml-2"
                onClick={() => setActivePanel('')}
                to={getCategoryUrl(activeCategory._id)}
              >
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid flex-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {isCategoryProductsFetching ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    className="h-16 animate-pulse bg-[#f8f3ea]"
                    key={index}
                  />
                ))
              ) : categoryProducts.length ? (
                categoryProducts.map((product) => {
                  const imageUrl = getProductImage(product)

                  return (
                    <Link
                      className="group flex items-center gap-3 border border-black/10 bg-white p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#181512] hover:bg-[#f8f3ea]"
                      key={product._id}
                      onClick={() => setActivePanel('')}
                      to={`/products/${product._id}`}
                    >
                      <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden bg-[#f8f3ea] text-[#7a3f1d]">
                        {imageUrl ? (
                          <img
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            src={imageUrl}
                          />
                        ) : (
                          <ImageOff className="h-4 w-4" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-bold text-[#181512] transition-colors group-hover:text-[#7a3f1d]">
                          {product.name}
                        </span>
                        <span className="mt-0.5 block text-xs font-bold text-[#7a3f1d]">
                          {formatPrice(product.price)}
                        </span>
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#7a3f1d] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    </Link>
                  )
                })
              ) : (
                <p className="py-2 text-xs font-semibold text-[#6b5f53]">
                  No products found in this category.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default NavbarCategoryNav
