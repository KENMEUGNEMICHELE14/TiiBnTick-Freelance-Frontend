import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Simuler des politiques par défaut, vu qu'elles ne sont pas encore dans le schéma Prisma
const MOCK_DEFAULT_POLICIES = {
    pricing: {
        pricePerKm: 250,
        pricePerM3: 1500,
        waitFeeEnabled: true,
    },
    availability: [
        { day: 'Lun', start: '08:00', end: '18:00', active: true },
        { day: 'Mar', start: '08:00', end: '18:00', active: true },
        { day: 'Mer', start: '08:00', end: '18:00', active: true },
        { day: 'Jeu', start: '08:00', end: '18:00', active: true },
        { day: 'Ven', start: '08:00', end: '18:00', active: true },
        { day: 'Sam', start: '10:00', end: '15:00', active: false },
        { day: 'Dim', start: '00:00', end: '00:00', active: false },
    ],
    acceptedPackages: {
        documents: true,
        colisStandard: true,
        fragile: false,
        volumineux: false,
        alimentaire: false,
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const user = await db.user.findUnique({
            where: { id },
        })

        if (!user || (user.userType !== 'LIVREUR' && user.userType !== 'ADMIN')) {
            return NextResponse.json(
                { error: 'Livreur introuvable' },
                { status: 404 }
            )
        }

        // Retourner les politiques statiques (à remplacer par la BD plus tard si le schéma évolue)
        return NextResponse.json(MOCK_DEFAULT_POLICIES, { status: 200 })
    } catch (error) {
        console.error('Erreur GET policies:', error)
        return NextResponse.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()

        const user = await db.user.findUnique({
            where: { id },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Livreur introuvable' },
                { status: 404 }
            )
        }

        // TODO: Une fois que le schéma Prisma aura des champs adaptés (ex: JSON 'policies'), 
        // on fera un db.user.update(...) ici. Pour le moment, on retourne juste un succès.
        return NextResponse.json({
            message: 'Politiques mises à jour avec succès (simulation)',
            data: body
        }, { status: 200 })

    } catch (error) {
        console.error('Erreur PUT policies:', error)
        return NextResponse.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
        )
    }
}
