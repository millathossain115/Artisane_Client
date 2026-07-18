import { ImageOff } from 'lucide-react'

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
  productName,
}: ProductGalleryProps) {
  const activeIndex = Math.max(
    0,
    images.findIndex((image) => image === mainImage),
  )

  return (
    <div>
      <div className="overflow-hidden bg-white">
        <div className="relative aspect-[4/3] bg-[#e4d8c8]">
          {mainImage ? (
            <img
              alt={productName}
              className="h-full w-full object-cover"
              src={mainImage}
            />
          ) : (
            <div className="grid h-full place-items-center text-[#7a3f1d]">
              <ImageOff className="h-10 w-10" />
            </div>
          )}
        </div>
      </div>

      {images.length > 0 ? (
        <div className="mt-4 border border-black/10 bg-white p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
              View images
            </p>
            <p className="text-xs font-bold text-[#6b5f53]">
              {activeIndex + 1}/{images.length}
            </p>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:gap-3">
            {images.map((image, index) => (
              <button
                aria-label={`View ${productName} image ${index + 1}`}
                className={`relative h-16 w-16 shrink-0 overflow-hidden border-2 bg-white transition sm:h-20 sm:w-20 ${
                  mainImage === image
                    ? 'border-[#181512]'
                    : 'border-black/10 hover:border-[#7a3f1d]'
                }`}
                key={`${image}-${index}`}
                onClick={() => onSelectImage(image)}
                type="button"
              >
                <img alt="" className="h-full w-full object-cover" src={image} />
                {mainImage === image ? (
                  <span className="absolute inset-x-0 bottom-0 bg-[#181512] py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                    Viewing
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ProductGallery
