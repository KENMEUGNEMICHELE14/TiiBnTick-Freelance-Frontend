import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const user = await db.user.findUnique({
    where: { id, userType: 'LIVREUR' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      rating: true,
      totalDeliveries: true,
      city: true,
      commercialName: true,
      memberSince: true,
      street: true,
      nationalId: true,
      password: true,
    },
  })

  if (!user) {
    return NextResponse.json({ message: 'Delivery person not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...user,
    memberSince: user.memberSince.toISOString(),
  })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  const data: any = {}
  if (body.firstName !== undefined) data.firstName = body.firstName
  if (body.lastName !== undefined) data.lastName = body.lastName
  if (body.email !== undefined) data.email = body.email
  if (body.phone !== undefined) data.phone = body.phone
  if (body.password !== undefined) data.password = body.password
  if (body.commercialName !== undefined) data.commercialName = body.commercialName
  if (body.city !== undefined) data.city = body.city
  if (body.street !== undefined) data.street = body.street
  if (body.nationalId !== undefined) data.nationalId = body.nationalId

  const user = await db.user.update({
    where: { id },
    data,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      rating: true,
      totalDeliveries: true,
      city: true,
      commercialName: true,
      memberSince: true,
      street: true,
      nationalId: true,
      password: true,
    },
  })

  return NextResponse.json({
    ...user,
    memberSince: user.memberSince.toISOString(),
  })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  await db.user.delete({ where: { id } })

  return NextResponse.json({ success: true })
}