import {
  BarChart3,
  Boxes,
  ClipboardList,
  History,
  Flame,
  FolderTree,
  Images,
  LayoutDashboard,
  MessageSquareText,
  Receipt,
  Settings,
  ShieldCheck,
  Star,
  UsersRound,
} from 'lucide-react'

import type { SidebarItem } from '../../components/layout/DashboardLayout'

export const adminNavItems: SidebarItem[] = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Orders', to: '/dashboard/admin/orders', icon: ClipboardList },
  { label: 'Payment Logs', to: '/dashboard/admin/payment-logs', icon: Receipt },
  {
    label: 'Activity Logs',
    to: '/dashboard/admin/activity-logs',
    icon: History,
  },
  {
    label: 'Product',
    items: [
      {
        label: 'Create Product',
        to: '/dashboard/products/create',
        icon: Boxes,
      },
      { label: 'Manage Products', to: '/dashboard/products', icon: Boxes },
    ],
  },
  {
    label: 'Category',
    items: [
      {
        label: 'Create Category',
        to: '/dashboard/categories/create',
        icon: FolderTree,
      },
      {
        label: 'Manage Categories',
        to: '/dashboard/categories',
        icon: FolderTree,
      },
    ],
  },
  {
    label: 'Users',
    requiredRole: 'super_admin',
    to: '/dashboard/users',
    icon: UsersRound,
  },
  { label: 'Reviews', to: '/dashboard/admin/reviews', icon: Star },
  { label: 'Promo Banner', to: '/dashboard/admin/promo', icon: Flame },
  { label: 'Home Hero', to: '/dashboard/admin/home-hero', icon: Images },
  {
    label: 'Messages',
    to: '/dashboard/admin/messages',
    icon: MessageSquareText,
  },
  { label: 'Analytics', to: '/dashboard/admin/analytics', icon: BarChart3 },
  {
    label: 'Settings',
    items: [
      { label: 'Security', to: '/dashboard/settings/security', icon: ShieldCheck },
      { label: 'System', to: '/dashboard/admin/settings', icon: Settings },
    ],
  },
]
