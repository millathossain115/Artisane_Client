import { useState } from 'react'
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingBag,
  UserRound,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import {
  clearAuthSession,
  getStoredUser,
  type AuthUser,
} from '../../features/auth/authApi'

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
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser())
  const [isProfileOpen, setIsProfileOpen] = useState(false)

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
          <div className="relative">
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
                    <a
                      className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-[#4f463d] transition hover:bg-[#f8f3ea] hover:text-[#181512]"
                      href="#"
                      role="menuitem"
                    >
                      <UserRound className="h-4 w-4" />
                      My profile
                    </a>
                    <a
                      className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-[#4f463d] transition hover:bg-[#f8f3ea] hover:text-[#181512]"
                      href="#"
                      role="menuitem"
                    >
                      <Package className="h-4 w-4" />
                      My orders
                    </a>
                    <a
                      className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-[#4f463d] transition hover:bg-[#f8f3ea] hover:text-[#181512]"
                      href="#"
                      role="menuitem"
                    >
                      <Settings className="h-4 w-4" />
                      Account settings
                    </a>
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
            type="button"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center bg-[#c85f2f] px-1 text-xs font-bold">
              3
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
    </header>
  )
}

export default Navbar
