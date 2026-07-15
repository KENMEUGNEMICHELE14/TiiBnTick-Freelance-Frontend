import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const announcement = await db.announcement.update({
    where: { id },
    data: { status: 'PUBLISHED' },
  })

  return NextResponse.json({
    id: announcement.id,
    clientId: announcement.clientId,
    title: announcement.title,
    description: announcement.description,
    status: announcement.status,
    createdAt: announcement.createdAt.toISOString(),
    updatedAt: announcement.updatedAt.toISOString(),
    recipientFirstName: announcement.recipientFirstName,
    recipientLastName: announcement.recipientLastName,
    recipientEmail: announcement.recipientEmail,
    recipientPhone: announcement.recipientPhone,
    shipperFirstName: announcement.shipperFirstName,
    shipperLastName: announcement.shipperLastName,
    shipperEmail: announcement.shipperEmail,
    shipperPhone: announcement.shipperPhone,
    amount: announcement.amount,
    pickupAddress: typeof announcement.pickupAddress === 'string' ? JSON.parse(announcement.pickupAddress) : announcement.pickupAddress,
    deliveryAddress: typeof announcement.deliveryAddress === 'string' ? JSON.parse(announcement.deliveryAddress) : announcement.deliveryAddress,
    packet: typeof announcement.packet === 'string' ? JSON.parse(announcement.packet) : announcement.packet,
    distance: announcement.distance,
    duration: announcement.duration,
    transportMethod: announcement.transportMethod,
    paymentMethod: announcement.paymentMethod,
    assignedDeliveryPersonId: announcement.assignedDeliveryPersonId ?? undefined,
    assignedDeliveryPersonFirstName: undefined,
    assignedDeliveryPersonLastName: undefined,
    assignedDeliveryPersonEmail: undefined,
    assignedDeliveryPersonPhone: undefined,
  })
}