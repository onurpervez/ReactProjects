import type { MealEntry, MealType } from '../types'

export interface DayHistory {
  date: string
  label: string
  entries: MealEntry[]
  totalCalories: number
  totalCarbs: number
  totalProtein: number
  totalFat: number
}

export function getHistory(username: string, days = 7): DayHistory[] {
  const result: DayHistory[] = []

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().slice(0, 10)
    const key = `macrotrack_meals_${username}_${dateStr}`

    const label = i === 0
      ? 'Bugün'
      : i === 1
      ? 'Dün'
      : date.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'short' })

    let entries: MealEntry[] = []
    try {
      const stored = localStorage.getItem(key)
      if (stored) entries = JSON.parse(stored)
    } catch { entries = [] }

    result.push({
      date: dateStr,
      label,
      entries,
      totalCalories: entries.reduce((s, e) => s + e.totalCalories, 0),
      totalCarbs:    Math.round(entries.reduce((s, e) => s + e.totalCarbs,   0) * 10) / 10,
      totalProtein:  Math.round(entries.reduce((s, e) => s + e.totalProtein, 0) * 10) / 10,
      totalFat:      Math.round(entries.reduce((s, e) => s + e.totalFat,     0) * 10) / 10,
    })
  }

  return result
}