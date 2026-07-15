import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const user = await db.user.findUnique({
    where: { email },
  })

  if (!user || user.password !== password) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }

  return NextResponse.json({
    token: 'local-token-' + user.id,
    id: user.id,
    lastName: user.lastName,
    firstName: user.firstName,
    email: user.email,
    phone: user.phone,
    userType: user.userType,
    isActive: true,
    clientId: user.userType === 'CLIENT' ? user.id : undefined,
    deliveryPersonId: user.userType === 'LIVREUR' ? user.id : undefined,
    rating: user.rating,
    totalDeliveries: user.totalDeliveries,
  })
}