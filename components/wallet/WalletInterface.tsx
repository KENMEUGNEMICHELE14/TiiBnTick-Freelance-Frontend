'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

import {
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  ScanLine,
  CreditCard,
  Building2,
  Coffee,
  ShoppingCart,
  Smartphone,
  Wifi,
  ChevronRight,
  History,
  MoreVertical,
  X,
  Star
} from 'lucide-react'

// Types for our Wallet component
export type Transaction = {
  id: string
  title: string
  merchant: string
  amount: number
  date: string
  type: 'payment' | 'deposit' | 'withdrawal'
  category?: 'food' | 'shopping' | 'transport' | 'bills' | 'other'
  status: 'completed' | 'pending' | 'failed'
}

export type WalletProps = {
  userName: string
  balance: number
  currency?: string
  cardNumber?: string
  transactions?: Transaction[]
  onAddFunds?: () => void
  onWithdraw?: () => void
  onSend?: () => void
  onScan?: () => void
}

// Helper to get category icon
const getCategoryIcon = (category: string | undefined, type: string) => {
  if (type === 'deposit') return <ArrowDownLeft className="w-5 h-5 text-green-600" />
  if (type === 'withdrawal') return <ArrowUpRight className="w-5 h-5 text-orange-600" />
  
  switch (category) {
    case 'food': return <Coffee className="w-5 h-5 text-gray-700" />
    case 'shopping': return <ShoppingCart className="w-5 h-5 text-gray-700" />
    case 'transport': return <Smartphone className="w-5 h-5 text-gray-700" />
    case 'bills': return <Building2 className="w-5 h-5 text-gray-700" />
    default: return <CreditCard className="w-5 h-5 text-gray-700" />
  }
}

