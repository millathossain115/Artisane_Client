import { Link } from 'react-router-dom'

import artistImage from '../../assets/home-banners/artist-optimized.jpg'
import brushLineImage from '../../assets/home-banners/brush-line-optimized.jpg'
import paintTableImage from '../../assets/home-banners/paint-table-optimized.jpg'
import paletteImage from '../../assets/home-banners/palette-optimized.jpg'

const useCases = [
  {
    description: 'Thoughtful pieces for every occasion.',
    image: artistImage,
    label: 'Gifts',
    to: '/products?search=gift',
  },
  {
    description: 'Artwork and accents for blank walls.',
    image: brushLineImage,
    label: 'Wall art',
    to: '/products?search=wall%20art',
  },
  {
    description: 'Ready sets for weekend making.',
    image: paintTableImage,
    label: 'Craft kits',
    to: '/products?search=kit',
  },
  {
    description: 'Objects that warm up daily spaces.',
    image: paletteImage,
    label: 'Home decor',
    to: '/products?search=decor',
  },
  {
    description: 'Tools and materials for creative work.',
    image: paintTableImage,
    label: 'Art supplies',
    to: '/products?search=supplies',
  },
]

function HomeUseCases() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
            Shop by use case
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Find the right piece faster
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-[#6b5f53]">
          Browse by what you need today, from gifts to supplies.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4 xl:grid-cols-5">
        {useCases.map((useCase) => (
          <Link
            className="group relative aspect-[3/4] overflow-hidden bg-[#181512] text-white"
            key={useCase.label}
            to={useCase.to}
          >
            <img
              alt={`${useCase.label} collection`}
              className="absolute inset-0 h-full w-full object-cover opacity-76 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
              src={useCase.image}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,21,18,0.04),rgba(24,21,18,0.9))]" />
            <div className="relative flex h-full flex-col justify-end p-2 sm:p-4">
              <h3 className="text-xs font-bold leading-tight sm:text-lg">
                {useCase.label}
              </h3>
              <p className="mt-1 line-clamp-2 text-[10px] font-medium leading-4 text-white/76 sm:mt-2 sm:text-sm sm:leading-5">
                {useCase.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default HomeUseCases
