import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Package } from 'lucide-react'

import { useGetCategoriesQuery } from '../../../features/categories/categoryApi'
import {
  type Product,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from '../../../features/products/productApi'
import ProductDeleteModal from './components/ProductDeleteModal'
import ProductEditModal from './components/ProductEditModal'
import ProductFilters from './components/ProductFilters'
import ProductRowsTable from './components/ProductRowsTable'
import ProductStatusBanner from './components/ProductStatusBanner'
import ProductUpdateConfirmModal from './components/ProductUpdateConfirmModal'
import {
  createSlug,
  getCategoryId,
  getEmptyProductEditForm,
  getErrorMessage,
  getSortParams,
  MAX_IMAGE_SIZE,
  MAX_PRODUCT_IMAGES,
  PAGE_SIZE_OPTIONS,
  type ProductEditForm,
  type SortFilter,
} from './productTableUtils'

function ProductTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortFilter, setSortFilter] = useState<SortFilter>('newest')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [currentPage, setCurrentPage] = useState(1)
  const sortParams = getSortParams(sortFilter)
  const {
    data: productList,
    isError: hasProductsError,
    isLoading: isProductsLoading,
  } = useGetProductsQuery({
    category: categoryFilter || undefined,
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
  const [deleteProduct, { isLoading: isDeleting }] =
    useDeleteProductMutation()
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false)
  const [editForm, setEditForm] = useState<ProductEditForm>(
    getEmptyProductEditForm(),
  )
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

  function clearMessages() {
    setStatus('')
    setError('')
  }

  function clearEditImagePreviews() {
    editImagePreviewRef.current.forEach((previewUrl) =>
      URL.revokeObjectURL(previewUrl),
    )
    editImagePreviewRef.current = []
    setEditImagePreviews([])
  }

  function handleEditImageChange(files: FileList | null) {
    clearMessages()

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
    clearMessages()
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

  function openDeleteModal(product: Product) {
    clearMessages()
    setProductToDelete(product)
  }

  function closeEditModal() {
    setProductToEdit(null)
    setEditImageFiles([])
    clearEditImagePreviews()
  }

  function updateEditField(field: keyof ProductEditForm, value: string) {
    clearMessages()
    setEditForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'name' ? { slug: createSlug(value) } : {}),
    }))
  }

  function validateEditForm() {
    if (!productToEdit) {
      return null
    }

    clearMessages()

    const numericPrice = Number(editForm.price)
    const numericStock = Number(editForm.stock)

    if (!editForm.categoryId) {
      setError('Select a category before updating product.')
      return null
    }

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      setError('Price must be a valid number.')
      return null
    }

    if (!Number.isInteger(numericStock) || numericStock < 0) {
      setError('Stock must be a valid whole number.')
      return null
    }

    return {
      numericPrice,
      numericStock,
    }
  }

  async function updateConfirmedProduct() {
    if (!productToEdit) {
      return
    }

    const validatedValues = validateEditForm()

    if (!validatedValues) {
      setShowUpdateConfirm(false)
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
        price: validatedValues.numericPrice,
        slug: editForm.slug.trim(),
        stock: validatedValues.numericStock,
      }).unwrap()

      setStatus('Product updated successfully.')
      setShowUpdateConfirm(false)
      closeEditModal()
    } catch (caughtError) {
      setShowUpdateConfirm(false)
      setError(getErrorMessage(caughtError, 'Failed to update product.'))
    }
  }

  function handleUpdateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearMessages()

    if (!validateEditForm()) {
      return
    }

    setShowUpdateConfirm(true)
  }

  async function handleConfirmDelete() {
    if (!productToDelete) {
      return
    }

    clearMessages()

    try {
      await deleteProduct(productToDelete._id).unwrap()
      setStatus('Product deleted successfully.')
      setProductToDelete(null)
      setCurrentPage((page) =>
        products.length === 1 ? Math.max(1, page - 1) : page,
      )
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, 'Failed to delete product.'))
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

      <ProductStatusBanner
        error={error}
        onClose={clearMessages}
        status={status}
      />

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

      <ProductFilters
        categories={categories}
        categoryFilter={categoryFilter}
        isCategoriesLoading={isCategoriesLoading}
        pageSize={pageSize}
        searchTerm={searchTerm}
        setCategoryFilter={setCategoryFilter}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        setSearchTerm={setSearchTerm}
        setSortFilter={setSortFilter}
        sortFilter={sortFilter}
      />

      <ProductRowsTable
        onDelete={openDeleteModal}
        onEdit={openEditModal}
        products={products}
        resultEnd={resultEnd}
        resultStart={resultStart}
        safeCurrentPage={safeCurrentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalProducts={totalProducts}
      />

      {productToEdit ? (
        <ProductEditModal
          categories={categories}
          editForm={editForm}
          editImageFiles={editImageFiles}
          editImageInputKey={editImageInputKey}
          editImagePreviews={editImagePreviews}
          hasCategoriesError={hasCategoriesError}
          isCategoriesLoading={isCategoriesLoading}
          isUpdating={isUpdating}
          onClose={() => {
            setShowUpdateConfirm(false)
            closeEditModal()
          }}
          onImageChange={handleEditImageChange}
          onRemoveImage={removeEditImage}
          onSubmit={handleUpdateSubmit}
          onUpdateField={updateEditField}
          product={productToEdit}
        />
      ) : null}

      {showUpdateConfirm && productToEdit ? (
        <ProductUpdateConfirmModal
          isUpdating={isUpdating}
          onClose={() => setShowUpdateConfirm(false)}
          onConfirm={updateConfirmedProduct}
          product={productToEdit}
        />
      ) : null}

      {productToDelete ? (
        <ProductDeleteModal
          isDeleting={isDeleting}
          onClose={() => setProductToDelete(null)}
          onConfirm={handleConfirmDelete}
          product={productToDelete}
        />
      ) : null}
    </section>
  )
}

export default ProductTable
