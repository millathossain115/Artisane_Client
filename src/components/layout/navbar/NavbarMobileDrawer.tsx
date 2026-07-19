import { ChevronRight, X } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useGetCategoriesQuery } from '../../../features/categories/categoryApi'

type NavbarMobileDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

function getCategoryUrl(categoryId: string) {
  return `/products?category=${encodeURIComponent(categoryId)}`
}

function NavbarMobileDrawer({ isOpen, onClose }: NavbarMobileDrawerProps) {
  const { data: categoryList, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery({
      limit: 100,
      page: 1,
      sortBy: 'name',
      sortOrder: 'asc',
    })
  const categories = (categoryList?.data ?? []).filter(
    (category) => category.isActive !== false,
  )

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[120] lg:hidden" role="presentation">
      <button
        aria-label="Close menu"
        className="absolute inset-0 bg-[#181512]/50"
        onClick={onClose}
        type="button"
      />

      <aside
        aria-label="Mobile menu"
        id="mobile-navigation"
        className="relative flex h-full w-[min(22rem,calc(100vw-2.5rem))] flex-col bg-[#f8f3ea] shadow-[18px_0_44px_rgba(24,21,18,0.2)]"
      >
        <div className="flex items-center justify-between border-b border-black/10 px-4 py-4">
          <Link className="flex items-center gap-3" onClick={onClose} to="/">
            <span className="grid h-10 w-10 place-items-center bg-[#181512] text-base font-bold text-white">
              A
            </span>
            <span className="font-display text-2xl font-bold">Artisane</span>
          </Link>
          <button
            aria-label="Close menu"
            className="grid h-10 w-10 place-items-center border border-black/10 bg-white text-[#181512]"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="dashboard-sidebar-scroll flex-1 overflow-y-auto px-4 py-5">
          <nav className="grid gap-2">
            <Link
              className="flex min-h-11 items-center justify-between border border-black/10 bg-white px-4 text-sm font-bold"
              onClick={onClose}
              to="/products"
            >
              All products
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              className="flex min-h-11 items-center justify-between border border-black/10 bg-white px-4 text-sm font-bold"
              onClick={onClose}
              to="/categories"
            >
              All categories
              <ChevronRight className="h-4 w-4" />
            </Link>
          </nav>

          <section className="mt-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
              Categories
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {isCategoriesLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div className="h-16 animate-pulse bg-white" key={index} />
                  ))
                : categories.map((category) => (
                    <Link
                      className="flex min-h-16 items-center border border-black/10 bg-white px-3 text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                      key={category._id}
                      onClick={onClose}
                      to={getCategoryUrl(category._id)}
                    >
                      <span className="line-clamp-2">{category.name}</span>
                    </Link>
                  ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}

export default NavbarMobileDrawer
