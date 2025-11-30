import { Suspense } from "react"
import AdminContent from "@/components/admin/AdminContent"

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <AdminContent />
    </Suspense>
  )
}

