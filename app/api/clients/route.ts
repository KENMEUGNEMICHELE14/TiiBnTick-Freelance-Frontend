import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const user = await db.user.create({
    data: {
      email: body.email,
      password: body.password || 'password123',
      firstName: body.firstName || '',
      lastName: body.lastName || '',
      phone: body.phone || '',
      userType: 'CLIENT',
      nationalId: body.nationalId || null,
    },
  })

  return NextResponse.json(user)
}