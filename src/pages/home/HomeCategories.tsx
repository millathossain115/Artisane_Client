import { ArrowRight } from 'lucide-react'

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

function HomeCategories({
  categories,
  hasError,
  isLoading,
}: HomeCategoriesProps) {
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
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Shop by craft
          </h2>
        </div>
        <a
          className="inline-flex items-center gap-2 text-sm font-bold text-[#181512]"
          href="#latest"
        >
          View latest products
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      {hasError ? (
        <div className="mt-8 border border-[#7a3f1d]/20 bg-white px-5 py-4 text-sm font-semibold text-[#7a3f1d]">
          Could not load categories.
        </div>
      ) : null}

      <div className="relative mt-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-[linear-gradient(90deg,#f6f0e5,rgba(246,240,229,0))]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-[linear-gradient(270deg,#f6f0e5,rgba(246,240,229,0))]" />

        <div className="category-craft-scroll flex gap-4 overflow-x-auto pb-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  className="h-72 w-72 shrink-0 animate-pulse bg-white"
                  key={index}
                />
              ))
            : categories.map((category, index) => (
                <a
                  className="group relative h-72 w-72 shrink-0 overflow-hidden bg-[#181512]"
                  href="#products"
                  key={category._id}
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
                    <h3 className="mt-2 text-3xl font-bold">
                      {category.name}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/76">
                      {category.description ??
                        craftNotes[index % craftNotes.length]}
                    </p>
                  </div>
                </a>
              ))}
        </div>
      </div>
    </section>
  )
}

export default HomeCategories
