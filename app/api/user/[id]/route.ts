import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        if (!id) {
            return NextResponse.json(
                { error: 'L\'ID de l\'utilisateur est requis' },
                { status: 400 }
            )
        }

        const user = await db.user.findUnique({
            where: { id },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Utilisateur introuvable' },
                { status: 404 }
            )
        }

        // On exclut le mot de passe pour des raisons de sécurité
        const { password, ...userWithoutPassword } = user

        return NextResponse.json(userWithoutPassword, { status: 200 })
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error)
        return NextResponse.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
        )
    }
}
