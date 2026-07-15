import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const subscriptions = await db.subscription.findMany({
    where: { announcementId: id },
    include: {
      deliveryPerson: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          rating: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const result = subscriptions.map((s) => ({
    subscriptionId: s.id,
    deliveryPersonId: s.deliveryPersonId,
    firstName: s.deliveryPerson.firstName,
    lastName: s.deliveryPerson.lastName,
    email: s.deliveryPerson.email,
    phone: s.deliveryPerson.phone,
    rating: s.deliveryPerson.rating,
    status: s.status,
    createdAt: s.createdAt.toISOString(),
  }))

  return NextResponse.json(result)
}