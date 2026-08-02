import type { FormEvent } from 'react'
import { AlertTriangle, Globe2, LoaderCircle, Save, Upload } from 'lucide-react'

import type { Category } from '../../../../features/categories/categoryApi'
import {
  MAX_IMAGE_SIZE,
  type CategoryEditForm,
  formatFileSize,
  getCategoryImageUrl,
  truncateFileName,
} from '../categoryTableUtils'

type CategoryEditModalProps = {
  category: Category
  editForm: CategoryEditForm
  editImageFile: File | null
  editImageInputKey: number
  editImagePreviewUrl: string
  imageWarning: string
  isEditFormChanged: boolean
  isUpdating: boolean
  onClose: () => void
  onFieldChange: (field: keyof CategoryEditForm, value: string) => void
  onImageChange: (file: File | undefined) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function CategoryEditModal({
  category,
  editForm,
  editImageFile,
  editImageInputKey,
  editImagePreviewUrl,
  imageWarning,
  isEditFormChanged,
  isUpdating,
  onClose,
  onFieldChange,
  onImageChange,
  onSubmit,
}: CategoryEditModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/55 px-4"
      role="presentation"
    >
      <div
        aria-modal="true"
        className="w-full max-w-2xl border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
        role="dialog"
      >
        <p className="text-sm font-bold text-[#7a3f1d]">Update category</p>
        <h2 className="mt-2 text-2xl font-bold">{category.name}</h2>

        <form className="mt-5" onSubmit={onSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              Category name
              <input
                className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                onChange={(event) =>
                  onFieldChange('name', event.target.value)
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
                  onFieldChange('slug', event.target.value)
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
                onFieldChange('description', event.target.value)
              }
              value={editForm.description}
            />
          </label>

          <label className="mt-5 grid gap-2 text-sm font-bold">
            <div className="flex items-center justify-between">
              <span>Category image</span>
              <span className="text-xs font-semibold text-[#7a3f1d]">
                Max size: {formatFileSize(MAX_IMAGE_SIZE)}
              </span>
            </div>
            <div className="border border-dashed border-black/20 bg-[#f8f3ea] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden bg-white text-[#7a3f1d]">
                    {editImagePreviewUrl || getCategoryImageUrl(category) ? (
                      <img
                        alt=""
                        className="h-full w-full object-cover"
                        src={editImagePreviewUrl || getCategoryImageUrl(category)}
                      />
                    ) : (
                      <Globe2 className="h-5 w-5" />
                    )}
                  </span>
                  <span className="min-w-0 max-w-[180px] sm:max-w-[240px]">
                    <span
                      className="block truncate font-bold"
                      title={editImageFile?.name}
                    >
                      {editImageFile
                        ? truncateFileName(editImageFile.name, 22)
                        : 'Keep current image'}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-[#6b5f53]">
                      {editImageFile
                        ? `${editImageFile.type} - ${formatFileSize(editImageFile.size)}`
                        : `Upload only when changing category image. Max: ${formatFileSize(MAX_IMAGE_SIZE)}.`}
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
                      onImageChange(event.target.files?.[0])
                    }
                    type="file"
                  />
                </span>
              </div>

              {imageWarning && (
                <div className="mt-3 flex items-center gap-2 border border-[#c85f2f]/30 bg-[#fff5ef] p-3 text-xs font-semibold text-[#8f3f1d]">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{imageWarning}</span>
                </div>
              )}
            </div>
          </label>

          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <button
              className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
              disabled={isUpdating}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="inline-flex min-h-11 items-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isUpdating || !isEditFormChanged}
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
  )
}

export default CategoryEditModal
