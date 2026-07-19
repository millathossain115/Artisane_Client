import { useState } from 'react'
import { ChevronDown, ImageOff } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useGetCategoriesQuery } from '../../../features/categories/categoryApi'
import { useGetProductsQuery } from '../../../features/products/productApi'
import { formatPrice, getProductImage } from '../../../utils/productDisplay'

const FEATURED_CATEGORY_LIMIT = 6

function getCategoryUrl(categoryId: string) {
  return `/products?category=${encodeURIComponent(categoryId)}`
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
      <span className="text-xs font-bold text-[#8a7d71]">Loading count</span>
    )
  }

  if (isError) {
    return (
      <span className="text-xs font-bold text-[#8f3f1d]">Count failed</span>
    )
  }

  return (
    <span className="text-xs font-bold text-[#7a3f1d]">
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
  const categories = (categoryList?.data ?? []).filter(
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
      className="relative border-t border-black/10 bg-[#eee2d3]/70"
      onMouseLeave={() => setActivePanel('')}
    >
      <nav className="mx-auto flex max-w-7xl gap-2 px-4 py-2 sm:overflow-x-auto sm:px-6 lg:px-8">
        <button
          aria-expanded={activePanel === 'all-categories'}
          className="inline-flex shrink-0 items-center gap-1 px-3 py-2 text-sm font-bold text-[#4f463d] transition hover:bg-white hover:text-[#181512]"
          onClick={() =>
            setActivePanel((currentPanel) =>
              currentPanel === 'all-categories' ? '' : 'all-categories',
            )
          }
          onFocus={() => setActivePanel('all-categories')}
          onMouseEnter={() => setActivePanel('all-categories')}
          type="button"
        >
          Categories
          <ChevronDown className="h-4 w-4" />
        </button>

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
        <div className="absolute left-0 right-0 top-full z-40 border-t border-black/10 bg-white shadow-[0_22px_44px_rgba(24,21,18,0.14)]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-4 py-4 sm:gap-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            {categories.length ? (
              categories.map((category) => (
                <Link
                  className="flex min-h-20 items-center justify-between gap-3 border border-black/10 px-3 py-3 transition hover:border-[#181512] hover:bg-[#f8f3ea] sm:gap-4 sm:px-4"
                  key={category._id}
                  onClick={() => setActivePanel('')}
                  to={getCategoryUrl(category._id)}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">
                      {category.name}
                    </span>
                    <CategoryProductCount categoryId={category._id} />
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-sm font-semibold text-[#6b5f53]">
                No categories available.
              </p>
            )}
          </div>
        </div>
      ) : null}

      {activeCategory ? (
        <div className="absolute left-0 right-0 top-full z-40 border-t border-black/10 bg-white shadow-[0_22px_44px_rgba(24,21,18,0.14)]">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
                {activeCategory.name}
              </p>
              <p className="mt-2 text-sm font-bold text-[#4f463d]">
                {isCategoryProductsFetching
                  ? 'Loading products'
                  : formatProductCount(activeCategoryProductCount)}
              </p>
              <Link
                className="mt-3 inline-flex min-h-10 items-center justify-center bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
                onClick={() => setActivePanel('')}
                to={getCategoryUrl(activeCategory._id)}
              >
                View category
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {isCategoryProductsFetching ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    className="h-28 animate-pulse bg-[#f8f3ea]"
                    key={index}
                  />
                ))
              ) : categoryProducts.length ? (
                categoryProducts.map((product) => {
                  const imageUrl = getProductImage(product)

                  return (
                    <Link
                      className="grid grid-cols-[72px_1fr] gap-3 border border-black/10 p-2 transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                      key={product._id}
                      onClick={() => setActivePanel('')}
                      to={`/products/${product._id}`}
                    >
                      <span className="grid h-20 w-20 place-items-center overflow-hidden bg-[#f8f3ea] text-[#7a3f1d]">
                        {imageUrl ? (
                          <img
                            alt={product.name}
                            className="h-full w-full object-cover"
                            src={imageUrl}
                          />
                        ) : (
                          <ImageOff className="h-5 w-5" />
                        )}
                      </span>
                      <span className="min-w-0 self-center">
                        <span className="line-clamp-2 text-sm font-bold">
                          {product.name}
                        </span>
                        <span className="mt-1 block text-xs font-bold text-[#7a3f1d]">
                          {formatPrice(product.price)}
                        </span>
                      </span>
                    </Link>
                  )
                })
              ) : (
                <p className="text-sm font-semibold text-[#6b5f53]">
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
