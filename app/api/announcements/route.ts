import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const announcements = await db.announcement.findMany({
    where: { status: 'PUBLISHED' },
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

export async function POST(request: NextRequest) {
  const body = await request.json()

  const announcement = await db.announcement.create({
    data: {
      clientId: body.clientId,
      title: body.title,
      description: body.description || '',
      status: body.autoPublish ? 'PUBLISHED' : 'DRAFT',
      amount: body.amount || 0,
      recipientFirstName: body.recipientFirstName || '',
      recipientLastName: body.recipientLastName || '',
      recipientEmail: body.recipientEmail || '',
      recipientPhone: body.recipientPhone || '',
      shipperFirstName: body.shipperFirstName || '',
      shipperLastName: body.shipperLastName || '',
      shipperEmail: body.shipperEmail || '',
      shipperPhone: body.shipperPhone || '',
      pickupAddress: body.pickupAddress ? JSON.stringify(body.pickupAddress) : '{}',
      deliveryAddress: body.deliveryAddress ? JSON.stringify(body.deliveryAddress) : '{}',
      packet: body.packet ? JSON.stringify(body.packet) : '{}',
      distance: body.distance,
      duration: body.duration,
      transportMethod: body.transportMethod || 'driving',
      paymentMethod: body.paymentMethod || 'CASH',
    },
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