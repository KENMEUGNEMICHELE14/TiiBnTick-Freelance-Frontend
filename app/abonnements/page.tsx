"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Zap,
  Package,
  Infinity,
  Star,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface PlanCard {
  name: string;
  tagline: string;
  price: number;
  badge?: string;
  highlight: boolean;
  quota: string;
  commissionPercent: number;
  netPercent: number;
  features: string[];
  ctaLabel: string;
  icon: React.ReactNode;
}

/* ── Freelancer — SubscriptionType.java ─────────────────
   FREE(5, 30%) | STANDARD(30, 20%) | ADVANCE(-1, 10%)   */
const freelancerPlans: PlanCard[] = [
  {
    name: "FREE",
    tagline: "Démarrez sans engagement",
    price: 0,
    highlight: false,
    quota: "5 livraisons / mois",
    commissionPercent: 30,
    netPercent: 70,
    icon: <Package className="w-5 h-5" />,
    features: [
      "5 livraisons par période",
      "Commission TiiBnTick : 30 %",
      "Vous conservez 70 % du montant",
      "Support client par email",
      "Historique 30 jours",
    ],
    ctaLabel: "Commencer gratuitement",
  },
  {
    name: "STANDARD",
    tagline: "Pour les livreurs actifs",
    price: 8000,
    badge: "Recommandé",
    highlight: true,
    quota: "30 livraisons / mois",
    commissionPercent: 20,
    netPercent: 80,
    icon: <TrendingUp className="w-5 h-5" />,
    features: [
      "30 livraisons par période",
      "Commission TiiBnTick : 20 %",
      "Vous conservez 80 % du montant",
      "Tableau de bord livreur",
      "Suivi des quotas en temps réel",
      "Support prioritaire",
    ],
    ctaLabel: "Choisir STANDARD",
  },
  {
    name: "ADVANCE",
    tagline: "Pour les pros de la livraison",
    price: 15000,
    highlight: false,
    quota: "Livraisons illimitées",
    commissionPercent: 10,
    netPercent: 90,
    icon: <Infinity className="w-5 h-5" />,
    features: [
      "Livraisons illimitées",
      "Commission TiiBnTick : 10 %",
      "Vous conservez 90 % du montant",
      "Tableau de bord avancé",
      "Assurance colis incluse",
      "Statistiques complètes",
      "Support dédié 24/7",
    ],
    ctaLabel: "Choisir ADVANCE",
  },
];

/* ── Point Relais — RelayPointSubscriptionType.java ─────
   BASIC(50, 15%) | STANDARD(200, 10%) | PREMIUM(-1, 5%) */
const relayPointPlans: PlanCard[] = [
  {
    name: "BASIC",
    tagline: "Idéal pour débuter",
    price: 5000,
    highlight: false,
    quota: "50 dépôts / mois",
    commissionPercent: 15,
    netPercent: 85,
    icon: <Package className="w-5 h-5" />,
    features: [
      "50 dépôts de colis / période",
      "Commission TiiBnTick : 15 %",
      "Vous conservez 85 % du montant",
      "Gestion de stock de base",
      "Support par email",
    ],
    ctaLabel: "Choisir BASIC",
  },
  {
    name: "STANDARD",
    tagline: "Pour les points actifs",
    price: 12000,
    badge: "Populaire",
    highlight: true,
    quota: "200 dépôts / mois",
    commissionPercent: 10,
    netPercent: 90,
    icon: <ShieldCheck className="w-5 h-5" />,
    features: [
      "200 dépôts de colis / période",
      "Commission TiiBnTick : 10 %",
      "Vous conservez 90 % du montant",
      "Tableau de bord point relais",
      "Suivi des quotas en temps réel",
      "Support prioritaire",
    ],
    ctaLabel: "Choisir STANDARD",
  },
  {
    name: "PREMIUM",
    tagline: "Croissance maximale",
    price: 25000,
    highlight: false,
    quota: "Dépôts illimités",
    commissionPercent: 5,
    netPercent: 95,
    icon: <Star className="w-5 h-5" />,
    features: [
      "Dépôts illimités",
      "Commission TiiBnTick : 5 %",
      "Vous conservez 95 % du montant",
      "Tableau de bord complet",
      "Analytics avancées",
      "Référencement premium sur la plateforme",
      "Support dédié 24/7",
    ],
    ctaLabel: "Choisir PREMIUM",
  },
];

