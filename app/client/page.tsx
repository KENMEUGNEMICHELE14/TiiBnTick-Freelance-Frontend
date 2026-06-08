'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import {
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Star,
  Menu,
  X,
  Package,
  Megaphone,
  Truck,
  Bell,
  Home,
  MessageSquare,
  User,
  Calendar,
  MapPin as MapPinIcon,
  Settings,
  LogOut,
  CreditCard,
  ChevronRight
} from 'lucide-react'

export default function ClientLanding() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [activeTab, setActiveTab] = useState('accueil')

  // Données fictives du client
  const clientInfo = {
    firstName: 'Marie',
    lastName: 'Kouassi',
    rating: 4.6,
    totalOrders: 24
  }

  const steps = [
    {
      number: '01',
      title: 'Publiez',
      description: 'Décrivez votre besoin et publiez votre annonce gratuite'
    },
    {
      number: '02',
      title: 'Choisissez',
      description: 'Comparez les profils, prix et avis des freelancers'
    },
    {
      number: '03',
      title: 'Livraison',
      description: 'Suivez en temps réel et recevez à votre porte'
    },
  ]

  const sidebarMenuItems = [
    { icon: Home, label: 'Accueil', tab: 'accueil' },
    { icon: Megaphone, label: 'Mes Annonces', tab: 'annonces' },
    { icon: MessageSquare, label: 'Réponses', tab: 'reponses' },
    { icon: Package, label: 'Livraisons', tab: 'livraisons' },
    { icon: MapPinIcon, label: 'Mes adresses', tab: 'adresses' },
    { icon: Calendar, label: 'Historique', tab: 'historique' },
    { icon: CreditCard, label: 'Portefeuille', tab: 'portefeuille' },
    { icon: Settings, label: 'Paramètres', tab: 'parametres' },
  ]

  const handleExpedition = () => {
    try {
      const expeditionPrefill = {
        currentStep: 1,
        senderData: {
          senderName: `${clientInfo.lastName} ${clientInfo.firstName}`,
          senderPhone: '',
          senderEmail: '',
          senderCountry: 'cameroun',
          senderRegion: 'centre',
          senderCity: 'Yaoundé',
          senderAddress: '',
          senderLieuDit: ''
        },
        recipientData: {
          recipientName: '', recipientPhone: '', recipientEmail: '', recipientCountry: 'cameroun', recipientRegion: 'centre', recipientCity: 'Yaoundé', recipientAddress: '', recipientLieuDit: ''
        },
        packageData: {
          photo: null, designation: '', description: '', weight: '', length: '', width: '', height: '',
          isFragile: false, isPerishable: false, isLiquid: false, isInsured: false, declaredValue: '',
          transportMethod: '', logistics: 'standard', pickup: false, delivery: false
        },
        routeData: { departurePointId: null, arrivalPointId: null, departurePointName: '', arrivalPointName: '', distanceKm: 0 },
        signatureData: { signatureUrl: null },
        pricing: { basePrice: 0, travelPrice: 0, operatorFee: 0, totalPrice: 0 }
      };
      localStorage.setItem('expedition_form_in_progress', JSON.stringify(expeditionPrefill));
    } catch (e) { console.error('Erreur préfill expedition', e); }
    router.push('/expedition');
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* ====== DESKTOP SIDEBAR (hidden on mobile/tablet) ====== */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 xl:w-80 bg-white border-r border-gray-200 sticky top-0 h-screen z-40">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              TiiB<span className="text-amber-500">n</span>Tick
            </h1>
          </div>
        </div>

        {/* Profile Section */}
        <div
          className="mx-4 mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 cursor-pointer hover:from-orange-100 hover:to-amber-100 transition-all"
          onClick={() => router.push('/client/profil')}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-md">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{clientInfo.lastName} {clientInfo.firstName}</p>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600">{clientInfo.rating} · {clientInfo.totalOrders} commandes</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarMenuItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.tab
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200'
                  : 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
            onClick={() => router.push('/')}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* ====== MAIN CONTENT AREA ====== */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* ====== HEADER ====== */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo (visible on mobile/tablet only) */}
              <div className="flex items-center gap-2 lg:hidden">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  TiiB<span className="text-amber-500">n</span>Tick
                </h1>
              </div>

              {/* Desktop Header: Breadcrumb / page title */}
              <div className="hidden lg:flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-800 capitalize">
                  {activeTab === 'accueil' ? 'Tableau de bord' : sidebarMenuItems.find(i => i.tab === activeTab)?.label || activeTab}
                </h2>
              </div>

              {/* Desktop Navigation (hidden since we have sidebar) */}
              <nav className="hidden lg:flex items-center gap-2">
                {activeTab !== 'adresses' && activeTab !== 'historique' && (
                  <Button variant="ghost" size="icon" className="text-gray-700 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Button>
                )}
                {activeTab === 'accueil' && (
                  <Button
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium shadow-md"
                    onClick={handleExpedition}
                  >
                    <Megaphone className="w-4 h-4 mr-2" />
                    Publier une annonce
                  </Button>
                )}
              </nav>

              {/* Mobile Menu Toggle */}
              <div className="lg:hidden flex items-center gap-2">
                {activeTab !== 'adresses' && activeTab !== 'historique' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-700 relative"
                  >
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
              </div>
            </div>

            {/* Mobile Menu Dropdown (hamburger) */}
            {mobileMenuOpen && (
              <nav className="lg:hidden border-t border-gray-100 bg-white py-4 space-y-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                     onClick={() => { router.push('/client/profil'); setMobileMenuOpen(false); }}>
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{clientInfo.lastName} {clientInfo.firstName}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">{clientInfo.rating}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { setActiveTab('adresses'); setMobileMenuOpen(false); }}>
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  Mes adresses
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { setActiveTab('historique'); setMobileMenuOpen(false); }}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Historique des livraisons
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { setActiveTab('portefeuille'); setMobileMenuOpen(false); }}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Portefeuille
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { setActiveTab('parametres'); setMobileMenuOpen(false); }}>
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </Button>
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50" onClick={() => router.push('/')}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>
              </nav>
            )}
          </div>
        </header>

        {/* ====== MAIN CONTENT ====== */}
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 sm:py-16 lg:py-24">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-bl from-orange-100 to-transparent opacity-50 rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-tr from-amber-100 to-transparent opacity-30 rounded-full -translate-x-1/3 translate-y-1/3"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Content */}
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
                    Vous avez un besoin ?
                    <span className="block text-orange-600">Trouvez votre freelancer</span>
                  </h2>

                  <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0">
                    Postez votre annonce et choisissez parmi nos centaines de freelancers disponibles. Repas, courses, documents, colis, pharmacie ou service personnalisé.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                    {activeTab === 'accueil' && (
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-6 sm:px-8 shadow-xl shadow-orange-500/20 text-base h-12"
                        onClick={handleExpedition}
                      >
                        <Megaphone className="w-5 h-5 mr-2" />
                        Publier une annonce
                      </Button>
                    )}
                    <Button size="lg" variant="outline" className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 font-semibold px-6 sm:px-8 h-12 text-base">
                      <Truck className="w-5 h-5 mr-2" />
                      Devenir freelancer
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 sm:gap-6 mt-6 sm:mt-8 justify-center lg:justify-start">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-gray-700 font-medium">Suivi en temps réel</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700 font-medium">Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-red-500" />
                      <span className="text-sm text-gray-700 font-medium">Service client 24/7</span>
                    </div>
                  </div>
                </div>

                {/* Right Content - Tracking Card */}
                <div className="mt-6 lg:mt-0">
                  <Card className="shadow-2xl border-2 border-orange-100 bg-white">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <MapPin className="w-5 sm:w-6 h-5 sm:h-6 text-orange-600" />
                        Suivre une livraison
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="tracking" className="text-sm sm:text-base font-semibold text-gray-800 mb-2">
                            Numéro de suivi
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="tracking"
                              placeholder="Entrez votre numéro"
                              value={trackingNumber}
                              onChange={(e) => setTrackingNumber(e.target.value)}
                              className="flex-1 text-sm sm:text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                            />
                            <Button size="icon" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                              <ArrowRight className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>

                        <div className="text-sm text-gray-500">
                          Exemple: TBP-2024-XXXXXXX
                        </div>

                        <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-4 py-3 rounded-lg">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">Dernière livraison il y a 5 minutes</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10 sm:mb-16">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                  Comment ça marche ?
                </h3>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                  En seulement 3 étapes simples
                </p>
              </div>

              {/* Mobile: Vertical list / Desktop: 3-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {steps.map((step, index) => (
                  <div key={index} className="relative">
                    {/* Mobile layout */}
                    <div className="flex items-start gap-4 md:hidden">
                      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full text-white font-bold shadow-md">
                        {step.number}
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="text-lg font-bold text-gray-900 mb-1">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden md:block text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full text-white text-2xl font-bold shadow-lg mb-6">
                        {step.number}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">
                        {step.title}
                      </h4>
                      <p className="text-gray-600">
                        {step.description}
                      </p>
                    </div>

                    {/* Connector Line (desktop only) */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-orange-200 to-transparent"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* ====== BOTTOM NAVIGATION (mobile/tablet only) ====== */}
        <nav className="lg:hidden sticky bottom-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="px-2 sm:px-4">
            <div className="flex items-center justify-around py-2 sm:py-3">
              <button
                onClick={() => setActiveTab('accueil')}
                className={`flex flex-col items-center gap-1 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'accueil' ? 'text-orange-600' : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                <Home className="w-5 sm:w-6 h-5 sm:h-6" />
                <span className="text-[10px] sm:text-xs font-medium">Accueil</span>
              </button>

              <button
                onClick={() => setActiveTab('annonces')}
                className={`flex flex-col items-center gap-1 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'annonces' ? 'text-orange-600' : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                <Megaphone className="w-5 sm:w-6 h-5 sm:h-6" />
                <span className="text-[10px] sm:text-xs font-medium">Annonces</span>
              </button>

              <button
                onClick={() => setActiveTab('reponses')}
                className={`flex flex-col items-center gap-1 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'reponses' ? 'text-orange-600' : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                <MessageSquare className="w-5 sm:w-6 h-5 sm:h-6" />
                <span className="text-[10px] sm:text-xs font-medium">Réponses</span>
              </button>

              <button
                onClick={() => setActiveTab('livraisons')}
                className={`flex flex-col items-center gap-1 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'livraisons' ? 'text-orange-600' : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                <Package className="w-5 sm:w-6 h-5 sm:h-6" />
                <span className="text-[10px] sm:text-xs font-medium">Livraisons</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}
