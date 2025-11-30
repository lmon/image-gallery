"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"

export default function AdminNav() {
  return (
    <div className="bg-indigo-600 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <h1 className="text-white text-xl font-bold">Admin Dashboard</h1>
            <Link
              href="/admin"
              className="text-indigo-100 hover:text-white text-sm font-medium"
            >
              Manage Images
            </Link>
            <Link
              href="/admin?tab=assets"
              className="text-indigo-100 hover:text-white text-sm font-medium"
            >
              Manage Assets
            </Link>
            <Link
              href="/"
              className="text-indigo-100 hover:text-white text-sm font-medium"
            >
              View Gallery
            </Link>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-indigo-100 hover:text-white text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

