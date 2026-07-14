import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat1 = searchParams.get('lat1')
  const lon1 = searchParams.get('lon1')
  const lat2 = searchParams.get('lat2')
  const lon2 = searchParams.get('lon2')
  const profile = searchParams.get('profile') || 'driving'

  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 })
  }

  const osrmProfile = profile === 'bike' ? 'cycling' : profile === 'foot' ? 'walking' : 'driving'
  const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) {
      return NextResponse.json({ error: 'Routing service error' }, { status: 502 })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Routing failed' }, { status: 502 })
  }
}