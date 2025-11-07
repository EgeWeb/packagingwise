export const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%239ca3af"%3EÜrün Görseli%3C/text%3E%3C/svg%3E'

export function isValidImageUrl(url: string): boolean {
  if (!url || url.trim() === '') return false

  try {
    const parsedUrl = new URL(url)

    // Check if it's a valid https URL
    if (parsedUrl.protocol !== 'https:') return false

    // Check if hostname is valid (not just dashes or invalid)
    if (!parsedUrl.hostname || parsedUrl.hostname === '-.com' || parsedUrl.hostname.includes('-.')) return false

    // Check if it ends with common image extensions or is a valid CDN URL
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const pathname = parsedUrl.pathname.toLowerCase()
    const hasValidExtension = validExtensions.some(ext => pathname.endsWith(ext))
    const isCDN = parsedUrl.hostname.includes('cdn') || parsedUrl.hostname.includes('cloudinary') || parsedUrl.hostname.includes('imgur')

    return hasValidExtension || isCDN
  } catch {
    return false
  }
}

export function getValidImageUrl(url: string): string {
  return isValidImageUrl(url) ? url : PLACEHOLDER_IMAGE
}
