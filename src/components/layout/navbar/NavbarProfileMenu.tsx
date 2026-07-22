import { useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Package,
  UserRound,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import CartButton from '../../cart/CartButton'
import {
  clearAuthSession,
  getStoredUser,
  type AuthUser,
} from '../../../features/auth/authApi'
import { syncCartForCurrentUser } from '../../../features/cart/cartSlice'
import { useAppDispatch } from '../../../redux/hooks'
import { getAssetUrl } from '../../../utils/productDisplay'

function NavbarProfileMenu() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser())
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)
  const isAdmin = user?.role === 'admin'
  const displayName = user?.name ?? 'Guest Artist'
  const displayEmail = user?.email ?? 'Login to view account'
  const userImageUrl = getAssetUrl(user?.profileImage || user?.avatar)

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
    dispatch(syncCartForCurrentUser())
    setUser(null)
    setIsProfileOpen(false)
    navigate('/login')
  }

  return (
    <div className="ml-auto flex items-center gap-2 md:ml-0">
      <div className="relative" ref={profileMenuRef}>
        <button
          aria-expanded={isProfileOpen}
          aria-haspopup="menu"
          className="flex min-w-0 items-center gap-3 border border-black/10 bg-white px-2 py-2 text-left transition hover:border-[#181512] sm:min-w-56 sm:px-3"
          onClick={() => setIsProfileOpen((current) => !current)}
          type="button"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden bg-[#181512] text-white">
            {userImageUrl ? (
              <img
                alt={displayName}
                className="h-full w-full object-cover"
                src={userImageUrl}
              />
            ) : (
              <UserRound className="h-4 w-4" />
            )}
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
            className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 border border-black/10 bg-white p-2 shadow-[0_22px_40px_rgba(24,21,18,0.14)]"
            role="menu"
          >
            <div className="border-b border-black/10 px-3 py-3">
              <p className="truncate text-sm font-bold">{displayName}</p>
              <p className="truncate text-xs text-[#6b5f53]">{displayEmail}</p>
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
  )
}

export default NavbarProfileMenu
