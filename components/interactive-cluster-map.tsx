'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet.markercluster'
import { Navigation, Layers, Compass, Loader2 } from 'lucide-react'

interface MapViewProps {
  initialLat?: number
  initialLng?: number
  initialZoom?: number
}

interface CityOption {
  name: string
  lat: number
  lng: number
}

const CITIES: CityOption[] = [
  { name: 'Dhaka', lat: 23.8103, lng: 90.4125 },
  { name: 'Khulna', lat: 22.8456, lng: 89.5403 },
  { name: 'Chittagong', lat: 22.3569, lng: 91.7832 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
]

export default function InteractiveClusterMap({
  initialLat = 23.8103,
  initialLng = 90.4125,
  initialZoom = 13,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeCity, setActiveCity] = useState('Dhaka')

  const setCity = (lat: number, lng: number, name: string) => {
    setActiveCity(name)
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 13)
    }
  }

  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapRef.current) return

    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })

    const map = L.map(mapContainerRef.current).setView(
      [initialLat, initialLng],
      initialZoom
    )

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    const markers = L.markerClusterGroup({
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    })

    map.addLayer(markers)
    mapRef.current = map
    clusterGroupRef.current = markers

    const fetchBBoxPoints = async () => {
      setLoading(true)
      const bounds = map.getBounds()
      const zoom = map.getZoom()

      try {
        const res = await fetch(
          `/api/map/bbox?minLng=${bounds.getWest()}&minLat=${bounds.getSouth()}&maxLng=${bounds.getEast()}&maxLat=${bounds.getNorth()}&zoom=${zoom}`
        )
        if (res.ok) {
          const data = await res.json()
          markers.clearLayers()

          if (Array.isArray(data)) {
            data.forEach((item) => {
              if (item.type === 'point') {
                const marker = L.marker([item.lat, item.lng])
                marker.bindPopup(`
                  <div style="min-width: 170px; font-family: sans-serif; padding: 2px;">
                    <strong style="font-size: 13px; color: #0f172a;">${item.name}</strong>
                    <div style="margin-top: 6px; font-size: 11px; display: flex; align-items: center; justify-content: space-between;">
                      <span style="color: #64748b;">Accessibility:</span>
                      <strong style="color: #059669; background: #ecfdf5; padding: 2px 6px; border-radius: 6px;">${Math.round(item.accessibility_score)} / 100</strong>
                    </div>
                    <div style="margin-top: 8px;">
                      <a href="/locations/${item.id}" style="color: #059669; font-weight: 600; text-decoration: none; font-size: 11px;">View Place Details →</a>
                    </div>
                  </div>
                `)
                markers.addLayer(marker)
              } else if (item.type === 'cluster') {
                const clusterMarker = L.circleMarker([item.lat, item.lng], {
                  radius: Math.min(26, Math.max(12, item.count / 10)),
                  color: '#059669',
                  fillColor: '#10b981',
                  fillOpacity: 0.8,
                  weight: 2,
                })
                clusterMarker.bindPopup(`
                  <div style="font-family: sans-serif;">
                    <strong>Cluster: ${item.count} venues</strong><br/>
                    Avg Score: <strong>${item.avg_score} / 100</strong>
                  </div>
                `)
                markers.addLayer(clusterMarker)
              }
            })
          }
        }
      } catch (err) {
        console.error('Failed to load bbox markers:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBBoxPoints()

    map.on('moveend', () => {
      fetchBBoxPoints()
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [initialLat, initialLng, initialZoom])

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col">
      {/* Floating Glass Pill Switcher positioned neatly at top-center */}
      <div className="absolute top-4 inset-x-0 z-[400] flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto p-1.5 rounded-full glass shadow-xl flex items-center gap-1.5 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 font-bold text-neutral-700 dark:text-neutral-300">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pilot Cities:</span>
          </div>
          {CITIES.map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => setCity(city.lat, city.lng, city.name)}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                activeCity === city.name
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Glass Loading Indicator */}
      {loading && (
        <div className="absolute top-4 right-4 z-[400] glass px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Syncing Viewport...</span>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full flex-1 z-0" />
    </div>
  )
}
