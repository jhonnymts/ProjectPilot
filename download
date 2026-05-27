import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string (YYYY-MM-DD) for display.
 * Always uses local date — never toISOString().
 */
export function formatDate(dateStr, fmt = 'MMM d, yyyy') {
  if (!dateStr) return '—'
  // parseISO handles YYYY-MM-DD without timezone shift
  return format(parseISO(dateStr), fmt)
}

/**
 * Get today's date as YYYY-MM-DD local string.
 * Use this for default date values — never new Date().toISOString()
 */
export function todayLocal() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Convert a JS Date to YYYY-MM-DD local string.
 */
export function toLocalDateString(date) {
  if (!date) return null
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export const STATUS_COLORS = {
  active: 'text-emerald-400 bg-emerald-400/10',
  on_hold: 'text-amber-400 bg-amber-400/10',
  completed: 'text-blue-400 bg-blue-400/10',
  archived: 'text-zinc-400 bg-zinc-400/10',
}

export const PRIORITY_COLORS = {
  low: 'text-zinc-400 bg-zinc-400/10',
  medium: 'text-blue-400 bg-blue-400/10',
  high: 'text-amber-400 bg-amber-400/10',
  critical: 'text-rose-400 bg-rose-400/10',
}

export const METHODOLOGY_COLORS = {
  agile: 'text-violet-400 bg-violet-400/10',
  waterfall: 'text-cyan-400 bg-cyan-400/10',
}
