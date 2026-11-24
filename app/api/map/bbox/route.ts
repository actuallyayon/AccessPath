import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const minLng = parseFloat(searchParams.get('minLng') || '0')
  const minLat = parseFloat(searchParams.get('minLat') || '0')
  const maxLng = parseFloat(searchParams.get('maxLng') || '0')
  const maxLat = parseFloat(searchParams.get('maxLat') || '0')
  const zoom = parseInt(searchParams.get('zoom') || '14', 10)

  const supabase = await createClient()

  try {
    const { data, error } = await supabase.rpc('locations_in_bbox', {
      min_lng: minLng,
      min_lat: minLat,
      max_lng: maxLng,
      max_lat: maxLat,
      zoom_level: zoom,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'BBox fetch failed', details: (err as Error).message },
      { status: 500 }
    )
  }
}
