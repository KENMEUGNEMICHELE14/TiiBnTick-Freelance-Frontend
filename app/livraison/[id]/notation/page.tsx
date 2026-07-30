'use client';

import React, { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, ArrowLeft, Send, CheckCircle2, Package,
  Truck, User, MapPin, MessageSquare, ThumbsUp,
  Clock, Shield, Award,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type Role = 'client' | 'livreur';

// ── Tags rapides par rôle ─────────────────────────────────────────────────────
const CLIENT_TAGS = [
  { id: 'ponctuel',      label: '⏱ Ponctuel',           icon: Clock },
  { id: 'soigneux',     label: '📦 Soigneux',            icon: Package },
  { id: 'professionnel',label: '💼 Professionnel',       icon: Award },
  { id: 'rapide',       label: '⚡ Rapide',              icon: Truck },
  { id: 'communicatif', label: '💬 Communicatif',        icon: MessageSquare },
  { id: 'fiable',       label: '🛡 Fiable',              icon: Shield },
];

const LIVREUR_TAGS = [
  { id: 'disponible',    label: '✅ Disponible',          icon: CheckCircle2 },
  { id: 'bien_emballe',  label: '📦 Colis bien emballé',  icon: Package },
  { id: 'facile_acces',  label: '🗺 Facile d\'accès',     icon: MapPin },
  { id: 'clair',         label: '💬 Instructions claires', icon: MessageSquare },
  { id: 'sympathique',   label: '😊 Sympathique',          icon: ThumbsUp },
  { id: 'ponctuel',      label: '⏱ Ponctuel',             icon: Clock },
];

// ── Star rating component ─────────────────────────────────────────────────────
function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);

  const labels: Record<number, string> = {
    1: 'Très mauvais',
    2: 'Mauvais',
    3: 'Moyen',
    4: 'Bien',
    5: 'Excellent !',
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-125 active:scale-110 focus:outline-none"
          >
            <Star
              className={`w-10 h-10 transition-colors duration-150 ${
                star <= (hovered || value)
                  ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {(hovered || value) > 0 && (
          <motion.p
            key={hovered || value}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm font-semibold text-amber-600"
          >
            {labels[hovered || value]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ role, router, deliveryId }: { role: Role; router: any; deliveryId: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6"
      >
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Merci pour votre avis !</h1>
        <p className="text-gray-500 text-sm max-w-xs mx-auto mb-2">
          Votre note a bien été enregistrée. Votre retour aide à améliorer la qualité du service TiiBnTick.
        </p>
        <div className="flex items-center justify-center gap-1 mt-2 mb-8">
          {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push(role === 'client' ? '/user' : '/go')}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-md"
          >
            Retour à l'accueil
          </button>
          {role === 'client' && (
            <button
              onClick={() => router.push(`/livraison/${deliveryId}/notation?role=livreur`)}
              className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm"
            >
              Voir la note du livreur
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function NotationPage() {
  const params       = useParams();
  const router       = useRouter();
  const searchParams = useSearchParams();

  const deliveryId = (params?.id as string) || 'LIV-2026-00142';
  const role: Role = (searchParams.get('role') as Role) || 'client';

  const [rating,    setRating]    = useState(0);
  const [comment,   setComment]   = useState('');
  const [tags,      setTags]      = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const tagList = role === 'client' ? CLIENT_TAGS : LIVREUR_TAGS;

  const toggleTag = (id: string) =>
    setTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setLoading(true);
    // TODO: POST /api/livraisons/[id]/notation  { role, rating, comment, tags }
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) return <SuccessScreen role={role} router={router} deliveryId={deliveryId} />;

  // Labels selon le rôle
  const isClient = role === 'client';
  const targetName  = isClient ? 'Éric Nkounga' : 'Marie Kamga';
  const targetRole  = isClient ? 'livreur' : 'client';
  const targetIcon  = isClient ? <Truck className="w-7 h-7 text-orange-500" /> : <User className="w-7 h-7 text-blue-500" />;
  const targetBg    = isClient ? 'bg-orange-100' : 'bg-blue-100';
  const sectionTitle = isClient ? 'Notez votre livreur' : 'Notez votre client';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-gray-900 text-base">Évaluation</h1>
            <p className="text-xs text-gray-500">{deliveryId}</p>
          </div>
          {/* Role switcher pill */}
          <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5 text-xs">
            <button
              onClick={() => router.push(`/livraison/${deliveryId}/notation?role=client`)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${role === 'client' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}
            >
              Client
            </button>
            <button
              onClick={() => router.push(`/livraison/${deliveryId}/notation?role=livreur`)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${role === 'livreur' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
            >
              Livreur
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Personne à noter */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl ${targetBg} flex items-center justify-center flex-shrink-0`}>
              {targetIcon}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">
                {isClient ? 'Votre livreur' : 'Votre client'}
              </p>
              <p className="font-bold text-gray-900 text-lg">{targetName}</p>
              <p className="text-sm text-gray-500">Livraison #{deliveryId}</p>
            </div>
          </motion.div>

          {/* Étoiles */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 text-sm mb-1 text-center">{sectionTitle}</h2>
            <p className="text-xs text-gray-400 text-center mb-5">Sélectionnez une note de 1 à 5 étoiles</p>
            <StarRating value={rating} onChange={setRating} />
            {rating === 0 && (
              <p className="text-center text-xs text-gray-400 mt-3">Appuyez sur une étoile pour noter</p>
            )}
          </motion.div>

          {/* Tags rapides */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 text-sm mb-1">Points forts</h2>
            <p className="text-xs text-gray-400 mb-4">Sélectionnez ce qui correspond (optionnel)</p>
            <div className="flex flex-wrap gap-2">
              {tagList.map(tag => {
                const selected = tags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                      selected
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm scale-[1.03]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Commentaire */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <label className="font-bold text-gray-900 text-sm mb-1 block">
              <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-orange-500" />Commentaire</span>
            </label>
            <p className="text-xs text-gray-400 mb-3">Partagez votre expérience (optionnel)</p>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={isClient
                ? 'Ex : Livreur très ponctuel, colis remis en parfait état…'
                : 'Ex : Client disponible, adresse facile à trouver…'}
              maxLength={400}
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-gray-50"
            />
            <p className="text-xs text-gray-400 text-right mt-1">{comment.length}/400</p>
          </motion.div>

          {/* Récapitulatif livraison */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Récapitulatif</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Distance', value: '3.2 km' },
                { label: 'Durée',    value: '18 min' },
                { label: 'Date',     value: '30 juil.' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <p className="text-base font-bold text-gray-900">{item.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bouton submit */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <button
              type="submit"
              disabled={rating === 0 || loading}
              className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                rating > 0 && !loading
                  ? 'bg-orange-500 hover:bg-orange-600 text-white active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Envoi en cours…
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Envoyer mon avis
                </>
              )}
            </button>
            {rating === 0 && (
              <p className="text-center text-xs text-gray-400 mt-2">Sélectionnez d'abord une note ★</p>
            )}
          </motion.div>

          <div className="h-6" />
        </form>
      </main>
    </div>
  );
}
