import { format, formatDistance, formatRelative } from 'date-fns'

/**
 * Format amount in cents to USD currency string
 */
export function formatCurrency(amountInCents: number): string {
  const amount = amountInCents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString()
  
  const suffixes = ['', 'K', 'M', 'B', 'T']
  const magnitude = Math.floor(Math.log10(num) / 3)
  const scaled = num / Math.pow(1000, magnitude)
  
  return `${scaled.toFixed(scaled < 10 ? 1 : 0)}${suffixes[magnitude]}`
}

/**
 * Format percentage with proper precision
 */
export function formatPercentage(value: number, precision: number = 1): string {
  return `${value.toFixed(precision)}%`
}

/**
 * Format date for display (e.g., "Dec 25, 2025")
 */
export function formatDate(date: Date | string | number): string {
  const dateObj = new Date(date)
  return format(dateObj, 'MMM d, yyyy')
}

/**
 * Format date and time for display (e.g., "Dec 25, 2025 at 2:30 PM")
 */
export function formatDateTime(date: Date | string | number): string {
  const dateObj = new Date(date)
  return format(dateObj, 'MMM d, yyyy \'at\' h:mm a')
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const dateObj = new Date(date)
  return formatDistance(dateObj, new Date(), { addSuffix: true })
}

/**
 * Format timestamp to relative time with context (e.g., "Yesterday at 2:30 PM")
 */
export function formatRelativeDateTime(date: Date | string | number): string {
  const dateObj = new Date(date)
  const now = new Date()
  const diffInHours = Math.abs(now.getTime() - dateObj.getTime()) / (1000 * 60 * 60)
  
  // If within 24 hours, show relative time
  if (diffInHours < 24) {
    return formatRelativeTime(dateObj)
  }
  
  // Otherwise show formatted relative date
  return formatRelative(dateObj, now)
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  
  return phone // Return original if not standard US format
}

/**
 * Format address for single line display
 */
export function formatAddress(address: {
  street?: string
  city?: string
  state?: string
  zipCode?: string
}): string {
  const parts = []
  
  if (address.street) parts.push(address.street)
  if (address.city) parts.push(address.city)
  if (address.state) parts.push(address.state)
  if (address.zipCode) parts.push(address.zipCode)
  
  return parts.join(', ')
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Format username/handle (ensure @ prefix)
 */
export function formatHandle(handle: string): string {
  return handle.startsWith('@') ? handle : `@${handle}`
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

/**
 * Format duration in seconds to human readable format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * Format social media URL for display (remove protocol, www)
 */
export function formatSocialUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace(/^www\./, '') + urlObj.pathname
  } catch {
    return url
  }
} 