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
  Star,
  UsersRound,
} from 'lucide-react'

export const adminNavItems = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Orders', to: '/dashboard/admin/orders', icon: ClipboardList },
  { label: 'Payment Logs', to: '/dashboard/admin/payment-logs', icon: Receipt },
  { label: 'Activity Logs', to: '/dashboard/admin/activity-logs', icon: History },
  {
    label: 'Product',
    items: [
      { label: 'Create Product', to: '/dashboard/products/create', icon: Boxes },
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
  { label: 'Users', to: '/dashboard/users', icon: UsersRound },
  { label: 'Reviews', to: '/dashboard/admin/reviews', icon: Star },
  { label: 'Promo Banner', to: '/dashboard/admin/promo', icon: Flame },
  { label: 'Home Hero', to: '/dashboard/admin/home-hero', icon: Images },
  { label: 'Messages', to: '#messages', icon: MessageSquareText },
  { label: 'Analytics', to: '#analytics', icon: BarChart3 },
  { label: 'Settings', to: '#settings', icon: Settings },
]
