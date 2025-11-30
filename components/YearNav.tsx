"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"

interface YearNavProps {
  years: number[]
}

export default function YearNav({ years }: YearNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Calculate dropdown position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left
      })
    }
  }, [isOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (years.length === 0) {
    return null
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium inline-flex items-center whitespace-nowrap"
      >
        Year
        <svg
          className={`ml-1 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="fixed w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 max-h-96 overflow-y-auto" 
          style={{ 
            zIndex: 9999,
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
        >
          <div className="py-1">
            {years.map((year) => {
              const isActive = pathname === `/gallery/year/${year}`
              return (
                <Link
                  key={year}
                  href={`/gallery/year/${year}`}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 text-sm ${
                    isActive
                      ? "bg-indigo-100 text-indigo-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {year}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

