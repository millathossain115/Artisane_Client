import { Link } from 'react-router-dom'
import { Eye, EyeOff, Globe2, Pencil, Trash2 } from 'lucide-react'

import type { Category } from '../../../../features/categories/categoryApi'
import {
  formatDate,
  getCategoryImageUrl,
  isCategoryActive,
  truncateWords,
} from '../categoryTableUtils'
import CategoryProductCount from './CategoryProductCount'

type CategoryDesktopTableProps = {
  categories: Category[]
  isUpdating: boolean
  onDelete: (category: Category) => void
  onEdit: (category: Category) => void
  onToggleStatus: (category: Category) => void
  totalCategories: number
}

function CategoryDesktopTable({
  categories,
  isUpdating,
  onDelete,
  onEdit,
  onToggleStatus,
  totalCategories,
}: CategoryDesktopTableProps) {
  return (
    <div className="hidden overflow-hidden lg:block">
      <table className="w-full table-fixed border-collapse text-left text-sm">
        <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
          <tr>
            <th className="w-[44%] px-3 py-3 2xl:px-5">Category</th>
            <th className="w-[14%] px-2 py-3 text-center 2xl:px-4">
              Products
            </th>
            <th className="w-[14%] px-2 py-3 text-center 2xl:px-4">
              Created
            </th>
            <th className="w-[14%] px-2 py-3 text-center 2xl:px-4">
              Status
            </th>
            <th className="w-[14%] px-2 py-3 text-center 2xl:px-4">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.length ? (
            categories.map((category) => {
              const imageUrl = getCategoryImageUrl(category)
              const categoryIsActive = isCategoryActive(category)

              return (
                <tr
                  className="border-t border-black/10 transition hover:bg-[#f8f3ea]"
                  key={category._id}
                >
                  <td className="min-w-0 px-3 py-4 2xl:px-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <Link
                        className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden bg-[#f8f3ea] text-[#7a3f1d] transition hover:opacity-80"
                        to={`/products?category=${encodeURIComponent(category._id)}`}
                      >
                        {imageUrl ? (
                          <img
                            alt=""
                            className="h-full w-full object-cover"
                            src={imageUrl}
                          />
                        ) : (
                          <Globe2 className="h-5 w-5" />
                        )}
                      </Link>
                      <span className="min-w-0 flex-1">
                        <Link
                          className="block truncate font-bold hover:underline"
                          title={category.name}
                          to={`/products?category=${encodeURIComponent(category._id)}`}
                        >
                          {category.name}
                        </Link>
                        <span
                          className="mt-1 block truncate text-xs font-semibold text-[#6b5f53]"
                          title={category.description || ''}
                        >
                          {category.description
                            ? truncateWords(category.description, 12)
                            : 'No description added.'}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-4 text-center 2xl:px-4">
                    <CategoryProductCount categoryId={category._id} />
                  </td>
                  <td
                    className="truncate px-2 py-4 text-center text-[#6b5f53] 2xl:px-4"
                    title={formatDate(category.createdAt)}
                  >
                    {formatDate(category.createdAt)}
                  </td>
                  <td className="px-2 py-4 text-center 2xl:px-4">
                    <button
                      className={`inline-flex max-w-full min-h-9 items-center justify-center gap-2 border px-2 text-xs font-bold transition 2xl:px-3 ${
                        categoryIsActive
                          ? 'border-[#7a3f1d]/15 bg-[#f8f3ea] text-[#7a3f1d] hover:border-[#7a3f1d]'
                          : 'border-[#c85f2f]/30 bg-[#fff5ef] text-[#8f3f1d] hover:border-[#8f3f1d]'
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                      disabled={isUpdating}
                      onClick={() => onToggleStatus(category)}
                      type="button"
                    >
                      {categoryIsActive ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                      <span className="truncate">
                        {categoryIsActive ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                  </td>
                  <td className="px-2 py-4 text-center 2xl:px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="inline-flex h-9 w-9 items-center justify-center border border-black/10 text-[#181512] transition hover:border-[#181512] hover:bg-white"
                        aria-label={`Update ${category.name}`}
                        onClick={() => onEdit(category)}
                        type="button"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        className="inline-flex h-9 w-9 items-center justify-center border border-[#c85f2f]/25 text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef]"
                        aria-label={`Delete ${category.name}`}
                        onClick={() => onDelete(category)}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
                {totalCategories
                  ? 'No categories match the current filters.'
                  : 'No categories found.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default CategoryDesktopTable
