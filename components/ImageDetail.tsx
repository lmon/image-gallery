"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface ImageDetailProps {
  image: {
    workId: number
    workName: string | null
    file: string | null
    dimensions: string | null
    dateCreated: Date
    medium: string | null
  }
  relatedImages?: Array<{
    workId: number
    workName: string | null
    thumbFile: string | null
    file: string | null
  }>
  otherImages?: Array<{
    workId: number
    workName: string | null
    thumbFile: string | null
    file: string | null
  }>
}

/* this is a comment */

export default function ImageDetail({
  image,
  relatedImages = [],
  otherImages = []
}: ImageDetailProps) {
  const [showOverlay, setShowOverlay] = useState(false)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      

      <div className="max-w-[735px] mx-auto">
        {/* Image */}
        <div 
          className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-8 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => image.file && setShowOverlay(true)}
          title="Click to view full size"
        >
          {image.file ? (
            <Image
              src={image.file}
              alt={image.workName || "Untitled"}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {image.workName || "Untitled"}
          </h1>

          <div className="space-y-4 text-gray-700">
            {image.dimensions && (
              <div>
                <h3 className="font-semibold text-gray-900">Dimensions</h3>
                <p>{image.dimensions}</p>
              </div>
            )}

            {image.medium && (
              <div>
                <h3 className="font-semibold text-gray-900">Medium</h3>
                <p>{image.medium}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-900">Date Created</h3>
              <p>{new Date(image.dateCreated).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Images */}
      {relatedImages.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedImages.map((related) => (
              <Link
                key={related.workId}
                href={`/image/${related.workId}`}
                className="group block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative aspect-square bg-gray-100">
                  {related.thumbFile || related.file ? (
                    <Image
                      src={related.thumbFile || related.file || ""}
                      alt={related.workName || "Untitled"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Other Images */}
      {otherImages.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            More from the Gallery
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {otherImages.map((other) => (
              <Link
                key={other.workId}
                href={`/image/${other.workId}`}
                className="group block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative aspect-square bg-gray-100">
                  {other.thumbFile || other.file ? (
                    <Image
                      src={other.thumbFile || other.file || ""}
                      alt={other.workName || "Untitled"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Full-size image overlay */}
      {showOverlay && image.file && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowOverlay(false)}
        >
          <button
            onClick={() => setShowOverlay(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-bold z-10"
            aria-label="Close"
          >
            ×
          </button>
          <div className="relative w-[99vw] h-[90vh]">
            <Image
              src={image.file}
              alt={image.workName || "Untitled"}
              fill
              className="object-contain"
              sizes="99vw"
              quality={100}
            />
          </div>
        </div>
      )}
    </div>
  )
}

