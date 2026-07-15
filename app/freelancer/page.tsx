'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import {
  Package, MapPin, Clock, DollarSign, Star, CheckCircle2, Navigation, Bell, User,
  Settings, LogOut, Menu, X, Phone, Map as MapIcon, TrendingUp, TrendingDown,
  LayoutDashboard, Megaphone, Truck, History, UserCircle, Target, ArrowUpRight,
  ArrowDownLeft, Wallet as WalletIcon, Eye, EyeOff, Shield, Building2, Send,
  Download, Plus, Search, Calendar as CalendarIcon, CreditCard, Mail, Lock,
  Loader2, Edit, Trash2, AlertTriangle, Smartphone, XCircle, ClipboardList, ScrollText,
} from 'lucide-react'
import { withAuth } from '@/components/hoc/withAuth'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getRoute } from '@/services/routing'
import { getPublishedAnnouncements, getDeliveryPersonSubscriptions, AnnouncementResponseDTO } from '@/services/announcementService'
import { updateDeliveryPerson, deleteDeliveryPerson } from '@/services/deliveryPersonService'
import apiClient from '@/lib/axios'
import { cn } from '@/lib/utils'

const MapLeaflet = dynamic(() => import('@/components/MapLeaflet'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-100 animate-pulse rounded-xl" />,
})

// ── Google Wallet icon ────────────────────────────────────────────
function GoogleWalletIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="28" height="28" rx="5" fill="#F97316" />
      <rect x="16" y="6" width="28" height="28" rx="5" fill="#fff" stroke="#FDBA74" strokeWidth="1" />
      <rect x="16" y="6" width="28" height="7" rx="5" fill="url(#fw-top)" />
      <rect x="16" y="27" width="28" height="7" rx="5" fill="url(#fw-bot)" />
      <path d="M26 20L23 26L20 20H18L22.5 28L21 31H23L29 20H26Z" fill="#F97316" />
      <path d="M32 20L29 26L26 20H24L28.5 28L27 31H29L35 20H32Z" fill="#F97316" opacity="0.7" />
      <defs>
        <linearGradient id="fw-top" x1="16" y1="6" x2="44" y2="13">
          <stop offset="0" stopColor="#FDBA74" /><stop offset="0.5" stopColor="#FFFFFF" /><stop offset="1" stopColor="#FED7AA" />
        </linearGradient>
        <linearGradient id="fw-bot" x1="16" y1="27" x2="44" y2="34">
          <stop offset="0" stopColor="#FDBA74" /><stop offset="1" stopColor="#F97316" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function fmt(n: number | undefined): string {
  if (n == null) return '0'
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')
}

// ── Mock data ─────────────────────────────────────────────────────
const mockTransactions = [
  { id: 'TXN001', type: 'credit' as const, label: 'Livraison Abidjan → Cocody', amount: 3500, date: '2025-01-15 14:30', status: 'completed' as const },
  { id: 'TXN002', type: 'credit' as const, label: 'Livraison Plateau → Marcory', amount: 2000, date: '2025-01-15 11:15', status: 'completed' as const },
  { id: 'TXN003', type: 'debit' as const, label: 'Retrait Mobile Money', amount: 15000, date: '2025-01-14 18:00', status: 'completed' as const },
  { id: 'TXN004', type: 'credit' as const, label: 'Livraison Yopougon → Zone 4', amount: 4000, date: '2025-01-14 09:45', status: 'completed' as const },
  { id: 'TXN005', type: 'credit' as const, label: 'Livraison Treichville → Bouaké', amount: 8000, date: '2025-01-13 16:20', status: 'completed' as const },
  { id: 'TXN006', type: 'debit' as const, label: 'Retrait Mobile Money', amount: 10000, date: '2025-01-12 12:00', status: 'completed' as const },
  { id: 'TXN007', type: 'credit' as const, label: 'Livraison Bingerville → Abidjan', amount: 2500, date: '2025-01-12 08:30', status: 'pending' as const },
  { id: 'TXN008', type: 'credit' as const, label: 'Bonus performance', amount: 5000, date: '2025-01-11 20:00', status: 'completed' as const },
  { id: 'TXN009', type: 'credit' as const, label: 'Livraison Adjamé → Plateau', amount: 3000, date: '2025-01-10 15:10', status: 'completed' as const },
  { id: 'TXN010', type: 'debit' as const, label: 'Retrait vers compte bancaire', amount: 20000, date: '2025-01-09 10:00', status: 'failed' as const },
]

const allHistorique = [
  { id: 'TBP-2024-156', customerName: 'Kouassi Mariam', deliveryAddress: 'Marcory, Rue 12', distance: 4.5, earnings: 1200, completedAt: '09:45', completedDate: '27/01/2025', rating: 5, tip: 500, packageType: 'Repas à domicile', pickupAddress: 'Cocody, Rue des Jardins' },
  { id: 'TBP-2024-155', customerName: 'Diop Abib', deliveryAddress: 'Cocody, Deux-Plateaux', distance: 7.2, earnings: 1800, completedAt: '08:30', completedDate: '27/01/2025', rating: 4, tip: 0, packageType: 'Documents urgents', pickupAddress: 'Plateau, Avenue de la République' },
  { id: 'TBP-2024-154', customerName: 'Yao Esther', deliveryAddress: 'Yopougon, Zone 4', distance: 10.5, earnings: 2500, completedAt: '19:20', completedDate: '26/01/2025', rating: 5, tip: 1000, packageType: 'Courses urgentes', pickupAddress: 'Abobo, Baoulé' },
  { id: 'TBP-2024-153', customerName: 'Koffi Aya', deliveryAddress: 'Plateau, Stade Général De Gaulle', distance: 3.8, earnings: 1000, completedAt: '17:45', completedDate: '26/01/2025', rating: 5, tip: 200, packageType: 'Pharmacie & Santé', pickupAddress: 'Marcory, Biétry' },
  { id: 'TBP-2024-152', customerName: 'Amani Yao', deliveryAddress: 'Treichville, Boulevard Mitterrand', distance: 8.3, earnings: 2000, completedAt: '15:30', completedDate: '26/01/2025', rating: 4, tip: 0, packageType: 'Colis', pickupAddress: 'Cocody, Angre' },
  { id: 'TBP-2024-151', customerName: 'Kouame Paul', deliveryAddress: 'Abobo, Derrière le pont', distance: 12.7, earnings: 3000, completedAt: '12:15', completedDate: '26/01/2025', rating: 5, tip: 500, packageType: 'Courses urgentes', pickupAddress: 'Yopougon, Sicogi' },
  { id: 'TBP-2024-150', customerName: 'Touré Aminata', deliveryAddress: 'Marcory, Rue 18', distance: 6.2, earnings: 1500, completedAt: '10:50', completedDate: '25/01/2025', rating: 4, tip: 300, packageType: 'Repas à domicile', pickupAddress: 'Plateau, Rue 12' },
  { id: 'TBP-2024-149', customerName: 'Koné Ibrahim', deliveryAddress: 'Cocody, Riviera', distance: 9.5, earnings: 2200, completedAt: '18:20', completedDate: '25/01/2025', rating: 5, tip: 800, packageType: 'Documents urgents', pickupAddress: 'Treichville, Marché Central' },
]

