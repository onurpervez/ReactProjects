import type { UserProfile } from '../types'

export function calculateBMR(profile: UserProfile): number {
  const { weight, height, age, gender } = profile

  if (gender === 'male') {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5)
  } else {
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161)
  }
}