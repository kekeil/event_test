import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import type { ProblemDetail } from "@/lib/types";

import { AUTH_COOKIE } from "@/lib/auth/constants";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

function readAuthCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${AUTH_COOKIE}=([^;]*)`),
  );
  const raw = match?.[1];
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = readAuthCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ProblemDetail>) => Promise.reject(err),
);

export type ApiErrorShape = {
  code?: string;
  message: string;
  fieldErrors?: Record<string, string>;
};

export function extractApiError(err: unknown): ApiErrorShape {
  if (!axios.isAxiosError(err)) {
    return { message: "Une erreur inattendue s'est produite." };
  }
  const raw = err.response?.data;
  const pd =
    raw && typeof raw === "object"
      ? (raw as Partial<ProblemDetail> & {
          errors?: { field: string; message: string }[];
        })
      : undefined;
  const status = err.response?.status;
  const code = typeof pd?.code === "string" ? pd.code : undefined;
  const detail =
    (typeof pd?.detail === "string" ? pd.detail : undefined) ??
    (typeof pd?.title === "string" ? pd.title : undefined) ??
    err.message;
  const fieldErrors: Record<string, string> = {};
  if (pd?.errors?.length) {
    for (const e of pd.errors) {
      if (e.field) fieldErrors[e.field] = e.message;
    }
  }
  if (Object.keys(fieldErrors).length) {
    return { code, message: detail ?? "Validation", fieldErrors };
  }
  if (detail) return { code, message: detail };
  if (status === 401) return { code, message: "Authentification requise." };
  return { code, message: "Une erreur s'est produite." };
}
