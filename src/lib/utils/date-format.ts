/**
 * Format date consistently to avoid hydration errors
 * Uses a consistent format that works on both server and client
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  // Check if date is valid
  if (isNaN(d.getTime())) {
    return 'Invalid Date'
  }
  
  // Use a consistent format that doesn't depend on locale
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

/**
 * Format date in a readable format (e.g., "January 15, 2024")
 * This is safe for client-side only rendering
 */
export function formatDateReadable(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date'
  }
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const year = d.getFullYear()
  const month = months[d.getMonth()]
  const day = d.getDate()
  
  return `${month} ${day}, ${year}`
}

/**
 * Format date and time consistently
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date'
  }
  
  const dateStr = formatDate(d)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  
  return `${dateStr} ${hours}:${minutes}`
}

