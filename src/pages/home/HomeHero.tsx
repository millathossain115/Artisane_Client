import { ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import type {
  HomeHeroContent,
  HomeHeroSlide,
} from '../../features/homeContent/homeContentApi'
import { getAssetUrl } from '../../utils/productDisplay'

type HomeHeroProps = {
  fallbackImage: string
  heroContent?: HomeHeroContent | null
  isLoading?: boolean
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    function handleChange(event: MediaQueryListEvent) {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

function getFallbackSlide(fallbackImage: string): HomeHeroSlide {
  return {
    eyebrow: 'New in the atelier',
    title: 'Artisane',
    description:
      'Shop stocked kits, tools, and craft materials from the latest marketplace edit.',
    image: fallbackImage,
    imageAlt: 'Living room with abstract wall painting',
    primaryButtonText: 'Shop products',
    primaryButtonLink: '/products',
    secondaryButtonText: 'Browse categories',
    secondaryButtonLink: '/categories',
    isActive: true,
    sortOrder: 0,
  }
}

function HomeHero({ fallbackImage, heroContent, isLoading }: HomeHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const isWaitingForHeroContent = isLoading && !heroContent
  const slides = useMemo(() => {
    if (isWaitingForHeroContent) {
      return []
    }

    const cmsSlides =
      heroContent?.isActive && heroContent.slides.length
        ? heroContent.slides
            .filter((slide) => slide.isActive)
            .sort((firstSlide, secondSlide) => {
              return firstSlide.sortOrder - secondSlide.sortOrder
            })
        : []

    return cmsSlides.length ? cmsSlides : [getFallbackSlide(fallbackImage)]
  }, [fallbackImage, heroContent, isWaitingForHeroContent])
  const autoplayMs =
    Math.min(10, Math.max(1, heroContent?.autoplaySeconds ?? 5)) * 1000
  const fadeMs = Math.min(1500, Math.max(300, heroContent?.fadeMs ?? 800))
  const currentActiveIndex =
    slides.length > 0 ? Math.min(activeIndex, slides.length - 1) : 0

  useEffect(() => {
    if (slides.length <= 1 || isPaused || prefersReducedMotion) {
      return
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length)
    }, autoplayMs)

    return () => window.clearInterval(intervalId)
  }, [autoplayMs, isPaused, prefersReducedMotion, slides.length])

  return (
    <section
      className="hero-enter relative isolate overflow-hidden bg-[#181512]"
      onBlur={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
    >
      {isWaitingForHeroContent ? (
        <div className="absolute inset-0 bg-[#181512]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,21,18,0.96),rgba(24,21,18,0.82),rgba(24,21,18,0.64))]" />
        </div>
      ) : null}

      {slides.map((slide, index) => (
        <div
          className={`absolute inset-0 transition-opacity ${
            index === currentActiveIndex ? 'opacity-100' : 'opacity-0'
          }`}
          key={`${slide.title}-${index}`}
          style={{ transitionDuration: `${fadeMs}ms` }}
        >
          <img
            alt={slide.imageAlt}
            className="h-full w-full object-cover opacity-72"
            src={getAssetUrl(slide.image) || fallbackImage}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,21,18,0.94),rgba(24,21,18,0.64),rgba(24,21,18,0.18))]" />
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,#f6f0e5,rgba(246,240,229,0))]" />

      <div className="relative mx-auto min-h-[calc(100svh-132px)] max-w-7xl lg:min-h-[620px]">
        {isWaitingForHeroContent ? (
          <div className="absolute inset-0 flex items-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl animate-pulse">
              <div className="mb-5 flex items-center gap-2">
                <div className="h-4 w-4 bg-[#f1c9a6]/70" />
                <div className="h-3 w-44 bg-[#f1c9a6]/55" />
              </div>
              <div className="h-14 w-72 bg-white/75 sm:h-16 sm:w-[30rem] lg:h-20" />
              <div className="mt-4 h-14 w-56 bg-white/60 sm:h-16 sm:w-[24rem] lg:h-20" />
              <div className="mt-7 max-w-xl space-y-3">
                <div className="h-4 w-full bg-white/35" />
                <div className="h-4 w-5/6 bg-white/30" />
              </div>
              <div className="mt-8 flex gap-3">
                <div className="h-12 w-36 bg-white/70" />
                <div className="h-12 w-40 border border-white/30 bg-white/10" />
              </div>
            </div>
          </div>
        ) : null}

        {slides.map((slide, index) => (
          <div
            className={`absolute inset-0 flex items-center px-4 py-16 transition-opacity sm:px-6 lg:px-8 ${
              index === currentActiveIndex
                ? 'pointer-events-auto opacity-100'
                : 'pointer-events-none opacity-0'
            }`}
            key={`${slide.title}-content-${index}`}
            style={{ transitionDuration: `${fadeMs}ms` }}
          >
            <div className="max-w-2xl text-white">
              <p className="mb-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#f1c9a6]">
                <Sparkles className="h-4 w-4" />
                {slide.eyebrow}
              </p>
              <h1 className="text-5xl font-bold leading-none sm:text-6xl lg:text-7xl">
                {slide.title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/84">
                {slide.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-bold text-[#181512] transition hover:bg-[#f1dfc8]"
                  to={slide.primaryButtonLink}
                >
                  {slide.primaryButtonText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  className="inline-flex items-center border border-white/35 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  to={slide.secondaryButtonLink}
                >
                  {slide.secondaryButtonText}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {slides.length > 1 ? (
          <div
            aria-label="Hero slides"
            className="absolute bottom-12 left-4 z-10 flex gap-2 sm:left-6 lg:left-8"
          >
            {slides.map((slide, index) => (
              <button
                aria-label={`Show hero slide ${index + 1}: ${slide.title}`}
                aria-current={index === currentActiveIndex}
                className={`h-2.5 transition-all ${
                  index === currentActiveIndex
                    ? 'w-8 bg-white'
                    : 'w-2.5 bg-white/45 hover:bg-white/75'
                }`}
                key={`${slide.title}-dot-${index}`}
                onClick={() => setActiveIndex(index)}
                type="button"
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default HomeHero
