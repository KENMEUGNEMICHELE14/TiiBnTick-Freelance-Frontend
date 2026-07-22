'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowLeft, Contact, Package, Plus, UserCircle, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// Types
type Contact = {
    id: string
    firstName: string
    lastName: string
    phone: string
    email?: string
}

// Mock contacts pour la démo.
const mockContacts: Contact[] = [
    { id: '1', firstName: 'Jean', lastName: 'Dupont', phone: '0102030405', email: 'jean@example.com' },
    { id: '2', firstName: 'Marie', lastName: 'Curie', phone: '0607080910', email: 'marie@example.com' },
    { id: '3', firstName: 'Ahmed', lastName: 'Sylla', phone: '0708091011', email: 'ahmed@example.com' }
]

export default function PreExpeditionPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const nextRoute = searchParams?.get('next') || '/expedition'

    const [step, setStep] = useState<'question' | 'form'>('question')

    const [isSenderContact, setIsSenderContact] = useState(true)
    const [isRecipientContact, setIsRecipientContact] = useState(true)

    const [selectedSender, setSelectedSender] = useState<Contact | null>(null)
    const [selectedRecipient, setSelectedRecipient] = useState<Contact | null>(null)

    const [contactDialogOpen, setContactDialogOpen] = useState(false)
    const [selectingFor, setSelectingFor] = useState<'sender' | 'recipient'>('sender')
    const [searchQuery, setSearchQuery] = useState('')

    const handleContinueWithoutContact = () => {
        router.push(nextRoute)
    }

    const handleSelectContactAction = (role: 'sender' | 'recipient') => {
        setSelectingFor(role)
        setContactDialogOpen(true)
    }

    const confirmContactSelection = (contact: Contact) => {
        if (selectingFor === 'sender') {
            setSelectedSender(contact)
        } else {
            setSelectedRecipient(contact)
        }
        setContactDialogOpen(false)
    }

    const handleValidateForm = () => {
        // 1. Lire the localStorage expeditionPrefill ou en créer un
        let expeditionPrefill: any = {}
        try {
            const stored = localStorage.getItem('expedition_form_in_progress')
            if (stored) expeditionPrefill = JSON.parse(stored)
        } catch (e) {
            console.error(e)
        }

        // Initialize structures if not present
        if (!expeditionPrefill.senderData) {
            expeditionPrefill.senderData = {}
        }
        if (!expeditionPrefill.recipientData) {
            expeditionPrefill.recipientData = {}
        }

        // 2. Mettre à jour avec les contacts choisis
        if (isSenderContact && selectedSender) {
            expeditionPrefill.senderData.senderName = `${selectedSender.lastName} ${selectedSender.firstName}`.trim()
            expeditionPrefill.senderData.senderPhone = selectedSender.phone
            if (selectedSender.email) expeditionPrefill.senderData.senderEmail = selectedSender.email
        }

        if (isRecipientContact && selectedRecipient) {
            expeditionPrefill.recipientData.recipientName = `${selectedRecipient.lastName} ${selectedRecipient.firstName}`.trim()
            expeditionPrefill.recipientData.recipientPhone = selectedRecipient.phone
            if (selectedRecipient.email) expeditionPrefill.recipientData.recipientEmail = selectedRecipient.email
        }

        // 3. Sauvegarder dans localStorage
        localStorage.setItem('expedition_form_in_progress', JSON.stringify(expeditionPrefill))

        // 4. Rediriger
        router.push(nextRoute)
    }

    const filteredContacts = mockContacts.filter(c =>
        `${c.firstName} ${c.lastName} ${c.phone}`.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <Button
                    variant="ghost"
                    onClick={() => step === 'form' ? setStep('question') : router.back()}
                    className="mb-4 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Retour
                </Button>

                <Card className="shadow-xl rounded-2xl border-0 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />

                    {step === 'question' && (
                        <CardContent className="p-8 text-center space-y-6">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Contact className="w-8 h-8 text-orange-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                L'expéditeur ou le destinataire est-il l'un de vos contacts ?
                            </h2>
                            <p className="text-gray-500 text-sm">
                                Si vous avez déjà enregistré cette personne, gagnez du temps en la sélectionnant directement.
                            </p>

                            <div className="grid grid-cols-1 gap-3 mt-6">
                                <Button
                                    onClick={() => setStep('form')}
                                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold h-12 text-base"
                                >
                                    Oui, c'est un contact
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleContinueWithoutContact}
                                    className="border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold h-12 text-base"
                                >
                                    Non, créer une nouvelle expédition
                                </Button>
                            </div>
                        </CardContent>
                    )}

                    {step === 'form' && (
                        <>
                            <CardHeader className="bg-gray-50 border-b border-gray-100 pb-6 px-8">
                                <CardTitle className="text-xl">Sélectionnez vos contacts</CardTitle>
                                <CardDescription>
                                    Cochez les rôles correspondant à vos contacts.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8 bg-white">

                                {/* Expéditeur */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="sender-checkbox"
                                            checked={isSenderContact}
                                            onCheckedChange={(checked) => setIsSenderContact(checked as boolean)}
                                            className="border-orange-500 data-[state=checked]:bg-orange-500"
                                        />
                                        <label
                                            htmlFor="sender-checkbox"
                                            className="text-base font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-800"
                                        >
                                            L'Expéditeur est un contact
                                        </label>
                                    </div>

                                    {isSenderContact && (
                                        <div className="pl-7">
                                            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                                                {selectedSender ? (
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                                                                {selectedSender.firstName.charAt(0)}{selectedSender.lastName.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900">{selectedSender.firstName} {selectedSender.lastName}</p>
                                                                <p className="text-sm text-gray-500">{selectedSender.phone}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-4">
                                                        <p className="text-sm text-gray-500 mb-3">Aucun contact sélectionné</p>
                                                    </div>
                                                )}

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSelectContactAction('sender')}
                                                    className="w-full mt-4 border-orange-200 text-orange-700 hover:bg-orange-50 font-medium"
                                                >
                                                    {selectedSender ? 'Changer de contact' : 'Choisir un contact'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Destinataire */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="recipient-checkbox"
                                            checked={isRecipientContact}
                                            onCheckedChange={(checked) => setIsRecipientContact(checked as boolean)}
                                            className="border-blue-500 data-[state=checked]:bg-blue-500"
                                        />
                                        <label
                                            htmlFor="recipient-checkbox"
                                            className="text-base font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-800"
                                        >
                                            Le Destinataire est un contact
                                        </label>
                                    </div>

                                    {isRecipientContact && (
                                        <div className="pl-7">
                                            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                                                {selectedRecipient ? (
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                                                {selectedRecipient.firstName.charAt(0)}{selectedRecipient.lastName.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900">{selectedRecipient.firstName} {selectedRecipient.lastName}</p>
                                                                <p className="text-sm text-gray-500">{selectedRecipient.phone}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-4">
                                                        <p className="text-sm text-gray-500 mb-3">Aucun contact sélectionné</p>
                                                    </div>
                                                )}

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSelectContactAction('recipient')}
                                                    className="w-full mt-4 border-blue-200 text-blue-700 hover:bg-blue-50 font-medium"
                                                >
                                                    {selectedRecipient ? 'Changer de contact' : 'Choisir un contact'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 mt-6 border-t border-gray-100 flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 font-semibold text-gray-700"
                                        onClick={() => router.back()}
                                    >
                                        Retour
                                    </Button>
                                    <Button
                                        className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold"
                                        onClick={handleValidateForm}
                                    >
                                        Valider
                                    </Button>
                                </div>

                            </CardContent>
                        </>
                    )}

                </Card>
            </div>

            {/* Modal / Dialog Contact Selection */}
            <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
                <DialogContent className="max-w-md bg-white">
                    <DialogHeader className="pb-4 border-b">
                        <DialogTitle>Choisir un contact</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Rechercher par nom, prénom ou téléphone..."
                                className="pl-9 bg-gray-50 border-gray-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                            {filteredContacts.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <UserCircle className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                    <p>Aucun contact trouvé</p>
                                </div>
                            ) : (
                                filteredContacts.map(contact => (
                                    <div
                                        key={contact.id}
                                        onClick={() => confirmContactSelection(contact)}
                                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50 cursor-pointer transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                                            {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{contact.firstName} {contact.lastName}</p>
                                            <p className="text-sm text-gray-500">{contact.phone}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
