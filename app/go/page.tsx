'use client'

import { useState, useEffect as useEffectProfil } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { updateClient, checkEmail, checkNationalId, deleteClient } from '@/services/clientService'
import dynamic from 'next/dynamic'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const MapLeaflet = dynamic(() => import('@/components/MapLeaflet'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-100 animate-pulse rounded-xl" />
});
import {
  MapPin,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Star,
  Menu,
  X,
  Package,
  Megaphone,
  Truck,
  Bell,
  Home,
  LayoutDashboard,
  MessageSquare,
  User,
  Calendar,
  MapPin as MapPinIcon,
  LogOut,
  DollarSign,
  MapIcon,
  Plus,
  UserCircle,
  Settings,
  Contact,
  Wallet as WalletIcon,
  TrendingUp,
  TrendingDown,
  Navigation,
  Send,
  FileText,
  Crown,
  Mail,
  Phone,
  CreditCard,
  Edit,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  Shield,
  Building2,
  Smartphone,
  ArrowDownLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { withAuth } from '@/components/hoc/withAuth'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useCallback } from 'react'
import {
  getAnnouncementByClientId,
  deleteAnnouncement,
  publishAnnouncement,
  updateAnnouncement,
  getSubscriptions,
  assignDeliveryPerson,
  AnnouncementResponseDTO,
  SubscriptionResponseDTO
} from '@/services/announcementService'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { getRoute } from '@/services/routing'

// Deterministic number formatter
function fmt(n: number | undefined): string {
  if (n == null) return '0'
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')
}

