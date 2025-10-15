import { http } from "./http";
import type { AxiosResponse } from "axios";

// Shared ApiResponse shape used by backend
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserPreferences {
  // flexible key-value map, keep values typed as unknown instead of any
  [key: string]: unknown;
}

// User related types
export interface UserMe {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  phone?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  address?: string | null;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
}

// User profile
export interface UserProfile {
  id: number;
  userId: number;
  phone?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  address?: string | null;
  avatarUrl?: string;
  emergencyContact?: string | null;
}


// Other related types
export interface Service {
  id: number;
  name: string;
  price: number;
  description?: string;
  durationMinutes?: number;
}


// Dentist type (similar to src/services/dentist.ts but with optional fields for non-admin views)
export interface Dentist {
  id: number;
  name: string;
  userId: number;
  specialization?: string;
  email?: string;
  phone?: string;
  active?: boolean;
  bio?: string;
}

// Appointment type
export interface AppointmentHistory {
  id: number;
  status: string;
  scheduledTime: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  customerId: number;
  customerUsername: string;
  dentistId: number;
  dentistUsername: string;
  receptionistId: number;
  receptionistUsername: string;
  // optional nested service returned by some endpoints
  service?: Service | null;
}

export const UserAPI = {
  me: () =>
    http.get<ApiResponse<UserMe>>("/api/users/me").then((r: AxiosResponse<ApiResponse<UserMe>>) => r.data),

  updatePreferences: (payload: UserPreferences) =>
    http.patch<ApiResponse<UserMe>>("/api/users/me/preferences", payload).then((r: AxiosResponse<ApiResponse<UserMe>>) => r.data),

  getMe: () => http.get('/api/users/me').then(r => r.data),
  getProfile: () => http.get('/api/users/me/profile').then(r => r.data),
  getAppointmentHistory: () => http.get('/api/appointments/history').then(r => r.data),
  updateProfile: (payload: Partial<UserProfile>) =>
    http.patch<ApiResponse<UserProfile>>('/api/users/me/profile', payload).then((r: AxiosResponse<ApiResponse<UserProfile>>) => r.data),

  // services and dentists
  getServices: () => http.get<ApiResponse<Service[]>>('/api/services').then((r: AxiosResponse<ApiResponse<Service[]>>) => r.data),
  getDentists: () => http.get<ApiResponse<Dentist[]>>('/api/dentists').then((r: AxiosResponse<ApiResponse<Dentist[]>>) => r.data),

  // Update appointment by id (PUT)
  updateAppointment: (id: number, payload: Record<string, unknown>) =>
    http.put<ApiResponse<unknown>>(`/api/appointments/${id}`, payload).then((r: AxiosResponse<ApiResponse<unknown>>) => r.data),

  // Cancel (delete) appointment
  cancelAppointment: (id: number) => http.delete<ApiResponse<unknown>>(`/api/appointments/${id}`).then((r: AxiosResponse<ApiResponse<unknown>>) => r.data),
};
