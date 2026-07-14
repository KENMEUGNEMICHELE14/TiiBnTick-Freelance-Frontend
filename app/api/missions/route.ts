import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const missions = await db.mission.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const result = missions.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    status: m.status,
    amount: m.amount,
    shipperFirstName: m.shipperFirstName,
    shipperLastName: m.shipperLastName,
    shipperEmail: m.shipperEmail,
    pickupAddress: typeof m.pickupAddress === 'string' ? JSON.parse(m.pickupAddress) : m.pickupAddress,
    deliveryAddress: typeof m.deliveryAddress === 'string' ? JSON.parse(m.deliveryAddress) : m.deliveryAddress,
    packet: typeof m.packet === 'string' ? JSON.parse(m.packet) : m.packet,
    distance: m.distance,
    duration: m.duration,
    transportMethod: m.transportMethod,
    paymentMethod: m.paymentMethod,
    assignedToId: m.assignedToId ?? null,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  }))

  return NextResponse.json(result)
}