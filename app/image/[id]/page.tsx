import { prisma } from "@/lib/prisma"
import ImageDetail from "@/components/ImageDetail"
import { notFound } from "next/navigation"
import { getImageUrl } from "@/lib/image-utils"

export const dynamic = "force-dynamic"

async function getImageData(id: number) {
  try {
    const image = await prisma.work.findUnique({
      where: { id: id }
    })

    if (!image) {
      return null
    }

    // Get related images:
    // 1. Images with this image as parent (children)
    // 2. Images with the same parent as this image (siblings)
    const relatedImages = await prisma.work.findMany({
      where: {
        OR: [
          // Children: images where parent equals current image's ID
          {
            parentId: id,
            isHidden: false
          },
          // Parent image
          {
            id: image.parentId || 0,
            isHidden: false
          },
          // Siblings: images where parent equals current image's parent (and parent exists)
          ...(image.parentId ? [{
            parentId: image.parentId,
            isHidden: false,
            id: { not: id } // Exclude the current image itself
          }] : [])
        ]
      },
      select: {
        id: true,
        name: true,
        file: true,
        thumbFile: true
      }
    })

    // Get random other images (for thumbnails)
    const otherImages = await prisma.$queryRaw<Array<{
      workId: number
      workName: string | null
      file: string | null
      thumbFile: string | null
    }>>`
      SELECT id as workId, name as workName, file, thumb_file as thumbFile
      FROM work
      WHERE id != ${id} AND is_hidden = 0 AND is_available = 1 AND parent_id IS NULL
      ORDER BY RAND()
      LIMIT 5
    `

    // Prefix image URLs with base URL
    return {
      image: {
        ...image,
        workId: image.id,
        workName: image.name,
        file: getImageUrl(image.file),
        thumbFile: getImageUrl(image.thumbFile)
      },
      relatedImages: relatedImages.map(img => ({
        ...img,
        workId: img.id,
        workName: img.name,
        file: getImageUrl(img.file),
        thumbFile: getImageUrl(img.thumbFile)
      })),
      otherImages: otherImages.map(img => ({
        ...img,
        file: getImageUrl(img.file),
        thumbFile: getImageUrl(img.thumbFile)
      }))
    }
  } catch (error) {
    console.error("Error fetching image data:", error)
    return null
  }
}

export default async function ImagePage({
  params
}: {
  params: { id: string }
}) {
  const id = parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const data = await getImageData(id)

  if (!data) {
    notFound()
  }

  return (
    <ImageDetail
      image={data.image}
      relatedImages={data.relatedImages}
      otherImages={data.otherImages}
    />
  )
}