export function WalletInterface({
  userName,
  balance,
  currency = 'FCFA',
  cardNumber = '•••• •••• •••• 4242',
  transactions = [],
  onAddFunds,
  onWithdraw,
  onSend,
  onScan
}: WalletProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isAddingMethod, setIsAddingMethod] = useState(false)

  // Mock payment methods
  const paymentMethods = [
    { id: '1', type: 'Visa', last4: '0753', expiry: '12/2026', icon: <CreditCard className="w-5 h-5 text-blue-600" /> },
    { id: '2', type: 'Orange Money', last4: '1234', icon: <Smartphone className="w-5 h-5 text-orange-500" /> }
  ]

  // Default transactions if none provided
  const displayTransactions = transactions.length > 0 ? transactions : [
    { id: '1', title: 'Paiement commande #1204', merchant: 'TiiBnTick', amount: -2500, date: 'Aujourd\'hui, 14:30', type: 'payment', category: 'transport', status: 'completed' },
    { id: '2', title: 'Recharge compte', merchant: 'Orange Money', amount: 15000, date: 'Hier, 09:15', type: 'deposit', status: 'completed' },
    { id: '3', title: 'Retrait vers Mobile Money', merchant: 'MTN MoMo', amount: -5000, date: '12 Mai 2026', type: 'withdrawal', status: 'completed' },
    { id: '4', title: 'Commission plateforme', merchant: 'TiiBnTick', amount: -450, date: '10 Mai 2026', type: 'payment', category: 'bills', status: 'completed' },
  ] as Transaction[]

  return (
    <div className="w-full max-w-md mx-auto space-y-6 pb-20 md:pb-0">
      
      {/* Digital Card Section (Google Wallet Style) */}
      <div className="relative perspective-1000">
        <motion.div
          className="w-full h-56 md:h-64 cursor-pointer relative preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front of Card */}
          <Card className="absolute w-full h-full backface-hidden border-0 bg-gradient-to-br from-gray-900 via-slate-800 to-black text-white shadow-2xl overflow-hidden rounded-2xl">
            {/* Background elements for glassmorphism effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
            
            <CardContent className="p-5 sm:p-6 md:p-8 h-full flex flex-col justify-between relative z-10">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="text-white/60 text-xs md:text-sm font-medium mb-1 truncate">Solde Principal</p>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight truncate">
                    {balance.toLocaleString()} <span className="text-lg sm:text-xl font-medium text-white/80">{currency}</span>
                  </h2>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                  <Wifi className="w-5 h-5 md:w-6 md:h-6 text-white/90 rotate-90" />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* EMV Chip placeholder */}
                  <div className="w-10 h-7 md:w-12 md:h-9 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md opacity-80 flex-shrink-0" />
                  <p className="font-mono text-base sm:text-lg tracking-widest text-white/90 truncate">{cardNumber}</p>
                </div>
                
                <div className="flex justify-between items-end gap-2">
                  <div className="min-w-0">
                    <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider mb-1 truncate">Titulaire</p>
                    <p className="text-sm sm:text-base font-semibold text-white/90 tracking-wide truncate">{userName}</p>
                  </div>
                  {/* Master card like circles */}
                  <div className="flex flex-shrink-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-500/80 mix-blend-screen" />
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-orange-500/80 mix-blend-screen -ml-2 sm:-ml-3" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back of Card */}
          <Card className="absolute w-full h-full backface-hidden border-0 bg-slate-900 text-white shadow-2xl overflow-hidden rounded-2xl rotate-y-180">
            <div className="w-full h-12 bg-black mt-6" />
            <CardContent className="p-6">
              <div className="bg-white/10 w-full h-10 rounded mt-4 flex justify-end items-center px-4">
                <span className="font-mono text-black bg-white px-2 py-1 rounded text-sm italic">***</span>
              </div>
              <div className="mt-8 text-center text-white/40 text-xs">
                <p>Cette carte est virtuelle et personnelle.</p>
                <p>Pour toute assistance, contactez le support TiiBnTick.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions (Floating Action Buttons style) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 px-1 sm:px-2">
        <div className="flex flex-col items-center gap-1 sm:gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-gray-50 border-gray-100 transition-all text-blue-600"
            onClick={onAddFunds}
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          <span className="text-[10px] sm:text-xs font-medium text-gray-600">Recharger</span>
        </div>
        
        <div className="flex flex-col items-center gap-1 sm:gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-gray-50 border-gray-100 transition-all text-orange-600"
            onClick={onWithdraw}
          >
            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          <span className="text-[10px] sm:text-xs font-medium text-gray-600">Retirer</span>
        </div>

        <div className="flex flex-col items-center gap-1 sm:gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-gray-50 border-gray-100 transition-all text-green-600"
            onClick={onSend}
          >
            <ArrowDownLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          <span className="text-[10px] sm:text-xs font-medium text-gray-600">Envoyer</span>
        </div>

        <div className="flex flex-col items-center gap-1 sm:gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-gray-50 border-gray-100 transition-all text-purple-600"
            onClick={onScan}
          >
            <ScanLine className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          <span className="text-[10px] sm:text-xs font-medium text-gray-600">Scanner</span>
        </div>
      </div>

      {/* Google-Style Settings Section */}
      <div className="pt-4 space-y-6">
        
        {/* Payment Methods Card Block */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 px-2">Modes de paiement</h3>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            
            {/* List of saved methods */}
            {paymentMethods.map((method, index) => (
              <div key={method.id} className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                  {method.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{method.type} •••• {method.last4}</p>
                  {method.expiry && <p className="text-xs text-gray-500">Expiration : {method.expiry}</p>}
                </div>
              </div>
            ))}

            {/* Add Payment Method Button / Form */}
            {isAddingMethod ? (
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-gray-900">Ajouter une carte ou compte</h4>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsAddingMethod(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input placeholder="Numéro de carte / Téléphone" className="pl-9 h-11" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="MM/AA" className="h-11" />
                      <Input placeholder="Code de sécurité" className="h-11" />
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="font-semibold mb-1">Adresse de facturation</p>
                    <p>{userName}</p>
                    <p>Melen, Yaoundé</p>
                    <p>Cameroun</p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsAddingMethod(false)}>Annuler</Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsAddingMethod(false)}>Enregistrer</Button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAddingMethod(true)}
                className="w-full flex items-center gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="absolute ml-4 mt-4 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-gray-200">
                    <Plus className="w-3 h-3 text-gray-900" />
                  </span>
                </div>
                <span className="font-medium text-gray-900 text-sm">Ajouter un mode de paiement</span>
              </button>
            )}

            {/* Manage Footer */}
            <div className="p-4 bg-gray-50 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Gérer les modes de paiement</span>
              <span className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
                {paymentMethods.length}
              </span>
            </div>
          </div>
        </div>

        {/* Fidelity / Subscription Block */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm p-4 sm:p-5">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="mt-1 shrink-0">
              <Star className="w-6 h-6 text-orange-500 fill-orange-500/20" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Programme de Fidélité</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                L&apos;attribution et la gestion de vos points de fidélité sont en cours de traitement par nos équipes. Cette fonctionnalité sera bientôt disponible.
              </p>
              
              <div className="mt-4 space-y-2">
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-300 w-[5%] rounded-full transition-all duration-500" />
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Utilisation de 0 pts sur 1000 (0 %)</span>
                  <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-orange-100 font-medium text-[10px]">
                    Bientôt
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Transactions Section */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <History className="w-5 h-5 text-gray-500" />
            Activité récente
          </h3>
          <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-medium">
            Voir tout
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <Card className="border-0 shadow-sm bg-white overflow-hidden rounded-2xl">
          <div className="w-full max-h-[500px] overflow-y-auto">
            <div className="p-2 sm:p-4 space-y-2 sm:space-y-4">
              {displayTransactions.map((tx, index) => (
                <div key={tx.id} className="flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-xl transition-colors group cursor-pointer gap-2">
                  <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex flex-shrink-0 items-center justify-center
                      ${tx.type === 'deposit' ? 'bg-green-100' : 
                        tx.type === 'withdrawal' ? 'bg-orange-100' : 'bg-gray-100'}`}>
                      {getCategoryIcon(tx.category, tx.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{tx.merchant}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 truncate">{tx.title} • {tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-1 sm:gap-3 flex-shrink-0">
                    <div>
                      <p className={`font-bold text-xs sm:text-sm whitespace-nowrap ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} {currency}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 capitalize">{tx.status}</p>
                    </div>
                    <MoreVertical className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </div>
  )
}