// Google Wallet-style icon
function GoogleWalletIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="28" height="28" rx="5" fill="#F97316" />
      <rect x="16" y="6" width="28" height="28" rx="5" fill="#fff" stroke="#FDBA74" strokeWidth="1" />
      <rect x="16" y="6" width="28" height="7" rx="5" fill="url(#go-wallet-gradient-top)" />
      <rect x="16" y="27" width="28" height="7" rx="5" fill="url(#go-wallet-gradient-bottom)" />
      <path d="M26 20L23 26L20 20H18L22.5 28L21 31H23L29 20H26Z" fill="#F97316" />
      <path d="M32 20L29 26L26 20H24L28.5 28L27 31H29L35 20H32Z" fill="#F97316" opacity="0.7" />
      <defs>
        <linearGradient id="go-wallet-gradient-top" x1="16" y1="6" x2="44" y2="13">
          <stop offset="0" stopColor="#FDBA74" />
          <stop offset="0.5" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FED7AA" />
        </linearGradient>
        <linearGradient id="go-wallet-gradient-bottom" x1="16" y1="27" x2="44" y2="34">
          <stop offset="0" stopColor="#FDBA74" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function GoLanding() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('accueil')
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [myAnnouncements, setMyAnnouncements] = useState<AnnouncementResponseDTO[]>([])
  const [route, setRoute] = useState<any>(null)

  // Réponses tab state
  const [responsesAnnouncements, setResponsesAnnouncements] = useState<AnnouncementResponseDTO[]>([])
  const [responsesLoading, setResponsesLoading] = useState(false)
  const [selectedResponseAnnouncement, setSelectedResponseAnnouncement] = useState<AnnouncementResponseDTO | null>(null)
  const [subscriptions, setSubscriptions] = useState<SubscriptionResponseDTO[]>([])
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false)
  const [subscriptionsDialogOpen, setSubscriptionsDialogOpen] = useState(false)
  const [assigningId, setAssigningId] = useState<string | null>(null)

  // Adresses state
  const [savedAddresses, setSavedAddresses] = useState<
    { id: string; label: string; street: string; city: string; isDefault: boolean }[]
  >([])
  const [showAddAddressDialog, setShowAddAddressDialog] = useState(false)
  const [newAddress, setNewAddress] = useState({ label: '', street: '', city: '' })

  // Contacts state
  const [savedContacts, setSavedContacts] = useState<
    { id: string; lastName: string; firstName: string; phone: string; isDefault: boolean }[]
  >([])
  const [showAddContactDialog, setShowAddContactDialog] = useState(false)
  const [newContact, setNewContact] = useState({ lastName: '', firstName: '', phone: '' })

  const fetchAnnouncements = useCallback(async () => {
    if (!user?.clientId) return
    setLoading(true)
    try {
      const data = await getAnnouncementByClientId(user.clientId)
      setMyAnnouncements(data)
    } catch (error) {
      toast.error('Erreur lors du chargement de vos annonces')
    } finally {
      setLoading(false)
    }
  }, [user?.clientId])

  useEffect(() => {
    if (activeTab === 'annonces' || activeTab === 'accueil') {
      fetchAnnouncements()
    }
    if (activeTab === 'reponses') {
      fetchResponsesAnnouncements()
    }
  }, [activeTab, fetchAnnouncements])

  const fetchResponsesAnnouncements = async () => {
    if (!user?.clientId) return
    setResponsesLoading(true)
    try {
      const data = await getAnnouncementByClientId(user.clientId)
      setResponsesAnnouncements(data)
    } catch (error) {
      toast.error('Erreur lors du chargement des annonces')
    } finally {
      setResponsesLoading(false)
    }
  }

  const handleViewSubscriptions = async (announcement: AnnouncementResponseDTO) => {
    setSelectedResponseAnnouncement(announcement)
    setSubscriptionsDialogOpen(true)
    setSubscriptionsLoading(true)
    try {
      const subs = await getSubscriptions(announcement.id)
      setSubscriptions(subs)
    } catch (error) {
      toast.error('Erreur lors du chargement des souscriptions')
      setSubscriptions([])
    } finally {
      setSubscriptionsLoading(false)
    }
  }

  const handleAssignDeliveryPerson = async (deliveryPersonId: string) => {
    if (!selectedResponseAnnouncement) return
    setAssigningId(deliveryPersonId)
    try {
      const updated = await assignDeliveryPerson(selectedResponseAnnouncement.id, deliveryPersonId)
      setResponsesAnnouncements(prev =>
        prev.map(a => a.id === updated.id ? updated : a)
      )
      setMyAnnouncements(prev =>
        prev.map(a => a.id === updated.id ? updated : a)
      )
      setSelectedResponseAnnouncement(updated)
      setSubscriptionsDialogOpen(false)
      toast.success('Livreur assigné avec succès ! Un email de notification lui a été envoyé.')
    } catch (error) {
      toast.error("Erreur lors de l'assignation du livreur")
    } finally {
      setAssigningId(null)
    }
  }

  useEffect(() => {
    const fetchRoute = async () => {
      if (
        selectedAnnouncement?.pickupAddress?.latitude &&
        selectedAnnouncement?.pickupAddress?.longitude &&
        selectedAnnouncement?.deliveryAddress?.latitude &&
        selectedAnnouncement?.deliveryAddress?.longitude
      ) {
        try {
          const routeData = await getRoute(
            selectedAnnouncement.pickupAddress.latitude,
            selectedAnnouncement.pickupAddress.longitude,
            selectedAnnouncement.deliveryAddress.latitude,
            selectedAnnouncement.deliveryAddress.longitude,
            selectedAnnouncement.transportMethod || 'driving'
          );
          setRoute(routeData);
        } catch (error) {
          console.error('Error fetching route:', error);
          setRoute(null);
        }
      } else {
        setRoute(null);
      }
    };
    fetchRoute();
  }, [selectedAnnouncement]);

  // Fonction pour publier une annonce
  const handlePublishAnnouncement = async (id: string) => {
    try {
      await publishAnnouncement(id)
      toast.success('Annonce publiée avec succès')
      fetchAnnouncements()
    } catch (error) {
      toast.error('Erreur lors de la publication')
    }
  }

  // State pour la boîte de dialogue de suppression
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null)

  // Fonction pour demander la suppression (ouvre la modale)
  const confirmDelete = (id: string) => {
    setAnnouncementToDelete(id)
    setDeleteDialogOpen(true)
  }

  // Fonction pour exécuter la suppression après confirmation
  const executeDelete = async () => {
    if (!announcementToDelete) return

    try {
      await deleteAnnouncement(announcementToDelete)
      toast.success('Annonce supprimée avec succès')
      setMyAnnouncements((prev) => prev.filter((ann) => ann.id !== announcementToDelete))
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    } finally {
      setDeleteDialogOpen(false)
      setAnnouncementToDelete(null)
    }
  }

  // Fonction pour mettre à jour une annonce
  const handleUpdateAnnouncement = async (updatedFields: any) => {
    if (!selectedAnnouncement) return;
    try {
      const payload = {
        clientId: selectedAnnouncement.clientId,
        title: selectedAnnouncement.title,
        description: selectedAnnouncement.description,
        recipientFirstName: selectedAnnouncement.recipientFirstName,
        recipientLastName: selectedAnnouncement.recipientLastName,
        recipientEmail: selectedAnnouncement.recipientEmail,
        recipientPhone: selectedAnnouncement.recipientPhone,
        shipperFirstName: selectedAnnouncement.shipperFirstName,
        shipperLastName: selectedAnnouncement.shipperLastName,
        shipperEmail: selectedAnnouncement.shipperEmail,
        shipperPhone: selectedAnnouncement.shipperPhone,
        amount: updatedFields.amount ?? selectedAnnouncement.amount,
        signatureUrl: selectedAnnouncement.signatureUrl,
        paymentMethod: selectedAnnouncement.paymentMethod,
        transportMethod: selectedAnnouncement.transportMethod,
        distance: selectedAnnouncement.distance,
        duration: selectedAnnouncement.duration,
        pickupAddress: selectedAnnouncement.pickupAddress,
        deliveryAddress: selectedAnnouncement.deliveryAddress,
        packet: {
          ...selectedAnnouncement.packet,
          ...updatedFields.packet,
        },
      };
      const updated = await updateAnnouncement(selectedAnnouncement.id, payload);
      setMyAnnouncements((prev) =>
        prev.map((ann) => (ann.id === updated.id ? updated : ann))
      );
      setSelectedAnnouncement(updated);
      setIsEditing(false);
      toast.success('Annonce mise à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de l\'annonce');
    }
  };



  // Client info from context
  const clientInfo = {
    firstName: user?.firstName || 'Go',
    lastName: user?.lastName || '',
    rating: user?.rating || 4.6,
    totalOrders: user?.totalDeliveries || 0
  }

  // ── Profil state ──────────────────────────────────────────────────
  const { toast: toastUI } = useToast()
  const { login, refreshUser } = useAuth() as any
  const [profilHasMounted, setProfilHasMounted] = useState(false)
  const [profilIsEditing, setProfilIsEditing] = useState(false)
  const [profilShowDeleteDialog, setProfilShowDeleteDialog] = useState(false)
  const [profilShowPassword, setProfilShowPassword] = useState(false)
  const [profilIsLoading, setProfilIsLoading] = useState(false)
  const [clientData, setClientData] = useState({
    firstName: '', lastName: '', email: '', phone: '', nationalId: '',
    password: '', rating: 5.0, totalOrders: 0, memberSince: new Date().toISOString()
  })
  const [editedData, setEditedData] = useState({
    firstName: '', lastName: '', email: '', phone: '', nationalId: '', password: ''
  })

  useEffectProfil(() => {
    setProfilHasMounted(true)
    if (typeof refreshUser === 'function') refreshUser()
  }, [])

  useEffectProfil(() => {
    if (user) {
      const d = {
        firstName: user.firstName || '', lastName: user.lastName || '',
        email: user.email || '', phone: (user as any).phone || '',
        nationalId: (user as any).nationalId || '',
        password: (user as any).password || '123atanga',
        rating: user.rating || 5.0, totalOrders: 0,
        memberSince: (user as any).memberSince || new Date().toISOString()
      }
      setClientData(d)
      setEditedData({ firstName: d.firstName, lastName: d.lastName, email: d.email, phone: d.phone, nationalId: d.nationalId, password: d.password })
    }
  }, [user])

  const handleProfilSave = async () => {
    const missing = []
    if (!editedData.firstName) missing.push('Prénom')
    if (!editedData.lastName) missing.push('Nom')
    if (!editedData.email) missing.push('Email')
    if (!editedData.phone) missing.push('Téléphone')
    if (!editedData.nationalId) missing.push('Numéro CNI')
    if (!editedData.password) missing.push('Mot de passe')
    if (missing.length > 0) { toastUI({ title: 'Champs obligatoires', description: `Veuillez remplir : ${missing.join(', ')}.`, variant: 'destructive' }); return }
    setProfilIsLoading(true)
    try {
      if (editedData.email !== clientData.email) {
        const emailExists = await checkEmail(editedData.email)
        if (emailExists) { toastUI({ title: 'Email déjà utilisé', description: 'Cet email est déjà associé à un autre compte.', variant: 'destructive' }); setProfilIsLoading(false); return }
      }
      if (editedData.nationalId !== clientData.nationalId) {
        const nIdExists = await checkNationalId(editedData.nationalId)
        if (nIdExists) { toastUI({ title: 'CNI déjà utilisé', description: 'Ce numéro CNI est déjà associé à un autre compte.', variant: 'destructive' }); setProfilIsLoading(false); return }
      }
      if (user?.clientId) {
        await updateClient(user.clientId, editedData)
        setClientData({ ...clientData, ...editedData })
        if (typeof login === 'function') login({ ...user, ...editedData })
        setProfilIsEditing(false)
        toastUI({ title: 'Succès ! ✅', description: 'Votre compte a été mis à jour avec succès.' })
      }
    } catch (error: any) {
      toastUI({ title: 'Échec de la mise à jour', description: error.response?.data?.message || error.message || 'Une erreur est survenue.', variant: 'destructive' })
    } finally { setProfilIsLoading(false) }
  }

  const handleProfilDelete = async () => {
    if (!user?.clientId) return
    setProfilIsLoading(true)
    try {
      await deleteClient(user.clientId)
      toastUI({ title: 'Compte supprimé ✅', description: 'Votre compte a été définitivement supprimé.' })
      logout()
    } catch (error: any) {
      toastUI({ title: 'Erreur', description: error.response?.data?.message || error.message || 'Une erreur est survenue.', variant: 'destructive' })
      setProfilIsLoading(false)
      setProfilShowDeleteDialog(false)
    }
  }

  const formatProfilDate = (dateString?: string) => {
    if (!profilHasMounted || !dateString) return '...'
    try { return new Date(dateString).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) } catch { return '...' }
  }

  const profilShowContent = profilHasMounted && user && clientData.email

  // ── Wallet state ──────────────────────────────────────────────────
  const [walletShowRechargeDialog, setWalletShowRechargeDialog] = useState(false)
  const [walletRechargeMethod, setWalletRechargeMethod] = useState<'momo' | 'bank' | null>(null)
  const [walletRechargeAmount, setWalletRechargeAmount] = useState('')
  const [walletShowBalance, setWalletShowBalance] = useState(true)
  const [walletActiveFilter, setWalletActiveFilter] = useState<'all' | 'credit' | 'debit'>('all')

  const walletData = { totalSpent: 180000, balance: 98500, pending: 2500, thisMonth: 23000, lastMonth: 31000 }
  const mockTransactions = [
    { id: 'TXN001', type: 'debit' as const, label: 'Livraison Abidjan → Cocody', amount: 3500, date: '2025-01-15 14:30', status: 'completed' as const },
    { id: 'TXN002', type: 'debit' as const, label: 'Livraison Plateau → Marcory', amount: 2000, date: '2025-01-15 11:15', status: 'completed' as const },
    { id: 'TXN003', type: 'credit' as const, label: 'Remboursement colis endommagé', amount: 15000, date: '2025-01-14 18:00', status: 'completed' as const },
    { id: 'TXN004', type: 'debit' as const, label: 'Livraison Yopougon → Zone 4', amount: 4000, date: '2025-01-14 09:45', status: 'completed' as const },
    { id: 'TXN005', type: 'debit' as const, label: 'Livraison Treichville → Bouaké', amount: 8000, date: '2025-01-13 16:20', status: 'completed' as const },
    { id: 'TXN006', type: 'credit' as const, label: 'Recharge Mobile Money', amount: 50000, date: '2025-01-12 12:00', status: 'completed' as const },
    { id: 'TXN007', type: 'debit' as const, label: 'Livraison Bingerville → Abidjan', amount: 2500, date: '2025-01-12 08:30', status: 'pending' as const },
    { id: 'TXN008', type: 'credit' as const, label: 'Bonus fidélité', amount: 2000, date: '2025-01-11 20:00', status: 'completed' as const },
    { id: 'TXN009', type: 'debit' as const, label: 'Livraison Adjamé → Plateau', amount: 3000, date: '2025-01-10 15:10', status: 'completed' as const },
    { id: 'TXN010', type: 'credit' as const, label: 'Recharge compte bancaire', amount: 100000, date: '2025-01-09 10:00', status: 'failed' as const },
  ]
  const walletFilteredTxns = mockTransactions.filter(t => walletActiveFilter === 'all' ? true : t.type === walletActiveFilter)

  const handleWalletRecharge = () => {
    const amount = parseInt(walletRechargeAmount)
    if (!amount || amount <= 0) { toastUI({ title: 'Erreur', description: 'Entrez un montant valide', variant: 'destructive' }); return }
    if (amount < 500) { toastUI({ title: 'Montant minimum', description: 'La recharge minimum est de 500 FCFA', variant: 'destructive' }); return }
    toastUI({ title: 'Demande envoyée', description: `Votre recharge de ${amount.toLocaleString()} FCFA est en cours de traitement.` })
    setWalletShowRechargeDialog(false); setWalletRechargeAmount(''); setWalletRechargeMethod(null)
  }



  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header — always on top, full width */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                TiiB<span className="text-amber-500">n</span>Tick
              </h1>
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
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {clientInfo.lastName} {clientInfo.firstName}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">{clientInfo.rating}</span>
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

            {/* Mobile Menu Hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <Button variant="ghost" size="icon" className="opacity-50 cursor-not-allowed" disabled>
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon-lg"
                className="border-gray-200 active:scale-95 transition-transform"
                aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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

            {/* User profile card */}
            <div className="mx-4 mt-4 mb-2 flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{clientInfo.lastName} {clientInfo.firstName}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-600">{clientInfo.rating}</span>
                </div>
              </div>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-[10px] shrink-0">Client</Badge>
            </div>

            {/* Navigation items */}
            <nav className="flex flex-col gap-0.5 px-3 py-2 flex-1">
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 rounded-lg py-3 h-auto',
                  activeTab === 'accueil' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700'
                )}
                onClick={() => { setActiveTab('accueil'); setMobileMenuOpen(false); }}
              >
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                Dashboard
              </Button>

              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 rounded-lg py-3 h-auto',
                  activeTab === 'annonces' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700'
                )}
                onClick={() => { setActiveTab('annonces'); setMobileMenuOpen(false); }}
              >
                <Megaphone className="w-5 h-5 shrink-0" />
                Annonces
              </Button>

              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 rounded-lg py-3 h-auto',
                  activeTab === 'reponses' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700'
                )}
                onClick={() => { setActiveTab('reponses'); setMobileMenuOpen(false); }}
              >
                <MessageSquare className="w-5 h-5 shrink-0" />
                Réponses
              </Button>

              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 rounded-lg py-3 h-auto',
                  activeTab === 'livraisons' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700'
                )}
                onClick={() => { setActiveTab('livraisons'); setMobileMenuOpen(false); }}
              >
                <Package className="w-5 h-5 shrink-0" />
                Livraisons
              </Button>

              <div className="h-px bg-gray-100 my-1 mx-2" />

              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 rounded-lg py-3 h-auto',
                  activeTab === 'wallet' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700'
                )}
                onClick={() => { setActiveTab('wallet'); setMobileMenuOpen(false); }}
              >
                <WalletIcon className="w-5 h-5 shrink-0" />
                Mon Wallet
              </Button>

              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 rounded-lg py-3 h-auto',
                  activeTab === 'adresses' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700'
                )}
                onClick={() => { setActiveTab('adresses'); setMobileMenuOpen(false); }}
              >
                <MapPinIcon className="w-5 h-5 shrink-0" />
                Mes adresses
              </Button>

              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 rounded-lg py-3 h-auto',
                  activeTab === 'contacts' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700'
                )}
                onClick={() => { setActiveTab('contacts'); setMobileMenuOpen(false); }}
              >
                <Contact className="w-5 h-5 shrink-0" />
                Contacts
              </Button>

              <div className="h-px bg-gray-100 my-1 mx-2" />

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 rounded-lg py-3 h-auto text-gray-700"
                onClick={() => { setActiveTab('profil'); setMobileMenuOpen(false); }}
              >
                <UserCircle className="w-5 h-5 shrink-0" />
                Mon profil
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 rounded-lg py-3 h-auto text-gray-700 opacity-50 cursor-not-allowed"
                disabled
              >
                <Settings className="w-5 h-5 shrink-0" />
                Paramètres
              </Button>
            </nav>

            {/* Logout/Déconnexion footer in drawer */}
            <div className="px-3 py-4 border-t border-gray-100">
              <button
                onClick={logout}
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Body: sidebar + main (desktop only) */}
      <div className="flex flex-1">

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-60 shrink-0 sticky top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-100 overflow-y-auto">
          {/* User profile card */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{clientInfo.lastName} {clientInfo.firstName}</p>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600">{clientInfo.rating}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 p-3 flex-1">
            <Button
              variant="ghost"
              className={cn('w-full justify-start gap-3 rounded-lg', activeTab === 'accueil' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700')}
              onClick={() => setActiveTab('accueil')}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              Dashboard
            </Button>

            <Button
              variant="ghost"
              className={cn('w-full justify-start gap-3 rounded-lg', activeTab === 'annonces' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700')}
              onClick={() => setActiveTab('annonces')}
            >
              <Megaphone className="w-5 h-5 shrink-0" />
              Annonces
            </Button>

            <Button
              variant="ghost"
              className={cn('w-full justify-start gap-3 rounded-lg', activeTab === 'reponses' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700')}
              onClick={() => setActiveTab('reponses')}
            >
              <MessageSquare className="w-5 h-5 shrink-0" />
              Réponses
            </Button>

            <Button
              variant="ghost"
              className={cn('w-full justify-start gap-3 rounded-lg', activeTab === 'livraisons' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700')}
              onClick={() => setActiveTab('livraisons')}
            >
              <Package className="w-5 h-5 shrink-0" />
              Livraisons
            </Button>

            <div className="h-px bg-gray-100 my-1" />

            <Button
              variant="ghost"
              className={cn('w-full justify-start gap-3 rounded-lg', activeTab === 'wallet' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700')}
              onClick={() => setActiveTab('wallet')}
            >
              <WalletIcon className="w-5 h-5 shrink-0" />
              Mon Wallet
            </Button>

            <Button
              variant="ghost"
              className={cn('w-full justify-start gap-3 rounded-lg', activeTab === 'adresses' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700')}
              onClick={() => setActiveTab('adresses')}
            >
              <MapPinIcon className="w-5 h-5 shrink-0" />
              Mes adresses
            </Button>

            <Button
              variant="ghost"
              className={cn('w-full justify-start gap-3 rounded-lg', activeTab === 'contacts' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700')}
              onClick={() => setActiveTab('contacts')}
            >
              <Contact className="w-5 h-5 shrink-0" />
              Contacts
            </Button>

            <div className="h-px bg-gray-100 my-1" />

            <Button
              variant="ghost"
              className={cn('w-full justify-start gap-3 rounded-lg', activeTab === 'profil' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700')}
              onClick={() => setActiveTab('profil')}
            >
              <UserCircle className="w-5 h-5 shrink-0" />
              Mon profil
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 rounded-lg text-gray-700 opacity-50 cursor-not-allowed"
              disabled
            >
              <Settings className="w-5 h-5 shrink-0" />
              Paramètres
            </Button>

            <div className="flex-1" />

            <div className="h-px bg-gray-100 my-1" />

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 rounded-lg text-red-600 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              Déconnexion
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* Announcements Section */}
          {activeTab === 'annonces' && (
            <section className="py-8 sm:py-12 bg-white min-h-[60vh]">
              <div className="max-w-7xl mx-auto">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                    <p className="text-gray-500">Chargement de vos annonces...</p>
                  </div>
                ) : myAnnouncements.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Mes Annonces</h2>
                      <Button
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold"
                        onClick={() => router.push('/expedition')}
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Ajouter une annonce
                      </Button>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-4">
                      {myAnnouncements.map((announcement: AnnouncementResponseDTO) => (
                        <Card key={announcement.id} className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow rounded-xl">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-xs break-all pr-2">{announcement.id}</CardTitle>
                              </div>
                              <Badge variant={announcement.status === 'ASSIGNED' ? 'default' : announcement.status === 'PUBLISHED' ? "default" : "secondary"}
                                className={announcement.status === 'ASSIGNED' ? "bg-green-100 text-green-700 border-green-300" : announcement.status === 'PUBLISHED' ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}
                              >
                                {announcement.status === 'ASSIGNED' ? (
                                  <><CheckCircle2 className="w-3 h-3 mr-1" /> Assignée</>
                                ) : announcement.status === 'PUBLISHED' ? "Publiée" : "Non publiée"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Retrait:</span> {announcement.pickupAddress?.street || announcement.pickupAddress?.description || announcement.pickupAddress?.district}, {announcement.pickupAddress?.city}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Livraison:</span> {announcement.deliveryAddress?.street || announcement.deliveryAddress?.description || announcement.deliveryAddress?.district}, {announcement.deliveryAddress?.city}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                              <div className="flex items-center gap-2">
                                <MapIcon className="w-4 h-4" />
                                <span>{announcement.distance ?? '--'} km</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{announcement.duration ? Math.round(announcement.duration) : '--'} min</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="font-semibold text-green-600">{announcement.amount?.toLocaleString() || 0} FCFA</span>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                                onClick={() => { setSelectedAnnouncement(announcement); setDetailsOpen(true) }}
                              >
                                Voir Détails
                              </Button>
                              {announcement.status !== 'ASSIGNED' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                                  onClick={() => confirmDelete(announcement.id)}
                                >
                                  Supprimer
                                </Button>
                              )}
                              {announcement.status !== 'PUBLISHED' && announcement.status !== 'ASSIGNED' && (
                                <Button
                                  size="sm"
                                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                                  onClick={() => handlePublishAnnouncement(announcement.id)}
                                >
                                  Publier
                                </Button>
                              )}
                            </div>

                            {/* Show assigned delivery person info */}
                            {announcement.status === 'ASSIGNED' && announcement.assignedDeliveryPersonFirstName && (
                              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  <span className="text-sm font-semibold text-green-700">Livreur assigné</span>
                                </div>
                                <p className="text-sm text-gray-700">
                                  {announcement.assignedDeliveryPersonFirstName} {announcement.assignedDeliveryPersonLastName}
                                </p>
                                <p className="text-xs text-gray-500">{announcement.assignedDeliveryPersonPhone}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <Package className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune annonce disponible</h3>
                    <p className="text-gray-500 text-center max-w-sm mb-8">
                      Vous n'avez pas encore publié d'annonce. Commencez dès maintenant pour trouver un livreur !
                    </p>
                    <Button
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold h-12 px-8 shadow-lg shadow-orange-500/20"
                      onClick={() => router.push('/expedition')}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Créer ma première annonce
                    </Button>
                  </div>
                )}

                <Dialog open={detailsOpen} onOpenChange={(o) => { setDetailsOpen(o); if (!o) { setSelectedAnnouncement(null); setIsEditing(false); } }}>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="border-b pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <DialogTitle className="text-xl">Détails de l'annonce</DialogTitle>
                            <DialogDescription className="font-mono text-xs text-orange-600 break-all">{selectedAnnouncement?.id}</DialogDescription>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant={isEditing ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              if (isEditing) {
                                const designation = (document.getElementById('edit-designation') as HTMLInputElement)?.value;
                                const description = (document.getElementById('edit-description') as HTMLTextAreaElement)?.value;
                                const amountStr = (document.getElementById('edit-amount') as HTMLInputElement)?.value;
                                const amount = amountStr ? parseFloat(amountStr) : selectedAnnouncement.amount;
                                handleUpdateAnnouncement({
                                  amount,
                                  packet: {
                                    designation: designation || selectedAnnouncement.packet.designation,
                                    description: description || selectedAnnouncement.packet.description
                                  }
                                });
                              } else {
                                setIsEditing(true);
                              }
                            }}
                            className={isEditing ? "bg-green-600 hover:bg-green-700 text-white" : "border-orange-500 text-orange-600 hover:bg-orange-50"}
                          >
                            {isEditing ? "Enregistrer" : "Modifier"}
                          </Button>
                        </div>
                      </div>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                      {/* Colonne Gauche : Infos Trajet & Carte */}
                      <div className="space-y-6">
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                            <div>
                              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Point de Retrait (Expéditeur)</p>
                              <p className="font-semibold text-gray-900">
                                {selectedAnnouncement?.shipperFirstName} {selectedAnnouncement?.shipperLastName}
                              </p>
                              <p className="text-sm text-gray-600 font-medium">{selectedAnnouncement?.shipperPhone?.replace(/^\+237/, '') || 'N/A'}</p>
                              <p className="text-sm text-gray-500">
                                {selectedAnnouncement?.pickupAddress?.street || selectedAnnouncement?.pickupAddress?.description || selectedAnnouncement?.pickupAddress?.district}, {selectedAnnouncement?.pickupAddress?.city}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                            <div>
                              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Point de Livraison (Destinataire)</p>
                              <p className="font-semibold text-gray-900">{selectedAnnouncement?.recipientLastName} {selectedAnnouncement?.recipientFirstName}</p>
                              <p className="text-sm text-gray-600 font-medium">{selectedAnnouncement?.recipientPhone?.replace(/^\+237/, '') || 'N/A'}</p>
                              <p className="text-sm text-gray-500">
                                {selectedAnnouncement?.deliveryAddress?.street || selectedAnnouncement?.deliveryAddress?.description || selectedAnnouncement?.deliveryAddress?.district}, {selectedAnnouncement?.deliveryAddress?.city}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-64 relative z-0">
                          {selectedAnnouncement && selectedAnnouncement.pickupAddress?.latitude && selectedAnnouncement.pickupAddress?.longitude && selectedAnnouncement.deliveryAddress?.latitude && selectedAnnouncement.deliveryAddress?.longitude ? (
                            <MapLeaflet
                              center={[
                                (selectedAnnouncement.pickupAddress.latitude + selectedAnnouncement.deliveryAddress.latitude) / 2,
                                (selectedAnnouncement.pickupAddress.longitude + selectedAnnouncement.deliveryAddress.longitude) / 2
                              ]}
                              zoom={10}
                              markers={[
                                { position: [selectedAnnouncement.pickupAddress.latitude, selectedAnnouncement.pickupAddress.longitude], label: "Retrait", color: "#f97316" },
                                { position: [selectedAnnouncement.deliveryAddress.latitude, selectedAnnouncement.deliveryAddress.longitude], label: "Livraison", color: "#10b981" }
                              ]}
                              route={route}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 gap-2">
                              <MapIcon className="w-8 h-8 opacity-20" />
                              <p className="text-xs">Carte non disponible</p>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100">
                          <div className="flex items-center gap-2">
                            <MapIcon className="w-5 h-5 text-orange-600" />
                            <span className="font-bold text-gray-900">{selectedAnnouncement?.distance ?? '--'} km</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-600" />
                            <span className="font-bold text-gray-900">{selectedAnnouncement?.duration ? Math.round(selectedAnnouncement.duration) : '--'} min</span>
                          </div>
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <Input id="edit-amount" type="number" defaultValue={selectedAnnouncement?.amount} className="h-9 w-28 text-sm font-bold text-orange-600 border-orange-200 focus:border-orange-500" />
                              <span className="text-sm font-bold text-orange-600">FCFA</span>
                            </div>
                          ) : (
                            <div className="text-lg font-black text-orange-600">
                              {selectedAnnouncement?.amount?.toLocaleString() || 0} FCFA
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Colonne Droite : Infos Colis & Logistique */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3 border-b pb-1">Détails du Colis</h4>

                          {/* Photo du Colis */}
                          <div className="mb-6">
                            <div className="aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center relative group">
                              {selectedAnnouncement?.packet?.photoPacket ? (
                                <img
                                  src={selectedAnnouncement.packet.photoPacket}
                                  alt="Colis"
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-400">
                                  <Package className="w-10 h-10 opacity-20" />
                                  <p className="text-xs">Aucune photo disponible</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Désignation</p>
                              {isEditing ? (
                                <Input id="edit-designation" defaultValue={selectedAnnouncement?.packet?.designation} className="h-9 text-sm border-orange-200 focus:border-orange-500" />
                              ) : (
                                <p className="font-semibold text-gray-900">{selectedAnnouncement?.packet?.designation}</p>
                              )}
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Type de colis</p>
                              <p className="font-semibold text-gray-900">{selectedAnnouncement?.packet?.description?.substring(0, 20)}...</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-gray-500 mb-1">Description</p>
                              {isEditing ? (
                                <textarea id="edit-description" className="w-full text-sm border border-orange-200 rounded-md p-2 h-24 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none" defaultValue={selectedAnnouncement?.packet?.description} />
                              ) : (
                                <p className="text-sm text-gray-600 leading-relaxed">{selectedAnnouncement?.packet?.description || 'Aucune description fournie'}</p>
                              )}
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Poids approx.</p>
                              <p className="font-semibold text-gray-900">3.5 kg</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Dimensions (Lxlxh)</p>
                              <p className="font-semibold text-gray-900">
                                {selectedAnnouncement?.packet?.length}x{selectedAnnouncement?.packet?.width}x{selectedAnnouncement?.packet?.thickness} cm
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl space-y-4 border border-orange-100">
                          <p className="text-sm font-bold text-orange-800 dark:text-orange-300 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Options & Sécurité
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className={selectedAnnouncement?.packet?.fragile ? "border-red-500 text-red-600 bg-red-50 font-semibold" : "opacity-30 border-gray-200 text-gray-400"}>Fragile</Badge>
                            <Badge variant="outline" className={selectedAnnouncement?.packet?.isPerishable ? "border-orange-500 text-orange-600 bg-orange-50 font-semibold" : "opacity-30 border-gray-200 text-gray-400"}>Périssable</Badge>
                            <Badge variant="outline" className={selectedAnnouncement?.isInsured ? "border-green-500 text-green-600 bg-green-50 font-semibold" : "opacity-30 border-gray-200 text-gray-400"}>
                              Assuré ({selectedAnnouncement?.declaredValue || 0} FCFA)
                            </Badge>
                          </div>
                          {/* Transport and urgence sections removed as not relevant */}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Elle supprimera définitivement votre annonce
                        ainsi que toutes les photos et données associées de nos serveurs.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={executeDelete}
                        className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
                      >
                        Supprimer définitivement
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </section>
          )}

          {/* Réponses Tab */}
          {activeTab === 'reponses' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Réponses aux annonces</h2>
                  <p className="text-sm text-gray-500 mt-1">Consultez les livreurs intéressés et assignez une livraison</p>
                </div>
              </div>

              {responsesLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
              ) : responsesAnnouncements.length === 0 ? (
                <Card className="py-16">
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune annonce</h3>
                    <p className="text-sm text-gray-500">Publiez une annonce pour recevoir des réponses de livreurs</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {responsesAnnouncements
                    .filter(a => a.status === 'PUBLISHED' || a.status === 'ASSIGNED')
                    .map((announcement) => (
                      <Card key={announcement.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900 truncate">{announcement.title}</h3>
                                {announcement.status === 'ASSIGNED' ? (
                                  <Badge className="bg-green-100 text-green-700 border-green-200">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Assigné
                                  </Badge>
                                ) : (
                                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                    Publiée
                                  </Badge>
                                )}
                              </div>
                              {announcement.description && (
                                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{announcement.description}</p>
                              )}
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4 text-orange-500" />
                                  <span className="truncate max-w-[180px] sm:max-w-[250px]">
                                    {announcement.pickupAddress?.city || 'N/A'} → {announcement.deliveryAddress?.city || 'N/A'}
                                  </span>
                                </div>
                                {announcement.amount && (
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4 text-green-500" />
                                    <span className="font-semibold text-green-600">{announcement.amount.toLocaleString()} FCFA</span>
                                  </div>
                                )}
                              </div>

                              {/* Show assigned delivery person details */}
                              {announcement.status === 'ASSIGNED' && announcement.assignedDeliveryPersonFirstName && (
                                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                      {announcement.assignedDeliveryPersonFirstName?.charAt(0)}{announcement.assignedDeliveryPersonLastName?.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-green-800">
                                        {announcement.assignedDeliveryPersonFirstName} {announcement.assignedDeliveryPersonLastName}
                                      </p>
                                      <p className="text-xs text-green-600">{announcement.assignedDeliveryPersonPhone}</p>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-500">{announcement.assignedDeliveryPersonEmail}</p>
                                </div>
                              )}
                            </div>
                            <div className="flex-shrink-0 self-start">
                              {announcement.status === 'ASSIGNED' ? (
                                <div className="px-3 py-2 bg-green-50 rounded-lg text-sm font-medium text-green-700 whitespace-nowrap">
                                  ✓ Livreur assigné
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700 w-full sm:w-auto"
                                  onClick={() => handleViewSubscriptions(announcement)}
                                >
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Voir les réponses
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}

              {/* Subscriptions Dialog */}
              <Dialog open={subscriptionsDialogOpen} onOpenChange={setSubscriptionsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader className="border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <DialogTitle className="text-lg">Livreurs intéressés</DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                          {selectedResponseAnnouncement?.title}
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="py-4 space-y-3">
                    {subscriptionsLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                      </div>
                    ) : subscriptions.length === 0 ? (
                      <div className="text-center py-12">
                        <User className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Aucun livreur n'a encore souscrit à cette annonce</p>
                      </div>
                    ) : (
                      subscriptions.map((sub) => (
                        <div
                          key={sub.subscriptionId}
                          className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                                {sub.firstName?.charAt(0)}{sub.lastName?.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900">{sub.lastName} {sub.firstName}</p>
                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                  <span className="flex items-center gap-1">
                                    <MapPinIcon className="w-3 h-3" />
                                    {sub.phone}
                                  </span>
                                  {sub.rating && (
                                    <span className="flex items-center gap-1">
                                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                      {sub.rating.toFixed(1)}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{sub.email}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              disabled={assigningId === sub.deliveryPersonId}
                              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md"
                              onClick={() => handleAssignDeliveryPerson(sub.deliveryPersonId)}
                            >
                              {assigningId === sub.deliveryPersonId ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                'Assigner'
                              )}
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </section>
          )}

          {activeTab === 'accueil' && (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Welcome Section */}
              <div className="mb-2">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Bienvenue, <span className="text-orange-600">{clientInfo.lastName} {clientInfo.firstName}</span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">Voici un aperçu de votre activité</p>
                <Button
                  className="mt-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                  size="sm"
                  onClick={() => {
                    if (user?.deliveryPersonId) {
                      router.push('/')
                    } else {
                      setActiveTab('augmenter')
                    }
                  }}
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  {user?.deliveryPersonId ? 'Basculer sur votre profil' : 'Augmenter votre profil'}
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <Card className="hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader className="pb-3 px-4 py-3">
                    <CardDescription className="text-[10px] md:text-xs text-black">Total</CardDescription>
                    <CardTitle className="text-xl md:text-2xl text-orange-600">{loading ? '…' : myAnnouncements.length}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 mt-auto">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Megaphone className="w-3 h-3 mr-1" />
                      Mes annonces
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader className="pb-3 px-4 py-3">
                    <CardDescription className="text-[10px] md:text-xs text-black">En attente</CardDescription>
                    <CardTitle className="text-xl md:text-2xl text-amber-600">{loading ? '…' : myAnnouncements.filter(a => a.status === 'PUBLISHED').length}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 mt-auto">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      Sans réponse
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader className="pb-3 px-4 py-3">
                    <CardDescription className="text-[10px] md:text-xs text-black">En cours</CardDescription>
                    <CardTitle className="text-xl md:text-2xl text-green-600">{loading ? '…' : myAnnouncements.filter(a => a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS').length}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 mt-auto">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Truck className="w-3 h-3 mr-1" />
                      Livraisons actives
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader className="pb-3 px-4 py-3">
                    <CardDescription className="text-[10px] md:text-xs text-black">Terminées</CardDescription>
                    <CardTitle className="text-xl md:text-2xl text-gray-600">{loading ? '…' : myAnnouncements.filter(a => a.status === 'DELIVERED' || a.status === 'COMPLETED').length}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 mt-auto">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Livraisons faites
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Wallet Section */}
              <Card className="relative overflow-hidden border-2 border-orange-100 bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <GoogleWalletIcon className="w-full h-full" />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base md:text-lg flex items-center gap-2">
                      <GoogleWalletIcon className="w-6 h-6" />
                      Mon Wallet
                    </CardTitle>
                    <Badge className="bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-100">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Actif
                    </Badge>
                  </div>
                  <CardDescription className="text-xs md:text-sm">Votre solde et vos transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl md:text-4xl font-bold text-gray-900">{fmt((user as any)?.totalEarnings ?? 0)}</span>
                    <span className="text-sm text-gray-500 mb-1">FCFA</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>Solde disponible</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                      <p className="text-xs text-gray-500">Ce mois</p>
                      <p className="text-lg font-bold text-gray-900">{fmt((user as any)?.monthlySpent ?? 0)} <span className="text-xs font-normal text-gray-500">FCFA</span></p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                      <p className="text-xs text-gray-500">Transactions</p>
                      <p className="text-lg font-bold text-orange-600">{(user as any)?.totalTransactions ?? 0}</p>
                    </div>
                  </div>
                  <Button className="mt-4 w-full bg-gradient-to-r from-orange-500 to-white text-orange-600 font-medium border border-orange-200 hover:from-orange-500 hover:to-orange-50" size="sm" onClick={() => setActiveTab('wallet')}>
                    <GoogleWalletIcon className="w-4 h-4 mr-2" />
                    Ouvrir mon Wallet
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3">Accès rapides</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow group" onClick={() => {
                    try {
                      const expeditionPrefill = {
                        currentStep: 1,
                        senderData: { senderName: `${clientInfo.lastName} ${clientInfo.firstName}`, senderPhone: '', senderEmail: '', senderCountry: 'cameroun', senderRegion: 'centre', senderCity: 'Yaoundé', senderAddress: '', senderLieuDit: '' },
                        recipientData: { recipientName: '', recipientPhone: '', recipientEmail: '', recipientCountry: 'cameroun', recipientRegion: 'centre', recipientCity: 'Yaoundé', recipientAddress: '', recipientLieuDit: '' },
                        packageData: { photo: null, designation: '', description: '', weight: '', length: '', width: '', height: '', isFragile: false, isPerishable: false, isLiquid: false, isInsured: false, declaredValue: '', transportMethod: '', logistics: 'standard', pickup: false, delivery: false },
                        routeData: { departurePointId: null, arrivalPointId: null, departurePointName: '', arrivalPointName: '', distanceKm: 0 },
                        signatureData: { signatureUrl: null },
                        pricing: { basePrice: 0, travelPrice: 0, operatorFee: 0, totalPrice: 0 }
                      };
                      localStorage.setItem('expedition_form_in_progress', JSON.stringify(expeditionPrefill));
                    } catch (e) { console.error('Erreur préfill', e); }
                    router.push('/expedition');
                  }}>
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                        <Send className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">Nouvelle annonce</span>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow group" onClick={() => setActiveTab('annonces')}>
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">Mes annonces</span>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow group" onClick={() => setActiveTab('reponses')}>
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">Réponses</span>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow group" onClick={() => setActiveTab('livraisons')}>
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                        <Truck className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">Livraisons</span>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow group" onClick={() => setActiveTab('wallet')}>
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                        <WalletIcon className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">Wallet</span>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow group" onClick={() => setActiveTab('profil')}>
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                        <UserCircle className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">Profil</span>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow group" onClick={() => setActiveTab('adresses')}>
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                        <MapPin className="w-5 h-5 text-rose-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">Adresses</span>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow group" onClick={() => setActiveTab('contacts')}>
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                        <Contact className="w-5 h-5 text-teal-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">Contacts</span>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Recent Announcements Preview */}
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="text-lg">Annonces récentes</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('annonces')}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    Voir tout
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : myAnnouncements.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Aucune annonce</p>
                        <p className="text-xs text-gray-400 mt-1">Publiez votre première annonce pour commencer</p>
                      </div>
                    ) : (
                      myAnnouncements.slice(0, 3).map((announcement) => (
                        <div key={announcement.id} className="p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => { setSelectedAnnouncement(announcement); setDetailsOpen(true) }}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold text-gray-900">{announcement.title}</span>
                                <Badge variant="outline" className={
                                  announcement.status === 'PUBLISHED' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                                    announcement.status === 'ASSIGNED' || announcement.status === 'IN_PROGRESS' ? 'bg-green-100 text-green-700 border-green-300' :
                                      announcement.status === 'DELIVERED' || announcement.status === 'COMPLETED' ? 'bg-gray-100 text-gray-700 border-gray-300' :
                                        'bg-amber-100 text-amber-700 border-amber-300'
                                }>
                                  {announcement.status === 'PUBLISHED' ? 'Publiée' :
                                    announcement.status === 'ASSIGNED' ? 'Assignée' :
                                      announcement.status === 'IN_PROGRESS' ? 'En cours' :
                                        announcement.status === 'DELIVERED' || announcement.status === 'COMPLETED' ? 'Livrée' :
                                          announcement.status}
                                </Badge>
                              </div>
                              <div className="flex items-start gap-2">
                                <Navigation className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="space-y-1 flex-1">
                                  <p className="text-xs text-gray-700">
                                    <span className="font-medium">De:</span> {announcement.pickupAddress?.city || 'N/A'} → <span className="font-medium">À:</span> {announcement.deliveryAddress?.city || 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {announcement.amount && (
                              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded flex-shrink-0">
                                <DollarSign className="w-3 h-3 text-green-600" />
                                <span className="text-sm font-semibold text-green-700">{fmt(announcement.amount)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {/* Livraisons Tab */}
          {activeTab === 'livraisons' && (
            <section className="py-8 sm:py-12 bg-white min-h-[60vh]">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Mes Livraisons</h2>
                    <p className="text-sm text-gray-500 mt-1">Suivez vos livraisons en cours et passées</p>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold"
                    onClick={() => router.push('/expedition')}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Nouvelle annonce
                  </Button>
                </div>
                <Card className="py-16">
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <Package className="w-12 h-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune livraison</h3>
                    <p className="text-sm text-gray-500 max-w-md">Vos livraisons actives apparaîtront ici. Publiez une annonce pour commencer.</p>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {/* Mes Adresses Tab */}
          {activeTab === 'adresses' && (
            <section className="py-8 sm:py-12 bg-white min-h-[60vh]">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Mes Adresses</h2>
                    <p className="text-sm text-gray-500 mt-1">Gérez vos adresses de retrait et de livraison</p>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold"
                    onClick={() => setShowAddAddressDialog(true)}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Ajouter
                  </Button>
                </div>

                {savedAddresses.length === 0 ? (
                  <Card className="py-16">
                    <CardContent className="flex flex-col items-center justify-center text-center">
                      <MapPinIcon className="w-12 h-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune adresse enregistrée</h3>
                      <p className="text-sm text-gray-500 max-w-md">Ajoutez vos adresses fréquentes pour gagner du temps lors de vos expéditions.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {savedAddresses.map((addr) => (
                      <Card key={addr.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-start gap-4">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPinIcon className="w-5 h-5 text-orange-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">{addr.label}</span>
                              {addr.isDefault && (
                                <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-[10px]">Par défaut</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{addr.street}, {addr.city}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                            onClick={() => setSavedAddresses(prev => prev.filter(a => a.id !== addr.id))}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <section className="py-8 sm:py-12 bg-white min-h-[60vh]">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Contacts</h2>
                    <p className="text-sm text-gray-500 mt-1">Gérez vos destinataires fréquents</p>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold"
                    onClick={() => setShowAddContactDialog(true)}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Ajouter
                  </Button>
                </div>

                {savedContacts.length === 0 ? (
                  <Card className="py-16">
                    <CardContent className="flex flex-col items-center justify-center text-center">
                      <Contact className="w-12 h-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucun contact enregistré</h3>
                      <p className="text-sm text-gray-500 max-w-md">Ajoutez vos destinataires fréquents pour les sélectionner rapidement lors de vos expéditions.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {savedContacts.map((contact) => (
                      <Card key={contact.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">{contact.firstName.charAt(0).toUpperCase()}{contact.lastName.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">{contact.firstName} {contact.lastName}</span>
                              {contact.isDefault && (
                                <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-[10px]">Par défaut</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{contact.phone}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                            onClick={() => setSavedContacts(prev => prev.filter(c => c.id !== contact.id))}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

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
                {/* Go — toujours masqué ici car on est déjà sur Go */}

                {/* Freelancer — masqué si on a déjà un compte Freelancer */}
                {!user?.deliveryPersonId && (
                  <Card className="relative overflow-hidden border-2 border-gray-200 hover:border-orange-300 transition-all hover:shadow-xl cursor-pointer group">
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-500 rounded-2xl flex items-center justify-center">
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Freelancer</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Espace livreur. Accédez aux annonces, acceptez des missions et gagnez de l'argent.
                        </p>
                      </div>
                      <div className="w-full space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          <span>Toutes les annonces disponibles</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          <span>Support prioritaire 24/7</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          <span>Wallet et retraits flexibles</span>
                        </div>
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 text-white h-12 text-base font-semibold"
                        onClick={() => router.push('/inscription?role=livreur&step=2')}
                      >
                        <ArrowUpRight className="w-4 h-4 mr-2" />
                        Devenir Freelancer
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

          {/* ── Wallet Tab ─────────────────────────────────────────────── */}
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
                    <span className="text-4xl md:text-5xl font-bold">{walletShowBalance ? walletData.balance.toLocaleString() : '•••••'}</span>
                    <span className="text-sm text-orange-100 mb-2">FCFA</span>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex-1"><p className="text-xs text-orange-100">Ce mois</p><p className="text-lg font-bold">{walletShowBalance ? walletData.thisMonth.toLocaleString() : '••••'} <span className="text-xs font-normal text-orange-100">FCFA</span></p></div>
                    <div className="flex-1"><p className="text-xs text-orange-100">En attente</p><p className="text-lg font-bold">{walletShowBalance ? walletData.pending.toLocaleString() : '••••'} <span className="text-xs font-normal text-orange-100">FCFA</span></p></div>
                    <div className="flex items-center gap-1 text-xs text-green-200"><TrendingDown className="w-3 h-3" /><span>{walletShowBalance ? '-26' : '•'}% vs mois dernier</span></div>
                  </div>
                </CardContent>
              </Card>
              <div className="grid grid-cols-2 gap-3">
                <Button className="h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0" onClick={() => { setWalletRechargeMethod('momo'); setWalletShowRechargeDialog(true) }}>
                  <Plus className="w-6 h-6" /><span className="text-sm font-semibold">Recharger</span><span className="text-[10px] text-orange-100">Mobile Money</span>
                </Button>
                <Button className="h-auto py-4 flex flex-col items-center gap-2 bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-50" onClick={() => { setWalletRechargeMethod('bank'); setWalletShowRechargeDialog(true) }}>
                  <Building2 className="w-6 h-6" /><span className="text-sm font-semibold">Recharger</span><span className="text-[10px]">Via compte bancaire</span>
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[{ label: 'Total dépenses', value: walletData.totalSpent, sub: 'FCFA', color: 'text-orange-600' }, { label: 'Mois dernier', value: walletData.lastMonth, sub: 'Déc 2024', color: 'text-muted-foreground' }, { label: 'En attente', value: walletData.pending, sub: 'FCFA', color: 'text-amber-600' }].map(s => (
                  <Card key={s.label} className="flex flex-col">
                    <CardHeader className="pb-2 px-3 py-3"><CardDescription className="text-[10px] text-gray-500">{s.label}</CardDescription><CardTitle className={cn('text-lg', s.color)}>{s.value.toLocaleString()}</CardTitle></CardHeader>
                    <CardContent className="px-3 pb-3 mt-auto"><div className={cn('flex items-center text-[10px]', s.color)}><Clock className="w-3 h-3 mr-1" /><span>{s.sub}</span></div></CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Clock className="w-5 h-5 text-orange-500" />Transactions</CardTitle>
                  <div className="flex gap-2 mt-2">
                    {([{ key: 'all' as const, label: 'Toutes' }, { key: 'credit' as const, label: 'Recharges' }, { key: 'debit' as const, label: 'Dépenses' }]).map(f => (
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
                            {txn.status === 'failed' && <><X className="w-2.5 h-2.5 mr-0.5 inline" />Échoué</>}
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
                  <div><p className="text-sm font-semibold text-gray-900">Sécurité de votre Wallet</p><p className="text-xs text-gray-600 mt-1">Vos fonds sont protégés. Les recharges sont traitées sous 24h ouvrables. Montant minimum : 500 FCFA.</p></div>
                </CardContent>
              </Card>
            </div>
          )}
          {/* ── Profil Tab ─────────────────────────────────────────────── */}
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
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
                          <User className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold mb-1">{clientData.lastName} {clientData.firstName}</h2>
                          <div className="flex items-center gap-4 text-sm opacity-90">
                            <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span className="font-semibold">{clientData.rating}</span></div>
                            <span>•</span>
                            <span>Membre depuis {formatProfilDate(clientData.memberSince)}</span>
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
                          { id: 'p-nationalId', label: 'Numéro CNI', key: 'nationalId' as const, icon: <CreditCard className="w-5 h-5 text-gray-400" />, type: 'text' },
                        ].map(f => (
                          <div key={f.id}>
                            <Label htmlFor={f.id}>{f.label} {profilIsEditing && <span className="text-red-500">*</span>}</Label>
                            {profilIsEditing
                              ? <Input id={f.id} type={f.type} value={editedData[f.key]} onChange={e => setEditedData({ ...editedData, [f.key]: e.target.value })} className="mt-1" />
                              : <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mt-1">{f.icon}<span className="font-medium">{(clientData as any)[f.key] || 'Non renseigné'}</span></div>
                            }
                          </div>
                        ))}
                        <div>
                          <Label htmlFor="p-password">Mot de passe {profilIsEditing && <span className="text-red-500">*</span>}</Label>
                          {profilIsEditing ? (
                            <div className="relative mt-1">
                              <Input id="p-password" type={profilShowPassword ? 'text' : 'password'} value={editedData.password} onChange={e => setEditedData({ ...editedData, password: e.target.value })} className="pr-10" />
                              <button type="button" onClick={() => setProfilShowPassword(!profilShowPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600">
                                {profilShowPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mt-1 relative pr-10 min-h-[52px]">
                              <Lock className="w-5 h-5 text-gray-400 shrink-0" />
                              <span className="font-medium truncate">{profilShowPassword ? clientData.password : '********'}</span>
                              <button type="button" onClick={() => setProfilShowPassword(!profilShowPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500">
                                {profilShowPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {profilIsEditing && (
                        <div className="flex gap-3 pt-4">
                          <Button onClick={handleProfilSave} disabled={profilIsLoading} className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                            <span className="flex items-center justify-center gap-2">
                              {profilIsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                              Enregistrer
                            </span>
                          </Button>
                          <Button onClick={() => { setProfilIsEditing(false); setEditedData({ ...clientData }) }} variant="outline" className="flex-1">Annuler</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5 text-orange-600" />Actions du compte</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <Button onClick={() => setProfilIsEditing(true)} variant="outline" className="w-full justify-start h-12 border-2 border-orange-200 hover:bg-orange-50 text-orange-700">
                        <Edit className="w-5 h-5 mr-3" />Modifier mon compte
                      </Button>
                      <Button onClick={logout} variant="outline" className="w-full justify-start h-12 border-2 border-blue-200 hover:bg-blue-50 text-blue-700">
                        <LogOut className="w-5 h-5 mr-3" />Déconnexion
                      </Button>
                      <Button onClick={() => setProfilShowDeleteDialog(true)} variant="outline" className="w-full justify-start h-12 border-2 border-red-200 hover:bg-red-50 text-red-600">
                        <Trash2 className="w-5 h-5 mr-3" />Supprimer le compte
                      </Button>
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
                              {profilIsLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}Oui
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
        </main>
      </div>

      {/* Dialog Recharge Wallet */}
      <Dialog open={walletShowRechargeDialog} onOpenChange={setWalletShowRechargeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="w-5 h-5 text-orange-500" />Recharger votre compte</DialogTitle>
            <DialogDescription>{walletRechargeMethod === 'momo' ? 'Effectuez une recharge via Mobile Money' : 'Effectuez une recharge via virement bancaire'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
              {walletRechargeMethod === 'momo' ? <><Smartphone className="w-6 h-6 text-orange-500" /><div><p className="text-sm font-semibold text-gray-900">Mobile Money</p><p className="text-xs text-gray-500">MTN / Moov / Orange Money</p></div></>
                : <><Building2 className="w-6 h-6 text-orange-500" /><div><p className="text-sm font-semibold text-gray-900">Virement bancaire</p><p className="text-xs text-gray-500">Depuis votre compte bancaire</p></div></>}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Solde actuel</span>
              <span className="font-bold text-green-600">{walletData.balance.toLocaleString()} FCFA</span>
            </div>
            <div>
              <Label htmlFor="w-amount" className="text-sm font-medium">Montant (FCFA)</Label>
              <Input id="w-amount" type="number" placeholder="Entrez le montant" value={walletRechargeAmount} onChange={e => setWalletRechargeAmount(e.target.value)} min={500} className="mt-1.5" />
              <p className="text-[10px] text-gray-400 mt-1">Minimum : 500 FCFA</p>
            </div>
            <div className="flex gap-2">
              {[1000, 5000, 10000, 20000].map(amount => (
                <button key={amount} onClick={() => setWalletRechargeAmount(String(amount))}
                  className={cn('flex-1 py-2 rounded-lg text-xs font-medium border transition-colors', walletRechargeAmount === String(amount) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300')}>
                  {amount >= 1000 ? `${amount / 1000}k` : amount}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild><Button variant="outline" className="flex-1">Annuler</Button></DialogClose>
            <Button className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white" onClick={handleWalletRecharge}>
              <Send className="w-4 h-4 mr-2" />Confirmer la recharge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Address Dialog */}
      <Dialog open={showAddAddressDialog} onOpenChange={setShowAddAddressDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-orange-500" />
              Ajouter une adresse
            </DialogTitle>
            <DialogDescription>Enregistrez une adresse pour vos expéditions futures</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="addr-label">Libellé</Label>
              <Input
                id="addr-label"
                placeholder="Ex: Maison, Bureau, Maman..."
                value={newAddress.label}
                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="addr-street">Adresse</Label>
              <Input
                id="addr-street"
                placeholder="Ex: Rue 12, Quartier Bastos"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="addr-city">Ville</Label>
              <Input
                id="addr-city"
                placeholder="Ex: Yaoundé"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="mt-1.5"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAddAddressDialog(false)}>Annuler</Button>
            <Button
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
              onClick={() => {
                if (!newAddress.label || !newAddress.street || !newAddress.city) {
                  toast.error('Veuillez remplir tous les champs')
                  return
                }
                setSavedAddresses(prev => [...prev, {
                  id: Date.now().toString(),
                  ...newAddress,
                  isDefault: savedAddresses.length === 0,
                }])
                setNewAddress({ label: '', street: '', city: '' })
                setShowAddAddressDialog(false)
                toast.success('Adresse ajoutée avec succès')
              }}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Contact Dialog */}
      <Dialog open={showAddContactDialog} onOpenChange={setShowAddContactDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Contact className="w-5 h-5 text-orange-500" />
              Ajouter un contact
            </DialogTitle>
            <DialogDescription>Enregistrez un destinataire fréquent</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="contact-lastname">Nom</Label>
              <Input
                id="contact-lastname"
                placeholder="Ex: Dupont"
                value={newContact.lastName}
                onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="contact-firstname">Prénom</Label>
              <Input
                id="contact-firstname"
                placeholder="Ex: Jean"
                value={newContact.firstName}
                onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="contact-phone">Numéro de téléphone</Label>
              <Input
                id="contact-phone"
                placeholder="Ex: +237 6XX XXX XXX"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="mt-1.5"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAddContactDialog(false)}>Annuler</Button>
            <Button
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
              onClick={() => {
                if (!newContact.lastName || !newContact.firstName || !newContact.phone) {
                  toast.error('Veuillez remplir tous les champs')
                  return
                }
                setSavedContacts(prev => [...prev, {
                  id: Date.now().toString(),
                  ...newContact,
                  isDefault: savedContacts.length === 0,
                }])
                setNewContact({ lastName: '', firstName: '', phone: '' })
                setShowAddContactDialog(false)
                toast.success('Contact ajouté avec succès')
              }}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default withAuth(GoLanding, ['CLIENT'])
