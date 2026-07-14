import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const mission = await db.mission.findUnique({ where: { id } })
  if (!mission) {
    return NextResponse.json({ error: 'Mission non trouvée' }, { status: 404 })
  }

  if (mission.status === 'ASSIGNED') {
    return NextResponse.json({ error: 'Mission déjà acceptée' }, { status: 400 })
  }

  const updated = await db.mission.update({
    where: { id },
    data: { status: 'ASSIGNED' },
  })

  return NextResponse.json({
    id: updated.id,
    status: updated.status,
  })
}