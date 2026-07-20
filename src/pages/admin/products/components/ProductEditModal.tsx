import { ImageOff, LoaderCircle, Save, Trash2, Upload } from 'lucide-react'
import type { FormEvent } from 'react'

import type { Category } from '../../../../features/categories/categoryApi'
import type { Product } from '../../../../features/products/productApi'
import {
  formatFileSize,
  getProductImageUrl,
  type ProductEditForm,
} from '../productTableUtils'

type ProductEditModalProps = {
  categories: Category[]
  editForm: ProductEditForm
  editImageFiles: File[]
  editImageInputKey: number
  editImagePreviews: string[]
  hasCategoriesError: boolean
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
  isCategoriesLoading,
  isUpdating,
  onClose,
  onImageChange,
  onRemoveImage,
  onSubmit,
  onUpdateField,
  product,
}: ProductEditModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#181512]/55 px-4 py-6"
      role="presentation"
    >
      <div
        aria-modal="true"
        className="w-full max-w-3xl border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
        role="dialog"
      >
        <p className="text-sm font-bold text-[#7a3f1d]">Update product</p>
        <h2 className="mt-2 text-2xl font-bold">{product.name}</h2>

        <form className="mt-5" onSubmit={onSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              Product name
              <input
                className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                onChange={(event) => onUpdateField('name', event.target.value)}
                required
                type="text"
                value={editForm.name}
              />
              <span className="text-xs font-semibold text-[#6b5f53]">
                Slug: {editForm.slug || 'product-slug'}
              </span>
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Category
              <select
                className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
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

            <label className="grid gap-2 text-sm font-bold">
              Brand
              <input
                className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                onChange={(event) => onUpdateField('brand', event.target.value)}
                type="text"
                value={editForm.brand}
              />
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Price
              <input
                className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                min="0"
                onChange={(event) => onUpdateField('price', event.target.value)}
                required
                step="0.01"
                type="number"
                value={editForm.price}
              />
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Stock
              <input
                className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                min="0"
                onChange={(event) => onUpdateField('stock', event.target.value)}
                required
                step="1"
                type="number"
                value={editForm.stock}
              />
            </label>
          </div>

          <label className="mt-5 grid gap-2 text-sm font-bold">
            Description
            <textarea
              className="min-h-28 resize-y border border-black/10 px-3 py-3 text-sm font-medium leading-6 outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
              onChange={(event) =>
                onUpdateField('description', event.target.value)
              }
              value={editForm.description}
            />
          </label>

          <label className="mt-5 grid gap-2 text-sm font-bold">
            Replacement photos
            <div className="border border-dashed border-black/20 bg-[#f8f3ea] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden bg-white text-[#7a3f1d]">
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
                      <ImageOff className="h-5 w-5" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold">
                      {editImageFiles.length
                        ? `${editImageFiles.length} replacement photo selected`
                        : 'Keep current photos'}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-[#6b5f53]">
                      Upload only when changing product photos.
                    </span>
                  </span>
                </div>

                <span className="relative inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d]">
                  <Upload className="h-4 w-4" />
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
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
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
                        className="absolute right-2 top-2 grid h-9 w-9 place-items-center bg-white text-[#8f3f1d] shadow-[0_10px_24px_rgba(24,21,18,0.18)] transition hover:bg-[#fff5ef]"
                        onClick={() => onRemoveImage(index)}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="p-3">
                        <p className="truncate font-bold">
                          {editImageFiles[index]?.name}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#6b5f53]">
                          {editImageFiles[index]
                            ? formatFileSize(editImageFiles[index].size)
                            : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>

          {hasCategoriesError && (
            <p className="mt-5 border border-[#c85f2f]/30 bg-[#fff5ef] px-4 py-3 text-sm font-semibold text-[#8f3f1d]">
              Failed to load categories for product form.
            </p>
          )}

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
              disabled={isUpdating || isCategoriesLoading}
              type="submit"
            >
              {isUpdating ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
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
