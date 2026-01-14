import { requireAuth } from "@/lib/auth-utils"
import AdminNav from "@/components/admin/AdminNav"

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  // Require authentication before rendering admin pages
  await requireAuth()
  
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  )
}

