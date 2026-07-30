'use client';

import React, { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, ArrowLeft, Send, CheckCircle2,
  Truck, User, MessageSquare, Loader2,
} from 'lucide-react';
import { submitRating } from '@/services/livraisonService';


// ── Types ─────────────────────────────────────────────────────────────────────
type Role = 'client' | 'livreur';

// ── Star rating component ─────────────────────────────────────────────────────
function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const labels: Record<number, string> = {
    1: 'Très mauvais', 2: 'Mauvais', 3: 'Moyen', 4: 'Bien', 5: 'Excellent !',
  };
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map(star => (
          <button key={star} type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-125 active:scale-110 focus:outline-none">
            <Star className={`w-10 h-10 transition-colors duration-150 ${
              star <= (hovered || value)
                ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                : 'text-gray-300'
            }`} />
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {(hovered || value) > 0 && (
          <motion.p key={hovered || value}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-sm font-semibold text-amber-600">
            {labels[hovered || value]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ role, router }: { role: Role; router: any }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Merci pour votre avis !</h1>
        <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8">
          Votre note a bien été enregistrée. Votre retour aide à améliorer la qualité du service TiiBnTick.
        </p>
        <button
          onClick={() => router.push(role === 'client' ? '/user' : '/go')}
          className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-md">
          Retour à l'accueil
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function NotationPage() {
  const params       = useParams();
  const router       = useRouter();
  const searchParams = useSearchParams();

  const deliveryId = params?.id as string;
  const role: Role = (searchParams.get('role') as Role) || 'client';

  const [rating,    setRating]    = useState(0);
  const [comment,   setComment]   = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [apiError,  setApiError]  = useState<string | null>(null);

  const isClient = role === 'client';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !deliveryId) return;
    setLoading(true);
    setApiError(null);
    try {
      await submitRating({
        announcementId: deliveryId,
        role,
        rating,
        comment: comment.trim() || undefined,
      });
      setSubmitted(true);
    } catch (err: any) {
      setApiError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return <SuccessScreen role={role} router={router} />;

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
            <p className="text-xs text-gray-500 truncate">{deliveryId}</p>
          </div>
          {/* Role switcher */}
          <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5 text-xs">
            <button
              onClick={() => router.push(`/livraison/${deliveryId}/notation?role=client`)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${role === 'client' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}>
              Client
            </button>
            <button
              onClick={() => router.push(`/livraison/${deliveryId}/notation?role=livreur`)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${role === 'livreur' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>
              Livreur
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Cible de la notation */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl ${isClient ? 'bg-orange-100' : 'bg-blue-100'} flex items-center justify-center flex-shrink-0`}>
              {isClient
                ? <Truck className="w-7 h-7 text-orange-500" />
                : <User  className="w-7 h-7 text-blue-500"   />}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">
                {isClient ? 'Vous notez votre livreur' : 'Vous notez votre client'}
              </p>
              <p className="font-bold text-gray-900 text-lg">Livraison #{deliveryId}</p>
            </div>
          </motion.div>

          {/* Étoiles */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 text-sm mb-1 text-center">
              {isClient ? 'Notez votre livreur' : 'Notez votre client'}
            </h2>
            <p className="text-xs text-gray-400 text-center mb-5">Sélectionnez une note de 1 à 5 étoiles</p>
            <StarRating value={rating} onChange={setRating} />
            {rating === 0 && (
              <p className="text-center text-xs text-gray-400 mt-3">Appuyez sur une étoile pour noter</p>
            )}
          </motion.div>

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

          {/* Erreur API */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {apiError}
            </div>
          )}

          {/* Bouton submit */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <button type="submit" disabled={rating === 0 || loading}
              className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                rating > 0 && !loading
                  ? 'bg-orange-500 hover:bg-orange-600 text-white active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}>
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Envoi en cours…</>
              ) : (
                <><Send className="w-5 h-5" />Envoyer mon avis</>
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
