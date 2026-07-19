import { Menu } from 'lucide-react'
import { Link } from 'react-router-dom'

import NavbarCategoryNav from './navbar/NavbarCategoryNav'
import NavbarProfileMenu from './navbar/NavbarProfileMenu'
import NavbarSearch from './navbar/NavbarSearch'

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f8f3ea]/95 shadow-[0_10px_30px_rgba(24,21,18,0.06)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center border border-black/10 bg-white/70 text-[#181512] transition hover:bg-white lg:hidden"
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link className="flex items-center gap-3" to="/">
          <span className="grid h-10 w-10 place-items-center bg-[#181512] text-base font-bold text-white">
            A
          </span>
          <span className="font-display text-2xl font-bold">Artisane</span>
        </Link>

        <NavbarSearch className="ml-auto hidden min-w-64 max-w-md flex-1 md:block" />
        <NavbarProfileMenu />
      </div>

      <NavbarCategoryNav />

      <div className="border-t border-black/10 px-4 py-3 md:hidden">
        <NavbarSearch className="mx-auto max-w-7xl" />
      </div>
    </header>
  )
}

export default Navbar
