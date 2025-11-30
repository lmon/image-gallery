const IMAGE_BASE_URL = "https://www.lucasmonaco.com"

/**
 * Prefixes image paths with the base URL
 */
export function getImageUrl(path: string | null): string | null {
  if (!path) return null
  
  // If it already starts with http/https, return as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }
  
  // If it starts with www., add https:// protocol
  if (path.startsWith("www.")) {
    return `https://${path}`
  }
  
  // Otherwise, prefix with our base URL
  return `${IMAGE_BASE_URL}${path}`
}

/**
 * Gets the display image URL (prefers thumbFile, falls back to file)
 */
export function getDisplayImageUrl(
  thumbFile: string | null,
  file: string | null
): string | null {
  const url = thumbFile || file
  return getImageUrl(url)
}

