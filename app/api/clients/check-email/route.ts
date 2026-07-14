import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')

  if (!email) {
    return NextResponse.json(false)
  }

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  })

  return NextResponse.json(!!user)
}