import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { deliveryPersonId } = await request.json()

  const existing = await db.subscription.findUnique({
    where: {
      announcementId_deliveryPersonId: {
        announcementId: id,
        deliveryPersonId,
      },
    },
  })

  if (existing) {
    return NextResponse.json({ message: 'Already subscribed' }, { status: 409 })
  }

  await db.subscription.create({
    data: {
      announcementId: id,
      deliveryPersonId,
      status: 'PENDING',
    },
  })

  return NextResponse.json({ success: true, message: 'Subscribed successfully' })
}