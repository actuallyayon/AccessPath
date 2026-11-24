'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { Navigation2, AlertTriangle, ShieldCheck, CheckCircle2, Sliders, Loader2, ArrowRight } from 'lucide-react'
import { formatDistance, formatScore } from '@/lib/utils'

interface RouteResult {
  id: string
  name: string
  geometry: { coordinates: [number, number][] }
  distance: number
  duration: number
  score: number
  barrierCount: number
  warnings: string[]
  breakdown: Array<{ name: string; points: number; reason: string }>
  recommended: boolean
}

export default function RoutePlanner() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const routeLayerRef = useRef<L.GeoJSON | null>(null)

  const [startQuery, setStartQuery] = useState('Dhanmondi, Dhaka')
  const [startLat, setStartLat] = useState(23.7461)
  const [startLng, setStartLng] = useState(90.3742)

  const [destQuery, setDestQuery] = useState('Shahbag, Dhaka')
  const [destLat, setDestLat] = useState(23.7388)
  const [destLng, setDestLng] = useState(90.3956)

  const [avoidStairs, setAvoidStairs] = useState(true)
  const [maxIncline, setMaxIncline] = useState(8)

  const [loading, setLoading] = useState(false)
  const [routes, setRoutes] = useState<RouteResult[]>([])
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)
  const [routingEngine, setRoutingEngine] = useState<string>('')

  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapRef.current) return

    const map = L.map(mapContainerRef.current).setView([23.7425, 90.3849], 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    if (routeLayerRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current)
      routeLayerRef.current = null
    }

    if (routes.length === 0) return

    const selected = routes.find((r) => r.id === selectedRouteId) || routes[0]

    const geoJsonData = {
      type: 'Feature' as const,
      properties: {},
      geometry: selected.geometry,
    }

    const layer = L.geoJSON(geoJsonData, {
      style: {
        color: selected.score >= 80 ? '#059669' : selected.score >= 50 ? '#d97706' : '#e11d48',
        weight: 6,
        opacity: 0.9,
      },
    })

    layer.addTo(mapRef.current)
    routeLayerRef.current = layer

    try {
      mapRef.current.fitBounds(layer.getBounds(), { padding: [50, 50] })
    } catch {}
  }, [routes, selectedRouteId])

  const handleCalculateRoute = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/route-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startLat,
          startLng,
          destLat,
          destLng,
          preferences: { avoid_stairs: avoidStairs, max_incline_deg: maxIncline },
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setRoutes(data.routes || [])
        if (data.routes && data.routes.length > 0) {
          setSelectedRouteId(data.routes[0].id)
        }
        setRoutingEngine(data.meta?.engine || '')
      }
    } catch (err) {
      console.error('Route calculation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleCalculateRoute()
  }, [])

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0]

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* Left Planning & Results Sidebar */}
      <div className="w-full lg:w-[440px] p-5 overflow-y-auto border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-10 flex flex-col space-y-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Accessibility Route Planner</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Routes ranked by physical accessibility scores, stair avoidance, and sidewalk barrier hazards.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-3 bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
          <div>
            <label className="block text-[11px] font-semibold uppercase text-neutral-500 mb-1">
              Start Origin
            </label>
            <input
              type="text"
              value={startQuery}
              onChange={(e) => setStartQuery(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-neutral-500 mb-1">
              Destination
            </label>
            <input
              type="text"
              value={destQuery}
              onChange={(e) => setDestQuery(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
            />
          </div>

          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={avoidStairs}
                onChange={(e) => setAvoidStairs(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Avoid Stairs & High Curbs (2x Penalty)</span>
            </label>
          </div>

          <button
            onClick={handleCalculateRoute}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Computing Accessible Alternatives...</span>
              </>
            ) : (
              <span>Find Accessible Routes</span>
            )}
          </button>
        </div>

        {/* Alternatives List */}
        {routes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                {routes.length} Alternatives Evaluated
              </span>
              <span className="text-[10px] text-neutral-400">{routingEngine}</span>
            </div>

            <div className="space-y-2">
              {routes.map((route) => {
                const isSelected = route.id === selectedRouteId
                const scoreInfo = formatScore(route.score)
                return (
                  <button
                    key={route.id}
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/30'
                        : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs">{route.name}</span>
                        {route.recommended && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Recommended
                          </span>
                        )}
                      </div>

                      <span className={`px-2 py-0.5 rounded-md text-xs font-black ${scoreInfo.badgeBg}`}>
                        {route.score} / 100
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      <span>{formatDistance(route.distance)}</span>
                      <span>•</span>
                      <span>{Math.round(route.duration / 60)} mins</span>
                      {route.barrierCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-rose-600 font-semibold">
                            {route.barrierCount} obstacle(s)
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Selected Route Breakdown */}
        {selectedRoute && (
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 space-y-3 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Score Breakdown: {selectedRoute.name}
            </h3>

            <div className="space-y-1.5">
              {selectedRoute.breakdown.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between text-[11px]">
                  <div>
                    <strong className="text-neutral-800 dark:text-neutral-200">{item.name}</strong>
                    <div className="text-[10px] text-neutral-500">{item.reason}</div>
                  </div>
                  <span
                    className={`font-mono font-bold shrink-0 ml-2 ${
                      item.points >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {item.points > 0 ? `+${item.points}` : item.points}
                  </span>
                </div>
              ))}
            </div>

            {selectedRoute.warnings.length > 0 && (
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Accessibility Warnings Along Path:
                </span>
                {selectedRoute.warnings.map((w, wi) => (
                  <div key={wi} className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Map Canvas */}
      <div className="flex-1 h-full relative">
        <div ref={mapContainerRef} className="w-full h-full z-0" />
      </div>
    </div>
  )
}
