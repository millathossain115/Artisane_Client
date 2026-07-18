import { useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  UserRound,
  X,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { API_BASE_URL } from '../../config/api'
import {
  clearCart,
  decreaseCartItem,
  increaseCartItem,
  removeFromCart,
} from '../../features/cart/cartSlice'
import {
  clearAuthSession,
  getStoredUser,
  type AuthUser,
} from '../../features/auth/authApi'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'

const categoryItems = [
  'Painting',
  'Ceramics',
  'Sculpture',
  'Textiles',
  'Prints',
  'Studio Tools',
  'Gift Edit',
]

function formatPrice(value: number) {
  return `$${value.toFixed(value % 1 === 0 ? 0 : 2)}`
}

function getCartImageUrl(image?: string) {
  if (!image) {
    return ''
  }

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }

  return `${API_BASE_URL.replace('/api/v1', '')}${image}`
}

function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const cartItems = useAppSelector((state) => state.cart.items)
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser())
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)
  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  function handleLogout() {
    clearAuthSession()
    setUser(null)
    setIsProfileOpen(false)
    navigate('/login')
  }

  const displayName = user?.name ?? 'Guest Artist'
  const displayEmail = user?.email ?? 'Login to view account'

  return (
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

        <form
          className="ml-auto hidden min-w-64 max-w-md flex-1 items-center gap-2 border border-black/10 bg-white px-3 py-2 md:flex"
          onSubmit={(event) => event.preventDefault()}
        >
          <Search className="h-5 w-5 text-[#766a5e]" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#8a7d71]"
            placeholder="Search handmade products"
            type="search"
          />
        </form>

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
                        to="/dashboard#orders"
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

          <button
            className="relative grid h-10 w-10 place-items-center bg-[#181512] text-white transition hover:bg-[#7a3f1d]"
            aria-label="Open cart"
            onClick={() => setIsCartOpen(true)}
            type="button"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center bg-[#c85f2f] px-1 text-xs font-bold">
              {cartQuantity}
            </span>
          </button>
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
        <form
          className="mx-auto flex max-w-7xl items-center gap-2 border border-black/10 bg-white px-3 py-2"
          onSubmit={(event) => event.preventDefault()}
        >
          <Search className="h-5 w-5 text-[#766a5e]" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#8a7d71]"
            placeholder="Search handmade products"
            type="search"
          />
        </form>
      </div>

      {isCartOpen ? (
        <div className="fixed inset-0 z-[80]" role="presentation">
          <button
            aria-label="Close cart"
            className="absolute inset-0 h-full w-full bg-[#181512]/55"
            onClick={() => setIsCartOpen(false)}
            type="button"
          />

          <aside
            aria-label="Shopping cart"
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
                  Cart
                </p>
                <h2 className="text-2xl font-bold">Your craft box</h2>
              </div>
              <button
                aria-label="Close cart"
                className="grid h-10 w-10 place-items-center border border-black/10 transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                onClick={() => setIsCartOpen(false)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cartItems.length ? (
                <div className="grid gap-4">
                  {cartItems.map((item) => {
                    const imageUrl = getCartImageUrl(item.image)

                    return (
                      <article
                        className="grid grid-cols-[76px_1fr] gap-3 border-b border-black/10 pb-4"
                        key={item.id}
                      >
                        <Link
                          className="block overflow-hidden bg-[#f8f3ea]"
                          onClick={() => setIsCartOpen(false)}
                          to={`/products/${item.id}`}
                        >
                          {imageUrl ? (
                            <img
                              alt={item.name}
                              className="h-24 w-full object-cover"
                              src={imageUrl}
                            />
                          ) : (
                            <span className="grid h-24 place-items-center text-[#7a3f1d]">
                              <ShoppingBag className="h-5 w-5" />
                            </span>
                          )}
                        </Link>

                        <div className="min-w-0">
                          <Link
                            className="line-clamp-2 font-bold leading-snug transition hover:text-[#7a3f1d]"
                            onClick={() => setIsCartOpen(false)}
                            to={`/products/${item.id}`}
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-xs font-semibold text-[#6b5f53]">
                            {item.categoryName}
                          </p>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="inline-grid grid-cols-[32px_40px_32px] overflow-hidden border border-black/10">
                              <button
                                aria-label={`Decrease ${item.name}`}
                                className="grid h-8 place-items-center transition hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-45"
                                disabled={item.quantity <= 1}
                                onClick={() =>
                                  dispatch(decreaseCartItem(item.id))
                                }
                                type="button"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="grid h-8 place-items-center border-x border-black/10 text-xs font-bold">
                                {item.quantity}
                              </span>
                              <button
                                aria-label={`Increase ${item.name}`}
                                className="grid h-8 place-items-center transition hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-45"
                                disabled={item.quantity >= item.stock}
                                onClick={() =>
                                  dispatch(increaseCartItem(item.id))
                                }
                                type="button"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <button
                              aria-label={`Remove ${item.name}`}
                              className="grid h-8 w-8 place-items-center border border-black/10 text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef]"
                              onClick={() => dispatch(removeFromCart(item.id))}
                              type="button"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="mt-3 text-sm font-bold">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="grid min-h-72 place-items-center text-center">
                  <div>
                    <span className="mx-auto grid h-14 w-14 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                      <ShoppingBag className="h-6 w-6" />
                    </span>
                    <p className="mt-4 text-lg font-bold">Cart is empty.</p>
                    <p className="mt-2 text-sm text-[#6b5f53]">
                      Add products from home or product detail page.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-black/10 p-5">
              <div className="flex items-center justify-between gap-3 text-sm font-bold">
                <span>Subtotal</span>
                <span className="text-xl">{formatPrice(cartSubtotal)}</span>
              </div>
              <button
                className="mt-4 min-h-12 w-full bg-[#181512] px-5 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={!cartItems.length}
                type="button"
              >
                Checkout coming soon
              </button>
              <button
                className="mt-3 min-h-11 w-full border border-black/10 px-5 text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={!cartItems.length}
                onClick={() => dispatch(clearCart())}
                type="button"
              >
                Clear cart
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
