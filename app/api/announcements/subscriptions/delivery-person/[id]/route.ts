import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const subscriptions = await db.subscription.findMany({
    where: { deliveryPersonId: id },
    include: {
      announcement: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const result = subscriptions.map((s) => ({
    id: s.announcement.id,
    clientId: s.announcement.clientId,
    title: s.announcement.title,
    description: s.announcement.description,
    status: s.announcement.status,
    subscriptionStatus: s.status,
    createdAt: s.announcement.createdAt.toISOString(),
    updatedAt: s.announcement.updatedAt.toISOString(),
    recipientFirstName: s.announcement.recipientFirstName,
    recipientLastName: s.announcement.recipientLastName,
    recipientEmail: s.announcement.recipientEmail,
    recipientPhone: s.announcement.recipientPhone,
    shipperFirstName: s.announcement.shipperFirstName,
    shipperLastName: s.announcement.shipperLastName,
    shipperEmail: s.announcement.shipperEmail,
    shipperPhone: s.announcement.shipperPhone,
    amount: s.announcement.amount,
    pickupAddress: typeof s.announcement.pickupAddress === 'string' ? JSON.parse(s.announcement.pickupAddress) : s.announcement.pickupAddress,
    deliveryAddress: typeof s.announcement.deliveryAddress === 'string' ? JSON.parse(s.announcement.deliveryAddress) : s.announcement.deliveryAddress,
    packet: typeof s.announcement.packet === 'string' ? JSON.parse(s.announcement.packet) : s.announcement.packet,
    distance: s.announcement.distance,
    duration: s.announcement.duration,
    transportMethod: s.announcement.transportMethod,
    paymentMethod: s.announcement.paymentMethod,
    assignedDeliveryPersonId: s.announcement.assignedDeliveryPersonId ?? undefined,
    assignedDeliveryPersonFirstName: undefined,
    assignedDeliveryPersonLastName: undefined,
    assignedDeliveryPersonEmail: undefined,
    assignedDeliveryPersonPhone: undefined,
  }))

  return NextResponse.json(result)
}