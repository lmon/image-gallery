import { prisma } from "@/lib/prisma"
import ImageGrid from "@/components/ImageGrid"
import { getImageUrl } from "@/lib/image-utils"
import { notFound } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getImagesByGroup(group: string) {
  try {
    const decodedGroup = decodeURIComponent(group)
    
    const images = await prisma.work.findMany({
      where: {
        groupName: decodedGroup,
        isHidden: false,
        parentId: null  // Exclude child images - they only appear in Related section
      },
      orderBy: {
        dateAdded: "desc"
      },
      select: {
        id: true,
        name: true,
        file: true,
        thumbFile: true,
        dimensions: true,
        medium: true,
        dateCreated: true
      }
    })
    
    // Prefix image URLs with base URL
    return images.map(image => ({
      ...image,
      workId: image.id,
      workName: image.name,
      file: getImageUrl(image.file),
      thumbFile: getImageUrl(image.thumbFile)
    }))
  } catch (error) {
    console.error("Error fetching images by group:", error)
    return []
  }
}

export default async function GroupGalleryPage({
  params
}: {
  params: { group: string }
}) {
  const images = await getImagesByGroup(params.group)
  const decodedGroup = decodeURIComponent(params.group)

  if (images.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {decodedGroup}
          </h1>
        </div>

        <ImageGrid images={images} />
      </div>
    </div>
  )
}

