import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/assets - List all assets
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const assets = await prisma.asset.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })

    // Map to old field names for backward compatibility
    return NextResponse.json(assets.map(asset => ({
      ...asset,
      created: asset.createdAt,
      updated: asset.updatedAt
    })))
  } catch (error) {
    console.error("Error fetching assets:", error)
    return NextResponse.json(
      { error: "Failed to fetch assets" },
      { status: 500 }
    )
  }
}

// POST /api/assets - Create new asset (admin only)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, url, type, description } = body

    if (!title || !type) {
      return NextResponse.json(
        { error: "Title and type are required" },
        { status: 400 }
      )
    }

    const asset = await prisma.asset.create({
      data: {
        title,
        url: url || "",
        type,
        description: description || null
      }
    })

    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    console.error("Error creating asset:", error)
    return NextResponse.json(
      { error: "Failed to create asset" },
      { status: 500 }
    )
  }
}

