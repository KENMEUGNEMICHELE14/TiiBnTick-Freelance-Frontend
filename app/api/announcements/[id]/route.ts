import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function formatAnnouncement(a: any, assignedPerson?: any) {
  return {
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
    assignedDeliveryPersonFirstName: assignedPerson?.firstName,
    assignedDeliveryPersonLastName: assignedPerson?.lastName,
    assignedDeliveryPersonEmail: assignedPerson?.email,
    assignedDeliveryPersonPhone: assignedPerson?.phone,
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const announcement = await db.announcement.findUnique({ where: { id } })

  if (!announcement) {
    return NextResponse.json({ message: 'Announcement not found' }, { status: 404 })
  }

  let assignedPerson: any = null
  if (announcement.assignedDeliveryPersonId) {
    assignedPerson = await db.user.findUnique({
      where: { id: announcement.assignedDeliveryPersonId },
      select: { firstName: true, lastName: true, email: true, phone: true },
    })
  }

  return NextResponse.json(formatAnnouncement(announcement, assignedPerson))
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  const data: any = {}
  if (body.title !== undefined) data.title = body.title
  if (body.description !== undefined) data.description = body.description
  if (body.status !== undefined) data.status = body.status
  if (body.amount !== undefined) data.amount = body.amount
  if (body.recipientFirstName !== undefined) data.recipientFirstName = body.recipientFirstName
  if (body.recipientLastName !== undefined) data.recipientLastName = body.recipientLastName
  if (body.recipientEmail !== undefined) data.recipientEmail = body.recipientEmail
  if (body.recipientPhone !== undefined) data.recipientPhone = body.recipientPhone
  if (body.shipperFirstName !== undefined) data.shipperFirstName = body.shipperFirstName
  if (body.shipperLastName !== undefined) data.shipperLastName = body.shipperLastName
  if (body.shipperEmail !== undefined) data.shipperEmail = body.shipperEmail
  if (body.shipperPhone !== undefined) data.shipperPhone = body.shipperPhone
  if (body.pickupAddress !== undefined) data.pickupAddress = JSON.stringify(body.pickupAddress)
  if (body.deliveryAddress !== undefined) data.deliveryAddress = JSON.stringify(body.deliveryAddress)
  if (body.packet !== undefined) data.packet = JSON.stringify(body.packet)
  if (body.distance !== undefined) data.distance = body.distance
  if (body.duration !== undefined) data.duration = body.duration
  if (body.transportMethod !== undefined) data.transportMethod = body.transportMethod
  if (body.paymentMethod !== undefined) data.paymentMethod = body.paymentMethod

  const announcement = await db.announcement.update({
    where: { id },
    data,
  })

  let assignedPerson: any = null
  if (announcement.assignedDeliveryPersonId) {
    assignedPerson = await db.user.findUnique({
      where: { id: announcement.assignedDeliveryPersonId },
      select: { firstName: true, lastName: true, email: true, phone: true },
    })
  }

  return NextResponse.json(formatAnnouncement(announcement, assignedPerson))
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  await db.subscription.deleteMany({ where: { announcementId: id } })
  await db.announcement.delete({ where: { id } })

  return NextResponse.json({ success: true })
}