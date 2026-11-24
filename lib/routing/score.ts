/**
 * AccessPath Pure Route Accessibility Scoring Engine
 *
 * Evaluates pedestrian and wheelchair routes based on physical obstacles,
 * accessibility fixtures (ramps, elevators), barrier reports, step data,
 * and user mobility preferences.
 */

export interface BarrierItem {
  id: string
  category:
    | 'broken_footpath'
    | 'missing_ramp'
    | 'blocked_sidewalk'
    | 'broken_elevator'
    | 'unsafe_crossing'
  description?: string
  status: 'verified' | 'pending' | 'resolved' | 'rejected'
  distanceToRoute?: number
}

export interface RouteScoreInput {
  distance_m: number
  duration_s: number
  steps_count?: number
  ramps_count?: number
  elevators_count?: number
  barriers: BarrierItem[]
  shortest_alt_distance_m?: number
  preferences?: {
    avoid_stairs?: boolean
    max_incline_deg?: number
    require_elevators?: boolean
  }
}

export interface ScoreBreakdownItem {
  name: string
  points: number
  reason: string
}

export interface RouteScoreOutput {
  score: number // Clamped 0 - 100
  distance_m: number
  duration_s: number
  barrier_count: number
  warnings: string[]
  breakdown: ScoreBreakdownItem[]
  recommended: boolean
}

// Penalty weights for barrier categories
const BARRIER_PENALTIES: Record<BarrierItem['category'], number> = {
  broken_footpath: 10,
  blocked_sidewalk: 10,
  missing_ramp: 12,
  broken_elevator: 12,
  unsafe_crossing: 15,
}

export function calculateRouteScore(input: RouteScoreInput): RouteScoreOutput {
  let score = 100
  const breakdown: ScoreBreakdownItem[] = []
  const warnings: string[] = []

  breakdown.push({
    name: 'Base Score',
    points: 100,
    reason: 'Initial baseline accessibility score',
  })

  // 1. Distance relative bonus: Up to +15 if shorter or equal to shortest alternative
  if (input.shortest_alt_distance_m && input.shortest_alt_distance_m > 0) {
    const ratio = input.shortest_alt_distance_m / input.distance_m
    if (ratio >= 0.95) {
      const distBonus = Math.min(15, Math.round(ratio * 15))
      score += distBonus
      breakdown.push({
        name: 'Short Distance Bonus',
        points: distBonus,
        reason: 'Optimal route length reduces physical strain',
      })
    }
  }

  // 2. Positive accessibility fixtures along route
  const ramps = input.ramps_count || 0
  if (ramps > 0) {
    const rampPts = Math.min(15, ramps * 5)
    score += rampPts
    breakdown.push({
      name: 'Ramps Available',
      points: rampPts,
      reason: `${ramps} verified ramp(s) detected along transit path (+5 each, max 15)`,
    })
  }

  const elevators = input.elevators_count || 0
  if (elevators > 0) {
    const elevPts = Math.min(10, elevators * 5)
    score += elevPts
    breakdown.push({
      name: 'Elevator Access',
      points: elevPts,
      reason: `${elevators} elevator transition(s) available (+5 each, max 10)`,
    })
  }

  // 3. Steps / Staircase Penalties (-15 each, 2x if avoid_stairs preferred)
  const steps = input.steps_count || 0
  if (steps > 0) {
    const stairsMultiplier = input.preferences?.avoid_stairs ? 2 : 1
    const stepsPenalty = steps * 15 * stairsMultiplier
    score -= stepsPenalty
    warnings.push(`Route contains ${steps} flight(s) of stairs or steps`)
    breakdown.push({
      name: 'Stairs / Steps Penalty',
      points: -stepsPenalty,
      reason: `${steps} staircase barrier(s) detected (${stairsMultiplier}x penalty applied)`,
    })
  }

  // 4. Barrier reports evaluation with normalization
  // Verified count at 100% weight, pending/unverified count at 40% weight
  let rawBarrierPenalty = 0
  let verifiedBarriers = 0
  let unverifiedBarriers = 0

  for (const b of input.barriers) {
    if (b.status === 'resolved' || b.status === 'rejected') continue

    const baseWeight = BARRIER_PENALTIES[b.category] || 10
    const weight = b.status === 'verified' ? baseWeight : baseWeight * 0.4

    rawBarrierPenalty += weight

    if (b.status === 'verified') {
      verifiedBarriers++
      warnings.push(`Verified obstacle: ${b.category.replace('_', ' ')}`)
    } else {
      unverifiedBarriers++
      warnings.push(`Unverified community report: ${b.category.replace('_', ' ')}`)
    }
  }

  // Density normalization per kilometer so longer routes aren't disproportionately penalized
  const routeKm = Math.max(0.2, input.distance_m / 1000)
  const densityFactor = Math.min(1.5, Math.max(0.6, 1 / Math.sqrt(routeKm)))
  const normalizedPenalty = Math.round(rawBarrierPenalty * densityFactor)

  if (normalizedPenalty > 0) {
    score -= normalizedPenalty
    breakdown.push({
      name: 'Barrier Reports Penalty',
      points: -normalizedPenalty,
      reason: `${verifiedBarriers} verified and ${unverifiedBarriers} unverified barriers (normalized for route distance)`,
    })
  }

  // Clamp final score strictly between 0 and 100
  const finalScore = Math.max(0, Math.min(100, Math.round(score)))
  const recommended = finalScore >= 70 && steps === 0

  return {
    score: finalScore,
    distance_m: input.distance_m,
    duration_s: input.duration_s,
    barrier_count: verifiedBarriers + unverifiedBarriers,
    warnings,
    breakdown,
    recommended,
  }
}
