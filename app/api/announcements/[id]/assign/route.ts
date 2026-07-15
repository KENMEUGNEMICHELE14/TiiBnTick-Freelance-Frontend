import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { deliveryPersonId } = await request.json()

  // Update or create subscription to ACCEPTED
  await db.subscription.upsert({
    where: {
      announcementId_deliveryPersonId: {
        announcementId: id,
        deliveryPersonId,
      },
    },
    update: { status: 'ACCEPTED' },
    create: {
      announcementId: id,
      deliveryPersonId,
      status: 'ACCEPTED',
    },
  })

  const announcement = await db.announcement.update({
    where: { id },
    data: {
      status: 'ASSIGNED',
      assignedDeliveryPersonId: deliveryPersonId,
    },
  })

  const assignedPerson = await db.user.findUnique({
    where: { id: deliveryPersonId },
    select: { firstName: true, lastName: true, email: true, phone: true },
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
    assignedDeliveryPersonFirstName: assignedPerson?.firstName,
    assignedDeliveryPersonLastName: assignedPerson?.lastName,
    assignedDeliveryPersonEmail: assignedPerson?.email,
    assignedDeliveryPersonPhone: assignedPerson?.phone,
  })
}