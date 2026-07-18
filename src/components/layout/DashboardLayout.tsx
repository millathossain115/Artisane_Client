import { useEffect, type ReactNode } from 'react'
import {
  Bell,
  Brush,
  ChevronDown,
  LogOut,
  Search,
  type LucideIcon,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import {
  clearAuthSession,
  getStoredUser,
  type AuthUser,
} from '../../features/auth/authApi'

type SidebarItem = {
  label: string
  to: string
  icon: LucideIcon
}

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
  searchPlaceholder?: string
  workspaceLabel?: string
}

function DashboardLayout({
  actions = [],
  children,
  eyebrow = 'Control room',
  helperText,
  helperTitle = 'Today',
  searchPlaceholder = 'Search dashboard',
  sidebarItems,
  subtitle,
  title,
  workspaceLabel = 'Marketplace studio',
}: DashboardLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = getStoredUser() as AuthUser | null

  useEffect(() => {
    if (!location.hash) {
      return
    }

    document
      .getElementById(location.hash.slice(1))
      ?.scrollIntoView({ block: 'start' })
  }, [location.hash])

  function handleLogout() {
    clearAuthSession()
    navigate('/login')
  }

  function getSidebarItemClass(isActive: boolean) {
    const baseClass =
      'flex items-center gap-3 px-4 py-3 text-sm font-bold transition'

    return isActive
      ? `${baseClass} bg-white text-[#181512] hover:bg-white hover:text-[#181512]`
      : `${baseClass} text-white/70 hover:bg-white/10 hover:text-white`
  }

  return (
    <div className="min-h-screen bg-[#f8f3ea] text-[#181512]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-black/10 bg-[#181512] text-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <span className="grid h-11 w-11 place-items-center bg-white text-base font-bold text-[#181512]">
            A
          </span>
          <div>
            <Link className="font-display text-3xl font-bold" to="/">
              Artisane
            </Link>
            <p className="text-xs font-semibold text-white/55">
              {workspaceLabel}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isAnchor = item.to.startsWith('#')
            const isActive = isAnchor
              ? location.pathname === '/dashboard' && location.hash === item.to
              : location.pathname === item.to && !location.hash
            const to = isAnchor ? `/dashboard${item.to}` : item.to
            const className = getSidebarItemClass(isActive)

            return (
              <Link className={className} key={item.label} to={to}>
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
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
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f8f3ea]/95 backdrop-blur">
          <div className="flex min-h-20 items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <Link className="flex items-center gap-3 lg:hidden" to="/">
              <span className="grid h-10 w-10 place-items-center bg-[#181512] text-base font-bold text-white">
                A
              </span>
              <span className="font-display text-2xl font-bold">Artisane</span>
            </Link>

            <form
              className="hidden min-w-64 max-w-lg flex-1 items-center gap-2 border border-black/10 bg-white px-3 py-2 md:flex"
              onSubmit={(event) => event.preventDefault()}
            >
              <Search className="h-5 w-5 text-[#766a5e]" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#8a7d71]"
                placeholder={searchPlaceholder}
                type="search"
              />
            </form>

            <div className="ml-auto flex items-center gap-2">
              <button
                className="relative grid h-10 w-10 place-items-center border border-black/10 bg-white transition hover:border-[#181512]"
                aria-label="Notifications"
                type="button"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 bg-[#c85f2f]" />
              </button>

              <div className="flex min-w-0 items-center gap-3 border border-black/10 bg-white px-3 py-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center bg-[#181512] text-white">
                  <Brush className="h-4 w-4" />
                </span>
                <span className="hidden min-w-0 sm:block">
                  <span className="block truncate text-sm font-bold">
                    {user?.name ?? 'Dashboard User'}
                  </span>
                  <span className="block truncate text-xs text-[#6b5f53]">
                    {user?.email ?? 'No email loaded'}
                  </span>
                </span>
                <ChevronDown className="hidden h-4 w-4 text-[#6b5f53] sm:block" />
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
