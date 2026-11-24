// @ts-ignore
import { calculateRouteScore } from './score.ts'
// @ts-ignore
import type { BarrierItem, RouteScoreInput } from './score.ts'

function runTests() {
  console.log('--- Running Route Accessibility Scoring Unit Tests ---')
  let passed = 0
  let total = 0

  function assert(condition: boolean, desc: string) {
    total++
    if (condition) {
      console.log(`✓ PASS: ${desc}`)
      passed++
    } else {
      console.error(`✗ FAIL: ${desc}`)
    }
  }

  // Test 1: Ideal route baseline
  const idealRoute: RouteScoreInput = {
    distance_m: 1000,
    duration_s: 900,
    barriers: [],
  }
  const res1 = calculateRouteScore(idealRoute)
  assert(res1.score === 100, 'Baseline route has score 100')
  assert(res1.recommended === true, 'Baseline route is recommended')

  // Test 2: Ramps and elevators bonus
  const boostedRoute: RouteScoreInput = {
    distance_m: 1000,
    duration_s: 900,
    ramps_count: 2,
    elevators_count: 1,
    barriers: [],
    shortest_alt_distance_m: 1000,
  }
  const res2 = calculateRouteScore(boostedRoute)
  assert(res2.score === 100, 'Clamped to max 100 even with bonuses')
  assert(res2.breakdown.some(b => b.name === 'Ramps Available'), 'Breakdown includes ramp bonus')

  // Test 3: Verified barriers penalty
  const barrierRoute: RouteScoreInput = {
    distance_m: 1000,
    duration_s: 900,
    barriers: [
      { id: '1', category: 'broken_footpath', status: 'verified' },
      { id: '2', category: 'missing_ramp', status: 'verified' },
    ],
  }
  const res3 = calculateRouteScore(barrierRoute)
  assert(res3.score < 100, 'Verified barriers decrease score')
  assert(res3.warnings.length === 2, 'Warnings generated for each barrier')

  // Test 4: Unverified barriers count at 40% weight
  const unverifiedBarrierRoute: RouteScoreInput = {
    distance_m: 1000,
    duration_s: 900,
    barriers: [
      { id: '1', category: 'broken_footpath', status: 'pending' },
    ],
  }
  const res4 = calculateRouteScore(unverifiedBarrierRoute)
  assert(res4.score > res3.score, 'Unverified barrier has lower penalty than verified barrier')

  // Test 5: Avoid stairs preference multiplier
  const stairsRoute: RouteScoreInput = {
    distance_m: 1000,
    duration_s: 900,
    steps_count: 1,
    barriers: [],
    preferences: { avoid_stairs: true },
  }
  const res5 = calculateRouteScore(stairsRoute)
  assert(res5.score <= 70, 'Stairs with avoid_stairs penalty reduces score significantly')
  assert(res5.recommended === false, 'Route with stairs is not recommended for wheelchair users')

  console.log(`\nTests finished: ${passed}/${total} passed.`)
  if (passed !== total) process.exit(1)
}

runTests()
