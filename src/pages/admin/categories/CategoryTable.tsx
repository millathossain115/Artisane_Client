import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ChevronLeft, ChevronRight, FolderTree, X } from 'lucide-react'

import { ErrorState, SkeletonTable } from '../../../components/loaders'
import {
  type Category,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from '../../../features/categories/categoryApi'
import CategoryConfirmModals from './components/CategoryConfirmModals'
import CategoryDesktopTable from './components/CategoryDesktopTable'
import CategoryEditModal from './components/CategoryEditModal'
import CategoryMobileList from './components/CategoryMobileList'
import CategoryTableFilters from './components/CategoryTableFilters'
import {
  MAX_IMAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  type CategoryEditForm,
  type SortFilter,
  formatFileSize,
  getErrorMessage,
  getSortParams,
  isCategoryActive,
} from './categoryTableUtils'

function CategoryTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortFilter, setSortFilter] = useState<SortFilter>('newest')
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [currentPage, setCurrentPage] = useState(1)
  const sortParams = getSortParams(sortFilter)
  const {
    data: categoryList,
    isError: hasCategoriesError,
    isLoading: isCategoriesLoading,
  } = useGetCategoriesQuery({
    limit: pageSize,
    page: currentPage,
    searchTerm: searchTerm.trim() || undefined,
    ...sortParams,
  })
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation()
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation()
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  )
  const [categoryToToggleStatus, setCategoryToToggleStatus] =
    useState<Category | null>(null)
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false)
  const [imageWarning, setImageWarning] = useState('')
  const [editForm, setEditForm] = useState<CategoryEditForm>({
    description: '',
    name: '',
    slug: '',
  })
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImagePreviewUrl, setEditImagePreviewUrl] = useState('')
  const [editImageInputKey, setEditImageInputKey] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const editImagePreviewRef = useRef('')
  const categories = categoryList?.data ?? []
  const categoryMeta = categoryList?.meta
  const totalCategories = categoryMeta?.total ?? categories.length
  const totalPages = Math.max(1, categoryMeta?.totalPage ?? 1)
  const safeCurrentPage = Math.min(
    categoryMeta?.page ?? currentPage,
    totalPages,
  )
  const resultStart = totalCategories
    ? (safeCurrentPage - 1) * (categoryMeta?.limit ?? pageSize) + 1
    : 0
  const resultEnd = Math.min(
    resultStart + (categoryMeta?.limit ?? pageSize) - 1,
    totalCategories,
  )
  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    sortFilter !== 'newest' ||
    pageSize !== PAGE_SIZE_OPTIONS[0]
  const isEditFormChanged = Boolean(
    categoryToEdit &&
      (editForm.name.trim() !== categoryToEdit.name ||
        editForm.slug.trim() !== categoryToEdit.slug ||
        editForm.description.trim() !== (categoryToEdit.description ?? '') ||
        Boolean(editImageFile)),
  )

  useEffect(() => {
    return () => {
      if (editImagePreviewRef.current) {
        URL.revokeObjectURL(editImagePreviewRef.current)
      }
    }
  }, [])

  function clearEditImagePreview() {
    if (editImagePreviewRef.current) {
      URL.revokeObjectURL(editImagePreviewRef.current)
      editImagePreviewRef.current = ''
    }

    setEditImagePreviewUrl('')
  }

  function setEditImagePreview(file: File) {
    clearEditImagePreview()

    const previewUrl = URL.createObjectURL(file)
    editImagePreviewRef.current = previewUrl
    setEditImagePreviewUrl(previewUrl)
  }

  function handleEditImageChange(file: File | undefined) {
    setStatus('')
    setError('')
    setImageWarning('')

    if (!file) {
      setEditImageFile(null)
      clearEditImagePreview()
      return
    }

    if (!file.type.startsWith('image/')) {
      setEditImageFile(null)
      clearEditImagePreview()
      setEditImageInputKey((currentKey) => currentKey + 1)
      setImageWarning('Only image files are allowed.')
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setEditImageFile(null)
      clearEditImagePreview()
      setEditImageInputKey((currentKey) => currentKey + 1)
      setImageWarning(
        `Warning: Selected photo (${formatFileSize(file.size)}) exceeds maximum allowed size of ${formatFileSize(MAX_IMAGE_SIZE)}.`,
      )
      return
    }

    setEditImageFile(file)
    setEditImagePreview(file)
  }

  function openEditModal(category: Category) {
    setStatus('')
    setError('')
    setImageWarning('')
    setCategoryToEdit(category)
    setEditForm({
      description: category.description ?? '',
      name: category.name,
      slug: category.slug,
    })
    setEditImageFile(null)
    clearEditImagePreview()
    setEditImageInputKey((currentKey) => currentKey + 1)
  }

  function closeEditModal() {
    setCategoryToEdit(null)
    setEditImageFile(null)
    clearEditImagePreview()
    setShowUpdateConfirm(false)
    setImageWarning('')
  }

  function updateEditField(field: keyof CategoryEditForm, value: string) {
    setStatus('')
    setError('')
    setEditForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleUpdateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!categoryToEdit) {
      return
    }

    setShowUpdateConfirm(true)
  }

  async function handleConfirmUpdate() {
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
      closeEditModal()
    } catch (caughtError) {
      setShowUpdateConfirm(false)
      setError(getErrorMessage(caughtError, 'Failed to update category.'))
    }
  }

  async function handleConfirmToggleStatus() {
    if (!categoryToToggleStatus) {
      return
    }

    setStatus('')
    setError('')

    const nextStatus = !isCategoryActive(categoryToToggleStatus)

    try {
      await updateCategory({
        id: categoryToToggleStatus._id,
        isActive: nextStatus,
      }).unwrap()

      setStatus(`Category marked ${nextStatus ? 'active' : 'inactive'}.`)
      setCategoryToToggleStatus(null)
    } catch (caughtError) {
      setError(
        getErrorMessage(caughtError, 'Failed to update category status.'),
      )
    }
  }

  function handleToggleCategoryStatus(category: Category) {
    setStatus('')
    setError('')
    setCategoryToToggleStatus(category)
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
      setCurrentPage((page) =>
        categories.length === 1 ? Math.max(1, page - 1) : page,
      )
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, 'Failed to delete category.'))
    }
  }

  function handleRequestDelete(category: Category) {
    setStatus('')
    setError('')
    setCategoryToDelete(category)
  }

  function handleResetFilters() {
    setSearchTerm('')
    setSortFilter('newest')
    setPageSize(PAGE_SIZE_OPTIONS[0])
    setCurrentPage(1)
  }

  return (
    <section className="mt-6 border border-black/10 bg-white" id="categories">
      <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3.5 sm:px-5">
        <span className="grid h-9 w-9 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
          <FolderTree className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-xl font-bold">Current categories</h2>
          <p className="mt-0.5 text-xs font-semibold text-[#6b5f53]">
            All category records currently stored in the database.
          </p>
        </div>
      </div>

      {(status || error) && (
        <div
          className={`border-b border-black/10 px-5 py-3 text-sm font-semibold ${
            error
              ? 'bg-[#fff5ef] text-[#8f3f1d]'
              : 'bg-[#effaf3] text-[#1f6b43]'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span>{error || status}</span>
            <button
              aria-label="Close message"
              className="grid h-8 w-8 shrink-0 place-items-center border border-current/20 transition hover:bg-white/45"
              onClick={() => {
                setStatus('')
                setError('')
              }}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {hasCategoriesError ? (
        <ErrorState
          title="Failed to load categories"
          message="Could not retrieve categories list. Please try refreshing."
          onRetry={() => window.location.reload()}
          className="mx-5"
        />
      ) : null}

      <CategoryTableFilters
        hasActiveFilters={hasActiveFilters}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize)
          setCurrentPage(1)
        }}
        onResetFilters={handleResetFilters}
        onSearchTermChange={(nextSearchTerm) => {
          setSearchTerm(nextSearchTerm)
          setCurrentPage(1)
        }}
        onSortFilterChange={(nextSortFilter) => {
          setSortFilter(nextSortFilter)
          setCurrentPage(1)
        }}
        pageSize={pageSize}
        searchTerm={searchTerm}
        sortFilter={sortFilter}
      />

      {isCategoriesLoading ? (
        <div className="p-5">
          <SkeletonTable rows={pageSize} cols={5} />
        </div>
      ) : (
        <>
          <CategoryMobileList
            categories={categories}
            isUpdating={isUpdating}
            onDelete={handleRequestDelete}
            onEdit={openEditModal}
            onToggleStatus={handleToggleCategoryStatus}
            totalCategories={totalCategories}
          />
          <CategoryDesktopTable
            categories={categories}
            isUpdating={isUpdating}
            onDelete={handleRequestDelete}
            onEdit={openEditModal}
            onToggleStatus={handleToggleCategoryStatus}
            totalCategories={totalCategories}
          />
        </>
      )}

      <div className="flex flex-col gap-2 border-t border-black/10 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs font-semibold text-[#6b5f53]">
          Showing {resultStart}-{resultEnd} of {totalCategories} categories.
        </p>

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous page"
            className="inline-flex h-8 w-8 items-center justify-center border border-black/10 text-[#181512] transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={safeCurrentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-20 text-center text-xs font-bold">
            Page {safeCurrentPage} of {totalPages}
          </span>
          <button
            aria-label="Next page"
            className="inline-flex h-8 w-8 items-center justify-center border border-black/10 text-[#181512] transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
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
        <CategoryEditModal
          category={categoryToEdit}
          editForm={editForm}
          editImageFile={editImageFile}
          editImageInputKey={editImageInputKey}
          editImagePreviewUrl={editImagePreviewUrl}
          imageWarning={imageWarning}
          isEditFormChanged={isEditFormChanged}
          isUpdating={isUpdating}
          onClose={closeEditModal}
          onFieldChange={updateEditField}
          onImageChange={handleEditImageChange}
          onSubmit={handleUpdateSubmit}
        />
      )}

      <CategoryConfirmModals
        categoryToDelete={categoryToDelete}
        categoryToEdit={categoryToEdit}
        categoryToToggleStatus={categoryToToggleStatus}
        isDeleting={isDeleting}
        isUpdating={isUpdating}
        onCancelDelete={() => setCategoryToDelete(null)}
        onCancelStatus={() => setCategoryToToggleStatus(null)}
        onCancelUpdate={() => setShowUpdateConfirm(false)}
        onConfirmDelete={handleConfirmDelete}
        onConfirmStatus={handleConfirmToggleStatus}
        onConfirmUpdate={handleConfirmUpdate}
        showUpdateConfirm={showUpdateConfirm}
      />
    </section>
  )
}

export default CategoryTable
