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

export interface UserMe {
  id?: string;
  username?: string;
  email?: string;
  preferences?: UserPreferences;
  // allow other backend-provided fields
  [key: string]: unknown;
}

export const UserAPI = {
  me: () =>
    http.get<ApiResponse<UserMe>>("/api/users/me").then((r: AxiosResponse<ApiResponse<UserMe>>) => r.data),

  updatePreferences: (payload: UserPreferences) =>
    http.patch<ApiResponse<UserMe>>("/api/users/me/preferences", payload).then((r: AxiosResponse<ApiResponse<UserMe>>) => r.data),
};

