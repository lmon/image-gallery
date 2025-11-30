import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/assets/[id] - Get single asset
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const id = parseInt(params.id)

    const asset = await prisma.asset.findUnique({
      where: { id }
    })

    if (!asset) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      )
    }

    // Map to old field names for backward compatibility
    return NextResponse.json({
      ...asset,
      created: asset.createdAt,
      updated: asset.updatedAt
    })
  } catch (error) {
    console.error("Error fetching asset:", error)
    return NextResponse.json(
      { error: "Failed to fetch asset" },
      { status: 500 }
    )
  }
}

// PUT /api/assets/[id] - Update asset (admin only)
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

    if (body.title !== undefined) updateData.title = body.title
    if (body.url !== undefined) updateData.url = body.url
    if (body.type !== undefined) updateData.type = body.type
    if (body.description !== undefined) updateData.description = body.description

    const asset = await prisma.asset.update({
      where: { id },
      data: updateData
    })

    // Map to old field names for backward compatibility
    return NextResponse.json({
      ...asset,
      created: asset.createdAt,
      updated: asset.updatedAt
    })
  } catch (error) {
    console.error("Error updating asset:", error)
    return NextResponse.json(
      { error: "Failed to update asset" },
      { status: 500 }
    )
  }
}

// DELETE /api/assets/[id] - Delete asset (admin only)
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

    await prisma.asset.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting asset:", error)
    return NextResponse.json(
      { error: "Failed to delete asset" },
      { status: 500 }
    )
  }
}

