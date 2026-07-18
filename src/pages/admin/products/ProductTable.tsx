import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  LoaderCircle,
  Package,
  Pencil,
  Save,
  Search,
  Trash2,
  Upload,
} from 'lucide-react'

import { API_BASE_URL } from '../../../config/api'
import { useGetCategoriesQuery } from '../../../features/categories/categoryApi'
import {
  type Product,
  useGetProductsQuery,
  useUpdateProductMutation,
} from '../../../features/products/productApi'

type ProductEditForm = {
  brand: string
  categoryId: string
  description: string
  name: string
  price: string
  slug: string
  stock: string
}

type SortFilter = 'newest' | 'oldest' | 'name-asc' | 'name-desc'

const PAGE_SIZE_OPTIONS = [5, 10, 20]
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 2,
    style: 'currency',
  }).format(value)
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.ceil(size / 1024)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function getProductImageUrl(imageUrl?: string) {
  if (!imageUrl) {
    return ''
  }

  if (imageUrl.startsWith('http')) {
    return imageUrl
  }

  return `${API_BASE_URL.replace('/api/v1', '')}${imageUrl}`
}

function getCategoryName(category: Product['category']) {
  if (typeof category === 'string') {
    return category
  }

  return category.name
}

function getCategoryId(category: Product['category']) {
  if (typeof category === 'string') {
    return category
  }

  return category._id
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

function getSortParams(sortFilter: SortFilter) {
  if (sortFilter === 'oldest') {
    return { sortBy: 'createdAt' as const, sortOrder: 'asc' as const }
  }

  if (sortFilter === 'name-asc') {
    return { sortBy: 'name' as const, sortOrder: 'asc' as const }
  }

  if (sortFilter === 'name-desc') {
    return { sortBy: 'name' as const, sortOrder: 'desc' as const }
  }

  return { sortBy: 'createdAt' as const, sortOrder: 'desc' as const }
}

function ProductTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortFilter, setSortFilter] = useState<SortFilter>('newest')
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [currentPage, setCurrentPage] = useState(1)
  const sortParams = getSortParams(sortFilter)
  const {
    data: productList,
    isError: hasProductsError,
    isLoading: isProductsLoading,
  } = useGetProductsQuery({
    limit: pageSize,
    page: currentPage,
    searchTerm: searchTerm.trim() || undefined,
    ...sortParams,
  })
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
  const [updateProduct, { isLoading: isUpdating }] =
    useUpdateProductMutation()
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [editForm, setEditForm] = useState<ProductEditForm>({
    brand: '',
    categoryId: '',
    description: '',
    name: '',
    price: '',
    slug: '',
    stock: '',
  })
  const [editImageFiles, setEditImageFiles] = useState<File[]>([])
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([])
  const [editImageInputKey, setEditImageInputKey] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const editImagePreviewRef = useRef<string[]>([])
  const products = productList?.data ?? []
  const categories = categoryList?.data ?? []
  const productMeta = productList?.meta
  const totalProducts = productMeta?.total ?? products.length
  const totalPages = Math.max(1, productMeta?.totalPage ?? 1)
  const safeCurrentPage = Math.min(productMeta?.page ?? currentPage, totalPages)
  const resultStart = totalProducts
    ? (safeCurrentPage - 1) * (productMeta?.limit ?? pageSize) + 1
    : 0
  const resultEnd = Math.min(
    resultStart + (productMeta?.limit ?? pageSize) - 1,
    totalProducts,
  )

  useEffect(() => {
    return () => {
      editImagePreviewRef.current.forEach((previewUrl) =>
        URL.revokeObjectURL(previewUrl),
      )
    }
  }, [])

  function clearEditImagePreviews() {
    editImagePreviewRef.current.forEach((previewUrl) =>
      URL.revokeObjectURL(previewUrl),
    )
    editImagePreviewRef.current = []
    setEditImagePreviews([])
  }

  function handleEditImageChange(files: FileList | null) {
    setStatus('')
    setError('')

    if (!files?.length) {
      setEditImageFiles([])
      clearEditImagePreviews()
      return
    }

    const nextFiles = Array.from(files)

    if (nextFiles.length > MAX_PRODUCT_IMAGES) {
      setError(`Upload up to ${MAX_PRODUCT_IMAGES} product images.`)
      setEditImageFiles([])
      clearEditImagePreviews()
      setEditImageInputKey((currentKey) => currentKey + 1)
      return
    }

    if (nextFiles.some((file) => !file.type.startsWith('image/'))) {
      setError('Only image files are allowed.')
      setEditImageFiles([])
      clearEditImagePreviews()
      setEditImageInputKey((currentKey) => currentKey + 1)
      return
    }

    if (nextFiles.some((file) => file.size > MAX_IMAGE_SIZE)) {
      setError('Each image must be 5MB or less.')
      setEditImageFiles([])
      clearEditImagePreviews()
      setEditImageInputKey((currentKey) => currentKey + 1)
      return
    }

    clearEditImagePreviews()

    const nextPreviews = nextFiles.map((file) => URL.createObjectURL(file))
    editImagePreviewRef.current = nextPreviews
    setEditImageFiles(nextFiles)
    setEditImagePreviews(nextPreviews)
    setEditImageInputKey((currentKey) => currentKey + 1)
  }

  function removeEditImage(indexToRemove: number) {
    const previewToRemove = editImagePreviews[indexToRemove]

    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove)
    }

    editImagePreviewRef.current = editImagePreviewRef.current.filter(
      (_previewUrl, index) => index !== indexToRemove,
    )
    setEditImageFiles((currentFiles) =>
      currentFiles.filter((_file, index) => index !== indexToRemove),
    )
    setEditImagePreviews((currentPreviews) =>
      currentPreviews.filter((_previewUrl, index) => index !== indexToRemove),
    )
  }

  function openEditModal(product: Product) {
    setStatus('')
    setError('')
    setProductToEdit(product)
    setEditForm({
      brand: product.brand ?? '',
      categoryId: getCategoryId(product.category),
      description: product.description ?? '',
      name: product.name,
      price: String(product.price),
      slug: product.slug || createSlug(product.name),
      stock: String(product.stock),
    })
    setEditImageFiles([])
    clearEditImagePreviews()
    setEditImageInputKey((currentKey) => currentKey + 1)
  }

  function closeEditModal() {
    setProductToEdit(null)
    setEditImageFiles([])
    clearEditImagePreviews()
  }

  function updateEditField(field: keyof ProductEditForm, value: string) {
    setStatus('')
    setError('')
    setEditForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'name' ? { slug: createSlug(value) } : {}),
    }))
  }

  async function handleUpdateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!productToEdit) {
      return
    }

    setStatus('')
    setError('')

    const numericPrice = Number(editForm.price)
    const numericStock = Number(editForm.stock)

    if (!editForm.categoryId) {
      setError('Select a category before updating product.')
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

    try {
      await updateProduct({
        brand: editForm.brand.trim(),
        category: editForm.categoryId,
        description: editForm.description.trim(),
        id: productToEdit._id,
        images: editImageFiles.length ? editImageFiles : undefined,
        name: editForm.name.trim(),
        price: numericPrice,
        slug: editForm.slug.trim(),
        stock: numericStock,
      }).unwrap()

      setStatus('Product updated successfully.')
      closeEditModal()
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, 'Failed to update product.'))
    }
  }

  return (
    <section className="mt-6 border border-black/10 bg-white" id="products">
      <div className="flex items-center gap-3 border-b border-black/10 p-5">
        <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
          <Package className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold">Current products</h2>
          <p className="mt-1 text-sm text-[#6b5f53]">
            Products currently stored in the marketplace database.
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

      {(isProductsLoading || hasProductsError) && (
        <div
          className={`border-b border-black/10 px-5 py-3 text-sm font-semibold ${
            hasProductsError
              ? 'bg-[#fff5ef] text-[#8f3f1d]'
              : 'bg-[#f8f3ea] text-[#6b5f53]'
          }`}
        >
          {hasProductsError ? 'Failed to load products.' : 'Loading products...'}
        </div>
      )}

      <div className="grid gap-3 border-b border-black/10 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <label className="grid gap-2 text-sm font-bold">
          Search products
          <span className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b5f53]" />
            <input
              className="min-h-12 w-full border border-black/10 pl-10 pr-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
              onChange={(event) => {
                setSearchTerm(event.target.value)
                setCurrentPage(1)
              }}
              placeholder="Name, slug, brand, or description"
              type="search"
              value={searchTerm}
            />
          </span>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
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
        <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
          <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Brand</th>
              <th className="px-5 py-3">Created</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length ? (
              products.map((product) => {
                const imageUrl = getProductImageUrl(product.images?.[0])

                return (
                  <tr
                    className="border-t border-black/10 transition hover:bg-[#f8f3ea]"
                    key={product._id}
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
                            {product.name}
                          </span>
                          <span className="mt-1 block text-xs font-semibold text-[#6b5f53]">
                            {product.slug}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#7a3f1d]">
                      {getCategoryName(product.category)}
                    </td>
                    <td className="px-5 py-4 font-bold">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-5 py-4 text-[#6b5f53]">
                      {product.stock}
                    </td>
                    <td className="px-5 py-4 text-[#6b5f53]">
                      {product.brand || 'No brand'}
                    </td>
                    <td className="px-5 py-4 text-[#6b5f53]">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        aria-label={`Update ${product.name}`}
                        className="inline-flex h-9 w-9 items-center justify-center border border-black/10 text-[#181512] transition hover:border-[#181512] hover:bg-white"
                        onClick={() => openEditModal(product)}
                        type="button"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr className="border-t border-black/10">
                <td
                  className="px-5 py-6 text-center font-semibold text-[#6b5f53]"
                  colSpan={7}
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-black/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-semibold text-[#6b5f53]">
          Showing {resultStart}-{resultEnd} of {totalProducts} products.
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

      {productToEdit && (
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
            <h2 className="mt-2 text-2xl font-bold">{productToEdit.name}</h2>

            <form className="mt-5" onSubmit={handleUpdateSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold">
                  Product name
                  <input
                    className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                    onChange={(event) =>
                      updateEditField('name', event.target.value)
                    }
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
                      updateEditField('categoryId', event.target.value)
                    }
                    required
                    value={editForm.categoryId}
                  >
                    <option value="">
                      {isCategoriesLoading
                        ? 'Loading categories...'
                        : 'Select category'}
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
                    onChange={(event) =>
                      updateEditField('brand', event.target.value)
                    }
                    type="text"
                    value={editForm.brand}
                  />
                </label>

                <label className="grid gap-2 text-sm font-bold">
                  Price
                  <input
                    className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                    min="0"
                    onChange={(event) =>
                      updateEditField('price', event.target.value)
                    }
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
                    onChange={(event) =>
                      updateEditField('stock', event.target.value)
                    }
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
                    updateEditField('description', event.target.value)
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
                        getProductImageUrl(productToEdit.images?.[0]) ? (
                          <img
                            alt=""
                            className="h-full w-full object-cover"
                            src={
                              editImagePreviews[0] ||
                              getProductImageUrl(productToEdit.images?.[0])
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
                        onChange={(event) =>
                          handleEditImageChange(event.target.files)
                        }
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
                            onClick={() => removeEditImage(index)}
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
                  onClick={closeEditModal}
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
      )}
    </section>
  )
}

export default ProductTable
