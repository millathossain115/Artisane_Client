import { Link } from 'react-router-dom'
import { Eye, EyeOff, Globe2, Pencil, Trash2 } from 'lucide-react'

import type { Category } from '../../../../features/categories/categoryApi'
import { getCategoryProductsUrl } from '../../../../utils/productDisplay'
import {
  formatDate,
  getCategoryImageUrl,
  isCategoryActive,
} from '../categoryTableUtils'
import CategoryProductCount from './CategoryProductCount'

type CategoryMobileListProps = {
  categories: Category[]
  isUpdating: boolean
  onDelete: (category: Category) => void
  onEdit: (category: Category) => void
  onToggleStatus: (category: Category) => void
  totalCategories: number
}

function CategoryMobileList({
  categories,
  isUpdating,
  onDelete,
  onEdit,
  onToggleStatus,
  totalCategories,
}: CategoryMobileListProps) {
  return (
    <div className="grid gap-3 p-4 lg:hidden">
      {categories.length ? (
        categories.map((category) => {
          const imageUrl = getCategoryImageUrl(category)
          const categoryIsActive = isCategoryActive(category)

          return (
            <article
              className="border border-black/10 bg-white p-4"
              key={category._id}
            >
              <div className="flex items-start gap-3">
                <Link
                  className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden bg-[#f8f3ea] text-[#7a3f1d]"
                  to={getCategoryProductsUrl(category)}
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
                <div className="min-w-0 flex-1">
                  <Link
                    className="line-clamp-2 font-bold hover:underline"
                    to={getCategoryProductsUrl(category)}
                  >
                    {category.name}
                  </Link>
                  <p className="mt-1 text-xs font-semibold text-[#6b5f53]">
                    {category._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-[#6b5f53]">
                    {category.description || 'No description added.'}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 border-t border-black/10 pt-3">
                <span className="inline-flex min-h-8 items-center bg-[#f8f3ea] px-2 text-xs font-bold text-[#6b5f53]">
                  Products
                </span>
                <CategoryProductCount categoryId={category._id} />
                <button
                  className={`inline-flex min-h-8 items-center gap-2 border px-2 text-xs font-bold transition ${
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
                  {categoryIsActive ? 'Active' : 'Inactive'}
                </button>
                <span className="inline-flex min-h-8 items-center bg-[#f8f3ea] px-2 text-xs font-bold text-[#6b5f53]">
                  {formatDate(category.createdAt)}
                </span>
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  aria-label={`Update ${category.name}`}
                  className="grid h-9 w-9 place-items-center border border-black/10 text-[#181512] transition hover:border-[#181512] hover:bg-white"
                  onClick={() => onEdit(category)}
                  type="button"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  aria-label={`Delete ${category.name}`}
                  className="grid h-9 w-9 place-items-center border border-[#c85f2f]/25 text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef]"
                  onClick={() => onDelete(category)}
                  type="button"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          )
        })
      ) : (
        <p className="border border-black/10 bg-[#f8f3ea] p-5 text-center text-sm font-semibold text-[#6b5f53]">
          {totalCategories
            ? 'No categories match the current filters.'
            : 'No categories found.'}
        </p>
      )}
    </div>
  )
}

export default CategoryMobileList
