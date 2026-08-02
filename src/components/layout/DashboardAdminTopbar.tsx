import type { RefObject } from 'react'
import {
  Bell,
  Brush,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import CartButton from '../cart/CartButton'

type DashboardAdminTopbarProps = {
  displayEmail: string
  displayName: string
  isAdmin: boolean
  isProfileOpen: boolean
  isSidebarOpen: boolean
  onLogout: () => void
  onOpenSidebar: () => void
  onToggleProfile: () => void
  profileMenuRef: RefObject<HTMLDivElement | null>
  setIsProfileOpen: (isOpen: boolean) => void
}

function DashboardAdminTopbar({
  displayEmail,
  displayName,
  isAdmin,
  isProfileOpen,
  isSidebarOpen,
  onLogout,
  onOpenSidebar,
  onToggleProfile,
  profileMenuRef,
  setIsProfileOpen,
}: DashboardAdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f8f3ea]/95 backdrop-blur">
      <div className="flex min-h-20 items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          className="grid h-10 w-10 shrink-0 place-items-center border border-black/10 bg-white text-[#181512] transition hover:border-[#181512] lg:hidden"
          aria-label="Open dashboard menu"
          aria-expanded={isSidebarOpen}
          onClick={onOpenSidebar}
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link className="flex items-center gap-3 lg:hidden" to="/">
          <span className="grid h-10 w-10 place-items-center bg-[#181512] text-base font-bold text-white">
            A
          </span>
          <span className="hidden font-display text-2xl font-bold sm:inline">
            Artisane
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <button
            className="relative grid h-10 w-10 place-items-center border border-black/10 bg-white transition hover:border-[#181512]"
            aria-label="Notifications"
            type="button"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 bg-[#c85f2f]" />
          </button>

          {!isAdmin ? <CartButton /> : null}

          <div className="relative" ref={profileMenuRef}>
            <button
              className="flex min-w-0 items-center gap-3 border border-black/10 bg-white px-3 py-2 text-left transition hover:border-[#181512]"
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
              onClick={onToggleProfile}
              type="button"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center bg-[#181512] text-white">
                <Brush className="h-4 w-4" />
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block truncate text-sm font-bold">
                  {displayName}
                </span>
                <span className="block truncate text-xs text-[#6b5f53]">
                  {displayEmail}
                </span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-[#6b5f53] sm:block" />
            </button>

            {isProfileOpen ? (
              <div
                className="absolute right-0 top-[calc(100%+0.5rem)] z-40 w-64 border border-black/10 bg-white p-2 shadow-[0_22px_40px_rgba(24,21,18,0.14)]"
                role="menu"
              >
                <div className="border-b border-black/10 px-3 py-3">
                  <p className="truncate text-sm font-bold">{displayName}</p>
                  <p className="truncate text-xs text-[#6b5f53]">
                    {displayEmail}
                  </p>
                </div>

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
                {!isAdmin && (
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
                  onClick={onLogout}
                  role="menuitem"
                  type="button"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : null}
          </div>

          <button
            className="hidden min-h-10 items-center gap-2 border border-black/10 bg-white px-3 text-sm font-bold transition hover:border-[#181512] sm:inline-flex"
            onClick={onLogout}
            type="button"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default DashboardAdminTopbar
