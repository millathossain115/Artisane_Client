import {
  BarChart3,
  Boxes,
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Star,
  UsersRound,
} from 'lucide-react'

export const adminNavItems = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Orders', to: '#orders', icon: ClipboardList },
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
  { label: 'Customers', to: '#customers', icon: UsersRound },
  { label: 'Reviews', to: '#reviews', icon: Star },
  { label: 'Messages', to: '#messages', icon: MessageSquareText },
  { label: 'Analytics', to: '#analytics', icon: BarChart3 },
  { label: 'Settings', to: '#settings', icon: Settings },
]
