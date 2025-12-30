type ApiErrorPayload =
  | { message?: string; error?: string }
  | { message?: string; errors?: unknown }
  | Record<string, unknown>;

import type { User } from "../types/auth";

const TOKEN_STORAGE_KEY = "accessToken";

// Dit is de URL van je backend (configureerbaar via .env)
// Voorbeelden:
// - VITE_API_URL=http://localhost:3001
// - VITE_API_URL=http://localhost:3001/api/v1
function normalizeApiUrl(value: string) {
  const trimmed = value.trim().replace(/\/$/, "");
  const url = new URL(trimmed);

  // Ensure we always end up at `/api/v1`
  if (url.pathname === "" || url.pathname === "/") {
    url.pathname = "/api/v1";
  } else if (!url.pathname.endsWith("/api/v1")) {
    url.pathname = `${url.pathname.replace(/\/$/, "")}/api/v1`;
  }

  return url.toString().replace(/\/$/, "");
}

const API_URL = normalizeApiUrl(
  import.meta.env.VITE_API_URL ?? "http://localhost:3001"
);

async function parseJsonSafe<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return null;
  return (await response.json()) as T;
}

async function buildErrorMessage(response: Response) {
  const json = await parseJsonSafe<ApiErrorPayload>(response);
  if (json && typeof json === "object") {
    const msg =
      (json as { message?: string }).message ?? (json as { error?: string }).error;
    if (msg) return msg;
  }

  // Fallback: try plain text (helps if we accidentally hit Grafana/HTML)
  const text = await response.text().catch(() => "");
  if (text) return `Request failed (${response.status})`;
  return `Request failed (${response.status})`;
}

type LoginResponse = {
  message: string;
  data: { accessToken: string; user: User };
};

export const authApi = {
  // Login functie - stuurt email + wachtwoord naar backend
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(await buildErrorMessage(response));
    }

    const json = await parseJsonSafe<LoginResponse>(response);
    if (!json) {
      throw new Error("Login response is geen JSON. Check of je backend URL klopt.");
    }
    return json; // { message, data: { accessToken, user } }
  },

  async logout() {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!token) {
      throw new Error("Geen token gevonden");
    }

    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(await buildErrorMessage(response));
    }

    // token verwijderen uit storage
    localStorage.removeItem(TOKEN_STORAGE_KEY);

    return (await parseJsonSafe<unknown>(response)) ?? null;
  },

  async me() {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!token) {
      throw new Error("Geen token gevonden");
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // token ongeldig/verlopen
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      throw new Error("Niet ingelogd");
    }

    return (await parseJsonSafe<unknown>(response)) ?? null; // verwacht user info
  },
};