export function FreelancerDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, logout, login, refreshUser } = useAuth() as any
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('accueil')

  const freelancerInfo = {
    firstName: user?.firstName || 'Freelancer',
    lastName: user?.lastName || '',
    rating: user?.rating || 4.8,
    totalDeliveries: user?.totalDeliveries || 156,
    totalEarnings: 245000,
    phone: user?.phone || '',
    displayName: user?.lastName || user?.firstName || 'Freelancer',
  }

  // ── Annonces / Livraisons state ───────────────────────────────────
  const [availableDeliveries, setAvailableDeliveries] = useState<AnnouncementResponseDTO[]>([])
  const [availableLoading, setAvailableLoading] = useState(false)
  const [activeDeliveries, setActiveDeliveries] = useState<AnnouncementResponseDTO[]>([])
  const [activeLoading, setActiveLoading] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [activeRoute, setActiveRoute] = useState<any>(null)
  const [pendingSubscriptions, setPendingSubscriptions] = useState<Set<string>>(new Set())
  const [subscribedIds, setSubscribedIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try { const s = localStorage.getItem('freelancer_subscribed_ids'); if (s) return new Set(JSON.parse(s)) } catch {}
    }
    return new Set()
  })

  const deliveryPersonIdRef = user?.deliveryPersonId || user?.id

  const fetchAvailableDeliveries = useCallback(async () => {
    setAvailableLoading(true)
    try {
      const data = await getPublishedAnnouncements()
      setAvailableDeliveries(data.filter((a: AnnouncementResponseDTO) => a.status === 'PUBLISHED'))
    } catch (e) { console.error(e) } finally { setAvailableLoading(false) }
  }, [])

  const fetchMyDeliveries = useCallback(async () => {
    if (!deliveryPersonIdRef) return
    setActiveLoading(true)
    try {
      const data = await getDeliveryPersonSubscriptions(deliveryPersonIdRef)
      setActiveDeliveries(data)
      const apiIds = data.map((a: AnnouncementResponseDTO) => a.id)
      setSubscribedIds(prev => {
        const merged = new Set(prev); apiIds.forEach((id: string) => merged.add(id))
        try { localStorage.setItem('freelancer_subscribed_ids', JSON.stringify([...merged])) } catch {}
        return merged
      })
    } catch (e) { console.error(e) } finally { setActiveLoading(false) }
  }, [deliveryPersonIdRef])

  useEffect(() => { fetchAvailableDeliveries(); fetchMyDeliveries() }, [fetchAvailableDeliveries, fetchMyDeliveries])

  useEffect(() => {
    if (!user?.id) return
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const es = new EventSource(`/api/notifications/stream/${user.id}${token ? `?token=${token}` : ''}`)
    es.onmessage = (event) => {
      try {
        if (!event.data) return
        const ev = JSON.parse(event.data)
        if (!ev.announcementId) return
        apiClient.get(`/api/announcements/${ev.announcementId}`).then(res => {
          const a = res.data as AnnouncementResponseDTO
          setAvailableDeliveries(prev => prev.find(d => d.id === a.id) ? prev : [a, ...prev])
          toast({ title: 'Nouvelle course disponible !', description: a.title || 'Une nouvelle course correspond à votre position.' })
        })
      } catch {}
    }
    es.onerror = () => es.close()
    return () => es.close()
  }, [user?.id])

  useEffect(() => {
    if (!selectedDelivery?.pickupAddress?.latitude || !selectedDelivery?.deliveryAddress?.latitude) { setActiveRoute(null); return }
    getRoute(selectedDelivery.pickupAddress.latitude, selectedDelivery.pickupAddress.longitude, selectedDelivery.deliveryAddress.latitude, selectedDelivery.deliveryAddress.longitude, selectedDelivery.transportMethod === 'bike' ? 'bike' : 'driving')
      .then(setActiveRoute).catch(() => setActiveRoute(null))
  }, [selectedDelivery])

  const handleAcceptDelivery = async (deliveryId: string) => {
    if (!user?.id) { toast({ title: 'Erreur', description: 'Vous devez être connecté.', variant: 'destructive' }); return }
    setPendingSubscriptions(prev => new Set(prev).add(deliveryId))
    try {
      const res = await apiClient.post(`/api/announcements/${deliveryId}/subscribe`, { deliveryPersonId: user.deliveryPersonId || user.id })
      if ([200, 201, 202].includes(res.status)) {
        setSubscribedIds(prev => { const n = new Set(prev); n.add(deliveryId); try { localStorage.setItem('freelancer_subscribed_ids', JSON.stringify([...n])) } catch {}; return n })
        toast({ title: 'Demande envoyée', description: 'Votre souscription est en cours de traitement.' })
      } else { toast({ title: 'Erreur', description: 'Impossible d\'envoyer la demande.', variant: 'destructive' }) }
    } catch { toast({ title: 'Erreur', description: 'Une erreur réseau est survenue.', variant: 'destructive' }) }
    finally { setPendingSubscriptions(prev => { const n = new Set(prev); n.delete(deliveryId); return n }) }
  }

  // ── Wallet state ─────────────────────────────────────────────────
  const walletData = { totalEarnings: 245000, available: 38500, pending: 6500, thisMonth: 45000, lastMonth: 40200 }
  const [walletShowBalance, setWalletShowBalance] = useState(true)
  const [walletActiveFilter, setWalletActiveFilter] = useState<'all' | 'credit' | 'debit'>('all')
  const [showRetraitDialog, setShowRetraitDialog] = useState(false)
  const [retraitMethod, setRetraitMethod] = useState<'momo' | 'bank' | null>(null)
  const [retraitAmount, setRetraitAmount] = useState('')
  const walletFilteredTxns = mockTransactions.filter(t => walletActiveFilter === 'all' ? true : t.type === walletActiveFilter)

  const handleRetrait = () => {
    const amount = parseInt(retraitAmount)
    if (!amount || amount <= 0) { toast({ title: 'Erreur', description: 'Entrez un montant valide', variant: 'destructive' }); return }
    if (amount > walletData.available) { toast({ title: 'Solde insuffisant', description: 'Le montant dépasse votre solde disponible', variant: 'destructive' }); return }
    if (amount < 500) { toast({ title: 'Montant minimum', description: 'Le retrait minimum est de 500 FCFA', variant: 'destructive' }); return }
    toast({ title: 'Demande envoyée', description: `Votre retrait de ${amount.toLocaleString()} FCFA est en cours de traitement.` })
    setShowRetraitDialog(false); setRetraitAmount(''); setRetraitMethod(null)
  }

  // ── Historique state ─────────────────────────────────────────────
  const [histSearchTerm, setHistSearchTerm] = useState('')
  const [histFilterPeriod, setHistFilterPeriod] = useState('all')
  const filteredHistorique = allHistorique.filter(d => {
    const matchSearch = d.id.toLowerCase().includes(histSearchTerm.toLowerCase()) || d.customerName.toLowerCase().includes(histSearchTerm.toLowerCase()) || d.deliveryAddress.toLowerCase().includes(histSearchTerm.toLowerCase())
    let matchPeriod = true
    const today = new Date()
    const dDate = new Date(d.completedDate.split('/').reverse().join('-'))
    if (histFilterPeriod === 'today') matchPeriod = dDate.toDateString() === today.toDateString()
    else if (histFilterPeriod === 'week') matchPeriod = dDate >= new Date(today.getTime() - 7 * 86400000)
    else if (histFilterPeriod === 'month') matchPeriod = dDate >= new Date(today.getTime() - 30 * 86400000)
    return matchSearch && matchPeriod
  })

  // ── Profil state ─────────────────────────────────────────────────
  const [profilHasMounted, setProfilHasMounted] = useState(false)
  const [profilIsEditing, setProfilIsEditing] = useState(false)
  const [profilShowDeleteDialog, setProfilShowDeleteDialog] = useState(false)
  const [profilShowPassword, setProfilShowPassword] = useState(false)
  const [profilIsLoading, setProfilIsLoading] = useState(false)
  const [editedData, setEditedData] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '********' })

  useEffect(() => { setProfilHasMounted(true); if (typeof refreshUser === 'function') refreshUser() }, [])
  useEffect(() => {
    if (user && !profilIsEditing) setEditedData({ firstName: user.firstName || '', lastName: user.lastName || '', email: user.email || '', phone: user.phone || '', password: '********' })
  }, [user, profilIsEditing])

  const handleProfilSave = async () => {
    const missing: string[] = []
    if (!editedData.firstName) missing.push('Prénom')
    if (!editedData.lastName) missing.push('Nom')
    if (!editedData.email) missing.push('Email')
    if (!editedData.phone) missing.push('Téléphone')
    if (missing.length > 0) { toast({ title: 'Champs obligatoires', description: `Veuillez remplir : ${missing.join(', ')}.`, variant: 'destructive' }); return }
    setProfilIsLoading(true)
    try {
      if (user?.deliveryPersonId) {
        const updateData = { ...editedData }
        if (updateData.password === '********') delete (updateData as any).password
        await updateDeliveryPerson(user.deliveryPersonId, updateData)
        if (typeof login === 'function') login({ ...user, ...editedData, password: (updateData as any).password || user.password })
        if (typeof refreshUser === 'function') await refreshUser()
        setProfilIsEditing(false)
        toast({ title: 'Succès ! ✅', description: 'Votre profil a été mis à jour avec succès.' })
      }
    } catch (error: any) {
      toast({ title: 'Échec de la mise à jour', description: error?.response?.data?.message || 'Une erreur est survenue.', variant: 'destructive' })
    } finally { setProfilIsLoading(false) }
  }

  const handleProfilDelete = async () => {
    if (!user?.deliveryPersonId) return
    setProfilIsLoading(true)
    try {
      await deleteDeliveryPerson(user.deliveryPersonId)
      toast({ title: 'Compte supprimé ✅', description: 'Votre compte a été supprimé. À bientôt !' })
      logout()
    } catch (error: any) {
      toast({ title: 'Erreur', description: error?.response?.data?.message || 'Impossible de supprimer le compte.', variant: 'destructive' })
      setProfilIsLoading(false); setProfilShowDeleteDialog(false)
    }
  }

  const formatProfilDate = (dateString?: string) => {
    if (!profilHasMounted || !dateString) return '...'
    try { return new Date(dateString).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) } catch { return '...' }
  }

  const profilShowContent = profilHasMounted && user

  // ── JSX ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">TiiB<span className="text-orange-500">n</span>Tick</h1>
                <p className="text-xs text-gray-500">Espace Freelancer</p>
              </div>
            </div>

            {/* Desktop right: profil pill + settings + logout */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="icon" className="opacity-50 cursor-not-allowed" disabled>
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{freelancerInfo.displayName}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">{freelancerInfo.rating}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="opacity-50 cursor-not-allowed" disabled>
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-orange-500 hover:text-orange-600 hover:bg-orange-50" onClick={logout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <Button variant="ghost" size="icon" className="opacity-50 cursor-not-allowed" disabled><Bell className="w-5 h-5" /></Button>
              <Button variant="outline" size="icon-lg" className="border-gray-200 active:scale-95 transition-transform"
                aria-label={mobileMenuOpen ? 'Fermer' : 'Menu'} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          {/* Drawer panel */}
          <div className="relative ml-auto w-[calc(100%-56px)] max-w-sm bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="text-base font-semibold text-gray-900">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* User card */}
            <div className="mx-4 mt-4 mb-2 flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {freelancerInfo.displayName}
                </p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-600">{freelancerInfo.rating}</span>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] shrink-0">En ligne</Badge>
            </div>

            {/* Nav items */}
            <nav className="flex flex-col gap-0.5 px-3 py-2 flex-1">
              {[
                { tab: 'accueil', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
                { tab: 'annonces', icon: <Megaphone className="w-5 h-5" />, label: 'Annonces' },
                { tab: 'livraisons', icon: <Truck className="w-5 h-5" />, label: 'Livraisons' },
                { tab: 'historique', icon: <History className="w-5 h-5" />, label: 'Historique' },
                { tab: 'wallet', icon: <WalletIcon className="w-5 h-5" />, label: 'Mon Wallet' },
                { tab: 'profil', icon: <UserCircle className="w-5 h-5" />, label: 'Mon profil' },
                { tab: 'missions', icon: <ClipboardList className="w-5 h-5" />, label: 'Missions' },
                { tab: 'politiques', icon: <ScrollText className="w-5 h-5" />, label: 'Politiques' },
              ].map(item => (
                <button key={item.tab}
                  className={cn('flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-colors w-full',
                    activeTab === item.tab ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-50')}
                  onClick={() => { setActiveTab(item.tab); setMobileMenuOpen(false) }}>
                  <span className={activeTab === item.tab ? 'text-orange-500' : 'text-gray-400'}>{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
              <button className="flex items-center gap-4 px-4 py-3 rounded-xl text-left text-gray-400 cursor-not-allowed w-full" disabled>
                <Settings className="w-5 h-5 text-gray-300" />
                <span className="text-sm">Paramètres</span>
              </button>
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-gray-100">
              <button onClick={logout} className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors w-full">
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Body: sidebar desktop + main ── */}
      <div className="flex flex-1">

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-60 shrink-0 sticky top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-100 overflow-y-auto">
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{freelancerInfo.displayName}</p>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600">{freelancerInfo.rating}</span>
              </div>
            </div>
          </div>
          <nav className="flex flex-col gap-1 p-3 flex-1">
            {[
              { tab: 'accueil', icon: <LayoutDashboard className="w-5 h-5 shrink-0" />, label: 'Dashboard' },
              { tab: 'annonces', icon: <Megaphone className="w-5 h-5 shrink-0" />, label: 'Annonces' },
              { tab: 'livraisons', icon: <Truck className="w-5 h-5 shrink-0" />, label: 'Livraisons' },
            ].map(item => (
              <Button key={item.tab} variant="ghost"
                className={cn('w-full justify-start gap-3 rounded-lg', activeTab === item.tab ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700')}
                onClick={() => setActiveTab(item.tab)}>
                {item.icon}{item.label}
              </Button>
            ))}
            <div className="h-px bg-gray-100 my-1" />
            {[
              { tab: 'wallet', icon: <WalletIcon className="w-5 h-5 shrink-0" />, label: 'Mon Wallet' },
              { tab: 'historique', icon: <History className="w-5 h-5 shrink-0" />, label: 'Historique' },
              { tab: 'profil', icon: <UserCircle className="w-5 h-5 shrink-0" />, label: 'Mon profil' },
              { tab: 'missions', icon: <ClipboardList className="w-5 h-5 shrink-0" />, label: 'Missions' },
              { tab: 'politiques', icon: <ScrollText className="w-5 h-5 shrink-0" />, label: 'Politiques' },
            ].map(item => (
              <Button key={item.tab} variant="ghost"
                className={cn('w-full justify-start gap-3 rounded-lg', activeTab === item.tab ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700')}
                onClick={() => setActiveTab(item.tab)}>
                {item.icon}{item.label}
              </Button>
            ))}
            <Button variant="ghost" className="w-full justify-start gap-3 rounded-lg text-gray-700 opacity-50 cursor-not-allowed" disabled>
              <Settings className="w-5 h-5 shrink-0" />Paramètres
            </Button>
            <div className="flex-1" />
            <div className="h-px bg-gray-100 my-1" />
            <Button variant="ghost" className="w-full justify-start gap-3 rounded-lg text-red-600 hover:bg-red-50" onClick={logout}>
              <LogOut className="w-5 h-5 shrink-0" />Déconnexion
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* ── Tab: Accueil ── */}
            {activeTab === 'accueil' && (
              <div className="space-y-6">
                <div className="mb-2">
                  <h2 className="text-2xl md:text-3xl font-bold">Bienvenue, <span className="text-orange-600">{freelancerInfo.displayName}</span></h2>
                  <p className="text-sm text-gray-500 mt-1">Voici un aperçu de votre activité</p>
                  <Button className="mt-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white" size="sm" onClick={() => setActiveTab('augmenter')}>
                    <ArrowUpRight className="w-4 h-4 mr-2" />Augmenter votre profil
                  </Button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  {[
                    { label: 'En cours', value: activeLoading ? '…' : activeDeliveries.length, color: 'text-orange-600', icon: <Truck className="w-3 h-3 mr-1" />, sub: 'Livraisons actives' },
                    { label: 'Terminées', value: freelancerInfo.totalDeliveries, color: 'text-green-600', icon: <CheckCircle2 className="w-3 h-3 mr-1" />, sub: 'Livraisons effectuées' },
                    { label: 'Disponibles', value: availableLoading ? '…' : availableDeliveries.length, color: 'text-blue-600', icon: <Megaphone className="w-3 h-3 mr-1" />, sub: 'Annonces ouvertes' },
                    { label: 'Restantes', value: Math.max(0, 30 - activeDeliveries.length), color: 'text-amber-600', icon: <Target className="w-3 h-3 mr-1" />, sub: 'Places offre en cours' },
                  ].map(s => (
                    <Card key={s.label} className="hover:shadow-md transition-shadow flex flex-col">
                      <CardHeader className="pb-3 px-4 py-3">
                        <CardDescription className="text-[10px] md:text-xs text-black">{s.label}</CardDescription>
                        <CardTitle className={cn('text-xl md:text-2xl', s.color)}>{s.value}</CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 mt-auto">
                        <div className="flex items-center text-xs text-muted-foreground">{s.icon}{s.sub}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Wallet preview */}
                <Card className="relative overflow-hidden border-2 border-orange-100 bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-5"><GoogleWalletIcon className="w-full h-full" /></div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base md:text-lg flex items-center gap-2"><GoogleWalletIcon className="w-6 h-6" />Mon Wallet</CardTitle>
                      <Badge className="bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-100"><DollarSign className="w-3 h-3 mr-1" />Actif</Badge>
                    </div>
                    <CardDescription className="text-xs md:text-sm">Vos gains et votre solde disponible</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl md:text-4xl font-bold text-gray-900">{fmt(freelancerInfo.totalEarnings)}</span>
                      <span className="text-sm text-gray-500 mb-1">FCFA</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-green-600"><TrendingUp className="w-3 h-3" /><span>+12% ce mois</span></div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-500">Ce mois</p>
                        <p className="text-lg font-bold text-gray-900">45 000 <span className="text-xs font-normal text-gray-500">FCFA</span></p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-500">Disponible</p>
                        <p className="text-lg font-bold text-green-600">38 500 <span className="text-xs font-normal text-gray-500">FCFA</span></p>
                      </div>
                    </div>
                    <Button className="mt-4 w-full bg-gradient-to-r from-orange-500 to-white text-orange-600 font-medium border border-orange-200 hover:from-orange-500 hover:to-orange-50" size="sm" onClick={() => setActiveTab('wallet')}>
                      <GoogleWalletIcon className="w-4 h-4 mr-2" />Ouvrir mon Wallet
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {[
                    { tab: 'annonces', icon: <Megaphone className="w-5 h-5 text-orange-500" />, title: 'Voir les annonces', desc: 'Consultez les annonces disponibles et souscrivez aux livraisons' },
                    { tab: 'livraisons', icon: <Truck className="w-5 h-5 text-orange-500" />, title: 'Mes livraisons', desc: 'Suivez vos livraisons en cours et gérez vos tournées' },
                    { tab: 'historique', icon: <History className="w-5 h-5 text-orange-500" />, title: 'Historique', desc: 'Consultez l\'historique de vos livraisons effectuées' },
                    { tab: 'wallet', icon: <GoogleWalletIcon className="w-5 h-5" />, title: 'Mon Wallet', desc: 'Consultez votre solde, vos gains et retirez vos fonds', extra: 'border-2 border-orange-100 hover:border-orange-300 bg-gradient-to-br from-orange-50/50 to-white' },
                    { tab: 'profil', icon: <UserCircle className="w-5 h-5 text-orange-500" />, title: 'Mon profil', desc: 'Gérez vos informations personnelles et paramètres' },
                    { tab: 'missions', icon: <ClipboardList className="w-5 h-5 text-orange-500" />, title: 'Missions', desc: 'Gérez vos missions disponibilités et préférences' },
                    { tab: 'politiques', icon: <ScrollText className="w-5 h-5 text-orange-500" />, title: 'Politiques', desc: 'Consultez les règles de conduite et politiques de paiement' },
                  ].map(a => (
                    <Card key={a.tab} className={cn('cursor-pointer hover:shadow-md transition-shadow', a.extra)} onClick={() => setActiveTab(a.tab)}>
                      <CardHeader>
                        <CardTitle className="text-base md:text-lg flex items-center gap-2">{a.icon}{a.title}</CardTitle>
                        <CardDescription className="text-xs md:text-sm">{a.desc}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                {/* Active deliveries preview */}
                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-lg">Livraisons en cours</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('livraisons')} className="text-orange-600 hover:text-orange-700">Voir tout</Button>
                  </CardHeader>
                  <CardContent>
                    {activeDeliveries.length === 0 ? (
                      <div className="text-center py-8">
                        <Truck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Aucune livraison en cours</p>
                        <p className="text-xs text-gray-400 mt-1">Souscrivez à une annonce pour commencer</p>
                      </div>
                    ) : activeDeliveries.slice(0, 2).map(d => (
                      <div key={d.id} className="p-3 bg-gray-50 rounded-lg border mb-2 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-gray-900">{d.title}</span>
                          <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 text-xs">{d.status === 'ASSIGNED' ? 'Assignée' : 'Souscrit'}</Badge>
                        </div>
                        <p className="text-xs text-gray-500">{d.pickupAddress?.city || 'N/A'} → {d.deliveryAddress?.city || 'N/A'}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ── Tab: Annonces ── */}
            {activeTab === 'annonces' && (
              <>
                <div className="grid lg:grid-cols-2 gap-4">
                  {availableLoading ? (
                    <div className="col-span-2 flex items-center justify-center py-16"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
                  ) : availableDeliveries.length === 0 ? (
                    <div className="col-span-2 text-center py-16">
                      <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune annonce disponible</h3>
                      <p className="text-sm text-gray-500">Revenez plus tard pour voir les nouvelles annonces</p>
                    </div>
                  ) : availableDeliveries.map(delivery => (
                    <Card key={delivery.id} className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow rounded-xl">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-base">{delivery.title}</CardTitle>
                            <p className="text-[10px] text-orange-600 font-medium italic">{delivery.pickupAddress?.city || 'N/A'} → {delivery.deliveryAddress?.city || 'N/A'}</p>
                          </div>
                          {delivery.amount && (
                            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                              <DollarSign className="w-3 h-3 text-green-600" />
                              <span className="text-sm font-semibold text-green-700">{fmt(delivery.amount)} FCFA</span>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {delivery.description && <p className="text-sm text-gray-500 line-clamp-2">{delivery.description}</p>}
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full" /><p className="text-sm text-gray-700"><span className="font-medium">Retrait:</span> {delivery.pickupAddress?.street || delivery.pickupAddress?.city || 'N/A'}</p></div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full" /><p className="text-sm text-gray-700"><span className="font-medium">Livraison:</span> {delivery.deliveryAddress?.street || delivery.deliveryAddress?.city || 'N/A'}</p></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                          {delivery.distance && <div className="flex items-center gap-2"><Navigation className="w-4 h-4" /><span>{delivery.distance.toFixed(1)} km</span></div>}
                          {delivery.amount && <div className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-green-600" /><span className="font-semibold text-green-600">{fmt(delivery.amount)} FCFA</span></div>}
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1 border-orange-500 text-orange-600 hover:bg-orange-50" onClick={() => { setSelectedDelivery(delivery); setDetailsOpen(true) }}>Voir les détails</Button>
                          <Button size="sm" disabled={pendingSubscriptions.has(delivery.id) || subscribedIds.has(delivery.id)}
                            className={cn('flex-1 text-white font-medium', (pendingSubscriptions.has(delivery.id) || subscribedIds.has(delivery.id)) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600')}
                            onClick={() => handleAcceptDelivery(delivery.id)}>
                            {(pendingSubscriptions.has(delivery.id) || subscribedIds.has(delivery.id)) ? 'En attente' : "Souscrire à l'annonce"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Dialog open={detailsOpen} onOpenChange={o => { setDetailsOpen(o); if (!o) setSelectedDelivery(null) }}>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="border-b pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center"><Package className="w-6 h-6 text-orange-600" /></div>
                        <div>
                          <DialogTitle className="text-xl">{selectedDelivery?.title || "Détails de l'annonce"}</DialogTitle>
                          <DialogDescription className="text-xs font-mono text-orange-600">{selectedDelivery?.id}</DialogDescription>
                        </div>
                      </div>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                          <div className="flex items-start gap-3"><div className="w-2 h-2 bg-green-500 rounded-full mt-2" /><div><p className="text-xs text-gray-500 uppercase font-bold">Lieu de Retrait</p><p className="text-sm text-gray-700">{[selectedDelivery?.pickupAddress?.street, selectedDelivery?.pickupAddress?.district, selectedDelivery?.pickupAddress?.city].filter(Boolean).join(', ')}</p></div></div>
                          <div className="flex items-start gap-3"><div className="w-2 h-2 bg-red-500 rounded-full mt-2" /><div><p className="text-xs text-gray-500 uppercase font-bold">Lieu de Livraison</p><p className="text-sm text-gray-700">{[selectedDelivery?.deliveryAddress?.street, selectedDelivery?.deliveryAddress?.district, selectedDelivery?.deliveryAddress?.city].filter(Boolean).join(', ')}</p></div></div>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm h-64 relative z-0">
                          {selectedDelivery?.pickupAddress?.latitude && selectedDelivery?.deliveryAddress?.latitude && (
                            <MapLeaflet center={[(selectedDelivery.pickupAddress.latitude + selectedDelivery.deliveryAddress.latitude) / 2, (selectedDelivery.pickupAddress.longitude + selectedDelivery.deliveryAddress.longitude) / 2]} zoom={12}
                              markers={[{ position: [selectedDelivery.pickupAddress.latitude, selectedDelivery.pickupAddress.longitude], label: 'Retrait', color: '#f97316' }, { position: [selectedDelivery.deliveryAddress.latitude, selectedDelivery.deliveryAddress.longitude], label: 'Livraison', color: '#10b981' }]}
                              route={activeRoute} />
                          )}
                        </div>
                        <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl">
                          {selectedDelivery?.distance && <div className="flex items-center gap-2"><Navigation className="w-5 h-5 text-orange-600" /><span className="font-bold">{selectedDelivery.distance.toFixed(1)} km</span></div>}
                          {selectedDelivery?.duration && <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-orange-600" /><span className="font-bold">{Math.round(selectedDelivery.duration)} min</span></div>}
                          {selectedDelivery?.amount && <div className="text-lg font-black text-orange-600">{fmt(selectedDelivery.amount)} FCFA</div>}
                        </div>
                      </div>
                      <div className="space-y-4">
                        {selectedDelivery?.description && <div><h4 className="text-sm font-bold uppercase tracking-wider mb-2">Description</h4><p className="text-sm text-gray-600">{selectedDelivery.description}</p></div>}
                        {selectedDelivery?.packet && (
                          <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1">Détails du Colis</h4>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                              {selectedDelivery.packet.designation && <div><p className="text-xs text-gray-500">Désignation</p><p className="font-medium">{selectedDelivery.packet.designation}</p></div>}
                              {selectedDelivery.packet.weight && <div><p className="text-xs text-gray-500">Poids</p><p className="font-medium">{selectedDelivery.packet.weight} kg</p></div>}
                            </div>
                          </div>
                        )}
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-bold uppercase tracking-wider mb-3">Destinataire</h4>
                          <div className="bg-blue-50 p-4 rounded-xl space-y-2">
                            {(selectedDelivery?.recipientFirstName || selectedDelivery?.recipientLastName) && (
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">{selectedDelivery?.recipientFirstName?.charAt(0) || '?'}</div>
                                <p className="font-bold text-gray-900">{selectedDelivery?.recipientFirstName} {selectedDelivery?.recipientLastName}</p>
                              </div>
                            )}
                            {selectedDelivery?.recipientPhone && <div className="flex items-center gap-2 text-sm text-gray-600"><Phone className="w-4 h-4" /><span>{selectedDelivery.recipientPhone}</span></div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}

            {/* ── Tab: Livraisons ── */}
            {activeTab === 'livraisons' && (
              activeLoading ? (
                <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
              ) : activeDeliveries.length === 0 ? (
                <div className="text-center py-16">
                  <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune livraison</h3>
                  <p className="text-sm text-gray-500">Souscrivez à une annonce pour voir vos livraisons ici</p>
                  <Button className="mt-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white" onClick={() => setActiveTab('annonces')}>Voir les annonces</Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {activeDeliveries.map(delivery => (
                    <Card key={delivery.id} className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow rounded-xl">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div><CardTitle className="text-base">{delivery.title}</CardTitle><p className="text-[10px] text-gray-400 italic">{delivery.pickupAddress?.city || 'N/A'} → {delivery.deliveryAddress?.city || 'N/A'}</p></div>
                          <Badge variant="outline" className={cn(delivery.status === 'ASSIGNED' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-orange-100 text-orange-700 border-orange-300')}>
                            {delivery.status === 'ASSIGNED' ? <><CheckCircle2 className="w-3 h-3 mr-1" />Assignée</> : <><Package className="w-3 h-3 mr-1" />Souscrit</>}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full" /><p className="text-sm text-gray-700"><span className="font-medium">Retrait:</span> {delivery.pickupAddress?.street || delivery.pickupAddress?.city || 'N/A'}</p></div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full" /><p className="text-sm text-gray-700"><span className="font-medium">Livraison:</span> {delivery.deliveryAddress?.street || delivery.deliveryAddress?.city || 'N/A'}</p></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                          {delivery.distance && <div className="flex items-center gap-2"><Navigation className="w-4 h-4" /><span>{delivery.distance.toFixed(1)} km</span></div>}
                          {delivery.amount && <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-600" /><span className="font-semibold text-green-600">{fmt(delivery.amount)} FCFA</span></div>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            )}

            {/* ── Tab: Wallet ── */}
            {activeTab === 'wallet' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <Card className="relative overflow-hidden border-2 border-orange-100 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 text-white">
                  <div className="absolute top-0 right-0 w-40 h-40 opacity-10"><GoogleWalletIcon className="w-full h-full" /></div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-orange-100 flex items-center gap-2"><WalletIcon className="w-4 h-4" />Solde disponible</CardTitle>
                      <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10" onClick={() => setWalletShowBalance(!walletShowBalance)}>
                        {walletShowBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-4xl md:text-5xl font-bold">{walletShowBalance ? walletData.available.toLocaleString() : '•••••'}</span>
                      <span className="text-sm text-orange-100 mb-2">FCFA</span>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex-1"><p className="text-xs text-orange-100">Ce mois</p><p className="text-lg font-bold">{walletShowBalance ? walletData.thisMonth.toLocaleString() : '••••'} <span className="text-xs font-normal text-orange-100">FCFA</span></p></div>
                      <div className="flex-1"><p className="text-xs text-orange-100">En attente</p><p className="text-lg font-bold">{walletShowBalance ? walletData.pending.toLocaleString() : '••••'} <span className="text-xs font-normal text-orange-100">FCFA</span></p></div>
                      <div className="flex items-center gap-1 text-xs text-green-200"><TrendingUp className="w-3 h-3" /><span>+{walletShowBalance ? '12' : '•'}% vs mois dernier</span></div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                  <Button className="h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0" onClick={() => { setRetraitMethod('momo'); setShowRetraitDialog(true) }}>
                    <Download className="w-6 h-6" /><span className="text-sm font-semibold">Retirer</span><span className="text-[10px] text-orange-100">Mobile Money</span>
                  </Button>
                  <Button className="h-auto py-4 flex flex-col items-center gap-2 bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-50" onClick={() => { setRetraitMethod('bank'); setShowRetraitDialog(true) }}>
                    <Building2 className="w-6 h-6" /><span className="text-sm font-semibold">Retirer</span><span className="text-[10px]">Vers compte bancaire</span>
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[{ label: 'Total gains', value: walletData.totalEarnings, sub: `+${Math.round((walletData.thisMonth - walletData.lastMonth) / walletData.lastMonth * 100)}%`, color: 'text-green-600' }, { label: 'Mois dernier', value: walletData.lastMonth, sub: 'Déc 2024', color: 'text-muted-foreground' }, { label: 'En attente', value: walletData.pending, sub: 'FCFA', color: 'text-amber-600' }].map(s => (
                    <Card key={s.label} className="flex flex-col">
                      <CardHeader className="pb-2 px-3 py-3"><CardDescription className="text-[10px] text-gray-500">{s.label}</CardDescription><CardTitle className={cn('text-lg', s.color)}>{s.value.toLocaleString()}</CardTitle></CardHeader>
                      <CardContent className="px-3 pb-3 mt-auto"><div className={cn('flex items-center text-[10px]', s.color)}><Clock className="w-3 h-3 mr-1" />{s.sub}</div></CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Clock className="w-5 h-5 text-orange-500" />Transactions</CardTitle>
                    <div className="flex gap-2 mt-2">
                      {[{ key: 'all' as const, label: 'Toutes' }, { key: 'credit' as const, label: 'Gains' }, { key: 'debit' as const, label: 'Retraits' }].map(f => (
                        <button key={f.key} onClick={() => setWalletActiveFilter(f.key)} className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-colors', walletActiveFilter === f.key ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>{f.label}</button>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                      {walletFilteredTxns.map(txn => (
                        <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100')}>
                              {txn.type === 'credit' ? <ArrowDownLeft className="w-5 h-5 text-green-600" /> : <ArrowUpRight className="w-5 h-5 text-red-500" />}
                            </div>
                            <div className="min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{txn.label}</p><p className="text-xs text-gray-500">{txn.date}</p></div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-3">
                            <p className={cn('text-sm font-bold', txn.type === 'credit' ? 'text-green-600' : 'text-red-500')}>{txn.type === 'credit' ? '+' : '-'}{txn.amount.toLocaleString()} FCFA</p>
                            <Badge variant="outline" className={cn('text-[9px] px-1.5 py-0', txn.status === 'completed' && 'bg-green-50 text-green-600 border-green-200', txn.status === 'pending' && 'bg-amber-50 text-amber-600 border-amber-200', txn.status === 'failed' && 'bg-red-50 text-red-500 border-red-200')}>
                              {txn.status === 'completed' && <><CheckCircle2 className="w-2.5 h-2.5 mr-0.5 inline" />Terminé</>}
                              {txn.status === 'pending' && <><Clock className="w-2.5 h-2.5 mr-0.5 inline" />En attente</>}
                              {txn.status === 'failed' && <><XCircle className="w-2.5 h-2.5 mr-0.5 inline" />Échoué</>}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-100 bg-orange-50/50">
                  <CardContent className="p-4 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div><p className="text-sm font-semibold text-gray-900">Sécurité de votre Wallet</p><p className="text-xs text-gray-600 mt-1">Vos fonds sont protégés. Les retraits sont traités sous 24h ouvrables. Montant minimum : 500 FCFA.</p></div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ── Tab: Historique ── */}
            {activeTab === 'historique' && (
              <div className="max-w-7xl mx-auto space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <Label htmlFor="hist-search" className="text-sm font-semibold text-gray-800 mb-2">Rechercher une livraison</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input id="hist-search" placeholder="Numéro, client ou adresse..." value={histSearchTerm} onChange={e => setHistSearchTerm(e.target.value)} className="pl-10" />
                        </div>
                      </div>
                      <div className="md:w-64">
                        <Label className="text-sm font-semibold text-gray-800 mb-2">Période</Label>
                        <select value={histFilterPeriod} onChange={e => setHistFilterPeriod(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                          <option value="all">Toutes les livraisons</option>
                          <option value="month">30 derniers jours</option>
                          <option value="week">7 derniers jours</option>
                          <option value="today">Aujourd'hui</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {filteredHistorique.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune livraison trouvée</h3>
                    <p className="text-gray-500">Essayez de modifier vos critères de recherche ou de filtre</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Liste des livraisons</h2>
                      <p className="text-sm text-gray-500">{filteredHistorique.length} livraison{filteredHistorique.length > 1 ? 's' : ''} trouvée{filteredHistorique.length > 1 ? 's' : ''}</p>
                    </div>
                    {filteredHistorique.map(d => (
                      <Card key={d.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-lg text-gray-900">{d.id}</h3>
                                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300"><CheckCircle2 className="w-3 h-3 mr-1" />Livré</Badge>
                                <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">{d.packageType}</Badge>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2"><Phone className="w-3 h-3" /><span className="font-medium">Client:</span> {d.customerName}</div>
                                <div className="flex items-center gap-2"><CalendarIcon className="w-3 h-3" /><span>{d.completedDate}</span></div>
                                <div className="flex items-center gap-2"><Clock className="w-3 h-3" /><span>{d.completedAt}</span></div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2 text-sm"><div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" /><p className="text-gray-700"><span className="font-medium">Retrait:</span> {d.pickupAddress}</p></div>
                                <div className="flex items-start gap-2 text-sm"><div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0" /><p className="text-gray-700"><span className="font-medium">Livraison:</span> {d.deliveryAddress}</p></div>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1 text-gray-600"><MapPin className="w-3 h-3" />{d.distance} km</div>
                                <div className="flex items-center gap-1 text-green-600 font-semibold"><CreditCard className="w-3 h-3" />{d.earnings.toLocaleString()} FCFA</div>
                                {d.tip > 0 && <div className="flex items-center gap-1 text-purple-600 font-semibold"><TrendingUp className="w-3 h-3" />+{d.tip.toLocaleString()} FCFA (pourboire)</div>}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-yellow-50 px-4 py-3 rounded-lg">
                              <span className="text-sm font-semibold text-gray-700">Note:</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => <Star key={i} className={cn('w-5 h-5', i < d.rating ? 'text-yellow-500 fill-current' : 'text-gray-300')} />)}
                              </div>
                              <span className="text-2xl font-bold text-yellow-600 ml-1">{d.rating}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Tab: Profil ── */}
            {activeTab === 'profil' && (
              <div className="max-w-4xl mx-auto space-y-6" suppressHydrationWarning>
                {!profilShowContent ? (
                  <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Chargement de votre profil...</p>
                  </div>
                ) : (
                  <>
                    <Card className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30"><User className="w-10 h-10 text-white" /></div>
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-1">{user?.lastName || ''} {user?.firstName || ''}</h2>
                            <div className="flex items-center gap-4 text-sm opacity-90">
                              <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span className="font-semibold">{user?.rating || 5.0}</span></div>
                              <span>•</span>
                              <span>{user?.totalDeliveries || 0} livraisons</span>
                              <span>•</span>
                              <span>Membre depuis {formatProfilDate((user as any)?.memberSince)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-orange-600" />Informations personnelles</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { id: 'p-lastName', label: 'Nom', key: 'lastName' as const, icon: <User className="w-5 h-5 text-gray-400" />, type: 'text' },
                            { id: 'p-firstName', label: 'Prénom', key: 'firstName' as const, icon: <User className="w-5 h-5 text-gray-400" />, type: 'text' },
                            { id: 'p-email', label: 'Email', key: 'email' as const, icon: <Mail className="w-5 h-5 text-gray-400" />, type: 'email' },
                            { id: 'p-phone', label: 'Téléphone', key: 'phone' as const, icon: <Phone className="w-5 h-5 text-gray-400" />, type: 'tel' },
                          ].map(f => (
                            <div key={f.id}>
                              <Label htmlFor={f.id}>{f.label} {profilIsEditing && <span className="text-red-500">*</span>}</Label>
                              {profilIsEditing
                                ? <Input id={f.id} type={f.type} value={editedData[f.key]} onChange={e => setEditedData({ ...editedData, [f.key]: e.target.value })} className="mt-1" />
                                : <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mt-1">{f.icon}<span className="font-medium">{(user as any)?.[f.key] || 'Non renseigné'}</span></div>}
                            </div>
                          ))}
                          <div>
                            <Label htmlFor="p-password">Mot de passe {profilIsEditing && <span className="text-red-500">*</span>}</Label>
                            {profilIsEditing ? (
                              <div className="relative mt-1">
                                <Input id="p-password" type={profilShowPassword ? 'text' : 'password'} value={editedData.password} onChange={e => setEditedData({ ...editedData, password: e.target.value })} className="pr-10" />
                                <button type="button" onClick={() => setProfilShowPassword(!profilShowPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500">
                                  {profilShowPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mt-1 relative pr-10 min-h-[52px]">
                                <Lock className="w-5 h-5 text-gray-400 shrink-0" />
                                <span className="font-medium">{profilShowPassword ? (user as any)?.password || '••••••••' : '••••••••'}</span>
                                <button type="button" onClick={() => setProfilShowPassword(!profilShowPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500">
                                  {profilShowPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        {profilIsEditing && (
                          <div className="flex gap-3 pt-4">
                            <Button onClick={handleProfilSave} disabled={profilIsLoading} className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                              <span className="flex items-center justify-center gap-2">{profilIsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}Enregistrer</span>
                            </Button>
                            <Button onClick={() => setProfilIsEditing(false)} variant="outline" className="flex-1">Annuler</Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5 text-orange-600" />Actions du compte</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <Button onClick={() => setProfilIsEditing(true)} variant="outline" className="w-full justify-start h-12 border-2 border-orange-200 hover:bg-orange-50 text-orange-700"><Edit className="w-5 h-5 mr-3" />Modifier mon compte</Button>
                        <Button onClick={logout} variant="outline" className="w-full justify-start h-12 border-2 border-blue-200 hover:bg-blue-50 text-blue-700"><LogOut className="w-5 h-5 mr-3" />Déconnexion</Button>
                        <Button onClick={() => setProfilShowDeleteDialog(true)} variant="outline" className="w-full justify-start h-12 border-2 border-red-200 hover:bg-red-50 text-red-600"><Trash2 className="w-5 h-5 mr-3" />Supprimer le compte</Button>
                      </CardContent>
                    </Card>

                    {profilShowDeleteDialog && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="max-w-md w-full border-2 border-orange-200">
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-orange-600" /></div>
                              <div><CardTitle className="text-xl text-orange-900">Supprimer le compte ?</CardTitle><p className="text-sm text-orange-700 mt-1">Cette action est irréversible</p></div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600 mb-6">Êtes-vous sûr ? Toutes vos données seront définitivement perdues.</p>
                            <div className="flex gap-3">
                              <Button onClick={() => setProfilShowDeleteDialog(false)} variant="outline" className="flex-1">Non</Button>
                              <Button onClick={handleProfilDelete} disabled={profilIsLoading} className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white">
                                {profilIsLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}Oui, supprimer
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── Tab: Augmenter ── */}
            {activeTab === 'augmenter' && (
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="mb-2">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {user?.clientId && user?.deliveryPersonId ? 'Basculer de profil' : 'Augmenter votre profil'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {user?.clientId && user?.deliveryPersonId
                      ? 'Vous avez les deux comptes. Basculez d\'un dashboard à l\'autre.'
                      : 'Créez un second profil pour accéder à plus de fonctionnalités.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  {/* Go — masqué si on a déjà un compte Go (clientId) */}
                  {!user?.clientId && (
                    <Card className="relative overflow-hidden border-2 border-gray-200 hover:border-orange-300 transition-all hover:shadow-xl cursor-pointer group">
                      <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center">
                          <Package className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Espace Go</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Espace expéditeur. Publiez des annonces, trouvez un livreur et suivez vos colis.
                          </p>
                        </div>
                        <div className="w-full space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            <span>Publiez des annonces facilement</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            <span>Suivi en temps réel de vos colis</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            <span>Wallet et paiements sécurisés</span>
                          </div>
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white h-12 text-base font-semibold"
                          onClick={() => router.push('/inscription?role=client&step=2')}
                        >
                          <ArrowUpRight className="w-4 h-4 mr-2" />
                          Créer un compte Go
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Message si on a déjà les 2 comptes */}
                  {user?.clientId && user?.deliveryPersonId && (
                    <div className="md:col-span-2 text-center py-8">
                      <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-lg text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        Vous avez les deux profils. Utilisez le bouton ci-dessus pour basculer.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Tab: Missions ── */}
            {activeTab === 'missions' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Missions</h2>
                  <p className="text-sm text-gray-500 mt-1">Gérez vos disponibilités, tarifs et préférences de colis</p>
                </div>

                {/* Disponibilités */}
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-orange-600" />Disponibilités hebdomadaires</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { day: 'Lundi', defaultChecked: true, start: '08:00', end: '18:00' },
                      { day: 'Mardi', defaultChecked: true, start: '08:00', end: '18:00' },
                      { day: 'Mercredi', defaultChecked: true, start: '08:00', end: '18:00' },
                      { day: 'Jeudi', defaultChecked: true, start: '08:00', end: '18:00' },
                      { day: 'Vendredi', defaultChecked: true, start: '08:00', end: '18:00' },
                      { day: 'Samedi', defaultChecked: false, start: '09:00', end: '13:00' },
                      { day: 'Dimanche', defaultChecked: false, start: '09:00', end: '13:00' },
                    ].map(d => (
                      <div key={d.day} className="grid grid-cols-[140px_1fr_1fr] items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" defaultChecked={d.defaultChecked} className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 w-4 h-4" />
                          <span className="text-sm font-semibold text-gray-800">{d.day}</span>
                        </label>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Début</span>
                          <input type="time" defaultValue={d.start} className="p-2 text-sm rounded border border-gray-200 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Fin</span>
                          <input type="time" defaultValue={d.end} className="p-2 text-sm rounded border border-gray-200 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Tarification */}
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-orange-600" />Tarification du service</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold">Prix par kilomètre (FCFA)</Label>
                        <div className="relative mt-1.5">
                          <input type="number" defaultValue={250} className="w-full p-3 pr-12 rounded-lg border border-gray-200 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">/km</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Prix par m³ (FCFA)</Label>
                        <div className="relative mt-1.5">
                          <input type="number" defaultValue={1500} className="w-full p-3 pr-12 rounded-lg border border-gray-200 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">/m³</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Surfacturation par minute d'attente</p>
                          <p className="text-xs text-gray-500">Frais pour temps d'attente au ramassage/livraison</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                        </label>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Tarif d'attente (FCFA/min)</Label>
                        <input type="number" defaultValue={50} className="mt-1.5 w-full p-3 rounded-lg border border-gray-200 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm bg-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Types de colis */}
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5 text-orange-600" />Colis acceptés</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold">Plage de poids (kg)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <input type="number" defaultValue={0} placeholder="Min" className="w-full p-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-500" />
                        <span className="text-gray-400">à</span>
                        <input type="number" defaultValue={50} placeholder="Max" className="w-full p-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-500" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-3">Styles de colis acceptés</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { label: 'Standard', checked: true },
                          { label: 'Électronique', checked: true },
                          { label: 'Fragile', checked: false },
                          { label: 'Documents', checked: true },
                        ].map(c => (
                          <label key={c.label} className="flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:border-orange-300 cursor-pointer transition-all has-[:checked]:bg-orange-50 has-[:checked]:border-orange-400">
                            <input type="checkbox" defaultChecked={c.checked} className="hidden" />
                            <Package className="w-7 h-7 mb-2 text-gray-500" />
                            <span className="text-xs font-bold text-gray-700">{c.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8">
                        Enregistrer les modifications
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ── Tab: Politiques ── */}
            {activeTab === 'politiques' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Politiques Freelancer</h2>
                  <p className="text-sm text-gray-500 mt-1">Règles de conduite et engagements de la plateforme</p>
                </div>

                {/* Engagement */}
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-orange-600" />Engagement pour une logistique professionnelle</CardTitle></CardHeader>
                  <CardContent className="text-sm text-gray-600 space-y-3 leading-relaxed">
                    <p>Chez TiiBnTick Freelancer, nous redéfinissons la logistique du dernier kilomètre par l'excellence et la confiance. Notre plateforme n'est pas seulement un outil de mise en relation, c'est un écosystème où chaque livraison compte.</p>
                    <p>Nous nous engageons à fournir une infrastructure robuste permettant aux freelancers de travailler en toute autonomie tout en garantissant un niveau de service premium.</p>
                  </CardContent>
                </Card>

                {/* Règles de conduite */}
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-orange-600" />Règles de conduite</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { icon: <Clock className="w-6 h-6 text-orange-500" />, title: 'Ponctualité', desc: 'Respect strict des créneaux de ramassage et de livraison pour maintenir la fluidité du réseau.' },
                        { icon: <Star className="w-6 h-6 text-orange-500" />, title: 'Courtoisie', desc: 'Représenter TiiBnTick avec respect auprès des clients. Une communication claire est essentielle.' },
                        { icon: <Package className="w-6 h-6 text-orange-500" />, title: 'Manipulation Sécurisée', desc: 'Garantir l\'intégrité physique de chaque colis confié, du point A au point B.' },
                      ].map(r => (
                        <div key={r.title} className="space-y-2">
                          {r.icon}
                          <h4 className="font-semibold text-gray-800">{r.title}</h4>
                          <p className="text-sm text-gray-500">{r.desc}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Politique de paiement */}
                <Card className="bg-gray-900 text-white border-0">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-white"><DollarSign className="w-5 h-5 text-orange-400" />Politique de Paiement Garanti</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 border border-white/20 rounded-lg">
                        <p className="font-semibold mb-1">Commissions Transparentes</p>
                        <p className="text-sm text-white/70">TiiBnTick prélève une commission fixe sur chaque course, couvrant les frais de service et l'assurance.</p>
                      </div>
                      <div className="p-4 border border-white/20 rounded-lg">
                        <p className="font-semibold mb-1">Délais de Versement</p>
                        <p className="text-sm text-white/70">Versements journaliers pour une liquidité immédiate ou hebdomadaires pour une gestion simplifiée.</p>
                      </div>
                    </div>
                    <div className="bg-orange-500/20 p-5 rounded-lg border border-orange-500/40">
                      <h4 className="font-semibold mb-3 flex items-center gap-2"><Shield className="w-4 h-4" />Paiement Garanti</h4>
                      <p className="text-sm text-white/80 mb-2">Les fonds sont bloqués par la plateforme dès l'acceptation de la mission.</p>
                      <p className="text-xs text-white/60">Le virement est débloqué vers votre compte TiiBnTick dès la validation finale par le destinataire via QR Code de sécurité.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Résiliation */}
                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-red-700"><AlertTriangle className="w-5 h-5" />Résiliation et Suspension</CardTitle></CardHeader>
                  <CardContent className="text-sm text-gray-600 space-y-3">
                    <p>Le non-respect répété ou grave de nos politiques peut entraîner une suspension temporaire ou définitive du compte Freelancer :</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li>Annulations de missions abusives et répétées (plus de 3 en 30 jours).</li>
                      <li>Comportement inapproprié ou non-professionnel envers les clients.</li>
                      <li>Fraude sur les documents ou utilisation de comptes tiers.</li>
                      <li>Manquement aux règles de sécurité routière ou manipulation dangereuse des colis.</li>
                    </ul>
                    <p className="font-semibold text-gray-800 italic pt-2">TiiBnTick se réserve le droit de geler les avoirs en cours en cas d'enquête pour fraude avérée.</p>
                  </CardContent>
                </Card>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ── Dialog Retrait Wallet ── */}
      <Dialog open={showRetraitDialog} onOpenChange={setShowRetraitDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Download className="w-5 h-5 text-orange-500" />Retirer des fonds</DialogTitle>
            <DialogDescription>{retraitMethod === 'momo' ? 'Effectuez un retrait vers votre compte Mobile Money' : 'Effectuez un retrait vers votre compte bancaire'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
              {retraitMethod === 'momo' ? <><Smartphone className="w-6 h-6 text-orange-500" /><div><p className="text-sm font-semibold text-gray-900">Mobile Money</p><p className="text-xs text-gray-500">MTN / Moov / Orange Money</p></div></>
                : <><Building2 className="w-6 h-6 text-orange-500" /><div><p className="text-sm font-semibold text-gray-900">Virement bancaire</p><p className="text-xs text-gray-500">Vers votre compte bancaire</p></div></>}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Solde disponible</span>
              <span className="font-bold text-green-600">{walletData.available.toLocaleString()} FCFA</span>
            </div>
            <div>
              <Label htmlFor="retrait-amount" className="text-sm font-medium">Montant (FCFA)</Label>
              <Input id="retrait-amount" type="number" placeholder="Entrez le montant" value={retraitAmount} onChange={e => setRetraitAmount(e.target.value)} min={500} max={walletData.available} className="mt-1.5" />
              <p className="text-[10px] text-gray-400 mt-1">Minimum : 500 FCFA</p>
            </div>
            <div className="flex gap-2">
              {[1000, 5000, 10000, 20000].map(amount => (
                <button key={amount} onClick={() => setRetraitAmount(String(amount))}
                  className={cn('flex-1 py-2 rounded-lg text-xs font-medium border transition-colors', retraitAmount === String(amount) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300')}>
                  {amount >= 1000 ? `${amount / 1000}k` : amount}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild><Button variant="outline" className="flex-1">Annuler</Button></DialogClose>
            <Button className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white" onClick={handleRetrait}>
              <Send className="w-4 h-4 mr-2" />Confirmer le retrait
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default withAuth(FreelancerDashboard, ['LIVREUR'])
