// src/services/http.ts
import { API_BASE } from "./config";

let apiToken: string | null = null;

/** Define (ou limpa) o token JWT para as próximas requisições */
export function setApiToken(token: string | null) {
  apiToken = token;
}

/** Wrapper de fetch que prefixa API_BASE e injeta Authorization: Bearer */
export async function http(path: string, init: RequestInit = {}): Promise<Response> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const headers = new Headers(init.headers);

  // Define Content-Type só quando tem body (evita OPTIONS desnecessário em GET)
  const hasBody = init.body != null;
  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (apiToken) {
    headers.set("Authorization", `Bearer ${apiToken}`);
  }

  return fetch(url, { ...init, headers });
}
