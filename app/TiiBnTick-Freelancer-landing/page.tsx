'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
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
                <Badge className="ml-2 bg-orange-100 text-orange-700 hover:bg-orange-200 hidden sm:inline-flex">Freelancer</Badge>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <a href="#" className="text-orange-600 font-bold border-b-2 border-orange-600 pb-1 text-sm">Freelancer</a>
                <a href="#" className="text-slate-600 hover:text-orange-600 font-medium transition-colors text-sm">Solutions</a>
                <a href="#" className="text-slate-600 hover:text-orange-600 font-medium transition-colors text-sm">Resources</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-slate-600 hover:text-orange-600 font-medium transition-colors px-4 py-2 hidden sm:block">Connexion</button>
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
              <a href="#" className="text-orange-600 font-bold py-2">Freelancer</a>
              <a href="#" className="text-slate-600 hover:text-orange-600 font-medium py-2">Solutions</a>
              <a href="#" className="text-slate-600 hover:text-orange-600 font-medium py-2">Resources</a>
              <button className="text-slate-600 font-medium py-2 text-left">Connexion</button>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl">S&apos;inscrire</Button>
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
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-slate-900 mb-4 leading-tight">
                TiiBnTick{' '}
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Freelancer.
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-lg">
                L&apos;application dédiée pour professionnaliser les benskinneurs et transporteurs individuels. Gagnez en crédibilité avec un profil pro et des revenus sécurisés.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
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
                <p className="text-sm text-slate-600">
                  <span className="font-bold text-slate-900">+15,000</span> livreurs nous font confiance
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
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Pourquoi rejoindre le réseau ?
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Nous construisons l&apos;infrastructure qui transforme la logistique informelle en un métier d&apos;avenir structuré et respecté.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Benefit 1 */}
              <div className="p-8 rounded-2xl border-2 border-slate-100 hover:border-orange-300 bg-white transition-all hover:shadow-lg group">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Profil Pro &amp; Réputation</h3>
                <p className="text-slate-600">
                  Construisez votre crédibilité avec un profil vérifié, un historique de courses complet et des avis clients qui boostent vos opportunités.
                </p>
              </div>
              {/* Benefit 2 */}
              <div className="p-8 rounded-2xl border-2 border-slate-100 hover:border-orange-300 bg-white transition-all hover:shadow-lg group">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Revenus Structurés</h3>
                <p className="text-slate-600">
                  Recevez vos paiements de manière sécurisée et instantanée. Suivez vos gains journaliers et hebdomadaires directement sur votre tableau de bord.
                </p>
              </div>
              {/* Benefit 3 */}
              <div className="p-8 rounded-2xl border-2 border-slate-100 hover:border-orange-300 bg-white transition-all hover:shadow-lg group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Route className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Optimisation Trajets</h3>
                <p className="text-slate-600">
                  Notre algorithme intelligent optimise vos itinéraires pour réduire votre consommation de carburant et maximiser le nombre de livraisons.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Management */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
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
                    <p className="text-xs font-bold text-slate-900 leading-tight">Colis Express</p>
                    <p className="text-[10px] text-slate-500">Distance: 3.2 km</p>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs sm:text-sm font-semibold rounded-lg">
                  Accepter la mission
                </Button>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                Gestion des missions
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Gestion intelligente des missions
              </h2>
              <p className="text-lg text-slate-600">
                Plus besoin de chercher des clients. TiiBnTick Go vous connecte en temps réel avec des opportunités proches de vous.
              </p>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-1">Matching Intelligent</h4>
                    <p className="text-slate-600">Recevez des propositions adaptées à votre véhicule et votre position actuelle.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                    <Navigation className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-1">Visibilité Temps Réel</h4>
                    <p className="text-slate-600">Suivez votre progression et informez vos clients instantanément de votre arrivée.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-1">Paiement Garanti</h4>
                    <p className="text-slate-600">L&apos;argent est bloqué par la plateforme au début de la course et libéré à la livraison.</p>
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
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 text-white text-center p-6 sm:p-8 md:p-12 rounded-2xl">
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
                  className="border-2 border-white/50 text-white hover:bg-white/10 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-xl font-semibold w-full sm:w-auto"
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
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">TiiBnTick</span>
              </div>
              <p className="text-slate-400 text-sm">
                La solution simple et fiable pour tous vos envois de colis au Cameroun. Connectant les quartiers et les villages.
              </p>
              <div className="flex gap-3 mt-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all">
                  <Share2 className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all">
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Envoyer un colis</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Comment ça marche</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors font-bold text-orange-400">Espace PRO</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Suivre un colis</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Mentions Légales</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Conditions d&apos;Utilisation</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Politique de Confidentialité</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>Douala, Cameroun</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>contact@tiibntick.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>+237 6XX XXX XXX</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8">
            <p className="text-sm text-slate-400 text-center">
              &copy; 2026 TiiBnTick Logistics. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 bg-gradient-to-br from-orange-500 to-orange-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-transform group">
        <Headphones className="w-7 h-7" />
        <span className="absolute right-18 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Besoin d&apos;aide ?
        </span>
      </button>
    </div>
  );
}