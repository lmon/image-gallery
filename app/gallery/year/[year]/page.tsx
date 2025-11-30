import { prisma } from "@/lib/prisma"
import ImageGrid from "@/components/ImageGrid"
import { getImageUrl } from "@/lib/image-utils"
import { notFound } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getImagesByYear(year: string) {
  try {
    const yearNum = parseInt(year)
    
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      return []
    }

    // Get images where the year of dateCreated matches
    const images = await prisma.$queryRaw<Array<{
      workId: number
      workName: string | null
      file: string | null
      thumbFile: string | null
      dimensions: string | null
      medium: string | null
      dateCreated: Date
    }>>`
      SELECT id as workId, name as workName, file, thumb_file as thumbFile, dimensions, medium, date_created as dateCreated
      FROM work
      WHERE YEAR(date_created) = ${yearNum} AND is_hidden = 0 AND parent_id IS NULL
      ORDER BY date_created DESC
    `
    
    // Prefix image URLs with base URL
    return images.map(image => ({
      ...image,
      file: getImageUrl(image.file),
      thumbFile: getImageUrl(image.thumbFile)
    }))
  } catch (error) {
    console.error("Error fetching images by year:", error)
    return []
  }
}

export default async function YearGalleryPage({
  params
}: {
  params: { year: string }
}) {
  const images = await getImagesByYear(params.year)
  const year = params.year

  if (images.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {year}
          </h1>
        </div>

        <ImageGrid images={images} />
      </div>
    </div>
  )
}

