'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, MapPin, Clock, CheckCircle2, Truck, Phone,
  User, ArrowLeft, Star, ChevronRight, Navigation,
  Weight, Box, Calendar, RefreshCw,
} from 'lucide-react';

// ── Dynamic map import (SSR-safe) ─────────────────────────────────────────────
const MapLeaflet = dynamic(() => import('@/components/MapLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 animate-pulse flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-orange-400">
        <Navigation className="w-8 h-8 animate-bounce" />
        <span className="text-sm font-medium">Calcul du trajet…</span>
      </div>
    </div>
  ),
});

// ── Types ─────────────────────────────────────────────────────────────────────
type DeliveryStatus = 'pending' | 'picked_up' | 'in_transit' | 'delivered';

interface DeliveryData {
  id: string;
  status: DeliveryStatus;
  colis: { designation: string; poids: string; dimensions: string };
  livreur: { nom: string; prenom: string; telephone: string; vehicule: string };
  from: { label: string; lat: number; lng: number };
  to:   { label: string; lat: number; lng: number };
  estimatedArrival: string;
  distance: string;
  createdAt: string;
}

// ── Mock data (remplacer par appel API /api/livraisons/[id]) ──────────────────
const MOCK_DELIVERY: DeliveryData = {
  id: 'LIV-2026-00142',
  status: 'in_transit',
  colis: { designation: 'Documents confidentiels', poids: '0.5 kg', dimensions: '30×20×5 cm' },
  livreur: { nom: 'Nkounga', prenom: 'Éric', telephone: '+237691234567', vehicule: 'Moto Honda CB 125 — LT 2456 AC' },
  from: { label: 'Akwa, Douala', lat: 4.0511, lng: 9.7085 },
  to:   { label: 'Bonanjo, Douala', lat: 4.0580, lng: 9.6960 },
  estimatedArrival: '12 min',
  distance: '3.2 km',
  createdAt: '30 juillet 2026, 12h45',
};

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<DeliveryStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:    { label: 'En attente',      color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',   icon: <Clock className="w-4 h-4" /> },
  picked_up:  { label: 'Colis récupéré', color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',     icon: <Package className="w-4 h-4" /> },
  in_transit: { label: 'En route',        color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: <Truck className="w-4 h-4" /> },
  delivered:  { label: 'Livré ✓',         color: 'text-green-700',  bg: 'bg-green-50 border-green-200',   icon: <CheckCircle2 className="w-4 h-4" /> },
};

const TIMELINE: { key: DeliveryStatus; label: string; sub: string }[] = [
  { key: 'pending',    label: 'Commande créée',  sub: 'Colis en attente de prise en charge' },
  { key: 'picked_up', label: 'Colis récupéré',   sub: 'Le livreur a pris votre colis' },
  { key: 'in_transit',label: 'En route',          sub: 'Colis en cours de livraison' },
  { key: 'delivered', label: 'Livré',             sub: 'Colis remis au destinataire' },
];

const STATUS_ORDER: DeliveryStatus[] = ['pending', 'picked_up', 'in_transit', 'delivered'];

// ── OSRM fetcher ──────────────────────────────────────────────────────────────
async function fetchOsrmRoute(from: { lat: number; lng: number }, to: { lat: number; lng: number }) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('OSRM error');
    const data = await res.json();
    if (data.routes?.[0]?.geometry) {
      return { type: 'Feature' as const, geometry: data.routes[0].geometry, properties: {} };
    }
  } catch { /* fallback — ligne droite dans MapLeaflet */ }
  return null;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SuiviLivraisonPage() {
  const params = useParams();
  const router = useRouter();
  const deliveryId = (params?.id as string) || MOCK_DELIVERY.id;

  const [delivery] = useState<DeliveryData>(MOCK_DELIVERY);
  const [route, setRoute] = useState<any>(null);
  const [routeLoading, setRouteLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const statusIndex = STATUS_ORDER.indexOf(delivery.status);
  const statusConf  = STATUS_CONFIG[delivery.status];

  const loadRoute = useCallback(async () => {
    const r = await fetchOsrmRoute(delivery.from, delivery.to);
    setRoute(r);
    setRouteLoading(false);
  }, [delivery.from, delivery.to]);

  useEffect(() => { loadRoute(); }, [loadRoute]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRouteLoading(true);
    await loadRoute();
    setLastRefresh(new Date());
    setTimeout(() => setIsRefreshing(false), 700);
  };

  const markers = [
    { position: [delivery.from.lat, delivery.from.lng] as [number,number], label: `📦 ${delivery.from.label}`, color: '#f97316' },
    { position: [delivery.to.lat,   delivery.to.lng]   as [number,number], label: `📍 ${delivery.to.label}`,   color: '#22c55e' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-gray-900 text-base">Suivi de livraison</h1>
            <p className="text-xs text-gray-500 truncate">{deliveryId}</p>
          </div>
          <button onClick={handleRefresh} className="w-9 h-9 rounded-xl bg-orange-50 hover:bg-orange-100 flex items-center justify-center transition-colors">
            <RefreshCw className={`w-4 h-4 text-orange-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 space-y-4">

        {/* Status badge */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${statusConf.bg}`}>
          <div className={`${statusConf.color} flex-shrink-0`}>{statusConf.icon}</div>
          <div className="flex-1">
            <p className={`font-bold text-sm ${statusConf.color}`}>{statusConf.label}</p>
            {delivery.status === 'in_transit' && (
              <p className="text-xs text-gray-500 mt-0.5">
                Arrivée estimée dans <strong>{delivery.estimatedArrival}</strong> · {delivery.distance}
              </p>
            )}
          </div>
          {delivery.status === 'in_transit' && (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
            </span>
          )}
        </motion.div>

        {/* Map */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
          <div className="h-64 md:h-80">
            {!routeLoading ? (
              <MapLeaflet
                center={[(delivery.from.lat + delivery.to.lat) / 2, (delivery.from.lng + delivery.to.lng) / 2]}
                zoom={13}
                markers={markers}
                route={route}
                className="h-full"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 animate-pulse flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-orange-400">
                  <Navigation className="w-8 h-8 animate-bounce" />
                  <span className="text-sm font-medium">Calcul du trajet…</span>
                </div>
              </div>
            )}
          </div>
          <div className="px-4 py-3 flex items-center gap-3 border-t border-gray-100 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0" />
              <span className="truncate max-w-[130px]">{delivery.from.label}</span>
            </div>
            <div className="w-8 border-t border-dashed border-orange-300 flex-shrink-0" />
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
              <span className="truncate max-w-[130px]">{delivery.to.label}</span>
            </div>
            <span className="ml-auto text-xs text-gray-400 flex-shrink-0">
              {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 text-sm mb-4">Étapes de livraison</h2>
          {TIMELINE.map((step, idx) => {
            const done   = statusIndex > idx;
            const active = statusIndex === idx;
            const isLast = idx === TIMELINE.length - 1;
            return (
              <div key={step.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                    done ? 'bg-green-500 border-green-500' : active ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-300'
                  }`}>
                    {done ? <CheckCircle2 className="w-4 h-4 text-white" />
                          : active ? <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                          : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                  </div>
                  {!isLast && <div className={`w-0.5 h-9 mt-1 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />}
                </div>
                <div className="pb-4 pt-0.5">
                  <p className={`text-sm font-semibold ${done || active ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                  <p className={`text-xs mt-0.5 ${done || active ? 'text-gray-500' : 'text-gray-300'}`}>{step.sub}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Livreur */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <Truck className="w-4 h-4 text-orange-500" /> Votre livreur
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900">{delivery.livreur.prenom} {delivery.livreur.nom}</p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{delivery.livreur.vehicule}</p>
              <div className="flex items-center gap-0.5 mt-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-3 h-3 ${s <= 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                ))}
                <span className="text-xs text-gray-500 ml-1">4.0</span>
              </div>
            </div>
            <a href={`tel:${delivery.livreur.telephone}`}
              className="w-11 h-11 rounded-xl bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors shadow-sm">
              <Phone className="w-5 h-5 text-white" />
            </a>
          </div>
        </motion.div>

        {/* Colis */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-500" /> Détails du colis
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Box className="w-3.5 h-3.5" />,      label: 'Désignation', value: delivery.colis.designation },
              { icon: <Weight className="w-3.5 h-3.5" />,   label: 'Poids',       value: delivery.colis.poids },
              { icon: <MapPin className="w-3.5 h-3.5" />,   label: 'Dimensions',  value: delivery.colis.dimensions },
              { icon: <Calendar className="w-3.5 h-3.5" />, label: 'Créée le',    value: delivery.createdAt },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">{item.icon}{item.label}</div>
                <p className="text-sm font-semibold text-gray-800 truncate">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA notation — affiché seulement si livré */}
        <AnimatePresence>
          {delivery.status === 'delivered' && (
            <motion.div initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 shadow-lg">
              <p className="text-white font-bold text-base mb-1">Livraison terminée ! 🎉</p>
              <p className="text-orange-100 text-sm mb-4">Notez cette livraison pour aider la communauté.</p>
              <button
                onClick={() => router.push(`/livraison/${deliveryId}/notation?role=client`)}
                className="w-full bg-white text-orange-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-50 transition-colors">
                <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                Noter la livraison
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-6" />
      </main>
    </div>
  );
}
