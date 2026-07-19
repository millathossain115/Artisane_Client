import { ArrowUpRight, FolderTree, ImageOff } from 'lucide-react'
import { Link } from 'react-router-dom'

import { API_BASE_URL } from '../../../config/api'
import type { Category } from '../../../features/categories/categoryApi'
import { formatCount, formatDate } from '../dashboardFormat'

type AdminCategoriesSectionProps = {
  categories: Category[]
  hasError: boolean
  isLoading: boolean
  totalCategories: number
}

function getCategoryImageUrl(category: Category) {
  if (!category.image) {
    return ''
  }

  if (category.image.startsWith('http')) {
    return category.image
  }

  return `${API_BASE_URL.replace('/api/v1', '')}${category.image}`
}

function AdminCategoriesSection({
  categories,
  hasError,
  isLoading,
  totalCategories,
}: AdminCategoriesSectionProps) {
  return (
    <section className="mt-6 border border-black/10 bg-white" id="categories">
      <div className="flex flex-col gap-4 border-b border-black/10 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
            <FolderTree className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-2xl font-bold">Current categories</h2>
            <p className="mt-1 text-sm text-[#6b5f53]">
              Live category records from the marketplace database.
            </p>
          </div>
        </div>
      </div>

      {(isLoading || hasError) && (
        <div
          className={`border-b border-black/10 px-5 py-3 text-sm font-semibold ${
            hasError
              ? 'bg-[#fff5ef] text-[#8f3f1d]'
              : 'bg-[#f8f3ea] text-[#6b5f53]'
          }`}
        >
          {hasError ? 'Failed to load categories.' : 'Loading categories...'}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
            <tr>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Created</th>
              <th className="px-5 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {categories.length ? (
              categories.map((category) => {
                const imageUrl = getCategoryImageUrl(category)

                return (
                  <tr
                    className="border-t border-black/10 transition hover:bg-[#f8f3ea]"
                    key={category._id}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden bg-[#f8f3ea] text-[#7a3f1d]">
                          {imageUrl ? (
                            <img
                              alt=""
                              className="h-full w-full object-cover"
                              src={imageUrl}
                            />
                          ) : (
                            <ImageOff className="h-5 w-5" />
                          )}
                        </span>
                        <span>
                          <span className="block font-bold">
                            {category.name}
                          </span>
                          <span className="mt-1 block text-xs font-semibold text-[#6b5f53]">
                            {category._id.slice(-8).toUpperCase()}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#7a3f1d]">
                      {category.slug}
                    </td>
                    <td className="max-w-xs px-5 py-4 text-[#6b5f53]">
                      <span className="line-clamp-2">
                        {category.description || 'No description added.'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#6b5f53]">
                      {formatDate(category.createdAt, 'Not set', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-4 text-[#6b5f53]">
                      {formatDate(category.updatedAt, 'Not set', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr className="border-t border-black/10">
                <td
                  className="px-5 py-6 text-center font-semibold text-[#6b5f53]"
                  colSpan={5}
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-black/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-[#6b5f53]">
          Showing {formatCount(categories.length, '0')} of{' '}
          {formatCount(totalCategories, '0')} categories.
        </p>
        <Link
          className="inline-flex min-h-10 items-center justify-center gap-2 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
          to="/dashboard/categories"
        >
          View all categories
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}

export default AdminCategoriesSection
