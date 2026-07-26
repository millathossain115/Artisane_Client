import { ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import type {
  HomeHeroContent,
  HomeHeroSlide,
} from '../../features/homeContent/homeContentApi'

type HomeHeroProps = {
  fallbackImage: string
  heroContent?: HomeHeroContent | null
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    setPrefersReducedMotion(mediaQuery.matches)

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

function HomeHero({ fallbackImage, heroContent }: HomeHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const slides = useMemo(() => {
    const cmsSlides =
      heroContent?.isActive && heroContent.slides.length
        ? heroContent.slides
            .filter((slide) => slide.isActive)
            .sort((firstSlide, secondSlide) => {
              return firstSlide.sortOrder - secondSlide.sortOrder
            })
        : []

    return cmsSlides.length ? cmsSlides : [getFallbackSlide(fallbackImage)]
  }, [fallbackImage, heroContent])
  const autoplayMs =
    Math.min(10, Math.max(1, heroContent?.autoplaySeconds ?? 5)) * 1000
  const fadeMs = Math.min(1500, Math.max(300, heroContent?.fadeMs ?? 800))

  useEffect(() => {
    setActiveIndex(0)
  }, [slides.length])

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
      {slides.map((slide, index) => (
        <div
          className={`absolute inset-0 transition-opacity ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
          key={`${slide.title}-${index}`}
          style={{ transitionDuration: `${fadeMs}ms` }}
        >
          <img
            alt={slide.imageAlt}
            className="h-full w-full object-cover opacity-72"
            src={slide.image || fallbackImage}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,21,18,0.94),rgba(24,21,18,0.64),rgba(24,21,18,0.18))]" />
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,#f6f0e5,rgba(246,240,229,0))]" />

      <div className="relative mx-auto min-h-[calc(100svh-132px)] max-w-7xl lg:min-h-[620px]">
        {slides.map((slide, index) => (
          <div
            className={`absolute inset-0 flex items-center px-4 py-16 transition-opacity sm:px-6 lg:px-8 ${
              index === activeIndex
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
                aria-current={index === activeIndex}
                className={`h-2.5 transition-all ${
                  index === activeIndex
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
