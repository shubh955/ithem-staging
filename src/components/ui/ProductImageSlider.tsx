'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface ProductImageSliderProps {
  images: string[]
  productName: string
}

export function ProductImageSlider({ images, productName }: ProductImageSliderProps) {
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length])

  if (images.length === 0) return null

  return (
    <>
      {/* Slider */}
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div className="relative w-full h-72 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
          <Image
            key={active}
            src={images[active]}
            alt={`${productName} – view ${active + 1}`}
            fill
            className="object-contain p-4 transition-opacity duration-200"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={active === 0}
          />

          {/* Zoom button */}
          <button
            onClick={() => setZoomed(true)}
            className="absolute top-3 right-3 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-100 p-1.5 text-gray-400 hover:text-dark transition-colors shadow-sm"
            aria-label="Zoom image"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          {/* Prev/Next arrows — only if more than 1 image */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-100 p-1.5 text-gray-500 hover:text-dark transition-colors shadow-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-100 p-1.5 text-gray-500 hover:text-dark transition-colors shadow-sm"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Counter badge */}
          {images.length > 1 && (
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
              {active + 1} / {images.length}
            </span>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative shrink-0 h-16 w-16 overflow-hidden rounded-xl border-2 transition-all ${
                  i === active
                    ? 'border-brand-orange shadow-sm'
                    : 'border-gray-100 opacity-60 hover:opacity-100 hover:border-gray-300'
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${productName} thumbnail ${i + 1}`}
                  fill
                  className="object-contain p-1.5 bg-gray-50"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setZoomed(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-3xl w-full rounded-2xl overflow-hidden bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[active]}
              alt={`${productName} – zoomed`}
              width={900}
              height={900}
              className="object-contain w-full h-full max-h-[85vh] p-6"
            />
            <button
              onClick={() => setZoomed(false)}
              className="absolute top-3 right-3 rounded-lg bg-gray-100 hover:bg-gray-200 p-1.5 text-dark transition-colors"
              aria-label="Close zoom"
            >
              ✕
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg bg-white border border-gray-100 p-2 text-gray-500 hover:text-dark shadow transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-white border border-gray-100 p-2 text-gray-500 hover:text-dark shadow transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
