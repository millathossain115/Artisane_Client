import { AlertTriangle, LoaderCircle, Save, Trash2 } from 'lucide-react'

import type { Category } from '../../../../features/categories/categoryApi'
import { isCategoryActive } from '../categoryTableUtils'

type CategoryConfirmModalsProps = {
  categoryToDelete: Category | null
  categoryToEdit: Category | null
  categoryToToggleStatus: Category | null
  isDeleting: boolean
  isUpdating: boolean
  onCancelDelete: () => void
  onCancelStatus: () => void
  onCancelUpdate: () => void
  onConfirmDelete: () => void
  onConfirmStatus: () => void
  onConfirmUpdate: () => void
  showUpdateConfirm: boolean
}

function CategoryConfirmModals({
  categoryToDelete,
  categoryToEdit,
  categoryToToggleStatus,
  isDeleting,
  isUpdating,
  onCancelDelete,
  onCancelStatus,
  onCancelUpdate,
  onConfirmDelete,
  onConfirmStatus,
  onConfirmUpdate,
  showUpdateConfirm,
}: CategoryConfirmModalsProps) {
  return (
    <>
      {showUpdateConfirm && categoryToEdit && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-[#181512]/55 px-4"
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-md border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
            role="dialog"
          >
            <div className="flex items-center gap-2 text-[#7a3f1d]">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm font-bold">Confirm update</p>
            </div>
            <h2 className="mt-2 text-2xl font-bold">
              Update {categoryToEdit.name}?
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#6b5f53]">
              Are you sure you want to save changes to this category?
            </p>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
                disabled={isUpdating}
                onClick={onCancelUpdate}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex min-h-11 items-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isUpdating}
                onClick={onConfirmUpdate}
                type="button"
              >
                {isUpdating ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isUpdating ? 'Updating...' : 'Confirm update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {categoryToToggleStatus && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/55 px-4"
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-md border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
            role="dialog"
          >
            <div className="flex items-center gap-2 text-[#c85f2f]">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm font-bold">Status change warning</p>
            </div>
            <h2 className="mt-2 text-2xl font-bold">
              {isCategoryActive(categoryToToggleStatus)
                ? 'Deactivate'
                : 'Activate'}{' '}
              {categoryToToggleStatus.name}?
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#6b5f53]">
              Are you sure you want to mark this category as{' '}
              <strong className="text-[#181512]">
                {isCategoryActive(categoryToToggleStatus)
                  ? 'Inactive'
                  : 'Active'}
              </strong>
              ?{' '}
              {isCategoryActive(categoryToToggleStatus)
                ? 'Deactivating will hide products associated with this category from storefront filters.'
                : 'Activating will make this category visible across storefront search and navigation.'}
            </p>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
                disabled={isUpdating}
                onClick={onCancelStatus}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex min-h-11 items-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isUpdating}
                onClick={onConfirmStatus}
                type="button"
              >
                {isUpdating ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isUpdating ? 'Updating...' : 'Confirm status change'}
              </button>
            </div>
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
                onClick={onCancelDelete}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex min-h-11 items-center gap-2 bg-[#8f3f1d] px-4 text-sm font-bold text-white transition hover:bg-[#181512] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isDeleting}
                onClick={onConfirmDelete}
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
    </>
  )
}

export default CategoryConfirmModals
