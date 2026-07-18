import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Bell,
  Brush,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import {
  clearAuthSession,
  getStoredUser,
  type AuthUser,
} from '../../features/auth/authApi'

type SidebarLinkItem = {
  label: string
  to: string
  icon: LucideIcon
}

type SidebarGroupItem = {
  label: string
  items: SidebarLinkItem[]
}

type SidebarItem = SidebarGroupItem | SidebarLinkItem

type DashboardAction = {
  label: string
  to?: string
  variant?: 'primary' | 'secondary'
}

type DashboardLayoutProps = {
  children: ReactNode
  title: string
  subtitle: string
  sidebarItems: SidebarItem[]
  actions?: DashboardAction[]
  eyebrow?: string
  helperTitle?: string
  helperText?: string
  workspaceLabel?: string
}

function DashboardLayout({
  actions = [],
  children,
  eyebrow = 'Control room',
  helperText,
  helperTitle = 'Today',
  sidebarItems,
  subtitle,
  title,
  workspaceLabel = 'Marketplace studio',
}: DashboardLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)
  const user = getStoredUser() as AuthUser | null

  const displayName = user?.name ?? 'Dashboard User'
  const displayEmail = user?.email ?? 'No email loaded'
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    if (!location.hash) {
      return
    }

    document
      .getElementById(location.hash.slice(1))
      ?.scrollIntoView({ block: 'start' })
  }, [location.hash])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsProfileOpen(false)
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  function handleLogout() {
    clearAuthSession()
    setIsProfileOpen(false)
    setIsSidebarOpen(false)
    navigate('/login')
  }

  function getSidebarItemClass(isActive: boolean) {
    const baseClass =
      'flex items-center gap-3 px-4 py-3 text-sm font-bold transition'

    return isActive
      ? `${baseClass} bg-white text-[#181512] hover:bg-white hover:text-[#181512]`
      : `${baseClass} text-white/70 hover:bg-white/10 hover:text-white`
  }

  function isSidebarGroup(item: SidebarItem): item is SidebarGroupItem {
    return 'items' in item
  }

  function renderSidebarLink(item: SidebarLinkItem, isNested = false) {
    const Icon = item.icon
    const isAnchor = item.to.startsWith('#')
    const isActive = isAnchor
      ? location.pathname === '/dashboard' && location.hash === item.to
      : location.pathname === item.to && !location.hash
    const to = isAnchor ? `/dashboard${item.to}` : item.to
    const className = `${getSidebarItemClass(isActive)} ${
      isNested ? 'pl-7' : ''
    }`

    return (
      <Link
        className={className}
        key={item.label}
        onClick={() => setIsSidebarOpen(false)}
        to={to}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{item.label}</span>
      </Link>
    )
  }

  function renderSidebarContent(showCloseButton = false) {
    return (
      <>
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <span className="grid h-11 w-11 place-items-center bg-white text-base font-bold text-[#181512]">
            A
          </span>
          <div className="min-w-0">
            <Link
              className="font-display text-3xl font-bold"
              onClick={() => setIsSidebarOpen(false)}
              to="/"
            >
              Artisane
            </Link>
            <p className="truncate text-xs font-semibold text-white/55">
              {workspaceLabel}
            </p>
          </div>

          {showCloseButton && (
            <button
              className="ml-auto grid h-10 w-10 place-items-center border border-white/10 text-white transition hover:bg-white hover:text-[#181512]"
              aria-label="Close dashboard menu"
              onClick={() => setIsSidebarOpen(false)}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {sidebarItems.map((item) => {
            if (!isSidebarGroup(item)) {
              return renderSidebarLink(item)
            }

            return (
              <div
                className="pt-3 first:pt-0"
                key={item.label}
              >
                <p className="px-4 pb-2 text-xs font-bold uppercase text-[#f1c9a6]">
                  {item.label}
                </p>
                <div className="space-y-1">
                  {item.items.map((childItem) =>
                    renderSidebarLink(childItem, true),
                  )}
                </div>
              </div>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase text-[#f1c9a6]">
              {helperTitle}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/70">
              {helperText ??
                'Review your latest marketplace activity and account tasks.'}
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f3ea] text-[#181512]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-black/10 bg-[#181512] text-white lg:flex lg:flex-col">
        {renderSidebarContent()}
      </aside>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          isSidebarOpen ? '' : 'pointer-events-none'
        }`}
        aria-hidden={!isSidebarOpen}
      >
        <button
          className={`absolute inset-0 bg-[#181512]/55 transition-opacity ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Close dashboard menu"
          onClick={() => setIsSidebarOpen(false)}
          type="button"
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-[min(20rem,86vw)] flex-col border-r border-white/10 bg-[#181512] text-white shadow-[24px_0_60px_rgba(24,21,18,0.28)] transition-transform duration-200 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {renderSidebarContent(true)}
        </aside>
      </div>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f8f3ea]/95 backdrop-blur">
          <div className="flex min-h-20 items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <button
              className="grid h-10 w-10 shrink-0 place-items-center border border-black/10 bg-white text-[#181512] transition hover:border-[#181512] lg:hidden"
              aria-label="Open dashboard menu"
              aria-expanded={isSidebarOpen}
              onClick={() => setIsSidebarOpen(true)}
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

              <div className="relative" ref={profileMenuRef}>
                <button
                  className="flex min-w-0 items-center gap-3 border border-black/10 bg-white px-3 py-2 text-left transition hover:border-[#181512]"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="menu"
                  onClick={() => setIsProfileOpen((current) => !current)}
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
                      <p className="truncate text-sm font-bold">
                        {displayName}
                      </p>
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
                  </div>
                ) : null}
              </div>

              <button
                className="hidden min-h-10 items-center gap-2 border border-black/10 bg-white px-3 text-sm font-bold transition hover:border-[#181512] sm:inline-flex"
                onClick={handleLogout}
                type="button"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col justify-between gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold text-[#7a3f1d]">{eyebrow}</p>
              <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b5f53]">
                {subtitle}
              </p>
            </div>

            {actions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {actions.map((action) => {
                  const className =
                    action.variant === 'primary'
                      ? 'bg-[#181512] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#7a3f1d]'
                      : 'border border-black/10 bg-white px-4 py-2 text-sm font-bold transition hover:border-[#181512]'

                  return action.to ? (
                    <Link
                      className={className}
                      key={action.label}
                      to={action.to}
                    >
                      {action.label}
                    </Link>
                  ) : (
                    <button
                      className={className}
                      key={action.label}
                      type="button"
                    >
                      {action.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
