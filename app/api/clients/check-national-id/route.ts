import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const nationalId = request.nextUrl.searchParams.get('nationalId')

  if (!nationalId) {
    return NextResponse.json(false)
  }

  const user = await db.user.findFirst({
    where: { nationalId },
    select: { id: true },
  })

  return NextResponse.json(!!user)
}