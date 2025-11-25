/**
 * Timestamp formatting utility for chat messages
 * Uses date-fns for human-readable relative time
 * Feature: 002-chat-panel
 */

import { formatDistanceToNow, format } from 'date-fns'

/**
 * Format timestamp as human-readable relative time
 *
 * Rules:
 * - <24 hours: "2 min ago", "5 hours ago"
 * - 24-48 hours: "Yesterday at 3:15 PM"
 * - 2-7 days: "Monday at 11:30 AM"
 * - 7+ days: "Nov 10 at 2:45 PM"
 *
 * @param timestamp Unix timestamp in milliseconds
 * @returns Formatted human-readable time string
 *
 * @example
 * formatTimestamp(Date.now() - 120000) // "2 minutes ago"
 * formatTimestamp(Date.now() - 86400000) // "Yesterday at 3:15 PM"
 * formatTimestamp(Date.now() - 604800000) // "Nov 10 at 2:45 PM"
 */
export function formatTimestamp(timestamp: number): string {
  const now = Date.now()
  const diffMs = now - timestamp
  const diffHours = diffMs / (1000 * 60 * 60)

  // Less than 24 hours: relative time
  if (diffHours < 24) {
    return formatDistanceToNow(timestamp, { addSuffix: true })
  }

  // 24-48 hours: "Yesterday at HH:MM AM/PM"
  if (diffHours < 48) {
    const time = format(timestamp, 'h:mm a')
    return `Yesterday at ${time}`
  }

  // 2-7 days: "Day at HH:MM AM/PM"
  if (diffHours < 7 * 24) {
    const day = format(timestamp, 'EEEE') // "Monday"
    const time = format(timestamp, 'h:mm a')
    return `${day} at ${time}`
  }

  // 7+ days: "MMM D at HH:MM AM/PM"
  return format(timestamp, 'MMM d at h:mm a')
}
