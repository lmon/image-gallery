"use client"

import { useState, useEffect } from "react"

interface AssetFormProps {
  asset?: {
    id: number
    title: string
    url: string
    type: string
    description?: string
  } | null
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function AssetForm({ asset, onSubmit, onCancel }: AssetFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    type: "",
    description: ""
  })

  useEffect(() => {
    if (asset) {
      setFormData({
        title: asset.title,
        url: asset.url,
        type: asset.type,
        description: asset.description || ""
      })
    }
  }, [asset])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {asset ? "Edit Asset" : "Add New Asset"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[#333333]"
            placeholder="Asset title"
          />
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[#333333]"
            placeholder="https://example.com/document.pdf"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            maxLength={512}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[#333333]"
            placeholder="Asset description (max 512 characters)"
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.description.length}/512 characters
          </p>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[#333333]"
          >
            <option value="">Select type...</option>
            <option value="pdf">PDF Document</option>
            <option value="link">Link</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
            <option value="image">Image</option>
            <option value="other">Other</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Or enter custom type:
          </p>
          <input
            type="text"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[#333333]"
            placeholder="Custom type"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
          >
            {asset ? "Update Asset" : "Create Asset"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