function PlanCardComponent({ plan }: { plan: PlanCard }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300
        ${plan.highlight
          ? "bg-orange-600 shadow-2xl shadow-orange-200 scale-[1.04] z-10"
          : "bg-white border border-orange-100 shadow-sm hover:shadow-lg hover:-translate-y-1"
        }`}
    >
      {/* Badge */}
      {plan.badge && (
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${plan.highlight ? "bg-white/20 text-white" : "bg-orange-100 text-orange-700"}`}
        >
          {plan.badge}
        </div>
      )}

      <div className="p-6 md:p-8 flex flex-col h-full">
        {/* Icône + nom */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-3
            ${plan.highlight ? "bg-white/20 text-white" : "bg-orange-100 text-orange-700"}`}
        >
          {plan.icon}
          <span className="text-xs font-bold uppercase tracking-widest">{plan.name}</span>
        </div>

        <p className={`text-sm mb-5 ${plan.highlight ? "text-orange-100" : "text-gray-500"}`}>
          {plan.tagline}
        </p>

        {/* Prix */}
        <div className="flex items-end gap-1 mb-3">
          <span className={`text-4xl font-black tracking-tight ${plan.highlight ? "text-white" : "text-gray-900"}`}>
            {plan.price === 0 ? "Gratuit" : plan.price.toLocaleString("fr-FR")}
          </span>
          {plan.price > 0 && (
            <span className={`text-sm font-medium mb-1.5 ${plan.highlight ? "text-orange-100" : "text-gray-400"}`}>
              FCFA / mois
            </span>
          )}
        </div>

        {/* Quota + net pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full
              ${plan.highlight ? "bg-white/20 text-white" : "bg-orange-100 text-orange-700"}`}
          >
            {plan.quota}
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full
              ${plan.highlight ? "bg-white/20 text-white" : "bg-green-50 text-green-700"}`}
          >
            Vous gardez {plan.netPercent} %
          </span>
        </div>

        {/* Séparateur */}
        <div className={`h-px mb-6 ${plan.highlight ? "bg-white/20" : "bg-orange-50"}`} />

        {/* Features */}
        <ul className="space-y-3 flex-1 mb-8">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                  ${plan.highlight ? "bg-white/25" : "bg-orange-100"}`}
              >
                <Check
                  className={`w-3 h-3 ${plan.highlight ? "text-white" : "text-orange-700"}`}
                  strokeWidth={3}
                />
              </span>
              <span className={`text-sm leading-snug ${plan.highlight ? "text-orange-50" : "text-gray-700"}`}>
                {f}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          className={`w-full h-12 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
            ${plan.highlight
              ? "bg-white text-orange-600 hover:bg-orange-50"
              : "bg-orange-600 text-white hover:bg-orange-700"
            }`}
        >
          {plan.ctaLabel}
        </button>
      </div>
    </div>
  );
}

export default function AbonnementsPage() {
  const [activeTab, setActiveTab] = useState<"freelancer" | "relaypoint">("freelancer");
  const currentPlans = activeTab === "freelancer" ? freelancerPlans : relayPointPlans;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour à l'accueil</span>
          </Link>
          <span className="text-lg font-black tracking-tighter text-gray-900">
            TiiB<span className="text-orange-600">n</span>Tick
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5 bg-orange-100 text-orange-700">
            <Zap className="w-3.5 h-3.5" />
            Tarifs &amp; Abonnements
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Choisissez votre formule
          </h1>
          <p className="text-lg text-gray-600">
            Des plans conçus pour chaque profil, avec des commissions
            transparentes et des quotas adaptés à votre activité.
          </p>
        </div>

        {/* Onglets */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 rounded-xl gap-1 bg-orange-100">
            <button
              onClick={() => setActiveTab("freelancer")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                ${activeTab === "freelancer"
                  ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                  : "text-orange-700 hover:bg-orange-200"
                }`}
            >
              🛵 Livreurs (Freelancer)
            </button>
            <button
              onClick={() => setActiveTab("relaypoint")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                ${activeTab === "relaypoint"
                  ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                  : "text-orange-700 hover:bg-orange-200"
                }`}
            >
              📦 Points Relais
            </button>
          </div>
        </div>

        {/* Sous-titre */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {activeTab === "freelancer" ? "Plans Freelancer / Livreur" : "Plans Point Relais"}
          </h2>
          <p className="text-gray-600">
            {activeTab === "freelancer"
              ? "Gérez vos livraisons avec un quota mensuel et une commission dégressive."
              : "Acceptez des dépôts de colis avec un quota mensuel et une commission avantageuse."}
          </p>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-6 items-center">
          {currentPlans.map((plan) => (
            <PlanCardComponent key={plan.name} plan={plan} />
          ))}
        </div>

        {/* Note transparence */}
        <div className="mt-12 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 bg-orange-50 border border-orange-100">
          <ShieldCheck className="w-8 h-8 flex-shrink-0 text-orange-600" />
          <div>
            <p className="font-semibold text-gray-900 mb-1">
              Transparence totale sur les commissions
            </p>
            <p className="text-sm text-gray-600">
              La commission TiiBnTick est déduite automatiquement de chaque
              transaction. Le montant affiché dans votre tableau de bord est
              toujours le montant net que vous recevez. Aucun frais caché.
            </p>
          </div>
        </div>

        {/* Méthodes de paiement */}
        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-gray-500 mb-3">Paiement accepté via</p>
          <div className="flex justify-center gap-3 flex-wrap">
            {["Mobile Money", "Orange Money", "Espèces"].map((method) => (
              <span
                key={method}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-orange-100 text-gray-600"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
