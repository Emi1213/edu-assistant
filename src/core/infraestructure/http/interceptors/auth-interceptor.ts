import { useAuthStore } from "@/features/auth/context/auth-store";
import type { InternalAxiosRequestConfig } from "axios";

export class AuthInterceptor {
  static onRequest(
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig {
    const authStore = useAuthStore();

    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }

    return config;
  }
}