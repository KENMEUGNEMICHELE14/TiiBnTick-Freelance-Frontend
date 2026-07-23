import React from 'react';
import Link from 'next/link';
import { Check, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ForfaitCard = ({
  titre,
  description,
  prix,
  features,
  buttonText,
  highlight = false,
}: {
  titre: string;
  description: string;
  prix: string | number;
  features: string[];
  buttonText: string;
  highlight?: boolean;
}) => (
  <Card className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${highlight ? 'border-orange-500 border-2 shadow-lg md:scale-105 z-10' : 'border-gray-200 border'}`}>
    {highlight && (
      <div className="absolute top-0 inset-x-0 h-1 bg-orange-500"></div>
    )}
    <CardContent className="p-6 md:p-8 flex flex-col h-full bg-white">
      <div className="text-center mb-6">
        <h3 className={`text-xl font-extrabold uppercase tracking-wide mb-2 ${highlight ? 'text-orange-500' : 'text-orange-500'}`}>{titre}</h3>
        <p className="text-sm text-gray-600 h-10 mb-4">{description}</p>
        <div className="flex items-end justify-center gap-1">
          <span className="text-4xl font-black text-gray-900">{prix}</span>
          <span className="text-sm font-bold text-gray-600 mb-1">FCFA/mois</span>
        </div>
      </div>
      
      <div className="space-y-4 flex-1 mb-8">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="mt-0.5 bg-orange-500 rounded text-white p-0.5 flex-shrink-0 shadow-sm">
              <Check className="h-3 w-3" strokeWidth={4} />
            </div>
            <span className="text-sm font-medium text-gray-900 leading-snug">{feature}</span>
          </div>
        ))}
      </div>
      
      <Button 
        className={`w-full h-12 text-base font-bold shadow-md transition-all hover:scale-[1.02] ${
          highlight 
            ? 'bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-500' 
            : 'bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-500'
        }`}
      >
        {buttonText}
      </Button>
    </CardContent>
  </Card>
);

export default function AbonnementsPage() {
  const forfaits = [
    {
      titre: "FREE",
      description: "Pour les livreurs ne déboursant aucune somme",
      prix: "0",
      features: [
        "5 livraisons par mois",
        "Support client : Email",
        "Support SMS",
        "Historique (30 jours)"
      ],
      buttonText: "Commencer gratuitement",
      highlight: false
    },
    {
      titre: "STANDARD",
      description: "Pour les livreurs indépendants moyens",
      prix: "8.000",
      features: [
        "50 livraisons par mois",
        "Tableau de bord livreur",
        "Assurance colis : Non incluse",
        "Commission réduite (5%)"
      ],
      buttonText: "Commencer",
      highlight: true
    },
    {
      titre: "ADVANCED",
      description: "Pour les livreurs indépendants professionnels",
      prix: "15.000",
      features: [
        "livraison illimité",
        "Tableau de bord avancé",
        "Assurance colis : incluse",
        "Commission préférentielle (3%)"
      ],
      buttonText: "Commencer",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-orange-100">
      {/* Header simple avec bouton retour */}
      <header className="p-4 md:p-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold transition-colors">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="hidden sm:inline">Retour à l'accueil</span>
        </Link>
        <div className="text-xl font-black tracking-tighter text-orange-500">
          TiiBnTick
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-16 lg:px-8">
        {/* En-tête de page */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
            Forfaits
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Choisissez l'abonnement qui correspond le mieux à votre activité de livreur.
          </p>
        </div>

        {/* Grille de forfaits */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-4 lg:gap-8 max-w-5xl mx-auto items-center">
          {forfaits.map((forfait, index) => (
            <ForfaitCard key={index} {...forfait} />
          ))}
        </div>
      </main>
    </div>
  );
}
