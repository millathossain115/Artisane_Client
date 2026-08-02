import { UserRound, X } from 'lucide-react'
import { Link, type Location } from 'react-router-dom'

import { isSuperAdminRole, type AuthUser } from '../../features/auth/authApi'
import type {
  SidebarActionItem,
  SidebarGroupItem,
  SidebarItem,
  SidebarLinkItem,
  SidebarNavItem,
} from './dashboardLayoutTypes'

type DashboardSidebarProps = {
  displayName: string
  helperText?: string
  helperTitle: string
  isCustomerLayout: boolean
  location: Location
  onClose: () => void
  onLogout: () => void
  showCloseButton?: boolean
  sidebarItems: SidebarItem[]
  user: AuthUser | null
  workspaceLabel: string
}

function getSidebarLinkTarget(to: string) {
  if (to.startsWith('#')) {
    return {
      hash: to,
      path: '/dashboard',
      to: `/dashboard${to}`,
    }
  }

  const [path, hashValue] = to.split('#')

  return {
    hash: hashValue ? `#${hashValue}` : '',
    path,
    to,
  }
}

function isSidebarGroup(item: SidebarItem): item is SidebarGroupItem {
  return 'items' in item
}

function isSidebarAction(item: SidebarNavItem): item is SidebarActionItem {
  return 'action' in item
}

function DashboardSidebar({
  displayName,
  helperText,
  helperTitle,
  isCustomerLayout,
  location,
  onClose,
  onLogout,
  showCloseButton = false,
  sidebarItems,
  user,
  workspaceLabel,
}: DashboardSidebarProps) {
  function getSidebarItemClass(isActive: boolean) {
    const baseClass =
      'flex items-center gap-3 px-4 py-3 text-sm font-medium tracking-wide transition'

    if (isCustomerLayout) {
      return isActive
        ? `${baseClass} border border-black/10 bg-[#f8f3ea] font-bold text-[#181512] shadow-sm hover:bg-[#f8f3ea]`
        : `${baseClass} border border-transparent text-[#4f463d] hover:border-black/10 hover:bg-[#f8f3ea] hover:text-[#181512]`
    }

    return isActive
      ? `${baseClass} bg-white text-[#181512] font-semibold hover:bg-white hover:text-[#181512]`
      : `${baseClass} text-white/70 hover:bg-white/10 hover:text-white`
  }

  function canAccessSidebarItem(item: SidebarItem) {
    return item.requiredRole !== 'super_admin' || isSuperAdminRole(user?.role)
  }

  function renderSidebarAction(item: SidebarActionItem, isNested = false) {
    const Icon = item.icon
    const className = `${getSidebarItemClass(false)} w-full text-left ${
      isNested ? 'pl-7' : ''
    }`

    return (
      <button
        className={className}
        key={item.label}
        onClick={onLogout}
        type="button"
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{item.label}</span>
      </button>
    )
  }

  function renderSidebarLink(item: SidebarLinkItem, isNested = false) {
    const Icon = item.icon
    const linkTarget = getSidebarLinkTarget(item.to)
    const isCustomerNestedRoute =
      isCustomerLayout &&
      item.to === '/dashboard/orders' &&
      location.pathname.startsWith('/dashboard/orders')
    const isActive = linkTarget.hash
      ? location.pathname === linkTarget.path && location.hash === linkTarget.hash
      : (isCustomerNestedRoute || location.pathname === linkTarget.path) &&
        !location.hash
    const className = `${getSidebarItemClass(isActive)} ${
      isNested ? 'pl-7' : ''
    }`

    return (
      <Link
        className={className}
        key={item.label}
        onClick={onClose}
        to={linkTarget.to}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{item.label}</span>
      </Link>
    )
  }

  const navClass = isCustomerLayout
    ? 'dashboard-sidebar-scroll flex-1 space-y-1 overflow-y-auto px-3 py-4'
    : 'dashboard-sidebar-scroll flex-1 space-y-1 overflow-y-auto px-4 py-5'
  const groupLabelClass = isCustomerLayout
    ? 'px-4 pb-2 text-xs font-semibold tracking-wider uppercase text-[#7a3f1d]'
    : 'px-4 pb-2 text-xs font-semibold tracking-wider uppercase text-[#f1c9a6]'
  const helperWrapClass = isCustomerLayout
    ? 'border-t border-black/10 p-3'
    : 'border-t border-white/10 p-4'
  const helperCardClass = isCustomerLayout
    ? 'border border-black/10 bg-[#f8f3ea] p-4'
    : 'border border-white/10 bg-white/5 p-4'
  const helperTitleClass = isCustomerLayout
    ? 'text-xs font-semibold tracking-wider uppercase text-[#7a3f1d]'
    : 'text-xs font-semibold tracking-wider uppercase text-[#f1c9a6]'
  const helperTextClass = isCustomerLayout
    ? 'mt-2 text-sm leading-6 text-[#6b5f53]'
    : 'mt-2 text-sm leading-6 text-white/70'

  return (
    <>
      {isCustomerLayout ? (
        <div className="flex min-h-16 items-center gap-3 border-b border-black/10 px-4 py-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#181512] text-white">
            <UserRound className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#7a3f1d]">
              {workspaceLabel}
            </p>
            <p className="truncate text-sm font-bold text-[#181512]">
              {displayName}
            </p>
          </div>

          {showCloseButton ? (
            <button
              className="ml-auto grid h-10 w-10 place-items-center border border-black/10 bg-white text-[#181512] transition hover:border-[#181512]"
              aria-label="Close dashboard menu"
              onClick={onClose}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      ) : (
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <span className="grid h-11 w-11 place-items-center bg-white text-base font-bold text-[#181512]">
            A
          </span>
          <div className="min-w-0">
            <Link
              className="font-display text-3xl font-bold tracking-tight"
              onClick={onClose}
              to="/"
            >
              Artisane
            </Link>
            <p className="truncate text-xs font-medium tracking-wider uppercase text-white/55">
              {workspaceLabel}
            </p>
          </div>

          {showCloseButton && (
            <button
              className="ml-auto grid h-10 w-10 place-items-center border border-white/10 text-white transition hover:bg-white hover:text-[#181512]"
              aria-label="Close dashboard menu"
              onClick={onClose}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      <nav className={navClass}>
        {sidebarItems.map((item) => {
          if (!canAccessSidebarItem(item)) {
            return null
          }

          if (!isSidebarGroup(item)) {
            return isSidebarAction(item)
              ? renderSidebarAction(item)
              : renderSidebarLink(item)
          }

          const visibleItems = item.items.filter(canAccessSidebarItem)

          if (!visibleItems.length) {
            return null
          }

          return (
            <div className="pt-3 first:pt-0" key={item.label}>
              <p className={groupLabelClass}>{item.label}</p>
              <div className="space-y-1">
                {visibleItems.map((childItem) =>
                  isSidebarAction(childItem)
                    ? renderSidebarAction(childItem, true)
                    : renderSidebarLink(childItem, true),
                )}
              </div>
            </div>
          )
        })}
      </nav>

      <div className={helperWrapClass}>
        <div className={helperCardClass}>
          <p className={helperTitleClass}>{helperTitle}</p>
          <p className={helperTextClass}>
            {helperText ??
              'Review your latest marketplace activity and account tasks.'}
          </p>
        </div>
      </div>
    </>
  )
}

export default DashboardSidebar
