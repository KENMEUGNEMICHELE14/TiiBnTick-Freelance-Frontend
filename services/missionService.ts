import apiClient from '@/lib/axios';

const API_URL = '/api/missions';

export interface MissionResponseDTO {
  id: string;
  title: string;
  description: string;
  status: string;
  amount: number;
  shipperFirstName: string;
  shipperLastName: string;
  shipperEmail: string;
  pickupAddress: {
    street?: string;
    district?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  deliveryAddress: {
    street?: string;
    district?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  packet: {
    designation?: string;
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    description?: string;
  };
  distance: number | null;
  duration: number | null;
  transportMethod: string;
  paymentMethod: string;
  assignedToId: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getMissions(): Promise<MissionResponseDTO[]> {
  try {
    const res = await apiClient.get<MissionResponseDTO[]>(API_URL);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch missions:', error);
    return [];
  }
}

export async function acceptMission(missionId: string, freelancerId: string): Promise<boolean> {
  try {
    await apiClient.post(`${API_URL}/${missionId}/accept`, { freelancerId });
    return true;
  } catch (error) {
    console.error('Failed to accept mission:', error);
    return false;
  }
}