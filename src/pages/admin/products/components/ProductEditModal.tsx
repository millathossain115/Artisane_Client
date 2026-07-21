import { AlertTriangle, ImageOff, LoaderCircle, Save, Trash2, Upload } from 'lucide-react'
import type { FormEvent } from 'react'

import type { Category } from '../../../../features/categories/categoryApi'
import type { Product } from '../../../../features/products/productApi'
import {
  formatFileSize,
  getCategoryId,
  getProductImageUrl,
  MAX_IMAGE_SIZE,
  truncateFileName,
  type ProductEditForm,
} from '../productTableUtils'

type ProductEditModalProps = {
  categories: Category[]
  editForm: ProductEditForm
  editImageFiles: File[]
  editImageInputKey: number
  editImagePreviews: string[]
  hasCategoriesError: boolean
  imageWarning?: string
  isCategoriesLoading: boolean
  isUpdating: boolean
  onClose: () => void
  onImageChange: (files: FileList | null) => void
  onRemoveImage: (index: number) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onUpdateField: (field: keyof ProductEditForm, value: string) => void
  product: Product
}

function ProductEditModal({
  categories,
  editForm,
  editImageFiles,
  editImageInputKey,
  editImagePreviews,
  hasCategoriesError,
  imageWarning,
  isCategoriesLoading,
  isUpdating,
  onClose,
  onImageChange,
  onRemoveImage,
  onSubmit,
  onUpdateField,
  product,
}: ProductEditModalProps) {
  const isEditFormChanged = Boolean(
    editForm.name.trim() !== product.name ||
      editForm.categoryId !== getCategoryId(product.category) ||
      editForm.brand.trim() !== (product.brand ?? '') ||
      editForm.price.trim() !== String(product.price) ||
      editForm.stock.trim() !== String(product.stock) ||
      editForm.description.trim() !== (product.description ?? '') ||
      editImageFiles.length > 0,
  )

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#181512]/55 px-4 py-4 sm:py-6"
      role="presentation"
    >
      <div
        aria-modal="true"
        className="w-full max-w-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-black/10 pb-2.5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#7a3f1d]">Update product</p>
            <h2 className="mt-0.5 text-xl font-bold leading-snug">{product.name}</h2>
          </div>
        </div>

        <form className="mt-3 sm:mt-4" onSubmit={onSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-bold">
              Product name
              <input
                className="min-h-10 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                onChange={(event) => onUpdateField('name', event.target.value)}
                required
                type="text"
                value={editForm.name}
              />
              <span className="text-[11px] font-semibold text-[#6b5f53]">
                Slug: {editForm.slug || 'product-slug'}
              </span>
            </label>

            <label className="grid gap-1 text-xs font-bold">
              Category
              <select
                className="min-h-10 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
                disabled={isCategoriesLoading}
                onChange={(event) =>
                  onUpdateField('categoryId', event.target.value)
                }
                required
                value={editForm.categoryId}
              >
                <option value="">
                  {isCategoriesLoading ? 'Loading categories...' : 'Select category'}
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 text-xs font-bold">
              Brand
              <input
                className="min-h-10 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                onChange={(event) => onUpdateField('brand', event.target.value)}
                type="text"
                value={editForm.brand}
              />
            </label>

            <label className="grid gap-1 text-xs font-bold">
              Price ($)
              <input
                className="min-h-10 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                min="0"
                onChange={(event) => onUpdateField('price', event.target.value)}
                required
                step="0.01"
                type="number"
                value={editForm.price}
              />
            </label>

            <label className="grid gap-1 text-xs font-bold sm:col-span-2">
              Stock count
              <input
                className="min-h-10 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                min="0"
                onChange={(event) => onUpdateField('stock', event.target.value)}
                required
                step="1"
                type="number"
                value={editForm.stock}
              />
            </label>
          </div>

          <label className="mt-3 grid gap-1 text-xs font-bold">
            Description
            <textarea
              className="min-h-20 resize-y border border-black/10 px-3 py-2 text-sm font-medium leading-5 outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
              onChange={(event) =>
                onUpdateField('description', event.target.value)
              }
              value={editForm.description}
            />
          </label>

          <label className="mt-3 grid gap-1 text-xs font-bold">
            <div className="flex items-center justify-between">
              <span>Replacement photos</span>
              <span className="text-[11px] font-semibold text-[#7a3f1d]">
                Max size: {formatFileSize(MAX_IMAGE_SIZE)}
              </span>
            </div>
            <div className="border border-dashed border-black/20 bg-[#f8f3ea] p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden bg-white text-[#7a3f1d]">
                    {editImagePreviews[0] ||
                    getProductImageUrl(product.images?.[0]) ? (
                      <img
                        alt=""
                        className="h-full w-full object-cover"
                        src={
                          editImagePreviews[0] ||
                          getProductImageUrl(product.images?.[0])
                        }
                      />
                    ) : (
                      <ImageOff className="h-4 w-4" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold text-xs">
                      {editImageFiles.length
                        ? `${editImageFiles.length} replacement photo selected`
                        : 'Keep current photos'}
                    </span>
                    <span className="mt-0.5 block text-[11px] font-semibold text-[#6b5f53]">
                      Upload only when changing product photos. Max: {formatFileSize(MAX_IMAGE_SIZE)}.
                    </span>
                  </span>
                </div>

                <span className="relative inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 bg-[#181512] px-3 text-xs font-bold text-white transition hover:bg-[#7a3f1d]">
                  <Upload className="h-3.5 w-3.5" />
                  Choose files
                  <input
                    accept="image/*"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    key={editImageInputKey}
                    multiple
                    onChange={(event) => onImageChange(event.target.files)}
                    type="file"
                  />
                </span>
              </div>

              {editImagePreviews.length > 0 && (
                <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                  {editImagePreviews.map((previewUrl, index) => (
                    <div
                      className="relative overflow-hidden border border-black/10 bg-white"
                      key={previewUrl}
                    >
                      <img
                        alt=""
                        className="aspect-square w-full object-cover"
                        src={previewUrl}
                      />
                      <button
                        aria-label={`Remove ${editImageFiles[index]?.name ?? 'image'}`}
                        className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center bg-white text-[#8f3f1d] shadow-[0_4px_12px_rgba(24,21,18,0.18)] transition hover:bg-[#fff5ef]"
                        onClick={() => onRemoveImage(index)}
                        type="button"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <div className="p-2">
                        <p
                          className="truncate font-bold text-xs"
                          title={editImageFiles[index]?.name}
                        >
                          {editImageFiles[index]?.name
                            ? truncateFileName(editImageFiles[index].name, 20)
                            : ''}
                        </p>
                        <p className="mt-0.5 text-[11px] font-semibold text-[#6b5f53]">
                          {editImageFiles[index]
                            ? formatFileSize(editImageFiles[index].size)
                            : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {imageWarning && (
                <div className="mt-2.5 flex items-center gap-2 border border-[#c85f2f]/30 bg-[#fff5ef] p-2 text-xs font-semibold text-[#8f3f1d]">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{imageWarning}</span>
                </div>
              )}
            </div>
          </label>

          {hasCategoriesError && (
            <p className="mt-3 border border-[#c85f2f]/30 bg-[#fff5ef] px-3 py-2 text-xs font-semibold text-[#8f3f1d]">
              Failed to load categories for product form.
            </p>
          )}

          <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-black/10 pt-3">
            <button
              className="min-h-10 border border-black/10 bg-white px-4 text-xs font-bold transition hover:border-[#181512]"
              disabled={isUpdating}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="inline-flex min-h-10 items-center gap-2 bg-[#181512] px-4 text-xs font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isUpdating || isCategoriesLoading || !isEditFormChanged}
              type="submit"
            >
              {isUpdating ? (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {isUpdating ? 'Updating...' : 'Update product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductEditModal
