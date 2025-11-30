import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getImageUrl } from "@/lib/image-utils"

// GET /api/images - List all images (filtered for public, all for admin)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const searchParams = request.nextUrl.searchParams
  const all = searchParams.get("all") === "true"

  try {
    const where = session && all ? {} : {
      isHidden: false,
      isAvailable: true,
      parentId: null  // Exclude child images from public listings
    }

    const images = await prisma.work.findMany({
      where,
      orderBy: {
        dateCreated: "desc"
      }
    })

    // Prefix image URLs with base URL and map to old field names for backward compatibility
    const imagesWithUrls = images.map(image => ({
      ...image,
      workId: image.id,
      workName: image.name,
      parent: image.parentId || 0,
      isADefault: image.isFeatured ? 1 : 0,
      group: image.groupName,
      file: getImageUrl(image.file),
      thumbFile: getImageUrl(image.thumbFile)
    }))

    return NextResponse.json(imagesWithUrls)
  } catch (error) {
    console.error("Error fetching images:", error)
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    )
  }
}

// POST /api/images - Create new image (admin only)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      workName,
      file,
      dateCreated,
      medium,
      filetype,
      filesize,
      dimensions,
      comments,
      thumbFile,
      isHidden,
      parent,
      isADefault,
      isAvailable,
      inTheHandsOf,
      group
    } = body

    const image = await prisma.work.create({
      data: {
        name: workName,
        file,
        dateAdded: new Date(),
        dateCreated: dateCreated ? new Date(dateCreated) : null,
        medium,
        filetype,
        fileSize: filesize ? parseInt(filesize) : null,
        dimensions,
        // description/comments field removed - column doesn't exist
        thumbFile: thumbFile || file,
        isHidden: Boolean(isHidden),
        parentId: parent ? parseInt(parent) : null,
        isFeatured: Boolean(isADefault),
        isAvailable: isAvailable !== false,
        // owner/inTheHandsOf field removed - column doesn't exist
        groupName: group || null
      }
    })

    return NextResponse.json({
      ...image,
      workId: image.id,
      workName: image.name,
      parent: image.parentId || 0,
      isADefault: image.isFeatured ? 1 : 0,
      group: image.groupName
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating image:", error)
    return NextResponse.json(
      { error: "Failed to create image" },
      { status: 500 }
    )
  }
}

