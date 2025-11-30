"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ImageForm from "@/components/admin/ImageForm"
import AssetForm from "@/components/admin/AssetForm"
import Image from "next/image"

type Tab = "images" | "assets"

export default function AdminPage() {
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const tabParam = searchParams.get("tab") as Tab | null
  
  const [activeTab, setActiveTab] = useState<Tab>(tabParam || "images")
  const [images, setImages] = useState<any[]>([])
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingImage, setEditingImage] = useState<any>(null)
  const [editingAsset, setEditingAsset] = useState<any>(null)
  const [existingGroups, setExistingGroups] = useState<string[]>([])

  // Handle tab parameter from URL
  useEffect(() => {
    if (tabParam && (tabParam === "images" || tabParam === "assets")) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  useEffect(() => {
    if (activeTab === "images") {
      fetchImages()
    } else {
      fetchAssets()
    }
  }, [activeTab])

  // Handle edit parameter from URL
  useEffect(() => {
    if (editId && images.length > 0) {
      const imageToEdit = images.find(img => img.workId === parseInt(editId))
      if (imageToEdit) {
        setEditingImage(imageToEdit)
      }
    }
  }, [editId, images])

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/images?all=true")
      const data = await response.json()
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setImages(data)
        
        // Extract unique groups from images
        const groups = Array.from(
          new Set(
            data
              .map((img: any) => img.group)
              .filter((g: string | null) => g !== null && g !== "")
          )
        ).sort() as string[]
        setExistingGroups(groups)
      } else {
        console.error("API returned non-array data:", data)
        setImages([])
        setExistingGroups([])
      }
    } catch (error) {
      console.error("Error fetching images:", error)
      setImages([])
      setExistingGroups([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAssets = async () => {
    try {
      const response = await fetch("/api/assets")
      const data = await response.json()
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setAssets(data)
      } else {
        console.error("API returned non-array data:", data)
        setAssets([])
      }
    } catch (error) {
      console.error("Error fetching assets:", error)
      setAssets([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: any) => {
    try {
      const response = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error("Failed to create")

      await fetchImages()
      setShowForm(false)
      alert("Image created successfully!")
    } catch (error) {
      alert("Failed to create image")
    }
  }

  const handleUpdate = async (data: any) => {
    try {
      const response = await fetch(`/api/images/${editingImage.workId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error("Failed to update")

      await fetchImages()
      setEditingImage(null)
      alert("Image updated successfully!")
    } catch (error) {
      alert("Failed to update image")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const response = await fetch(`/api/images/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete")

      await fetchImages()
      alert("Image deleted successfully!")
    } catch (error) {
      alert("Failed to delete image")
    }
  }

  const handleCreateAsset = async (data: any) => {
    try {
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error("Failed to create")

      await fetchAssets()
      setShowForm(false)
      alert("Asset created successfully!")
    } catch (error) {
      alert("Failed to create asset")
    }
  }

  const handleUpdateAsset = async (data: any) => {
    try {
      const response = await fetch(`/api/assets/${editingAsset.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error("Failed to update")

      await fetchAssets()
      setEditingAsset(null)
      alert("Asset updated successfully!")
    } catch (error) {
      alert("Failed to update asset")
    }
  }

  const handleDeleteAsset = async (id: number) => {
    if (!confirm("Are you sure you want to delete this asset?")) return

    try {
      const response = await fetch(`/api/assets/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete")

      await fetchAssets()
      alert("Asset deleted successfully!")
    } catch (error) {
      alert("Failed to delete asset")
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  // Show image form
  if ((showForm || editingImage) && activeTab === "images") {
    return (
      <div>
        <ImageForm
          image={editingImage}
          allImages={images.filter((img) => img.workId !== editingImage?.workId)}
          existingGroups={existingGroups}
          onSubmit={editingImage ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false)
            setEditingImage(null)
          }}
        />
      </div>
    )
  }

  // Show asset form
  if ((showForm || editingAsset) && activeTab === "assets") {
    return (
      <div>
        <AssetForm
          asset={editingAsset}
          onSubmit={editingAsset ? handleUpdateAsset : handleCreateAsset}
          onCancel={() => {
            setShowForm(false)
            setEditingAsset(null)
          }}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {activeTab === "images" ? "Add New Image" : "Add New Asset"}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => {
              setActiveTab("images")
              setLoading(true)
            }}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === "images"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            Images ({images.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("assets")
              setLoading(true)
            }}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === "assets"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            Assets ({assets.length})
          </button>
        </nav>
      </div>

      {/* Images Tab Content */}
      {activeTab === "images" && (
        <>
          {images.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No images yet. Add your first image!</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medium
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dimensions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {images.map((image) => (
                <tr key={image.workId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative w-16 h-16 bg-gray-100 rounded">
                      {image.thumbFile || image.file ? (
                        <Image
                          src={image.thumbFile || image.file}
                          alt={image.workName || "Untitled"}
                          fill
                          className="object-cover rounded"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-gray-400">
                          No img
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {image.workName || "Untitled"}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {image.workId}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {image.medium || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {image.dimensions || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {image.isHidden === 1 && (
                        <span className="inline-flex text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                          Hidden
                        </span>
                      )}
                      {!image.isAvailable && (
                        <span className="inline-flex text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                          Sold
                        </span>
                      )}
                      {image.isADefault === 1 && (
                        <span className="inline-flex text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => setEditingImage(image)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(image.workId)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          )}
        </>
      )}

      {/* Assets Tab Content */}
      {activeTab === "assets" && (
        <>
          {assets.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No assets yet. Add your first asset!</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {asset.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {asset.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={asset.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-900 truncate block max-w-xs"
                        >
                          {asset.url}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                          {asset.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(asset.created).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => setEditingAsset(asset)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

