// src/services/rest.ts
import { http } from "./http";

/** Tenta uma lista de caminhos e retorna o primeiro Response OK */
export async function tryPaths(paths: string[], init?: RequestInit): Promise<Response> {
  let lastStatus = 0;
  let lastText = "";
  for (const p of paths) {
    const res = await http(p, init);
    if (res.ok) return res;
    lastStatus = res.status;
    lastText = (await res.text().catch(() => "")) || String(res.status);
  }
  const err = new Error(lastText ? `Erro ${lastStatus}: ${lastText}` : `Falha ${lastStatus}`);
  // @ts-ignore para debug opcional
  (err as any).status = lastStatus;
  throw err;
}
