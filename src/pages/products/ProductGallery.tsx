import { useState } from 'react'
import { Expand, ImageOff, X } from 'lucide-react'

type ProductGalleryProps = {
  images: string[]
  mainImage?: string
  onSelectImage: (image: string) => void
  productId: string
  productName: string
}

function ProductGallery({
  images,
  mainImage,
  onSelectImage,
  productId,
  productName,
}: ProductGalleryProps) {
  const [prevProductId, setPrevProductId] = useState(productId)
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('cover')
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  if (prevProductId !== productId) {
    setPrevProductId(productId)
    setFitMode('cover')
  }

  const activeIndex = Math.max(
    0,
    images.findIndex((image) => image === mainImage),
  )

  return (
    <div>
      <div className="relative overflow-hidden border border-black/10 bg-white">
        <div className="relative aspect-[4/3] bg-[#f8f3ea]">
          {mainImage ? (
            <img
              alt={productName}
              className={`h-full w-full transition-all duration-300 ${
                fitMode === 'cover' ? 'object-cover' : 'object-contain p-2'
              }`}
              src={mainImage}
            />
          ) : (
            <div className="grid h-full place-items-center text-[#7a3f1d]">
              <ImageOff className="h-10 w-10" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 border border-black/10 bg-white p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
            View images
          </p>
          <p className="text-xs font-bold text-[#6b5f53]">
            {images.length > 0 ? `${activeIndex + 1}/${images.length}` : '0/0'}
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 sm:gap-3">
          {images.map((image, index) => {
            const isViewing = mainImage === image

            return (
              <button
                aria-label={`View ${productName} image ${index + 1}`}
                className={`relative h-16 w-16 shrink-0 overflow-hidden border-2 bg-white transition sm:h-20 sm:w-20 ${
                  isViewing && fitMode === 'cover'
                    ? 'border-[#181512]'
                    : 'border-black/10 hover:border-[#7a3f1d]'
                }`}
                key={`${image}-${index}`}
                onClick={() => {
                  onSelectImage(image)
                  setFitMode('cover')
                }}
                type="button"
              >
                <img alt="" className="h-full w-full object-cover" src={image} />
                {isViewing && fitMode === 'cover' ? (
                  <span className="absolute inset-x-0 bottom-0 block bg-[#181512] py-0.5 text-center text-[8px] font-bold uppercase tracking-wider text-white">
                    Fill View
                  </span>
                ) : null}
              </button>
            )
          })}

          {mainImage && (
            <button
              aria-label="View original ratio preview"
              className={`relative h-16 w-16 shrink-0 overflow-hidden border-2 bg-[#f8f3ea] transition sm:h-20 sm:w-20 ${
                fitMode === 'contain'
                  ? 'border-[#181512]'
                  : 'border-black/10 hover:border-[#7a3f1d]'
              }`}
              onClick={() => setFitMode('contain')}
              title="Preview full uncropped image ratio"
              type="button"
            >
              <img
                alt=""
                className="h-full w-full object-contain p-1"
                src={mainImage}
              />
              <span
                className={`absolute inset-x-0 bottom-0 block text-center text-[8px] font-bold uppercase tracking-wider ${
                  fitMode === 'contain'
                    ? 'bg-[#181512] text-white'
                    : 'bg-[#7a3f1d] text-white'
                }`}
              >
                Original Ratio
              </span>
            </button>
          )}

          {mainImage && (
            <button
              aria-label="Expand image fullscreen"
              className="group relative h-16 w-16 shrink-0 overflow-hidden border-2 border-black/10 transition hover:border-[#8f3f1d] sm:h-20 sm:w-20"
              onClick={() => setIsLightboxOpen(true)}
              title="Expand image fullscreen"
              type="button"
            >
              <img
                alt=""
                className="h-full w-full object-cover brightness-50 transition duration-300 group-hover:scale-105 group-hover:brightness-40"
                src={mainImage}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <Expand className="h-4 w-4 drop-shadow" />
                <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                  Expand
                </span>
              </div>
            </button>
          )}
        </div>
      </div>

      {isLightboxOpen && mainImage && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/85 p-4 backdrop-blur-sm"
          role="presentation"
        >
          <div className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center">
            <button
              aria-label="Close lightbox"
              className="btn-danger absolute -top-12 right-0 grid h-9 w-9 !p-0"
              onClick={() => setIsLightboxOpen(false)}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              alt={productName}
              className="max-h-[85vh] max-w-[90vw] object-contain shadow-2xl"
              src={mainImage}
            />
            <p className="mt-3 text-xs font-bold uppercase tracking-wider text-white/80">
              {productName} ({activeIndex + 1}/{images.length})
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductGallery
