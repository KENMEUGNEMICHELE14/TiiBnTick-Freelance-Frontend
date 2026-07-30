'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Package,
  Truck,
  Shield,
  DollarSign,
  Route,
  CheckCircle,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Share2,
  Globe,
  Navigation,
  Headphones,
} from 'lucide-react';

export default function TiiBnTickFreelancerLandingPage() {
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
    <div className="min-h-screen flex flex-col bg-[#f5f0e6]">
      {/* Navigation */}
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 transition-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#e67e22] rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-[#1e2a4a]">
                  TiiB<span className="text-orange-500">n</span>Tick
                </span>
                <Badge className="ml-2 bg-orange-100 text-orange-700 hover:bg-orange-200 hidden sm:inline-flex">Freelancer</Badge>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <a href="#" className="text-orange-600 font-bold border-b-2 border-orange-600 pb-1 text-sm">Freelancer</a>
                <a href="#" className="text-[#5a6b8a] hover:text-orange-600 font-medium transition-colors text-sm">Solutions</a>
                <a href="#" className="text-[#5a6b8a] hover:text-orange-600 font-medium transition-colors text-sm">Resources</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/connexion" className="text-gray-700 hover:text-orange-600 font-medium transition-colors px-4 py-2 hidden sm:block">Connexion</Link>
              <Link href="/inscription" className="hidden sm:flex bg-[#e67e22] hover:bg-[#d35400] text-white font-medium px-5 py-2.5 rounded-lg transition-all shadow-md items-center justify-center">S&apos;inscrire</Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {mobileMenuOpen ? <span className="w-6 h-6 flex items-center justify-center text-2xl leading-none">&times;</span> : (
                  <svg className="w-6 h-6 text-[#5a6b8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4">
            <div className="flex flex-col gap-3">
              <a href="#" className="text-orange-600 font-bold py-2">Freelancer</a>
              <a href="#" className="text-[#5a6b8a] hover:text-orange-600 font-medium py-2">Solutions</a>
              <a href="#" className="text-[#5a6b8a] hover:text-orange-600 font-medium py-2">Resources</a>
              <Link href="/connexion" className="text-[#5a6b8a] font-medium py-2 text-left">Connexion</Link>
              <Link href="/inscription" className="w-full">
                <Button className="w-full bg-[#e67e22] hover:bg-[#d35400] text-white font-medium rounded-lg">S&apos;inscrire</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[700px] flex items-center py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-8">
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 text-xs sm:text-sm px-3 sm:px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Solution pour Livreurs Indépendants
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#1e2a4a] mb-4 leading-tight">
                TiiB<span className="text-orange-500">n</span>Tick{' '}
                <span className="text-[#e67e22]">
                  Freelancer.
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-[#5a6b8a] max-w-lg">
                L&apos;application dédiée pour professionnaliser les benskinneurs et transporteurs individuels. Gagnez en crédibilité avec un profil pro et des revenus sécurisés.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  size="lg"
                  className="bg-[#e67e22] hover:bg-[#d35400] text-white text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                >
                  Devenir Freelancer
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-300 text-slate-700 hover:border-orange-500 hover:text-orange-600 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-xl font-semibold w-full sm:w-auto"
                >
                  Trouver des courses
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  <div
                    className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCLqhqJ8pitSI3Fl4eR_vAC57CWAp9o0do0t3rmS0sVdgQg0iCT9KRYrwndtk0jYJi02-Bp1j7cfK9JCMwcvbaUcP0Waq1jSy7JK_QpjgtEBgBOjy043x5gWiSc3daJ2xb6BvZTnsQn4RyPZtl_PB742zyQhhK3lKkxXE3JT2ls0RXN6oll_7w5ef_6juqh7BcieSnGcJcFeLYfu_zHer-PRUi65Hj6qHKSbS8w8hEX9Cc1GVGpSXZG')" }}
                  />
                  <div
                    className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBWRIOrTTxWYllG63F5ihNWh15WEvtF1FWAhXWwYyNwvtAcMUjee_q4_iFAvD7Gtqz34WyHSbZotyJDSBHEP2LEuPPC6iOgPTu8YCNLKmBDUAR-TTG-034EBdWrDLjoxI5b63H6Je1khhVi9wAu6QSnR_W5G9yujpFGC2jC4SY4JxT0jnWuAZVCNI8NOZzcrQhHEM49a9TqvIrIL8XZ3cgR-aFkRxyNZJdZt4daTC6zNE6DpzeNnUUN')" }}
                  />
                  <div
                    className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD7WpQs6UpM17tjlcXMdK2XJ7sjCWxx4SDp5rj4oJoOnVTKBXSCslJl28Zcjbyd25k-nGTddYIF5u4eBskGnSuSEVA5JFDIrt_jJdIeEV_6kvBohLhTQAp64r-_lmJnt2w3VU4sa7E46KC5QiPIiXio4w1b2mPnarxRgvGp65wTheWFsmNw8cFyuFZkiKUMCfNrJOg2hjXEHTL2_VNJgxhPRYC6HwocR5wj2PwRr66Wci_zIq-fSDte')" }}
                  />
                </div>
                <p className="text-sm text-[#5a6b8a]">
                  <span className="font-bold text-[#1e2a4a]">+15,000</span> livreurs nous font confiance
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-orange-200/30 rounded-full blur-3xl group-hover:bg-orange-300/40 transition-all duration-500" />
              <img
                className="relative w-full rounded-2xl shadow-2xl z-10 transition-transform duration-500 group-hover:scale-[1.02]"
                alt="Un livreur africain sur une moto jaune avec des colis, utilisant l'application TiiBnTick"
                src="/hero-orange.png"
              />
            </div>
          </div>
        </section>

        {/* Core Benefits */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">
                Avantages
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1e2a4a] mb-4">
                Pourquoi rejoindre le réseau ?
              </h2>
              <p className="text-lg text-[#5a6b8a] max-w-2xl mx-auto">
                Nous construisons l&apos;infrastructure qui transforme la logistique informelle en un métier d&apos;avenir structuré et respecté.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Benefit 1 */}
              <div className="p-8 rounded-2xl border-2 border-slate-100 hover:border-orange-300 bg-white transition-all hover:shadow-lg group">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#1e2a4a] mb-3">Profil Pro &amp; Réputation</h3>
                <p className="text-[#5a6b8a]">
                  Construisez votre crédibilité avec un profil vérifié, un historique de courses complet et des avis clients qui boostent vos opportunités.
                </p>
              </div>
              {/* Benefit 2 */}
              <div className="p-8 rounded-2xl border-2 border-slate-100 hover:border-orange-300 bg-white transition-all hover:shadow-lg group">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#1e2a4a] mb-3">Revenus Structurés</h3>
                <p className="text-[#5a6b8a]">
                  Recevez vos paiements de manière sécurisée et instantanée. Suivez vos gains journaliers et hebdomadaires directement sur votre tableau de bord.
                </p>
              </div>
              {/* Benefit 3 */}
              <div className="p-8 rounded-2xl border-2 border-slate-100 hover:border-orange-300 bg-white transition-all hover:shadow-lg group">
                <div className="w-16 h-16 bg-[#e67e22] hover:bg-[#d35400] text-whited-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Route className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#1e2a4a] mb-3">Optimisation Trajets</h3>
                <p className="text-[#5a6b8a]">
                  Notre algorithme intelligent optimise vos itinéraires pour réduire votre consommation de carburant et maximiser le nombre de livraisons.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Management */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#ffffff]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                className="absolute inset-0 w-full h-full object-cover"
                alt="Carte logistique interactive montrant des itinéraires de livraison"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHHF07Zqwr3BrbegQko8som8ruCwVVXt9GpagRdBjCtbleWc0pNv44XQQ1SWTGcrH68ODY2hUgrdHMk5mHs-jKdEb06cGpSiEncGC_llamGZihCJ_s4gKkYkUeHiVLah4L833UFiP7QaCXXoFqf2s9ZyIxRiBGfKDXT43WLlAktziREX-PoHho6kqGpGROtSayq7fcNDrQDQqtIoCSqztQN07qnE9L9eniH8ojT9YewNTQMpEipCiE"
              />
              <div className="absolute top-4 right-4 w-64 sm:w-72 bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-green-100 text-green-700 text-[10px] px-2 py-1">Mission Disponible</Badge>
                  <span className="text-orange-600 font-bold text-sm sm:text-base">2,500 FCFA</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1e2a4a] leading-tight">Colis Express</p>
                    <p className="text-[10px] text-slate-500">Distance: 3.2 km</p>
                  </div>
                </div>
                <Button className="w-full bg-[#e67e22] hover:bg-[#d35400] text-white text-xs sm:text-sm font-semibold rounded-lg">
                  Accepter la mission
                </Button>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                Gestion des missions
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1e2a4a]">
                Gestion intelligente des missions
              </h2>
              <p className="text-lg text-[#5a6b8a]">
                Plus besoin de chercher des clients. TiiBnTick Go vous connecte en temps réel avec des opportunités proches de vous.
              </p>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#1e2a4a] mb-1">Matching Intelligent</h4>
                    <p className="text-[#5a6b8a]">Recevez des propositions adaptées à votre véhicule et votre position actuelle.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Navigation className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#1e2a4a] mb-1">Visibilité Temps Réel</h4>
                    <p className="text-[#5a6b8a]">Suivez votre progression et informez vos clients instantanément de votre arrivée.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#1e2a4a] mb-1">Paiement Garanti</h4>
                    <p className="text-[#5a6b8a]">L&apos;argent est bloqué par la plateforme au début de la course et libéré à la livraison.</p>
                  </div>
                </li>
              </ul>
              <div className="pt-4">
                <button className="text-orange-600 font-semibold flex items-center gap-2 hover:translate-x-1 transition-transform hover:text-orange-700">
                  Découvrir le fonctionnement
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#e67e22] border-0 text-white text-center p-6 sm:p-8 md:p-12 rounded-2xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Prêt à rejoindre la révolution logistique ?
              </h2>
              <p className="text-orange-50 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
                Rejoignez une communauté de milliers d&apos;utilisateurs et transformez la façon dont nous échangeons des biens.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-orange-50 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white bg-white/20 text-white hover:bg-white hover:text-[#e67e22] text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-xl font-semibold w-full sm:w-auto backdrop-blur-sm"
                >
                  Consulter les tarifs
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
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-[#e67e22] rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">TiiB<span className="text-orange-400">n</span>Tick</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                La solution simple et fiable pour tous vos envois de colis au Cameroun. Connectant les quartiers et les villages.
              </p>
              {/* Social Links */}
              <div className="mt-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Suivez-nous</p>
                <div className="flex gap-3">
                  <a
                    href="https://www.facebook.com/YowyobInc"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TiiBnTick sur Facebook"
                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-orange-500/30"
                  >
                    {/* Facebook icon */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a
                    href="https://twitter.com/yowyob"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TiiBnTick sur Twitter / X"
                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-orange-500/30"
                  >
                    {/* X/Twitter icon */}
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a
                    href="https://www.instagram.com/yowyob"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TiiBnTick sur Instagram"
                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-orange-500/30"
                  >
                    {/* Instagram icon */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Navigation</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/expedition" className="hover:text-orange-400 transition-colors">Envoyer un colis</a></li>
                <li><a href="#how-it-works" className="hover:text-orange-400 transition-colors">Comment ça marche</a></li>
                <li><a href="/TiiBnTick-Freelancer-landing" className="hover:text-orange-400 transition-colors font-bold text-orange-400">Espace PRO</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Suivre un colis</a></li>
              </ul>
            </div>

            {/* Légal */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Légal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/legal/mentions-legales" className="hover:text-orange-400 transition-colors">Mentions Légales</a></li>
                <li><a href="/legal/cgu" className="hover:text-orange-400 transition-colors">Conditions d&apos;Utilisation</a></li>
                <li><a href="/legal/privacy" className="hover:text-orange-400 transition-colors">Politique de Confidentialité</a></li>
                <li><a href="/legal/cookies" className="hover:text-orange-400 transition-colors">Politique de Cookies</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>Douala, Cameroun</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <a href="mailto:contact@tiibntick.com" className="hover:text-orange-400 transition-colors">contact@tiibntick.com</a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>+237 6XX XXX XXX</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-slate-400">
              &copy; 2026 TiiBnTick — Un système Yowyob Inc. Ltd. Tous droits réservés.
            </p>
            <div className="flex gap-4 text-xs text-slate-500">
              <a href="/legal/privacy" className="hover:text-orange-400 transition-colors">Confidentialité</a>
              <a href="/legal/cookies" className="hover:text-orange-400 transition-colors">Cookies</a>
              <a href="/legal/cgu" className="hover:text-orange-400 transition-colors">CGU</a>
            </div>
          </div>
        </div>
      </footer>


    </div>
  );
}