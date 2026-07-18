import { useMemo, useState, type FormEvent } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  FolderTree,
  Globe2,
  LoaderCircle,
  Pencil,
  Save,
  Search,
  SlidersHorizontal,
  Trash2,
  Upload,
} from 'lucide-react'

import { API_BASE_URL } from '../../../config/api'
import {
  type Category,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from '../../../features/categories/categoryApi'

type CategoryEditForm = {
  description: string
  name: string
  slug: string
}

type ImageFilter = 'all' | 'with-image' | 'without-image'
type SortFilter = 'newest' | 'oldest' | 'name-asc' | 'name-desc'

const PAGE_SIZE_OPTIONS = [5, 10, 20]

function formatDate(value?: string) {
  if (!value) {
    return 'Not set'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Not set'
  }

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
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

function getErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== 'object') {
    return fallback
  }

  const errorRecord = error as Record<string, unknown>
  const data = errorRecord.data

  if (data && typeof data === 'object') {
    const dataRecord = data as Record<string, unknown>

    if (typeof dataRecord.message === 'string') {
      return dataRecord.message
    }
  }

  if (typeof errorRecord.message === 'string') {
    return errorRecord.message
  }

  return fallback
}

function getCategoryTime(value?: string) {
  if (!value) {
    return 0
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}

function categoryMatchesSearch(category: Category, searchTerm: string) {
  const query = searchTerm.trim().toLowerCase()

  if (!query) {
    return true
  }

  return [
    category.name,
    category.slug,
    category.description ?? '',
    category._id,
  ].some((value) => value.toLowerCase().includes(query))
}

function CategoryTable() {
  const {
    data: categories = [],
    isError: hasCategoriesError,
    isLoading: isCategoriesLoading,
  } = useGetCategoriesQuery()
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation()
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation()
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  )
  const [editForm, setEditForm] = useState<CategoryEditForm>({
    description: '',
    name: '',
    slug: '',
  })
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImageInputKey, setEditImageInputKey] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [imageFilter, setImageFilter] = useState<ImageFilter>('all')
  const [sortFilter, setSortFilter] = useState<SortFilter>('newest')
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [currentPage, setCurrentPage] = useState(1)

  const filteredCategories = useMemo(() => {
    return categories
      .filter((category) => categoryMatchesSearch(category, searchTerm))
      .filter((category) => {
        if (imageFilter === 'with-image') {
          return Boolean(category.image)
        }

        if (imageFilter === 'without-image') {
          return !category.image
        }

        return true
      })
      .sort((firstCategory, secondCategory) => {
        if (sortFilter === 'oldest') {
          return (
            getCategoryTime(firstCategory.createdAt) -
            getCategoryTime(secondCategory.createdAt)
          )
        }

        if (sortFilter === 'name-asc') {
          return firstCategory.name.localeCompare(secondCategory.name)
        }

        if (sortFilter === 'name-desc') {
          return secondCategory.name.localeCompare(firstCategory.name)
        }

        return (
          getCategoryTime(secondCategory.createdAt) -
          getCategoryTime(firstCategory.createdAt)
        )
      })
  }, [categories, imageFilter, searchTerm, sortFilter])

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pageStartIndex = (safeCurrentPage - 1) * pageSize
  const pageEndIndex = pageStartIndex + pageSize
  const visibleCategories = filteredCategories.slice(pageStartIndex, pageEndIndex)
  const resultStart = filteredCategories.length ? pageStartIndex + 1 : 0
  const resultEnd = Math.min(pageEndIndex, filteredCategories.length)

  function openEditModal(category: Category) {
    setStatus('')
    setError('')
    setCategoryToEdit(category)
    setEditForm({
      description: category.description ?? '',
      name: category.name,
      slug: category.slug,
    })
    setEditImageFile(null)
    setEditImageInputKey((currentKey) => currentKey + 1)
  }

  function updateEditField(field: keyof CategoryEditForm, value: string) {
    setStatus('')
    setError('')
    setEditForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleUpdateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!categoryToEdit) {
      return
    }

    setStatus('')
    setError('')

    try {
      await updateCategory({
        description: editForm.description.trim() || undefined,
        id: categoryToEdit._id,
        image: editImageFile ?? undefined,
        name: editForm.name.trim(),
        slug: editForm.slug.trim(),
      }).unwrap()

      setStatus('Category updated successfully.')
      setCategoryToEdit(null)
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, 'Failed to update category.'))
    }
  }

  async function handleConfirmDelete() {
    if (!categoryToDelete) {
      return
    }

    setStatus('')
    setError('')

    try {
      await deleteCategory(categoryToDelete._id).unwrap()
      setStatus('Category deleted successfully.')
      setCategoryToDelete(null)
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, 'Failed to delete category.'))
    }
  }

  return (
    <section className="mt-6 border border-black/10 bg-white" id="categories">
      <div className="flex items-center gap-3 border-b border-black/10 p-5">
        <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
          <FolderTree className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold">Current categories</h2>
          <p className="mt-1 text-sm text-[#6b5f53]">
            All category records currently stored in the database.
          </p>
        </div>
      </div>

      {(status || error) && (
        <p
          className={`border-b border-black/10 px-5 py-3 text-sm font-semibold ${
            error
              ? 'bg-[#fff5ef] text-[#8f3f1d]'
              : 'bg-[#effaf3] text-[#1f6b43]'
          }`}
        >
          {error || status}
        </p>
      )}

      {(isCategoriesLoading || hasCategoriesError) && (
        <div
          className={`border-b border-black/10 px-5 py-3 text-sm font-semibold ${
            hasCategoriesError
              ? 'bg-[#fff5ef] text-[#8f3f1d]'
              : 'bg-[#f8f3ea] text-[#6b5f53]'
          }`}
        >
          {hasCategoriesError
            ? 'Failed to load categories.'
            : 'Loading categories...'}
        </div>
      )}

      <div className="grid gap-3 border-b border-black/10 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <label className="grid gap-2 text-sm font-bold">
          Search categories
          <span className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b5f53]" />
            <input
              className="min-h-12 w-full border border-black/10 pl-10 pr-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
              onChange={(event) => {
                setSearchTerm(event.target.value)
                setCurrentPage(1)
              }}
              placeholder="Name, slug, description, or ID"
              type="search"
              value={searchTerm}
            />
          </span>
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-2 text-sm font-bold">
            Image
            <span className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b5f53]" />
              <select
                className="min-h-12 w-full border border-black/10 bg-white pl-10 pr-8 text-sm font-bold outline-none transition focus:border-[#181512]"
                onChange={(event) => {
                  setImageFilter(event.target.value as ImageFilter)
                  setCurrentPage(1)
                }}
                value={imageFilter}
              >
                <option value="all">All</option>
                <option value="with-image">With image</option>
                <option value="without-image">No image</option>
              </select>
            </span>
          </label>

          <label className="grid gap-2 text-sm font-bold">
            Sort
            <select
              className="min-h-12 w-full border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
              onChange={(event) => {
                setSortFilter(event.target.value as SortFilter)
                setCurrentPage(1)
              }}
              value={sortFilter}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name-asc">A to Z</option>
              <option value="name-desc">Z to A</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-bold">
            Rows
            <select
              className="min-h-12 w-full border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
              onChange={(event) => {
                setPageSize(Number(event.target.value))
                setCurrentPage(1)
              }}
              value={pageSize}
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-left text-sm">
          <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
            <tr>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Created</th>
              <th className="px-5 py-3">Updated</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleCategories.length ? (
              visibleCategories.map((category) => {
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
                            <Globe2 className="h-5 w-5" />
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
                      {formatDate(category.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-[#6b5f53]">
                      {formatDate(category.updatedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="inline-flex h-9 w-9 items-center justify-center border border-black/10 text-[#181512] transition hover:border-[#181512] hover:bg-white"
                          aria-label={`Update ${category.name}`}
                          onClick={() => openEditModal(category)}
                          type="button"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="inline-flex h-9 w-9 items-center justify-center border border-[#c85f2f]/25 text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef]"
                          aria-label={`Delete ${category.name}`}
                          onClick={() => {
                            setStatus('')
                            setError('')
                            setCategoryToDelete(category)
                          }}
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
                  colSpan={6}
                >
                  {categories.length
                    ? 'No categories match the current filters.'
                    : 'No categories found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-black/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-semibold text-[#6b5f53]">
          Showing {resultStart}-{resultEnd} of {filteredCategories.length}{' '}
          categories.
        </p>

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous page"
            className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-[#181512] transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={safeCurrentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-24 text-center text-sm font-bold">
            Page {safeCurrentPage} of {totalPages}
          </span>
          <button
            aria-label="Next page"
            className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-[#181512] transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={safeCurrentPage === totalPages}
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {categoryToEdit && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/55 px-4"
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-2xl border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
            role="dialog"
          >
            <p className="text-sm font-bold text-[#7a3f1d]">
              Update category
            </p>
            <h2 className="mt-2 text-2xl font-bold">{categoryToEdit.name}</h2>

            <form className="mt-5" onSubmit={handleUpdateSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold">
                  Category name
                  <input
                    className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                    onChange={(event) =>
                      updateEditField('name', event.target.value)
                    }
                    required
                    type="text"
                    value={editForm.name}
                  />
                </label>

                <label className="grid gap-2 text-sm font-bold">
                  Slug
                  <input
                    className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                    onChange={(event) =>
                      updateEditField('slug', event.target.value)
                    }
                    required
                    type="text"
                    value={editForm.slug}
                  />
                </label>
              </div>

              <label className="mt-5 grid gap-2 text-sm font-bold">
                Description
                <textarea
                  className="min-h-28 resize-y border border-black/10 px-3 py-3 text-sm font-medium leading-6 outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                  onChange={(event) =>
                    updateEditField('description', event.target.value)
                  }
                  value={editForm.description}
                />
              </label>

              <label className="mt-5 grid gap-2 text-sm font-bold">
                Category image
                <div className="border border-dashed border-black/20 bg-[#f8f3ea] p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-12 w-12 shrink-0 place-items-center bg-white text-[#7a3f1d]">
                        <Globe2 className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-bold">
                          {editImageFile?.name ?? 'Keep current image'}
                        </span>
                        <span className="mt-1 block text-xs font-semibold text-[#6b5f53]">
                          Upload only when changing category image.
                        </span>
                      </span>
                    </div>

                    <span className="relative inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d]">
                      <Upload className="h-4 w-4" />
                      Choose file
                      <input
                        accept="image/*"
                        className="absolute inset-0 cursor-pointer opacity-0"
                        key={editImageInputKey}
                        onChange={(event) =>
                          setEditImageFile(event.target.files?.[0] ?? null)
                        }
                        type="file"
                      />
                    </span>
                  </div>
                </div>
              </label>

              <div className="mt-6 flex flex-wrap justify-end gap-2">
                <button
                  className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
                  disabled={isUpdating}
                  onClick={() => setCategoryToEdit(null)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="inline-flex min-h-11 items-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isUpdating}
                  type="submit"
                >
                  {isUpdating ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isUpdating ? 'Updating...' : 'Update category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {categoryToDelete && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/55 px-4"
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-md border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
            role="dialog"
          >
            <p className="text-sm font-bold text-[#8f3f1d]">Delete category</p>
            <h2 className="mt-2 text-2xl font-bold">
              Delete {categoryToDelete.name}?
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#6b5f53]">
              This will remove the category from the marketplace database.
            </p>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
                disabled={isDeleting}
                onClick={() => setCategoryToDelete(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex min-h-11 items-center gap-2 bg-[#8f3f1d] px-4 text-sm font-bold text-white transition hover:bg-[#181512] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                type="button"
              >
                {isDeleting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {isDeleting ? 'Deleting...' : 'Confirm delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default CategoryTable
