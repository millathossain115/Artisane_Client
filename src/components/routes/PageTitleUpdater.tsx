import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `Artisane | ${title}` : 'Artisane'
  }, [title])
}

const TITLE_MAP: Record<string, string> = {
  '/': 'Home',
  '/categories': 'Categories',
  '/products': 'Products',
  '/about': 'About Us',
  '/faq': 'FAQ',
  '/shipping-returns': 'Shipping & Returns',
  '/terms': 'Terms & Conditions',
  '/privacy': 'Privacy Policy',
  '/payment/success': 'Payment Successful',
  '/payment/fail': 'Payment Failed',
  '/payment/cancel': 'Payment Cancelled',
  '/checkout': 'Checkout',
  '/login': 'Login',
  '/register': 'Register',
  '/dashboard': 'Dashboard',
  '/dashboard/profile': 'My Profile',
  '/dashboard/orders': 'My Orders',
  '/dashboard/reviews': 'My Reviews',
  '/dashboard/wishlist': 'My Wishlist',
  '/dashboard/admin/orders': 'Manage Orders',
  '/dashboard/admin/reviews': 'Manage Reviews',
  '/dashboard/admin/promo': 'Manage Promo',
  '/dashboard/categories': 'Manage Categories',
  '/dashboard/categories/create': 'Create Category',
  '/dashboard/products': 'Manage Products',
  '/dashboard/products/create': 'Create Product',
  '/dashboard/users': 'Manage Users',
}

function getDynamicTitle(pathname: string): string {
  if (TITLE_MAP[pathname]) {
    return TITLE_MAP[pathname]
  }

  if (pathname.startsWith('/products/')) {
    return 'Product Details'
  }
  if (pathname.startsWith('/dashboard/orders/')) {
    return 'Order Details'
  }
  if (pathname.startsWith('/dashboard/admin/orders/')) {
    return 'Admin Order Details'
  }

  return 'Page Not Found'
}

function PageTitleUpdater() {
  const { pathname } = useLocation()

  useEffect(() => {
    const pageTitle = getDynamicTitle(pathname)
    document.title = pathname === '/' ? 'Artisane' : `Artisane | ${pageTitle}`
  }, [pathname])

  return null
}

export { PageTitleUpdater, usePageTitle }
