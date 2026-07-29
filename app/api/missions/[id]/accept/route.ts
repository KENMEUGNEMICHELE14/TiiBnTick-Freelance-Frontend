import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // On récupère l'ID du freelance de la même manière que pour les annonces
  const body = await request.json()
  const { freelancerId } = body

  if (!freelancerId) {
    return NextResponse.json({ error: 'ID du freelance requis' }, { status: 400 })
  }

  const mission = await db.mission.findUnique({ where: { id } })

  if (!mission) {
    return NextResponse.json({ error: 'Mission non trouvée' }, { status: 404 })
  }

  if (mission.status === 'ASSIGNED') {
    return NextResponse.json({ error: 'Mission déjà acceptée' }, { status: 400 })
  }

  const updated = await db.mission.update({
    where: { id },
    data: {
      status: 'ASSIGNED',
      assignedToId: freelancerId // On assigne officiellement la mission à cet utilisateur
    },
  })

  // On récupère les infos du freelance assigné pour le renvoyer, copie de la logique d'annonce
  const assignedPerson = await db.user.findUnique({
    where: { id: freelancerId },
    select: { firstName: true, lastName: true, email: true, phone: true },
  })

  return NextResponse.json({
    id: updated.id,
    title: updated.title,
    description: updated.description,
    status: updated.status,
    amount: updated.amount,
    shipperFirstName: updated.shipperFirstName,
    shipperLastName: updated.shipperLastName,
    shipperEmail: updated.shipperEmail,
    pickupAddress: typeof updated.pickupAddress === 'string' ? JSON.parse(updated.pickupAddress) : updated.pickupAddress,
    deliveryAddress: typeof updated.deliveryAddress === 'string' ? JSON.parse(updated.deliveryAddress) : updated.deliveryAddress,
    packet: typeof updated.packet === 'string' ? JSON.parse(updated.packet) : updated.packet,
    distance: updated.distance,
    duration: updated.duration,
    transportMethod: updated.transportMethod,
    paymentMethod: updated.paymentMethod,
    assignedToId: updated.assignedToId ?? undefined,
    assignedToFirstName: assignedPerson?.firstName,
    assignedToLastName: assignedPerson?.lastName,
    assignedToEmail: assignedPerson?.email,
    assignedToPhone: assignedPerson?.phone,
  })
}