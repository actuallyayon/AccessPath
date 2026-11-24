'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'

interface MiniMapProps {
  lat: number
  lng: number
  name: string
}

export default function MiniMap({ lat, lng, name }: MiniMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return
    if (mapInstance.current) return

    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 15,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    const marker = L.marker([lat, lng]).addTo(map)
    marker.bindPopup(`<strong>${name}</strong>`).openPopup()

    mapInstance.current = map

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [lat, lng, name])

  return (
    <div
      ref={mapRef}
      className="w-full h-64 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 z-0"
    />
  )
}
