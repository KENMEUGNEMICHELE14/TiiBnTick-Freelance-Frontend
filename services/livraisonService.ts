import apiClient from '@/lib/axios';

const API_URL = '/api/announcements';

// ── Types ─────────────────────────────────────────────────────────────────────

export type DeliveryStatus = 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export interface TrackingResponseDTO {
  id: string;
  status: DeliveryStatus;
  estimatedArrival?: string;   // ISO string or human label
  distance?: string;
  createdAt: string;
  colis: {
    designation: string;
    poids?: string;
    dimensions?: string;
    photoPacket?: string;
  };
  livreur: {
    id: string;
    prenom: string;
    nom: string;
    telephone: string;
    vehicule?: string;
    rating?: number;
  };
  from: {
    label: string;
    lat?: number;
    lng?: number;
  };
  to: {
    label: string;
    lat?: number;
    lng?: number;
  };
}

export interface RatingPayload {
  announcementId: string;
  role: 'client' | 'livreur';   // who is rating
  rating: number;               // 1-5
  comment?: string;
  tags?: string[];
}

export interface RatingResponseDTO {
  id: string;
  announcementId: string;
  role: string;
  rating: number;
  comment?: string;
  tags?: string[];
  createdAt: string;
}

// ── Fetch tracking data for an announcement ────────────────────────────────────
export async function getAnnouncementTracking(announcementId: string): Promise<TrackingResponseDTO> {
  const res = await apiClient.get<TrackingResponseDTO>(`${API_URL}/${announcementId}/tracking`);
  return res.data;
}

// ── Submit a rating ────────────────────────────────────────────────────────────
export async function submitRating(payload: RatingPayload): Promise<RatingResponseDTO> {
  const res = await apiClient.post<RatingResponseDTO>(
    `${API_URL}/${payload.announcementId}/rating`,
    payload
  );
  return res.data;
}

// ── Get existing ratings for an announcement ───────────────────────────────────
export async function getRatings(announcementId: string): Promise<RatingResponseDTO[]> {
  const res = await apiClient.get<RatingResponseDTO[]>(`${API_URL}/${announcementId}/ratings`);
  return res.data;
}
