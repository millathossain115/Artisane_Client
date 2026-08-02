import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export type SidebarLinkItem = {
  label: string
  to: string
  icon: LucideIcon
  requiredRole?: 'super_admin'
}

export type SidebarActionItem = {
  label: string
  action: 'logout'
  icon: LucideIcon
  requiredRole?: 'super_admin'
}

export type SidebarNavItem = SidebarActionItem | SidebarLinkItem

export type SidebarGroupItem = {
  label: string
  items: SidebarNavItem[]
  requiredRole?: 'super_admin'
}

export type SidebarItem = SidebarGroupItem | SidebarNavItem

export type DashboardAction = {
  label: string
  to?: string
  variant?: 'primary' | 'secondary'
}

export type DashboardLayoutProps = {
  actions?: DashboardAction[]
  children: ReactNode
  eyebrow?: string
  helperText?: string
  helperTitle?: string
  layoutVariant?: 'admin' | 'customer'
  sidebarItems: SidebarItem[]
  subtitle: string
  title: string
  workspaceLabel?: string
}
