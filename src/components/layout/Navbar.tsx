import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  UserRound,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import CartButton from '../cart/CartButton'
import { useGetProductsQuery } from '../../features/products/productApi'
import { syncCartForCurrentUser } from '../../features/cart/cartSlice'
import {
  clearAuthSession,
  getStoredUser,
  type AuthUser,
} from '../../features/auth/authApi'
import { useAppDispatch } from '../../redux/hooks'
import {
  formatPrice,
  getProductCategoryName,
  getProductImage,
} from '../../utils/productDisplay'

const categoryItems = [
  'Painting',
  'Ceramics',
  'Sculpture',
  'Textiles',
  'Prints',
  'Studio Tools',
  'Gift Edit',
]

function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser())
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)
  const desktopSearchRef = useRef<HTMLDivElement | null>(null)
  const mobileSearchRef = useRef<HTMLDivElement | null>(null)
  const isAdmin = user?.role === 'admin'
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
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false)
      }

      const clickTarget = event.target as Node
      const isInsideDesktopSearch =
        desktopSearchRef.current?.contains(clickTarget)
      const isInsideMobileSearch =
        mobileSearchRef.current?.contains(clickTarget)

      if (!isInsideDesktopSearch && !isInsideMobileSearch) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  function handleLogout() {
    clearAuthSession()
    dispatch(syncCartForCurrentUser())
    setUser(null)
    setIsProfileOpen(false)
    navigate('/login')
  }

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

  function handleSearchProductClick() {
    setIsSearchOpen(false)
  }

  const displayName = user?.name ?? 'Guest Artist'
  const displayEmail = user?.email ?? 'Login to view account'

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f8f3ea]/95 shadow-[0_10px_30px_rgba(24,21,18,0.06)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <button
            className="grid h-10 w-10 place-items-center border border-black/10 bg-white/70 text-[#181512] transition hover:bg-white lg:hidden"
            aria-label="Open menu"
            type="button"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center bg-[#181512] text-base font-bold text-white">
              A
            </span>
            <span className="font-display text-2xl font-bold">Artisane</span>
          </Link>

          <div
            className="relative ml-auto hidden min-w-64 max-w-md flex-1 md:block"
            ref={desktopSearchRef}
          >
            <form
              className="flex items-center gap-2 border border-black/10 bg-white px-3 py-2"
              onSubmit={handleSearchSubmit}
            >
              <Search className="h-5 w-5 text-[#766a5e]" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#8a7d71]"
                name="search"
                onChange={(event) => handleSearchChange(event.target.value)}
                onFocus={() => setIsSearchOpen(trimmedSearchValue.length >= 2)}
                placeholder="Search handmade products"
                type="search"
                value={searchValue}
              />
            </form>

            {isSearchOpen ? (
              <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 border border-black/10 bg-white shadow-[0_22px_44px_rgba(24,21,18,0.16)]">
                {isSearchingProducts ? (
                  <div className="grid gap-3 p-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        className="h-14 animate-pulse bg-[#f8f3ea]"
                        key={index}
                      />
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

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <div className="relative" ref={profileMenuRef}>
              <button
                className="flex min-w-0 items-center gap-3 border border-black/10 bg-white px-2 py-2 text-left transition hover:border-[#181512] sm:min-w-56 sm:px-3"
                aria-expanded={isProfileOpen}
                aria-haspopup="menu"
                onClick={() => setIsProfileOpen((current) => !current)}
                type="button"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center bg-[#181512] text-white">
                  <UserRound className="h-4 w-4" />
                </span>
                <span className="hidden min-w-0 flex-1 sm:block">
                  <span className="block truncate text-sm font-bold">
                    {displayName}
                  </span>
                  <span className="block truncate text-xs text-[#6b5f53]">
                    {displayEmail}
                  </span>
                </span>
                <ChevronDown className="hidden h-4 w-4 shrink-0 text-[#6b5f53] sm:block" />
              </button>

              {isProfileOpen ? (
                <div
                  className="absolute right-0 top-[calc(100%+0.5rem)] w-64 border border-black/10 bg-white p-2 shadow-[0_22px_40px_rgba(24,21,18,0.14)]"
                  role="menu"
                >
                  <div className="border-b border-black/10 px-3 py-3">
                    <p className="truncate text-sm font-bold">{displayName}</p>
                    <p className="truncate text-xs text-[#6b5f53]">
                      {displayEmail}
                    </p>
                  </div>

                  {user ? (
                    <>
                      <Link
                        className="mt-2 flex items-center gap-3 px-3 py-2 text-sm font-semibold text-[#4f463d] transition hover:bg-[#f8f3ea] hover:text-[#181512]"
                        onClick={() => setIsProfileOpen(false)}
                        role="menuitem"
                        to="/dashboard"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-[#4f463d] transition hover:bg-[#f8f3ea] hover:text-[#181512]"
                        onClick={() => setIsProfileOpen(false)}
                        role="menuitem"
                        to="/dashboard/profile"
                      >
                        <UserRound className="h-4 w-4" />
                        My profile
                      </Link>
                      {user.role !== 'admin' && (
                        <Link
                          className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-[#4f463d] transition hover:bg-[#f8f3ea] hover:text-[#181512]"
                          onClick={() => setIsProfileOpen(false)}
                          role="menuitem"
                          to="/dashboard/orders"
                        >
                          <Package className="h-4 w-4" />
                          My orders
                        </Link>
                      )}
                      <button
                        className="mt-2 flex w-full items-center gap-3 border-t border-black/10 px-3 py-3 text-left text-sm font-bold text-[#7a3f1d] transition hover:bg-[#f8f3ea] hover:text-[#181512]"
                        onClick={handleLogout}
                        role="menuitem"
                        type="button"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="mt-2 grid gap-2 p-2">
                      <Link
                        className="bg-[#181512] px-4 py-2 text-center text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
                        onClick={() => setIsProfileOpen(false)}
                        to="/login"
                      >
                        Login
                      </Link>
                      <Link
                        className="border border-black/10 px-4 py-2 text-center text-sm font-bold transition hover:border-[#181512]"
                        onClick={() => setIsProfileOpen(false)}
                        to="/register"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {!isAdmin ? <CartButton /> : null}
          </div>
        </div>

        <div className="border-t border-black/10 bg-[#eee2d3]/70">
          <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
            {categoryItems.map((item) => (
              <a
                className="shrink-0 px-3 py-2 text-sm font-bold text-[#4f463d] transition hover:bg-white hover:text-[#181512]"
                href="#"
                key={item}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        <div className="border-t border-black/10 px-4 py-3 md:hidden">
          <div className="relative mx-auto max-w-7xl" ref={mobileSearchRef}>
            <form
              className="flex items-center gap-2 border border-black/10 bg-white px-3 py-2"
              onSubmit={handleSearchSubmit}
            >
              <Search className="h-5 w-5 text-[#766a5e]" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#8a7d71]"
                name="search"
                onChange={(event) => handleSearchChange(event.target.value)}
                onFocus={() => setIsSearchOpen(trimmedSearchValue.length >= 2)}
                placeholder="Search handmade products"
                type="search"
                value={searchValue}
              />
            </form>

            {isSearchOpen ? (
              <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 border border-black/10 bg-white shadow-[0_22px_44px_rgba(24,21,18,0.16)]">
                {isSearchingProducts ? (
                  <div className="grid gap-3 p-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        className="h-14 animate-pulse bg-[#f8f3ea]"
                        key={index}
                      />
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
        </div>
      </header>
    </>
  )
}

export default Navbar
