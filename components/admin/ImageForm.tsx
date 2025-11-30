"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface ImageFormProps {
  image?: any
  allImages?: any[]
  existingGroups?: string[]
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

export default function ImageForm({
  image,
  allImages = [],
  existingGroups = [],
  onSubmit,
  onCancel
}: ImageFormProps) {
  const [formData, setFormData] = useState({
    workName: image?.workName || "",
    dateCreated: image?.dateCreated
      ? new Date(image.dateCreated).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    medium: image?.medium || "",
    dimensions: image?.dimensions || "",
    comments: image?.comments || "",
    file: image?.file || "",
    thumbFile: image?.thumbFile || "",
    parent: image?.parent || 0,
    isHidden: image?.isHidden === 1 || false,
    isADefault: image?.isADefault === 1 || false,
    isAvailable: image?.isAvailable !== false,
    inTheHandsOf: image?.inTheHandsOf || "",
    group: image?.group || ""
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setFormData((prev) => ({
        ...prev,
        file: data.file,
        thumbFile: data.thumbFile
      }))
    } catch (error) {
      alert("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSubmit(formData)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {image ? "Edit Image" : "Add New Image"}
        </h3>

        {/* Image Thumbnail */}
        {image && (formData.thumbFile || formData.file) && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Image
            </label>
            <div className="relative w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={formData.thumbFile || formData.file}
                alt={formData.workName || "Image"}
                fill
                className="object-cover"
                sizes="192px"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.workName}
              onChange={(e) =>
                setFormData({ ...formData, workName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[#333333]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Created
            </label>
            <input
              type="date"
              value={formData.dateCreated}
              onChange={(e) =>
                setFormData({ ...formData, dateCreated: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[#333333]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medium
            </label>
            <input
              type="text"
              value={formData.medium}
              onChange={(e) =>
                setFormData({ ...formData, medium: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[#333333]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dimensions
            </label>
            <input
              type="text"
              value={formData.dimensions}
              onChange={(e) =>
                setFormData({ ...formData, dimensions: e.target.value })
              }
              placeholder="e.g., 40 x 60"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[#333333]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.comments}
              onChange={(e) =>
                setFormData({ ...formData, comments: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[#333333]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {uploading && (
              <p className="text-sm text-gray-500 mt-1">Uploading...</p>
            )}
            {formData.file && (
              <p className="text-sm text-gray-600 mt-1">
                Current: {formData.file}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Image
            </label>
            <select
              value={formData.parent}
              onChange={(e) =>
                setFormData({ ...formData, parent: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[#333333]"
            >
              <option value={0}>None</option>
              {allImages.map((img) => (
                <option key={img.workId} value={img.workId}>
                  {img.workName || `Image ${img.workId}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location / Owner
            </label>
            <input
              type="text"
              value={formData.inTheHandsOf}
              onChange={(e) =>
                setFormData({ ...formData, inTheHandsOf: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[#333333]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group
            </label>
            <input
              type="text"
              value={formData.group}
              onChange={(e) =>
                setFormData({ ...formData, group: e.target.value })
              }
              list="groupOptions"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[#333333]"
              placeholder="e.g., Paintings, Sculptures"
            />
            {existingGroups.length > 0 && (
              <datalist id="groupOptions">
                {existingGroups.map((group) => (
                  <option key={group} value={group} />
                ))}
              </datalist>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isHidden}
                onChange={(e) =>
                  setFormData({ ...formData, isHidden: e.target.checked })
                }
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Hidden from gallery</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) =>
                  setFormData({ ...formData, isAvailable: e.target.checked })
                }
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Available for purchase</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isADefault}
                onChange={(e) =>
                  setFormData({ ...formData, isADefault: e.target.checked })
                }
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Featured image</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || uploading || !formData.file}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : image ? "Update" : "Create"}
        </button>
      </div>
    </form>
  )
}

