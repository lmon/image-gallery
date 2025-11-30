import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import sharp from "sharp"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Get file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/\s/g, "_")
    const filename = `${timestamp}_${originalName}`
    const filepath = `/gallery/art/${filename}`

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), "public", "gallery", "art")
    await mkdir(uploadDir, { recursive: true })

    // Save original file
    const fullPath = path.join(uploadDir, filename)
    await writeFile(fullPath, buffer)

    // Generate thumbnail
    const thumbFilename = `thumb_${filename}`
    const thumbPath = path.join(uploadDir, thumbFilename)
    const thumbFilepath = `/gallery/art/${thumbFilename}`

    try {
      await sharp(buffer)
        .resize(400, 400, {
          fit: "inside",
          withoutEnlargement: true
        })
        .toFile(thumbPath)
    } catch (thumbError) {
      console.error("Error generating thumbnail:", thumbError)
      // If thumbnail generation fails, use original
      return NextResponse.json({
        file: filepath,
        thumbFile: filepath
      })
    }

    return NextResponse.json({
      file: filepath,
      thumbFile: thumbFilepath
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}

