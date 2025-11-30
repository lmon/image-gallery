"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()
  const pathname = usePathname()
  
  // Handle session loading state
  const isLoading = status === "loading"
  
  // Check if we're on an image detail page and extract the ID
  const imageIdMatch = pathname.match(/^\/image\/(\d+)$/)
  const imageId = imageIdMatch ? imageIdMatch[1] : null

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold" style={{ letterSpacing: '-3px', fontFamily: 'Verdana, Tahoma, Arial, sans-serif', color: '#9a9aAB' }}>
              lucasmonaco.com
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Home
            </Link>
            {!isLoading && (
              <>
                {session && imageId && (
                  <Link
                    href={`/admin?edit=${imageId}`}
                    className="text-indigo-600 hover:text-indigo-800 px-3 py-2 text-sm font-medium"
                  >
                    Edit
                  </Link>
                )}
                {session ? (
                  <Link
                    href="/admin"
                    className="text-indigo-600 hover:text-indigo-800 px-3 py-2 text-sm font-medium"
                  >
                    Admin
                  </Link>
                ) : (
                  <Link
                    href="/admin/login"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Admin Login
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {!isLoading && (
              <>
                {session && imageId && (
                  <Link
                    href={`/admin?edit=${imageId}`}
                    className="block text-indigo-600 hover:text-indigo-800 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Edit
                  </Link>
                )}
                {session ? (
                  <Link
                    href="/admin"
                    className="block text-indigo-600 hover:text-indigo-800 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                ) : (
                  <Link
                    href="/admin/login"
                    className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Login
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

