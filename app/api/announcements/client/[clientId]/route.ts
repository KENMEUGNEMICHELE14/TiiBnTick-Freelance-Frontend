import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params

  const announcements = await db.announcement.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
  })

  const result = announcements.map((a) => ({
    id: a.id,
    clientId: a.clientId,
    title: a.title,
    description: a.description,
    status: a.status,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    recipientFirstName: a.recipientFirstName,
    recipientLastName: a.recipientLastName,
    recipientEmail: a.recipientEmail,
    recipientPhone: a.recipientPhone,
    shipperFirstName: a.shipperFirstName,
    shipperLastName: a.shipperLastName,
    shipperEmail: a.shipperEmail,
    shipperPhone: a.shipperPhone,
    amount: a.amount,
    pickupAddress: typeof a.pickupAddress === 'string' ? JSON.parse(a.pickupAddress) : a.pickupAddress,
    deliveryAddress: typeof a.deliveryAddress === 'string' ? JSON.parse(a.deliveryAddress) : a.deliveryAddress,
    packet: typeof a.packet === 'string' ? JSON.parse(a.packet) : a.packet,
    distance: a.distance,
    duration: a.duration,
    transportMethod: a.transportMethod,
    paymentMethod: a.paymentMethod,
    assignedDeliveryPersonId: a.assignedDeliveryPersonId ?? undefined,
    assignedDeliveryPersonFirstName: undefined,
    assignedDeliveryPersonLastName: undefined,
    assignedDeliveryPersonEmail: undefined,
    assignedDeliveryPersonPhone: undefined,
  }))

  return NextResponse.json(result)
}