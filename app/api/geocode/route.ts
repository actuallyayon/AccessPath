import { NextRequest, NextResponse } from 'next/server'

// In-memory LRU / Simple cache for Nominatim results (respecting Nominatim usage policy)
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL_MS = 1000 * 60 * 30 // 30 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!q && (!lat || !lon)) {
    return NextResponse.json({ error: 'Missing query or coordinates' }, { status: 400 })
  }

  // Handle Reverse Geocoding
  if (lat && lon) {
    const cacheKey = `rev_${lat}_${lon}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data)
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'AccessPath-Urban-Mobility-Platform/1.0 (contact@accesspath.local)',
            'Accept-Language': 'en',
          },
        }
      )
      if (!res.ok) throw new Error('Nominatim reverse lookup failed')
      const data = await res.json()
      cache.set(cacheKey, { data, timestamp: Date.now() })
      return NextResponse.json(data)
    } catch (err: unknown) {
      return NextResponse.json(
        { error: 'Failed to reverse geocode', details: (err as Error).message },
        { status: 502 }
      )
    }
  }

  // Handle Search / Autocomplete Forward Geocoding
  const cacheKey = `search_${q?.toLowerCase()}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data)
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        q!
      )}&limit=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'AccessPath-Urban-Mobility-Platform/1.0 (contact@accesspath.local)',
          'Accept-Language': 'en',
        },
      }
    )

    if (!res.ok) throw new Error('Nominatim forward search failed')
    const data = await res.json()
    cache.set(cacheKey, { data, timestamp: Date.now() })
    return NextResponse.json(data)
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Failed to geocode query', details: (err as Error).message },
      { status: 502 }
    )
  }
}
