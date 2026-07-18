import { useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  Globe2,
  ImagePlus,
  LoaderCircle,
  Save,
  Upload,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useCreateCategoryMutation } from '../../../features/categories/categoryApi'
import { adminNavItems } from '../../dashboard/adminNavItems'
import CategoryTable from './CategoryTable'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

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
    return 'Failed to create category'
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

  return 'Failed to create category'
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.ceil(size / 1024)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function CreateCategory() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageInputKey, setImageInputKey] = useState(0)
  const [isSlugEdited, setIsSlugEdited] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [createCategory, { isLoading }] = useCreateCategoryMutation()

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

  function handleImageChange(file: File | undefined) {
    setStatus('')
    setError('')

    if (!file) {
      setImageFile(null)
      return
    }

    if (!file.type.startsWith('image/')) {
      setImageFile(null)
      setImageInputKey((currentKey) => currentKey + 1)
      setError('Only image files are allowed.')
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageFile(null)
      setImageInputKey((currentKey) => currentKey + 1)
      setError('Image size must be 5MB or less.')
      return
    }

    setImageFile(file)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('')
    setError('')
    setIsConfirmOpen(true)
  }

  async function handleConfirmCreate() {
    setStatus('')
    setError('')

    if (!name.trim() || !slug.trim()) {
      setError('Category name and slug are required.')
      setIsConfirmOpen(false)
      return
    }

    try {
      await createCategory({
        description: description.trim() || undefined,
        image: imageFile ?? undefined,
        name: name.trim(),
        slug: slug.trim(),
      }).unwrap()

      setStatus('Category created successfully.')
      setIsConfirmOpen(false)
      setName('')
      setSlug('')
      setDescription('')
      setImageFile(null)
      setImageInputKey((currentKey) => currentKey + 1)
      setIsSlugEdited(false)
    } catch (caughtError) {
      setError(getErrorMessage(caughtError))
    }
  }

  return (
    <DashboardLayout
      actions={[{ label: 'Back to dashboard', to: '/dashboard' }]}
      eyebrow="Category management"
      helperText="Create clean category records before assigning products to marketplace sections."
      searchPlaceholder="Search categories, products, orders"
      sidebarItems={adminNavItems}
      subtitle="Create category records and review all live marketplace categories from one page."
      title="Category management"
      workspaceLabel="Marketplace studio"
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_0.42fr]">
        <form
          className="border border-black/10 bg-white p-5"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              Category name
              <input
                className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                onChange={(event) => handleNameChange(event.target.value)}
                placeholder="Jewelry"
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
                placeholder="jewelry"
                required
                type="text"
                value={slug}
              />
            </label>
          </div>

          <label className="mt-5 grid gap-2 text-sm font-bold">
            Category image
            <div className="border border-dashed border-black/20 bg-[#f8f3ea] p-4 transition focus-within:border-[#181512]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center bg-white text-[#7a3f1d]">
                    {imageFile ? (
                      <ImagePlus className="h-5 w-5" />
                    ) : (
                      <Globe2 className="h-5 w-5" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold">
                      {imageFile?.name ?? 'Upload category image'}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-[#6b5f53]">
                      {imageFile
                        ? `${imageFile.type} - ${formatFileSize(imageFile.size)}`
                        : 'Optional. Default global icon will be used.'}
                    </span>
                  </span>
                </div>

                <span className="relative inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d]">
                  <Upload className="h-4 w-4" />
                  Choose file
                  <input
                    accept="image/*"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    key={imageInputKey}
                    onChange={(event) =>
                      handleImageChange(event.target.files?.[0])
                    }
                    type="file"
                  />
                </span>
              </div>
            </div>
          </label>

          <label className="mt-5 grid gap-2 text-sm font-bold">
            Description
            <textarea
              className="min-h-36 resize-y border border-black/10 px-3 py-3 text-sm font-medium leading-6 outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Handmade jewelry items"
              value={description}
            />
          </label>

          {(status || error) && (
            <p
              className={`mt-5 border px-4 py-3 text-sm font-semibold ${
                error
                  ? 'border-[#c85f2f]/30 bg-[#fff5ef] text-[#8f3f1d]'
                  : 'border-[#1f7a4d]/20 bg-[#effaf3] text-[#1f6b43]'
              }`}
            >
              {error || status}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              className="inline-flex min-h-11 items-center gap-2 bg-[#181512] px-5 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isLoading ? 'Creating...' : 'Create category'}
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
          <h2 className="text-2xl font-bold">Category payload</h2>
          <p className="mt-2 text-sm leading-6 text-white/65">
            The submitted request matches the backend category create body.
          </p>
          <dl className="mt-5 space-y-4 text-sm">
            {[
              ['name', name || 'Jewelry'],
              ['slug', slug || 'jewelry'],
              ['description', description || 'Handmade jewelry items'],
              [
                'image',
                imageFile
                  ? `${imageFile.name} (${formatFileSize(imageFile.size)})`
                  : 'Default global icon',
              ],
            ].map(([key, value]) => (
              <div className="border-t border-white/10 pt-3" key={key}>
                <dt className="font-bold text-[#f1c9a6]">{key}</dt>
                <dd className="mt-1 break-words text-white/75">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      {isConfirmOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/55 px-4"
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-md border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
            role="dialog"
          >
            <p className="text-sm font-bold text-[#7a3f1d]">Confirm category</p>
            <h2 className="mt-2 text-2xl font-bold">Create this category?</h2>
            <p className="mt-3 text-sm leading-6 text-[#6b5f53]">
              This will add a new category to the marketplace database.
              {!imageFile
                ? ' No image is attached, so the default global icon will be shown.'
                : ''}
            </p>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
                disabled={isLoading}
                onClick={() => setIsConfirmOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex min-h-11 items-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isLoading}
                onClick={handleConfirmCreate}
                type="button"
              >
                {isLoading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isLoading ? 'Creating...' : 'Confirm create'}
              </button>
            </div>
          </div>
        </div>
      )}

      <CategoryTable />
    </DashboardLayout>
  )
}

export default CreateCategory
