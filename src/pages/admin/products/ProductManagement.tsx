import { useState, type FormEvent } from 'react'
import { ArrowLeft, LoaderCircle, Save } from 'lucide-react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useGetCategoriesQuery } from '../../../features/categories/categoryApi'
import { useCreateProductMutation } from '../../../features/products/productApi'
import { adminNavItems } from '../../dashboard/adminNavItems'
import ProductTable from './ProductTable'

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

function parseImageUrls(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function ProductManagement() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [brand, setBrand] = useState('Artisane')
  const [imageUrls, setImageUrls] = useState('')
  const [isSlugEdited, setIsSlugEdited] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()
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
  const parsedImages = parseImageUrls(imageUrls)

  function handleNameChange(value: string) {
    setName(value)

    if (!isSlugEdited) {
      setSlug(createSlug(value))
    }
  }

  function handleSlugChange(value: string) {
    setIsSlugEdited(true)
    setSlug(createSlug(value))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('')
    setError('')

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

    if (!parsedImages.length) {
      setError('Add at least one product image URL.')
      return
    }

    try {
      await createProduct({
        brand: brand.trim() || undefined,
        category: categoryId,
        description: description.trim(),
        images: parsedImages,
        name: name.trim(),
        price: numericPrice,
        slug: slug.trim(),
        stock: numericStock,
      }).unwrap()

      setStatus('Product created successfully.')
      setName('')
      setSlug('')
      setDescription('')
      setPrice('')
      setStock('')
      setCategoryId('')
      setBrand('Artisane')
      setImageUrls('')
      setIsSlugEdited(false)
    } catch (caughtError) {
      setError(getErrorMessage(caughtError))
    }
  }

  return (
    <DashboardLayout
      actions={[{ label: 'Back to dashboard', to: '/dashboard' }]}
      eyebrow="Product management"
      helperText="Create products with valid category references before publishing them to the marketplace."
      searchPlaceholder="Search products, categories, orders"
      sidebarItems={adminNavItems}
      subtitle="Create product records and review all marketplace products from one page."
      title="Product management"
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
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Slug
              <input
                className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                onChange={(event) => handleSlugChange(event.target.value)}
                placeholder="handmade-ceramic-bowl"
                required
                type="text"
                value={slug}
              />
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
            Image URLs
            <textarea
              className="min-h-24 resize-y border border-black/10 px-3 py-3 text-sm font-medium leading-6 outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
              onChange={(event) => setImageUrls(event.target.value)}
              placeholder="https://example.com/product.jpg"
              required
              value={imageUrls}
            />
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
          <h2 className="text-2xl font-bold">Product payload</h2>
          <p className="mt-2 text-sm leading-6 text-white/65">
            The selected category sends its MongoDB _id as product.category.
          </p>
          <dl className="mt-5 space-y-4 text-sm">
            {[
              ['name', name || 'Handmade Ceramic Bowl'],
              ['slug', slug || 'handmade-ceramic-bowl'],
              ['category', selectedCategory?._id || 'CATEGORY_MONGODB_ID'],
              ['category name', selectedCategory?.name || 'Select category'],
              ['price', price || '45'],
              ['stock', stock || '12'],
              ['brand', brand || 'Artisane'],
              ['images', parsedImages.length ? parsedImages.join(', ') : '[]'],
            ].map(([key, value]) => (
              <div className="border-t border-white/10 pt-3" key={key}>
                <dt className="font-bold text-[#f1c9a6]">{key}</dt>
                <dd className="mt-1 break-words text-white/75">{value}</dd>
              </div>
            ))}
          </dl>

          {parsedImages[0] && (
            <img
              alt=""
              className="mt-5 aspect-video w-full object-cover"
              src={parsedImages[0]}
            />
          )}
        </aside>
      </div>

      <ProductTable />
    </DashboardLayout>
  )
}

export default ProductManagement
