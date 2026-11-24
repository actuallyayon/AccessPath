import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDistance(meters: number | null | undefined): string {
  if (meters === null || meters === undefined) return 'Unknown'
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

export function formatScore(score: number): {
  label: string
  color: string
  badgeBg: string
} {
  if (score >= 80) {
    return { label: 'High Accessibility', color: 'text-emerald-600', badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' }
  }
  if (score >= 50) {
    return { label: 'Moderate Accessibility', color: 'text-amber-600', badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' }
  }
  return { label: 'Low Accessibility / Barriers', color: 'text-rose-600', badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' }
}
