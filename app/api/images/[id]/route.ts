import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getImageUrl } from "@/lib/image-utils"

// GET /api/images/[id] - Get single image with related images
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    const image = await prisma.work.findUnique({
      where: { id: id }
    })

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      )
    }

    // Get related images (images with this image as parent)
    const relatedImages = await prisma.work.findMany({
      where: {
        parentId: id,
        isHidden: false
      }
    })

    // Get parent image if exists
    let parentImage = null
    if (image.parentId) {
      parentImage = await prisma.work.findUnique({
        where: { id: image.parentId }
      })
    }

    // Get other recent images (for thumbnails)
    const otherImages = await prisma.work.findMany({
      where: {
        id: { not: id },
        isHidden: false,
        isAvailable: true,
        parentId: null  // Exclude child images
      },
      take: 10,
      orderBy: { dateCreated: "desc" }
    })

    // Prefix image URLs with base URL and map to old field names
    return NextResponse.json({
      image: {
        ...image,
        workId: image.id,
        workName: image.name,
        parent: image.parentId || 0,
        isADefault: image.isFeatured ? 1 : 0,
        group: image.groupName,
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
      parentImage: parentImage ? {
        ...parentImage,
        workId: parentImage.id,
        workName: parentImage.name,
        file: getImageUrl(parentImage.file),
        thumbFile: getImageUrl(parentImage.thumbFile)
      } : null,
      otherImages: otherImages.map(img => ({
        ...img,
        workId: img.id,
        workName: img.name,
        file: getImageUrl(img.file),
        thumbFile: getImageUrl(img.thumbFile)
      }))
    })
  } catch (error) {
    console.error("Error fetching image:", error)
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    )
  }
}

// PUT /api/images/[id] - Update image (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const id = parseInt(params.id)
    const body = await request.json()

    const updateData: any = {}

    if (body.workName !== undefined) updateData.name = body.workName
    if (body.file !== undefined) updateData.file = body.file
    if (body.dateCreated !== undefined) updateData.dateCreated = body.dateCreated ? new Date(body.dateCreated) : null
    if (body.medium !== undefined) updateData.medium = body.medium
    if (body.filetype !== undefined) updateData.filetype = body.filetype
    if (body.filesize !== undefined) updateData.fileSize = body.filesize ? parseInt(body.filesize) : null
    if (body.dimensions !== undefined) updateData.dimensions = body.dimensions
    // comments/description field removed - column doesn't exist
    if (body.thumbFile !== undefined) updateData.thumbFile = body.thumbFile
    if (body.isHidden !== undefined) updateData.isHidden = Boolean(body.isHidden)
    if (body.parent !== undefined) updateData.parentId = body.parent ? parseInt(body.parent) : null
    if (body.isADefault !== undefined) updateData.isFeatured = Boolean(body.isADefault)
    if (body.isAvailable !== undefined) updateData.isAvailable = body.isAvailable
    // inTheHandsOf/owner field removed - column doesn't exist
    if (body.group !== undefined) updateData.groupName = body.group

    const image = await prisma.work.update({
      where: { id: id },
      data: updateData
    })

    return NextResponse.json({
      ...image,
      workId: image.id,
      workName: image.name,
      parent: image.parentId || 0,
      isADefault: image.isFeatured ? 1 : 0,
      group: image.groupName
    })
  } catch (error) {
    console.error("Error updating image:", error)
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    )
  }
}

// DELETE /api/images/[id] - Delete image (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const id = parseInt(params.id)

    await prisma.work.delete({
      where: { id: id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    )
  }
}

