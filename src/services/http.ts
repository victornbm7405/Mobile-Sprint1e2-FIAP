// src/services/http.ts
import { API_BASE } from "./config";

let apiToken: string | null = null;

/** Define (ou limpa) o token JWT para as próximas requisições */
export function setApiToken(token: string | null) {
  apiToken = token;
}

type HttpInit = RequestInit & {
  /** Tempo máximo da requisição em ms (opcional). Ex.: { timeoutMs: 15000 } */
  timeoutMs?: number;
};

/** Wrapper de fetch que prefixa API_BASE, injeta Authorization: Bearer e faz log em erro */
export async function http(path: string, init: HttpInit = {}): Promise<Response> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  const { timeoutMs, ...rest } = init;
  const headers = new Headers(rest.headers);

  // Define Content-Type só quando tem body e ainda não foi definido
  const hasBody = rest.body != null && (rest.method ?? "GET").toUpperCase() !== "GET";
  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Aceita JSON por padrão
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  // Injeta Bearer se houver token
  if (apiToken) {
    headers.set("Authorization", `Bearer ${apiToken}`);
  }

  // Timeout opcional
  const controller = new AbortController();
  const timer = timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;

  try {
    const res = await fetch(url, { ...rest, headers, signal: controller.signal });

    // Log simples para ajudar no debug quando a API retorna erro
    if (!res.ok) {
      try {
        const copy = res.clone();
        const txt = await copy.text();
        console.log("[HTTP ERROR]", res.status, rest.method ?? "GET", url, txt?.slice(0, 500));
      } catch {
        console.log("[HTTP ERROR]", res.status, rest.method ?? "GET", url, "<sem corpo>");
      }
    }

    return res;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
