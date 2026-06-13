import type { UserProfile } from '../types'
import { calculateBMR } from './calculateBMR'

const ACTIVITY_MULTIPLIERS: Record<UserProfile['activity'], number> = {
  sedentary:   1.2,
  light:       1.375,
  moderate:    1.55,
  active:      1.725,
  very_active: 1.9,
}

export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile)
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[profile.activity])
}