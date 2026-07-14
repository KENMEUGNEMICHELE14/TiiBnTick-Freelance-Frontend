'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Truck,
  Rocket,
  ArrowRight,
  Brain,
  Navigation,
  Handshake,
  CheckCircle,
  Share2,
  Globe,
} from 'lucide-react';

export default function TiiBnTickGoLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const nav = navRef.current;
      if (nav) {
        if (window.scrollY > 20) {
          nav.classList.add('shadow-md');
        } else {
          nav.classList.remove('shadow-md');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Navigation */}
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 transition-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                  TiiBnTick
                </span>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <a href="#" className="text-orange-600 font-bold border-b-2 border-orange-600 pb-1 text-sm">Solutions</a>
                <a href="#" className="text-slate-600 hover:text-orange-600 font-medium transition-colors text-sm">Go</a>
                <a href="#" className="text-slate-600 hover:text-orange-600 font-medium transition-colors text-sm">Freelancer</a>
                <a href="#" className="text-slate-600 hover:text-orange-600 font-medium transition-colors text-sm">Resources</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-slate-600 hover:text-orange-600 font-medium transition-colors px-4 py-2 rounded-xl hidden sm:block">Connexion</button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {mobileMenuOpen ? <span className="w-6 h-6 flex items-center justify-center text-2xl leading-none">&times;</span> : (
                  <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4">
            <div className="flex flex-col gap-3">
              <a href="#" className="text-orange-600 font-bold py-2">Solutions</a>
              <a href="#" className="text-slate-600 hover:text-orange-600 font-medium py-2">Go</a>
              <a href="#" className="text-slate-600 hover:text-orange-600 font-medium py-2">Freelancer</a>
              <a href="#" className="text-slate-600 hover:text-orange-600 font-medium py-2">Resources</a>
              <button className="text-slate-600 font-medium py-2 text-left">Connexion</button>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl">S&apos;inscrire</Button>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[700px] flex items-center overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 py-20">
            <div className="space-y-8">
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 text-xs sm:text-sm px-3 sm:px-4 py-2">
                <Rocket className="w-4 h-4 mr-2" />
                TiiBnTick Go
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Marketplace d&apos;opportunités{' '}
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent italic">
                  en temps réel.
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-xl">
                Publiez des annonces de colis à collecter et matchez instantanément avec les disponibilités des freelances et transporteurs grâce à notre géolocalisation intelligente.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                >
                  Publier une annonce
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-300 text-slate-700 hover:border-orange-500 hover:text-orange-600 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-xl font-semibold w-full sm:w-auto"
                >
                  Découvrir nos solutions
                </Button>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-orange-200/30 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Écosystème TiiBnTick Go - Marketplace d'opportunités logistiques en Afrique"
                  src="/hero-edited.png"
                />
              </div>
            </div>
          </div>
          {/* Atmospheric BG Element */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-100/60 -z-0 skew-x-12 translate-x-1/2" />
        </section>

        {/* Core Features Bento Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">
                Fonctionnalités
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                La Suite TiiBnTick Go
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Une infrastructure robuste pour transformer la logistique du dernier kilomètre.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Feature 1: Matching Intelligent */}
              <div className="md:col-span-8 bg-slate-50 rounded-2xl p-8 sm:p-10 flex flex-col justify-between border-2 border-slate-100 hover:border-orange-300 transition-all group">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Brain className="w-8 h-8 text-orange-600" />
                  </div>
                  <span className="text-orange-600 font-semibold text-sm">Optimisé par IA</span>
                </div>
                <div className="mt-16">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Matching Intelligent</h3>
                  <p className="text-slate-600 max-w-md">
                    Algorithme propriétaire qui connecte vos envois aux livreurs les plus proches et les plus fiables en quelques secondes.
                  </p>
                </div>
              </div>

              {/* Feature 2: Visibilité */}
              <div className="md:col-span-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 sm:p-6 text-white flex flex-col justify-between shadow-xl overflow-hidden">
                <div className="relative rounded-xl overflow-hidden mb-4">
                  <img
                    src="/go-section.png"
                    alt="Visibilité Temps Réel - Marketplace d'opportunités logistiques"
                    className="w-full h-auto object-cover rounded-xl"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <Navigation className="w-8 h-8" />
                  <h3 className="text-xl font-bold">Visibilité Temps Réel</h3>
                </div>
                <p className="text-sm text-orange-100">
                  Suivez chaque mouvement de votre colis sur une carte interactive haute précision.
                </p>
              </div>

              {/* Feature 3: Connexion */}
              <div className="md:col-span-4 bg-white rounded-2xl p-8 sm:p-10 flex flex-col justify-between border-2 border-slate-100 hover:border-orange-300 shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Handshake className="w-6 h-6 text-orange-600" />
                </div>
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Connexion Client-Freelance</h3>
                  <p className="text-sm text-slate-600">Interface directe sans intermédiaire pour une réactivité maximale.</p>
                </div>
              </div>

              {/* Feature 4: Opportunités */}
              <div className="md:col-span-8 bg-slate-900 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8 text-white">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4">Opportunités inclusives</h3>
                  <p className="text-slate-300 mb-6">
                    Nous bâtissons un réseau qui donne une voix aux acteurs informels tout en garantissant une qualité de service internationale.
                  </p>
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl">
                    Rejoindre le réseau
                  </Button>
                </div>
                <div className="hidden md:block w-48 h-48 bg-orange-500/20 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Announcement Unit */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                Annonces
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                L&apos;unité d&apos;annonce intelligente
              </h2>
              <p className="text-lg text-slate-600">
                Notre système de cartes d&apos;annonces est conçu pour une prise de décision rapide. Une structure claire, des données précises et une action immédiate.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-slate-600">Tarification transparente calculée par l&apos;algorithme.</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-slate-600">Points d&apos;origine et de destination géolocalisés.</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-slate-600">Vérification de sécurité par QR Code.</span>
                </li>
              </ul>
            </div>

            <div>
              {/* Delivery Card Example */}
              <div className="bg-white rounded-2xl border-2 border-slate-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Prix Estimé</span>
                    <span className="text-2xl font-bold text-orange-600">3,500 FCFA</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block mb-1">Distance</span>
                    <span className="text-sm font-bold text-slate-900">4.2 km</span>
                  </div>
                </div>
                <div className="relative space-y-8 mb-8">
                  {/* Route line */}
                  <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-slate-200" />
                  <div className="flex items-start gap-4 relative">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center z-10">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Collecte</p>
                      <p className="text-sm font-medium text-slate-900">Marché Central, Yaoundé</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 relative">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center z-10">
                      <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Livraison</p>
                      <p className="text-sm font-medium text-slate-900">Bonapriso, Avenue de Gaulle</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl py-4">
                  Publier cette annonce
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 sm:p-12 md:p-20 text-center text-white relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-300/20 -z-0 blur-[100px] rounded-full" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 relative z-10">
                Prêt à connecter l&apos;Afrique ?
              </h2>
              <p className="text-orange-50 text-base sm:text-lg mb-12 max-w-2xl mx-auto relative z-10">
                Rejoignez une communauté de milliers d&apos;utilisateurs et transformez la façon dont nous échangeons des biens.
              </p>
              <div className="relative z-10">
                <Button
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-8 sm:px-10 py-4 sm:py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">TiiBnTick</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                La solution simple et fiable pour tous vos envois de colis au Cameroun. Du quartier au village.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Envoyer un colis</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Comment ça marche</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Espace PRO</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Suivre un colis</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Mentions Légales</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Carrier Terms</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suivez-nous</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all">
                  <Share2 className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all">
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">&copy; 2026 TiiBnTick Logistics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}