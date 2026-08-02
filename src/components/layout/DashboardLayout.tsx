import { useEffect, useRef, useState } from 'react'
import { Menu } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  clearAuthSession,
  getStoredUser,
  isAdminRole,
  type AuthUser,
} from '../../features/auth/authApi'
import { syncCartForCurrentUser } from '../../features/cart/cartSlice'
import { useAppDispatch } from '../../redux/hooks'
import DashboardAdminTopbar from './DashboardAdminTopbar'
import DashboardPageHeading from './DashboardPageHeading'
import DashboardSidebar from './DashboardSidebar'
import Footer from './Footer'
import Navbar from './Navbar'
import type { DashboardLayoutProps } from './dashboardLayoutTypes'

export type {
  DashboardAction,
  SidebarActionItem,
  SidebarGroupItem,
  SidebarItem,
  SidebarLinkItem,
  SidebarNavItem,
} from './dashboardLayoutTypes'

function DashboardLayout({
  actions = [],
  children,
  eyebrow = 'Control room',
  helperText,
  helperTitle = 'Today',
  layoutVariant = 'admin',
  sidebarItems = [],
  subtitle,
  title,
  workspaceLabel = 'Marketplace studio',
}: DashboardLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)
  const user = getStoredUser() as AuthUser | null

  const displayName = user?.name ?? 'Dashboard User'
  const displayEmail = user?.email ?? 'No email loaded'
  const isAdmin = isAdminRole(user?.role)
  const isCustomerLayout = layoutVariant === 'customer'

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
    dispatch(syncCartForCurrentUser())
    setIsProfileOpen(false)
    setIsSidebarOpen(false)
    navigate('/login')
  }

  const sidebar = (showCloseButton = false) => (
    <DashboardSidebar
      displayName={displayName}
      helperText={helperText}
      helperTitle={helperTitle}
      isCustomerLayout={isCustomerLayout}
      location={location}
      onClose={() => setIsSidebarOpen(false)}
      onLogout={handleLogout}
      showCloseButton={showCloseButton}
      sidebarItems={sidebarItems}
      user={user}
      workspaceLabel={workspaceLabel}
    />
  )

  const pageHeading = (
    <DashboardPageHeading
      actions={actions}
      eyebrow={eyebrow}
      subtitle={subtitle}
      title={title}
    />
  )

  if (isCustomerLayout) {
    return (
      <div className="min-h-screen overflow-x-clip bg-[#f8f3ea] text-[#181512]">
        <Navbar />

        <div
          className={`fixed inset-0 z-50 overflow-hidden lg:hidden ${
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
            className={`absolute inset-y-0 left-0 flex w-[min(18rem,84vw)] max-w-[calc(100vw-1rem)] flex-col border-r border-black/10 bg-white text-[#181512] shadow-[24px_0_60px_rgba(24,21,18,0.22)] transition-transform duration-200 ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {sidebar(true)}
          </aside>
        </div>

        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:min-h-[calc(100dvh-132px)] lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start lg:px-8">
          <aside className="hidden border border-black/10 bg-white shadow-sm lg:sticky lg:top-[132px] lg:flex lg:h-[calc(100dvh-132px)] lg:max-h-[calc(100dvh-132px)] lg:flex-col">
            {sidebar()}
          </aside>

          <div className="min-w-0">
            <div className="mb-4 border border-black/10 bg-white px-3 py-3 shadow-sm backdrop-blur lg:hidden">
              <button
                className="inline-flex min-h-10 items-center gap-2 border border-black/10 bg-white px-3 text-sm font-bold text-[#181512] transition hover:border-[#181512]"
                aria-label="Open dashboard menu"
                aria-expanded={isSidebarOpen}
                onClick={() => setIsSidebarOpen(true)}
                type="button"
              >
                <Menu className="h-5 w-5" />
                Account menu
              </button>
            </div>

            <main className="min-w-0">
              {pageHeading}
              {children}
            </main>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f8f3ea] text-[#181512]">
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-72 border-r border-black/10 bg-[#181512] text-white lg:flex lg:flex-col">
        {sidebar()}
      </aside>

      <div
        className={`fixed inset-0 z-50 overflow-hidden lg:hidden ${
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
          className={`absolute inset-y-0 left-0 flex w-[min(18rem,84vw)] max-w-[calc(100vw-1rem)] flex-col border-r border-white/10 bg-[#181512] text-white shadow-[24px_0_60px_rgba(24,21,18,0.28)] transition-transform duration-200 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebar(true)}
        </aside>
      </div>

      <div className="lg:pl-72">
        <DashboardAdminTopbar
          displayEmail={displayEmail}
          displayName={displayName}
          isAdmin={isAdmin}
          isProfileOpen={isProfileOpen}
          isSidebarOpen={isSidebarOpen}
          onLogout={handleLogout}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onToggleProfile={() => setIsProfileOpen((current) => !current)}
          profileMenuRef={profileMenuRef}
          setIsProfileOpen={setIsProfileOpen}
        />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {pageHeading}
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
