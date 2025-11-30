"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import YearNav from "./YearNav"

interface GroupNavProps {
  groups: string[]
  years: number[]
}

export default function GroupNav({ groups, years }: GroupNavProps) {
  const pathname = usePathname()

  if (groups.length === 0 && years.length === 0) {
    return null
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-2 overflow-x-auto">
          {groups.map((group) => {
            const isActive = pathname === `/gallery/${encodeURIComponent(group)}`
            return (
              <Link
                key={group}
                href={`/gallery/${encodeURIComponent(group)}`}
                className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md mr-8 ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {group}
              </Link>
            )
          })}
          {years.length > 0 && <YearNav years={years} />}
        </div>
      </div>
    </div>
  )
}

