import Link from "next/link"
import Image from "next/image"

interface ImageGridProps {
  images: Array<{
    workId: number
    workName: string | null
    file: string | null
    thumbFile: string | null
    dimensions: string | null
    medium: string | null
  }>
}

export default function ImageGrid({ images }: ImageGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {images.map((image) => (
        <Link
          key={image.workId}
          href={`/image/${image.workId}`}
          className="group block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative aspect-square bg-gray-100">
            {image.thumbFile || image.file ? (
              <Image
                src={image.thumbFile || image.file || ""}
                alt={image.workName || "Untitled"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div className="p-4 bg-white">
            <h3 className="font-semibold text-gray-900 line-clamp-1">
              {image.workName || "Untitled"}
            </h3>
            {image.medium && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                {image.medium}
              </p>
            )}
            {/* {image.dimensions && (
              <p className="text-xs text-gray-400 mt-1">
                {image.dimensions}
              </p>
            )} */}
          </div>
        </Link>
      ))}
    </div>
  )
}

