import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  AlertTriangle,
  ImagePlus,
  LoaderCircle,
  Save,
  Trash2,
  Upload,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useGetCategoriesQuery } from '../../../features/categories/categoryApi'
import { useCreateProductMutation } from '../../../features/products/productApi'
import { adminNavItems } from '../../dashboard/adminNavItems'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_PRODUCT_IMAGES = 5

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function getErrorMessage(error: unknown) {
  if (!error || typeof error !== 'object') {
    return 'Failed to create product'
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

  return 'Failed to create product'
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.ceil(size / 1024)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function CreateProduct() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [brand, setBrand] = useState('Artisane')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageInputKey, setImageInputKey] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [showCreateConfirm, setShowCreateConfirm] = useState(false)
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()
  const imagePreviewRef = useRef<string[]>([])
  const {
    data: categoryList,
    isError: hasCategoriesError,
    isLoading: isCategoriesLoading,
  } = useGetCategoriesQuery({
    limit: 100,
    page: 1,
    sortBy: 'name',
    sortOrder: 'asc',
  })
  const categories = categoryList?.data ?? []
  const selectedCategory = categories.find(
    (category) => category._id === categoryId,
  )

  useEffect(() => {
    return () => {
      imagePreviewRef.current.forEach((previewUrl) =>
        URL.revokeObjectURL(previewUrl),
      )
    }
  }, [])

  function clearImagePreviews() {
    imagePreviewRef.current.forEach((previewUrl) =>
      URL.revokeObjectURL(previewUrl),
    )
    imagePreviewRef.current = []
    setImagePreviews([])
  }

  function handleImageChange(files: FileList | null) {
    setStatus('')
    setError('')

    if (!files?.length) {
      return
    }

    const nextFiles = Array.from(files)

    if (nextFiles.some((file) => !file.type.startsWith('image/'))) {
      setError('Only image files are allowed.')
      setImageInputKey((currentKey) => currentKey + 1)
      return
    }

    if (nextFiles.some((file) => file.size > MAX_IMAGE_SIZE)) {
      setError('Each image must be 5MB or less.')
      setImageInputKey((currentKey) => currentKey + 1)
      return
    }

    if (imageFiles.length + nextFiles.length > MAX_PRODUCT_IMAGES) {
      setError(`Upload up to ${MAX_PRODUCT_IMAGES} product images.`)
      setImageInputKey((currentKey) => currentKey + 1)
      return
    }

    const nextPreviews = nextFiles.map((file) => URL.createObjectURL(file))

    imagePreviewRef.current = [...imagePreviewRef.current, ...nextPreviews]
    setImageFiles((currentFiles) => [...currentFiles, ...nextFiles])
    setImagePreviews((currentPreviews) => [...currentPreviews, ...nextPreviews])
    setImageInputKey((currentKey) => currentKey + 1)
  }

  function removeImage(indexToRemove: number) {
    const previewToRemove = imagePreviews[indexToRemove]

    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove)
    }

    imagePreviewRef.current = imagePreviewRef.current.filter(
      (_previewUrl, index) => index !== indexToRemove,
    )
    setImageFiles((currentFiles) =>
      currentFiles.filter((_file, index) => index !== indexToRemove),
    )
    setImagePreviews((currentPreviews) =>
      currentPreviews.filter((_previewUrl, index) => index !== indexToRemove),
    )
  }

  function handleNameChange(value: string) {
    setName(value)
    setSlug(createSlug(value))
  }

  function validateProductForm() {
    const numericPrice = Number(price)
    const numericStock = Number(stock)

    if (!categoryId) {
      setError('Select a category before creating product.')
      return
    }

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      setError('Price must be a valid number.')
      return
    }

    if (!Number.isInteger(numericStock) || numericStock < 0) {
      setError('Stock must be a valid whole number.')
      return
    }

    if (!imageFiles.length) {
      setError('Upload at least one product image.')
      return null
    }

    return {
      numericPrice,
      numericStock,
    }
  }

  async function createConfirmedProduct() {
    const validatedValues = validateProductForm()

    if (!validatedValues) {
      setShowCreateConfirm(false)
      return
    }

    try {
      await createProduct({
        brand: brand.trim() || undefined,
        category: categoryId,
        description: description.trim(),
        images: imageFiles,
        name: name.trim(),
        price: validatedValues.numericPrice,
        slug: slug.trim(),
        stock: validatedValues.numericStock,
      }).unwrap()

      setStatus('Product created successfully.')
      setShowCreateConfirm(false)
      setName('')
      setSlug('')
      setDescription('')
      setPrice('')
      setStock('')
      setCategoryId('')
      setBrand('Artisane')
      setImageFiles([])
      clearImagePreviews()
      setImageInputKey((currentKey) => currentKey + 1)
    } catch (caughtError) {
      setError(getErrorMessage(caughtError))
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('')
    setError('')

    if (!validateProductForm()) {
      return
    }

    setShowCreateConfirm(true)
  }

  return (
    <DashboardLayout
      actions={[{ label: 'Manage products', to: '/dashboard/products' }]}
      eyebrow="Product management"
      helperText="Create products with valid category references before publishing them to the marketplace."
      sidebarItems={adminNavItems}
      subtitle="Create product records and assign each product to a real category id."
      title="Create product"
      workspaceLabel="Marketplace studio"
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_0.42fr]">
        <form
          className="border border-black/10 bg-white p-5"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              Product name
              <input
                className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                onChange={(event) => handleNameChange(event.target.value)}
                placeholder="Handmade Ceramic Bowl"
                required
                type="text"
                value={name}
              />
              <span className="text-xs font-semibold text-[#6b5f53]">
                Slug: {slug || 'handmade-ceramic-bowl'}
              </span>
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Category
              <select
                className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
                disabled={isCategoriesLoading}
                onChange={(event) => setCategoryId(event.target.value)}
                required
                value={categoryId}
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
                onChange={(event) => setBrand(event.target.value)}
                placeholder="Artisane"
                type="text"
                value={brand}
              />
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Price
              <input
                className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                min="0"
                onChange={(event) => setPrice(event.target.value)}
                placeholder="45"
                required
                step="0.01"
                type="number"
                value={price}
              />
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Stock
              <input
                className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                min="0"
                onChange={(event) => setStock(event.target.value)}
                placeholder="12"
                required
                step="1"
                type="number"
                value={stock}
              />
            </label>
          </div>

          <label className="mt-5 grid gap-2 text-sm font-bold">
            Description
            <textarea
              className="min-h-32 resize-y border border-black/10 px-3 py-3 text-sm font-medium leading-6 outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="A handmade ceramic bowl."
              required
              value={description}
            />
          </label>

          <label className="mt-5 grid gap-2 text-sm font-bold">
            Product photos
            <div className="border border-dashed border-black/20 bg-[#f8f3ea] p-4 transition focus-within:border-[#181512]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center bg-white text-[#7a3f1d]">
                    <ImagePlus className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold">
                      {imageFiles.length
                        ? `${imageFiles.length} photo selected`
                        : 'Upload product photos'}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-[#6b5f53]">
                      Up to {MAX_PRODUCT_IMAGES} images. Each image must be 5MB
                      or less.
                    </span>
                  </span>
                </div>

                <span className="relative inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d]">
                  <Upload className="h-4 w-4" />
                  Choose files
                  <input
                    accept="image/*"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    key={imageInputKey}
                    multiple
                    onChange={(event) => handleImageChange(event.target.files)}
                    type="file"
                  />
                </span>
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {imagePreviews.map((previewUrl, index) => (
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
                        aria-label={`Remove ${imageFiles[index]?.name ?? 'image'}`}
                        className="absolute right-2 top-2 grid h-9 w-9 place-items-center bg-white text-[#8f3f1d] shadow-[0_10px_24px_rgba(24,21,18,0.18)] transition hover:bg-[#fff5ef]"
                        onClick={() => removeImage(index)}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="p-3">
                        <p className="truncate font-bold">
                          {imageFiles[index]?.name}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#6b5f53]">
                          {imageFiles[index]
                            ? formatFileSize(imageFiles[index].size)
                            : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>

          {(status || error || hasCategoriesError) && (
            <p
              className={`mt-5 border px-4 py-3 text-sm font-semibold ${
                error || hasCategoriesError
                  ? 'border-[#c85f2f]/30 bg-[#fff5ef] text-[#8f3f1d]'
                  : 'border-[#1f7a4d]/20 bg-[#effaf3] text-[#1f6b43]'
              }`}
            >
              {error ||
                (hasCategoriesError
                  ? 'Failed to load categories for product form.'
                  : status)}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              className="inline-flex min-h-11 items-center gap-2 bg-[#181512] px-5 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isCreating || isCategoriesLoading}
              type="submit"
            >
              {isCreating ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isCreating ? 'Creating...' : 'Create product'}
            </button>

            <Link
              className="inline-flex min-h-11 items-center gap-2 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
              to="/dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
        </form>

        <aside className="border border-black/10 bg-[#181512] p-5 text-white">
          <h2 className="text-2xl font-bold">Product preview</h2>
          <p className="mt-2 text-sm leading-6 text-white/65">
            {selectedCategory
              ? selectedCategory.name
              : 'Select category to complete preview'}
          </p>

          {imagePreviews[0] ? (
            <img
              alt=""
              className="mt-5 aspect-video w-full object-cover"
              src={imagePreviews[0]}
            />
          ) : (
            <div className="mt-5 grid aspect-video w-full place-items-center bg-white/10 text-white/55">
              <ImagePlus className="h-8 w-8" />
            </div>
          )}

          <div className="mt-5 border-t border-white/10 pt-5">
            <p className="text-xs font-bold uppercase text-[#f1c9a6]">
              {brand || 'Artisane'}
            </p>
            <h3 className="mt-2 text-3xl font-bold">
              {name || 'Handmade Ceramic Bowl'}
            </h3>
            <p className="mt-2 text-sm font-semibold text-white/65">
              {slug || 'handmade-ceramic-bowl'}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 border-y border-white/10 text-sm">
            <div className="border-r border-white/10 py-4 pr-4">
              <p className="text-xs font-bold uppercase text-[#f1c9a6]">
                Price
              </p>
              <p className="mt-1 text-xl font-bold">${price || '45'}</p>
            </div>
            <div className="py-4 pl-4">
              <p className="text-xs font-bold uppercase text-[#f1c9a6]">
                Stock
              </p>
              <p className="mt-1 text-xl font-bold">{stock || '12'}</p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-white/75">
            {description || 'A handmade ceramic bowl.'}
          </p>

          <p className="mt-5 text-xs font-bold uppercase text-[#f1c9a6]">
            {imageFiles.length || 0} photo{imageFiles.length === 1 ? '' : 's'}
          </p>
        </aside>
      </div>

      {showCreateConfirm && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/55 px-4"
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-md border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
            role="dialog"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center bg-[#fff5ef] text-[#8f3f1d]">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-[#8f3f1d]">
                  Confirm product creation
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  Create {name || 'this product'}?
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#6b5f53]">
              This will publish a new product record with the selected
              category, price, stock, and uploaded photos.
            </p>

            <div className="mt-5 border-y border-black/10 py-4 text-sm">
              <p className="font-bold">{name}</p>
              <p className="mt-1 text-[#6b5f53]">
                {selectedCategory?.name ?? 'No category'} · ${price || '0'} ·{' '}
                {stock || '0'} in stock · {imageFiles.length} photo
                {imageFiles.length === 1 ? '' : 's'}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
                disabled={isCreating}
                onClick={() => setShowCreateConfirm(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex min-h-11 items-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isCreating}
                onClick={createConfirmedProduct}
                type="button"
              >
                {isCreating ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isCreating ? 'Creating...' : 'Confirm create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default CreateProduct
