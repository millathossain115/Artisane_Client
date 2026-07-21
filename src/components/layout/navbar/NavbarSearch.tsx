import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Search, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { useGetProductsQuery } from '../../../features/products/productApi'
import {
  formatPrice,
  getProductCategoryName,
  getProductImage,
} from '../../../utils/productDisplay'

type NavbarSearchProps = {
  className?: string
}

function NavbarSearch({ className = '' }: NavbarSearchProps) {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement | null>(null)
  const trimmedSearchValue = searchValue.trim()
  const shouldFetchSearch = trimmedSearchValue.length >= 2
  const { data: searchProductList, isFetching: isSearchingProducts } =
    useGetProductsQuery(
      {
        limit: 5,
        page: 1,
        searchTerm: trimmedSearchValue,
      },
      { skip: !shouldFetchSearch },
    )
  const searchProducts = searchProductList?.data ?? []

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!searchRef.current?.contains(event.target as Node)) {
        setIsSearchOpen(false)
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const searchTerm = String(formData.get('search') ?? '').trim()

    navigate(
      searchTerm
        ? `/products?search=${encodeURIComponent(searchTerm)}`
        : '/products',
    )
    setSearchValue(searchTerm)
    setIsSearchOpen(false)
  }

  function handleSearchChange(value: string) {
    setSearchValue(value)
    setIsSearchOpen(value.trim().length >= 2)
  }

  function handleClearSearch() {
    setSearchValue('')
    setIsSearchOpen(false)
  }

  function handleSearchProductClick() {
    setIsSearchOpen(false)
  }

  const isActive = isFocused || isSearchOpen

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form
        className={`flex items-center gap-2.5 border bg-white px-3.5 py-2 transition-all duration-200 ${
          isActive
            ? 'border-[#181512] ring-2 ring-[#181512]/10 shadow-md'
            : 'border-black/15 hover:border-black/35'
        }`}
        onSubmit={handleSearchSubmit}
      >
        <Search
          className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
            isActive ? 'text-[#7a3f1d]' : 'text-[#766a5e]'
          }`}
        />
        <input
          className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#8a7d71]"
          name="search"
          onBlur={() => setIsFocused(false)}
          onChange={(event) => handleSearchChange(event.target.value)}
          onFocus={() => {
            setIsFocused(true)
            setIsSearchOpen(trimmedSearchValue.length >= 2)
          }}
          placeholder="Search handmade products..."
          type="search"
          value={searchValue}
        />
        {searchValue ? (
          <button
            aria-label="Clear search"
            className="grid h-5 w-5 shrink-0 place-items-center text-[#8a7d71] transition hover:text-[#181512]"
            onClick={handleClearSearch}
            type="button"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </form>

      {isSearchOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 border border-black/10 bg-white shadow-[0_22px_44px_rgba(24,21,18,0.16)]">
          {isSearchingProducts ? (
            <div className="grid gap-3 p-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div className="h-14 animate-pulse bg-[#f8f3ea]" key={index} />
              ))}
            </div>
          ) : searchProducts.length ? (
            <div className="py-2">
              {searchProducts.map((product) => {
                const imageUrl = getProductImage(product)

                return (
                  <Link
                    className="grid grid-cols-[52px_1fr_auto] items-center gap-3 px-3 py-2 transition hover:bg-[#f8f3ea]"
                    key={product._id}
                    onClick={handleSearchProductClick}
                    to={`/products/${product._id}`}
                  >
                    <span className="grid h-12 w-12 place-items-center overflow-hidden bg-[#f8f3ea] text-[#7a3f1d]">
                      {imageUrl ? (
                        <img
                          alt={product.name}
                          className="h-full w-full object-cover"
                          src={imageUrl}
                        />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold">
                        {product.name}
                      </span>
                      <span className="mt-1 block truncate text-xs font-semibold text-[#6b5f53]">
                        {getProductCategoryName(product)}
                      </span>
                    </span>
                    <span className="text-xs font-bold text-[#7a3f1d]">
                      {formatPrice(product.price)}
                    </span>
                  </Link>
                )
              })}
              <Link
                className="mt-1 block border-t border-black/10 px-3 py-3 text-center text-xs font-bold text-[#7a3f1d] transition hover:bg-[#f8f3ea]"
                onClick={handleSearchProductClick}
                to={`/products?search=${encodeURIComponent(trimmedSearchValue)}`}
              >
                View all results
              </Link>
            </div>
          ) : (
            <div className="p-4 text-sm font-semibold text-[#6b5f53]">
              No quick results found.
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default NavbarSearch
