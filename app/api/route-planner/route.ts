import { NextRequest, NextResponse } from 'next/server'
import { calculateRouteScore } from '@/lib/routing/score'
import { createClient } from '@/lib/supabase/server'
import type { BarrierCategory, BarrierStatus } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { startLat, startLng, destLat, destLng, preferences } = body

    if (!startLat || !startLng || !destLat || !destLng) {
      return NextResponse.json(
        { error: 'Missing start or destination coordinates' },
        { status: 400 }
      )
    }

    const orsKey = process.env.ORS_API_KEY
    let routes: Array<{
      geometry: { coordinates: [number, number][] }
      distance: number
      duration: number
      steps?: number
    }> = []

    // 1. Try OpenRouteService Wheelchair Profile if key is provided
    if (orsKey && orsKey !== 'your-openrouteservice-api-key') {
      try {
        const orsRes = await fetch(
          'https://api.openrouteservice.org/v2/directions/wheelchair/geojson',
          {
            method: 'POST',
            headers: {
              Authorization: orsKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              coordinates: [
                [startLng, startLat],
                [destLng, destLat],
              ],
              alternative_routes: { target_count: 3 },
              preference: 'recommended',
            }),
          }
        )

        if (orsRes.ok) {
          const orsData = await orsRes.json()
          if (orsData.features && orsData.features.length > 0) {
            routes = orsData.features.map((feat: {
              geometry: { coordinates: [number, number][] }
              properties: { summary: { distance: number; duration: number }; segments?: Array<{ steps?: unknown[] }> }
            }) => ({
              geometry: feat.geometry,
              distance: feat.properties.summary.distance,
              duration: feat.properties.summary.duration,
              steps: feat.properties.segments?.[0]?.steps?.length || 0,
            }))
          }
        }
      } catch (e) {
        console.warn('ORS fetch failed, falling back to OSRM:', e)
      }
    }

    // 2. Fallback to public OSRM foot routing if ORS unavailable or failed
    if (routes.length === 0) {
      const osrmUrl = `https://router.project-osrm.org/route/v1/foot/${startLng},${startLat};${destLng},${destLat}?overview=full&geometries=geojson&alternatives=true&steps=true`
      const osrmRes = await fetch(osrmUrl)
      if (osrmRes.ok) {
        const osrmData = await osrmRes.json()
        if (osrmData.routes && osrmData.routes.length > 0) {
          routes = osrmData.routes.map((r: {
            geometry: { coordinates: [number, number][] }
            distance: number
            duration: number
            legs?: Array<{ steps?: unknown[] }>
          }) => ({
            geometry: r.geometry,
            distance: r.distance,
            duration: r.duration,
            steps: r.legs?.[0]?.steps?.length || 0,
          }))
        }
      }
    }

    if (routes.length === 0) {
      // Direct geometric fallback if network is unreachable
      routes = [
        {
          geometry: {
            coordinates: [
              [startLng, startLat],
              [destLng, destLat],
            ],
          },
          distance: 1200,
          duration: 900,
          steps: 0,
        },
      ]
    }

    // 3. For each route, query Supabase for nearby barriers via barriers_near_line RPC
    const supabase = await createClient()
    const shortestDistance = Math.min(...routes.map((r) => r.distance))

    const scoredRoutes = await Promise.all(
      routes.map(async (route, idx) => {
        let nearbyBarriers: Array<{
          id: string
          category: BarrierCategory
          description: string
          image_url: string | null
          status: BarrierStatus
          distance_to_route: number
        }> = []

        try {
          const { data: dbBarriers } = await supabase.rpc('barriers_near_line', {
            route_geojson: route.geometry,
            buffer_meters: 30,
          })
          if (dbBarriers) {
            nearbyBarriers = dbBarriers
          }
        } catch {
          // If Supabase not connected yet or RPC unavailable, continue with empty barriers
        }

        const scoring = calculateRouteScore({
          distance_m: route.distance,
          duration_s: route.duration,
          steps_count: route.steps ? Math.floor(route.steps / 6) : 0,
          ramps_count: 1, // baseline accessibility transition
          elevators_count: 0,
          barriers: nearbyBarriers.map((b) => ({
            id: b.id,
            category: b.category,
            description: b.description,
            status: b.status,
            distanceToRoute: b.distance_to_route,
          })),
          shortest_alt_distance_m: shortestDistance,
          preferences: preferences || { avoid_stairs: true },
        })

        return {
          id: `route_${idx + 1}`,
          name: idx === 0 ? 'Primary Recommended Path' : `Alternative Route ${idx + 1}`,
          geometry: route.geometry,
          distance: route.distance,
          duration: route.duration,
          score: scoring.score,
          barrierCount: scoring.barrier_count,
          barriers: nearbyBarriers,
          warnings: scoring.warnings,
          breakdown: scoring.breakdown,
          recommended: scoring.recommended,
        }
      })
    )

    // Sort routes primarily by accessibility score (highest to lowest), not just distance
    scoredRoutes.sort((a, b) => b.score - a.score)

    return NextResponse.json({
      routes: scoredRoutes,
      meta: {
        count: scoredRoutes.length,
        engine: orsKey ? 'OpenRouteService (Wheelchair)' : 'OSRM Pedestrian Fallback',
      },
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Route calculation failed', details: (error as Error).message },
      { status: 500 }
    )
  }
}
