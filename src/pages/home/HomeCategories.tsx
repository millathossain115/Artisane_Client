import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Category } from '../../features/categories/categoryApi'
import { getAssetUrl } from '../../utils/productDisplay'
import { categoryFallbackImages, craftNotes } from './homeContent'

type HomeCategoriesProps = {
  categories: Category[]
  hasError: boolean
  isLoading: boolean
}

function getCategoryImage(category: Category, index: number) {
  return (
    getAssetUrl(category.image) ??
    categoryFallbackImages[index % categoryFallbackImages.length]
  )
}

function getCategoryUrl(categoryId: string) {
  return `/products?category=${encodeURIComponent(categoryId)}`
}

function HomeCategories({
  categories,
  hasError,
  isLoading,
}: HomeCategoriesProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const [scrollState, setScrollState] = useState({
    canScrollNext: false,
    canScrollPrevious: false,
  })

  const updateScrollState = useCallback(() => {
    const rail = railRef.current

    if (!rail) {
      return
    }

    const maxScrollLeft = rail.scrollWidth - rail.clientWidth

    setScrollState({
      canScrollNext: rail.scrollLeft < maxScrollLeft - 8,
      canScrollPrevious: rail.scrollLeft > 8,
    })
  }, [])

  useEffect(() => {
    const rail = railRef.current

    if (!rail) {
      return
    }

    updateScrollState()
    rail.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      rail.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [categories.length, isLoading, updateScrollState])

  function scrollCategoryRail(direction: 'next' | 'previous') {
    const rail = railRef.current

    if (!rail) {
      return
    }

    const distance = Math.max(288, rail.clientWidth * 0.82)

    rail.scrollBy({
      behavior: 'smooth',
      left: direction === 'next' ? distance : -distance,
    })
  }

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      id="categories"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
            Categories
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Shop by craft</h2>
        </div>
        <Link
          className="inline-flex items-center gap-2 text-sm font-bold text-[#181512]"
          to="/categories"
        >
          View all categories
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {hasError ? (
        <div className="mt-8 border border-[#7a3f1d]/20 bg-white px-5 py-4 text-sm font-semibold text-[#7a3f1d]">
          Could not load categories.
        </div>
      ) : null}

      <div className="relative mt-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-[linear-gradient(90deg,#f6f0e5,rgba(246,240,229,0))]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-[linear-gradient(270deg,#f6f0e5,rgba(246,240,229,0))]" />

        <button
          aria-label="Previous categories"
          className="absolute left-2 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/60 bg-white/92 text-[#181512] shadow-[0_14px_34px_rgba(24,21,18,0.18)] backdrop-blur transition hover:bg-[#181512] hover:text-white disabled:pointer-events-none disabled:opacity-35 sm:-left-5"
          disabled={!scrollState.canScrollPrevious}
          onClick={() => scrollCategoryRail('previous')}
          type="button"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          className="category-craft-scroll flex scroll-px-4 gap-4 overflow-x-auto scroll-smooth pb-1"
          ref={railRef}
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  className="h-72 w-72 shrink-0 animate-pulse bg-white"
                  key={index}
                />
              ))
            : categories.map((category, index) => (
                <Link
                  className="group relative h-72 w-72 shrink-0 overflow-hidden bg-[#181512]"
                  key={category._id}
                  to={getCategoryUrl(category._id)}
                >
                  <img
                    alt={`${category.name} category`}
                    className="absolute inset-0 h-full w-full object-cover opacity-76 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
                    src={getCategoryImage(category, index)}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,21,18,0.04),rgba(24,21,18,0.84))]" />
                  <div className="relative flex h-full flex-col justify-end p-5 text-white">
                    <p className="text-sm font-bold text-[#f1c9a6]">
                      {category.slug}
                    </p>
                    <h3 className="mt-2 text-3xl font-bold">{category.name}</h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/76">
                      {category.description ??
                        craftNotes[index % craftNotes.length]}
                    </p>
                  </div>
                </Link>
              ))}
        </div>

        <button
          aria-label="Next categories"
          className="absolute right-2 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/60 bg-white/92 text-[#181512] shadow-[0_14px_34px_rgba(24,21,18,0.18)] backdrop-blur transition hover:bg-[#181512] hover:text-white disabled:pointer-events-none disabled:opacity-35 sm:-right-5"
          disabled={!scrollState.canScrollNext}
          onClick={() => scrollCategoryRail('next')}
          type="button"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  )
}

export default HomeCategories
