import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ImagePlus,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
  type HomeHeroSlide,
  useGetHomeHeroQuery,
  useUpdateHomeHeroMutation,
} from '../../../features/homeContent/homeContentApi'
import { getAssetUrl } from '../../../utils/productDisplay'
import { adminNavItems } from '../adminNavItems'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_SLIDES = 5
const FIXED_HERO_BUTTONS = {
  primaryButtonText: 'Shop products',
  primaryButtonLink: '/products',
  secondaryButtonText: 'Browse categories',
  secondaryButtonLink: '/categories',
} as const

type EditableHeroSlide = HomeHeroSlide & {
  uid: string
  imageFile?: File
  previewUrl?: string
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.ceil(size / 1024)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function createDefaultSlide(index: number): EditableHeroSlide {
  return {
    uid: `slide-${Date.now()}-${index}`,
    eyebrow: 'New in the atelier',
    title: 'Artisane',
    description:
      'Shop stocked kits, tools, and craft materials from the latest marketplace edit.',
    image: '',
    imageAlt: 'Living room with abstract wall painting',
    ...FIXED_HERO_BUTTONS,
    isActive: true,
    sortOrder: index,
  }
}

function createEditableSlide(
  slide: HomeHeroSlide,
  index: number,
): EditableHeroSlide {
  return {
    ...slide,
    ...FIXED_HERO_BUTTONS,
    uid: slide._id ?? `slide-${Date.now()}-${index}`,
    sortOrder: index,
  }
}

function getErrorMessage(error: unknown) {
  if (!error || typeof error !== 'object') {
    return 'Failed to save home hero'
  }

  const data = (error as { data?: { message?: string } }).data
  return data?.message ?? 'Failed to save home hero'
}

function clampAutoplaySeconds(value: number) {
  return Math.min(10, Math.max(1, value))
}

function ManageHomeHero() {
  const { data: heroContent, isLoading, refetch } = useGetHomeHeroQuery()
  const [updateHomeHero, { isLoading: isSaving }] = useUpdateHomeHeroMutation()
  const [isActive, setIsActive] = useState(true)
  const [autoplaySeconds, setAutoplaySeconds] = useState(5)
  const [fadeMs, setFadeMs] = useState(800)
  const [slides, setSlides] = useState<EditableHeroSlide[]>([
    createDefaultSlide(0),
  ])
  const [loadedHeroId, setLoadedHeroId] = useState<string | null>(null)
  const [message, setMessage] = useState<{
    text: string
    type: 'error' | 'success'
  } | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const previewUrlsRef = useRef<string[]>([])

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((previewUrl) =>
        URL.revokeObjectURL(previewUrl),
      )
    }
  }, [])

  useEffect(() => {
    if (!heroContent || heroContent._id === loadedHeroId) {
      return
    }

    clearPreviewUrls()
    setLoadedHeroId(heroContent._id ?? null)
    setIsActive(heroContent.isActive ?? true)
    setAutoplaySeconds(clampAutoplaySeconds(heroContent.autoplaySeconds ?? 5))
    setFadeMs(heroContent.fadeMs ?? 800)
    setSlides(
      heroContent.slides.length
        ? heroContent.slides.map(createEditableSlide)
        : [createDefaultSlide(0)],
    )
  }, [heroContent, loadedHeroId])

  function clearPreviewUrls() {
    previewUrlsRef.current.forEach((previewUrl) =>
      URL.revokeObjectURL(previewUrl),
    )
    previewUrlsRef.current = []
  }

  function updateSlide(index: number, updates: Partial<EditableHeroSlide>) {
    setSlides((currentSlides) =>
      currentSlides.map((slide, slideIndex) =>
        slideIndex === index ? { ...slide, ...updates } : slide,
      ),
    )
  }

  function addSlide() {
    if (slides.length >= MAX_SLIDES) {
      return
    }

    setSlides((currentSlides) => [
      ...currentSlides,
      createDefaultSlide(currentSlides.length),
    ])
  }

  function removeSlide(index: number) {
    const slide = slides[index]

    if (slide?.previewUrl) {
      URL.revokeObjectURL(slide.previewUrl)
    }

    setSlides((currentSlides) =>
      currentSlides.filter((_slide, slideIndex) => slideIndex !== index),
    )
  }

  function moveSlide(index: number, direction: 'down' | 'up') {
    const nextIndex = direction === 'up' ? index - 1 : index + 1

    if (nextIndex < 0 || nextIndex >= slides.length) {
      return
    }

    setSlides((currentSlides) => {
      const nextSlides = [...currentSlides]
      const currentSlide = nextSlides[index]
      const targetSlide = nextSlides[nextIndex]

      if (!currentSlide || !targetSlide) {
        return currentSlides
      }

      nextSlides[index] = targetSlide
      nextSlides[nextIndex] = currentSlide
      return nextSlides
    })
  }

  function handleImageChange(index: number, file?: File) {
    setMessage(null)

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setMessage({ text: 'Only image files are allowed.', type: 'error' })
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setMessage({
        text: `Image must be ${formatFileSize(MAX_IMAGE_SIZE)} or smaller.`,
        type: 'error',
      })
      return
    }

    const currentPreviewUrl = slides[index]?.previewUrl

    if (currentPreviewUrl) {
      URL.revokeObjectURL(currentPreviewUrl)
    }

    const previewUrl = URL.createObjectURL(file)
    previewUrlsRef.current.push(previewUrl)
    updateSlide(index, { imageFile: file, previewUrl })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)

    if (!slides.length) {
      setMessage({ text: 'Add at least one hero slide.', type: 'error' })
      return
    }

    setIsConfirmOpen(true)
  }

  async function handleConfirmSave() {
    setIsConfirmOpen(false)
    setMessage(null)

    const imageFiles: Record<number, File | undefined> = {}

    slides.forEach((slide, index) => {
      imageFiles[index] = slide.imageFile
    })

    try {
      const savedHero = await updateHomeHero({
        isActive,
        autoplaySeconds,
        fadeMs,
        imageFiles,
        slides: slides.map((slide, index) => ({
          _id: slide._id,
          eyebrow: slide.eyebrow,
          title: slide.title,
          description: slide.description,
          image: slide.image,
          imageAlt: slide.imageAlt,
          ...FIXED_HERO_BUTTONS,
          isActive: slide.isActive,
          sortOrder: index,
        })),
      }).unwrap()

      clearPreviewUrls()
      setLoadedHeroId(savedHero._id ?? null)
      setIsActive(savedHero.isActive)
      setAutoplaySeconds(savedHero.autoplaySeconds)
      setFadeMs(savedHero.fadeMs)
      setSlides(
        savedHero.slides.length
          ? savedHero.slides.map(createEditableSlide)
          : [createDefaultSlide(0)],
      )
      setMessage({ text: 'Home hero updated successfully.', type: 'success' })
      refetch()
    } catch (error) {
      setMessage({ text: getErrorMessage(error), type: 'error' })
    }
  }

  return (
    <DashboardLayout
      eyebrow="Homepage content"
      helperText="Manage homepage hero slides without touching product shelves or promo banners."
      sidebarItems={adminNavItems}
      subtitle="Create up to five homepage hero slides with text, buttons, images, and fade timing."
      title="Home hero"
      workspaceLabel="Marketplace studio"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <section className="border border-black/10 bg-white p-3 sm:p-4">
          <div className="grid gap-2 md:grid-cols-3">
            <label className="flex items-center justify-between gap-3 border border-black/10 bg-[#f8f3ea] px-3 py-2 text-xs font-bold">
              <span>
                <span className="block">Hero status</span>
                <span className="mt-0.5 block text-[11px] font-semibold text-[#6b5f53]">
                  {isActive ? 'Visible on homepage' : 'Fallback hero shown'}
                </span>
              </span>
              <input
                checked={isActive}
                className="h-4 w-4 accent-[#181512]"
                onChange={(event) => setIsActive(event.target.checked)}
                type="checkbox"
              />
            </label>

            <label className="grid gap-1.5 text-xs font-bold">
              Autoplay seconds
              <input
                className="min-h-9 border border-black/10 px-2 text-xs font-semibold outline-none transition focus:border-[#181512]"
                max="10"
                min="1"
                onChange={(event) =>
                  setAutoplaySeconds(
                    clampAutoplaySeconds(Number(event.target.value)),
                  )
                }
                type="number"
                value={autoplaySeconds}
              />
            </label>

            <label className="grid gap-1.5 text-xs font-bold">
              Fade milliseconds
              <input
                className="min-h-9 border border-black/10 px-2 text-xs font-semibold outline-none transition focus:border-[#181512]"
                max="1500"
                min="300"
                onChange={(event) => setFadeMs(Number(event.target.value))}
                type="number"
                value={fadeMs}
              />
            </label>
          </div>

          {message ? (
            <div
              className={`mt-3 flex items-center justify-between gap-3 border px-3 py-2 text-xs font-semibold ${
                message.type === 'success'
                  ? 'border-[#1f7a4d]/20 bg-[#effaf3] text-[#1f6b43]'
                  : 'border-[#c85f2f]/30 bg-[#fff5ef] text-[#8f3f1d]'
              }`}
            >
              <span>{message.text}</span>
              <button
                aria-label="Close message"
                className="grid h-7 w-7 place-items-center border border-current/20"
                onClick={() => setMessage(null)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </section>

        <div className="space-y-4">
          {isLoading ? (
            <div className="border border-black/10 bg-white p-5 text-center text-sm font-bold text-[#6b5f53]">
              Loading hero content...
            </div>
          ) : (
            slides.map((slide, index) => {
              const previewImage = slide.previewUrl || getAssetUrl(slide.image)

              return (
                <section
                  className="grid gap-4 border border-black/10 bg-white p-3 sm:p-4 xl:grid-cols-[minmax(0,1fr)_320px]"
                  key={slide.uid}
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-3">
                      <div>
                        <p className="text-xs font-bold text-[#7a3f1d]">
                          Slide {index + 1}
                        </p>
                        <p className="mt-0.5 text-[11px] font-semibold text-[#6b5f53]">
                          {slide.isActive ? 'Active' : 'Hidden'} on storefront
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          className="grid h-8 w-8 place-items-center border border-black/10 transition hover:border-[#181512]"
                          disabled={index === 0}
                          onClick={() => moveSlide(index, 'up')}
                          type="button"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          className="grid h-8 w-8 place-items-center border border-black/10 transition hover:border-[#181512]"
                          disabled={index === slides.length - 1}
                          onClick={() => moveSlide(index, 'down')}
                          type="button"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          className="grid h-8 w-8 place-items-center border border-[#c85f2f]/25 text-[#8f3f1d] transition hover:bg-[#fff5ef]"
                          disabled={slides.length === 1}
                          onClick={() => removeSlide(index)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="grid gap-1.5 text-xs font-bold">
                        Eyebrow
                        <input
                          className="min-h-9 border border-black/10 px-2 text-xs font-semibold outline-none transition focus:border-[#181512]"
                          onChange={(event) =>
                            updateSlide(index, { eyebrow: event.target.value })
                          }
                          required
                          value={slide.eyebrow}
                        />
                      </label>

                      <label className="grid gap-1.5 text-xs font-bold">
                        Title
                        <input
                          className="min-h-9 border border-black/10 px-2 text-xs font-semibold outline-none transition focus:border-[#181512]"
                          onChange={(event) =>
                            updateSlide(index, { title: event.target.value })
                          }
                          required
                          value={slide.title}
                        />
                      </label>
                    </div>

                    <label className="grid gap-1.5 text-xs font-bold">
                      Description
                      <textarea
                        className="min-h-20 resize-y border border-black/10 px-2 py-2 text-xs font-semibold leading-5 outline-none transition focus:border-[#181512]"
                        onChange={(event) =>
                          updateSlide(index, {
                            description: event.target.value,
                          })
                        }
                        required
                        value={slide.description}
                      />
                    </label>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <label className="grid gap-1.5 text-xs font-bold">
                        Primary text
                        <input
                          className="min-h-9 cursor-not-allowed border border-black/10 bg-[#f8f3ea] px-2 text-xs font-semibold text-[#6b5f53] outline-none"
                          disabled
                          value={FIXED_HERO_BUTTONS.primaryButtonText}
                        />
                      </label>

                      <label className="grid gap-1.5 text-xs font-bold">
                        Primary link
                        <input
                          className="min-h-9 cursor-not-allowed border border-black/10 bg-[#f8f3ea] px-2 text-xs font-semibold text-[#6b5f53] outline-none"
                          disabled
                          value={FIXED_HERO_BUTTONS.primaryButtonLink}
                        />
                      </label>

                      <label className="grid gap-1.5 text-xs font-bold">
                        Secondary text
                        <input
                          className="min-h-9 cursor-not-allowed border border-black/10 bg-[#f8f3ea] px-2 text-xs font-semibold text-[#6b5f53] outline-none"
                          disabled
                          value={FIXED_HERO_BUTTONS.secondaryButtonText}
                        />
                      </label>

                      <label className="grid gap-1.5 text-xs font-bold">
                        Secondary link
                        <input
                          className="min-h-9 cursor-not-allowed border border-black/10 bg-[#f8f3ea] px-2 text-xs font-semibold text-[#6b5f53] outline-none"
                          disabled
                          value={FIXED_HERO_BUTTONS.secondaryButtonLink}
                        />
                      </label>
                    </div>

                    <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                      <label className="grid gap-1.5 text-xs font-bold">
                        Image alt text
                        <input
                          className="min-h-9 border border-black/10 px-2 text-xs font-semibold outline-none transition focus:border-[#181512]"
                          onChange={(event) =>
                            updateSlide(index, { imageAlt: event.target.value })
                          }
                          required
                          value={slide.imageAlt}
                        />
                      </label>

                      <label className="inline-flex min-h-9 cursor-pointer items-center justify-center gap-1.5 bg-[#181512] px-3 text-xs font-bold text-white transition hover:bg-[#7a3f1d]">
                        <Upload className="h-4 w-4" />
                        Upload image
                        <input
                          accept="image/*"
                          className="sr-only"
                          onChange={(event) =>
                            handleImageChange(index, event.target.files?.[0])
                          }
                          type="file"
                        />
                      </label>
                    </div>

                    <label className="flex items-center justify-between gap-3 border border-black/10 bg-[#f8f3ea] px-3 py-2 text-xs font-bold">
                      <span>Show this slide</span>
                      <input
                        checked={slide.isActive}
                        className="h-4 w-4 accent-[#181512]"
                        onChange={(event) =>
                          updateSlide(index, {
                            isActive: event.target.checked,
                          })
                        }
                        type="checkbox"
                      />
                    </label>
                  </div>

                  <aside className="bg-[#181512] p-3 text-white xl:sticky xl:top-[132px] xl:max-h-[calc(100dvh-132px)] xl:self-start xl:overflow-y-auto">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f1c9a6]">
                      Live preview
                    </p>
                    <div className="relative mt-3 aspect-[4/3] overflow-hidden bg-white/10">
                      {previewImage ? (
                        <img
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover opacity-70"
                          src={previewImage}
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-white/45">
                          <ImagePlus className="h-8 w-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,21,18,0.08),rgba(24,21,18,0.9))]" />
                      <div className="absolute inset-x-0 bottom-0 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#f1c9a6]">
                          {slide.eyebrow}
                        </p>
                        <h3 className="mt-1.5 text-3xl font-bold">
                          {slide.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/75">
                          {slide.description}
                        </p>
                      </div>
                    </div>
                  </aside>
                </section>
              )
            })
          )}
        </div>

        <div className="flex flex-wrap justify-between gap-2 border border-black/10 bg-white p-3 sm:p-4">
          <button
            className="inline-flex min-h-9 items-center gap-1.5 border border-black/10 bg-white px-3 text-xs font-bold transition hover:border-[#181512]"
            disabled={slides.length >= MAX_SLIDES}
            onClick={addSlide}
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add slide
          </button>

          <button
            className="inline-flex min-h-9 items-center gap-1.5 bg-[#181512] px-3 text-xs font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? 'Saving...' : 'Save hero'}
          </button>
        </div>
      </form>

      {isConfirmOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/55 px-4"
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-sm border border-black/10 bg-white p-4 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
            role="dialog"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center bg-[#fff5ef] text-[#8f3f1d]">
                <AlertTriangle className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-[#8f3f1d]">
                  Confirm hero update
                </p>
                <h2 className="mt-1 text-xl font-bold">
                  Update homepage hero?
                </h2>
              </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-[#6b5f53]">
              Saving will update public homepage hero slides immediately.
            </p>

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button
                className="min-h-9 border border-black/10 bg-white px-3 text-xs font-bold transition hover:border-[#181512]"
                disabled={isSaving}
                onClick={() => setIsConfirmOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex min-h-9 items-center gap-1.5 bg-[#181512] px-3 text-xs font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSaving}
                onClick={handleConfirmSave}
                type="button"
              >
                {isSaving ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? 'Saving...' : 'Confirm save'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  )
}

export default ManageHomeHero
