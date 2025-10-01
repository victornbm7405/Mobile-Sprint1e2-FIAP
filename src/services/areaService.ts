// src/services/areaService.ts
import { API_BASE } from "./config";

export type Area = { id: number; nome: string };

type Page<T> = { items: T[]; total: number; page: number; pageSize: number };

/** Lista até 1000 áreas para preencher selects/filtros. */
export async function listAreas(): Promise<Area[]> {
  // Tenta /api/Area e, se 404, tenta /api/Areas
  const urls = [
    `${API_BASE}/api/Area?page=1&pageSize=1000`,
    `${API_BASE}/api/Areas?page=1&pageSize=1000`,
  ];

  let lastStatus = 0;
  let lastText = "";

  for (const url of urls) {
    const r = await fetch(url);
    if (r.ok) {
      const data = await r.json();
      // backend pode devolver diretamente lista também
      if (Array.isArray(data)) return data as Area[];
      const page = data as Page<Area>;
      return page.items ?? [];
    } else {
      lastStatus = r.status;
      lastText = await r.text().catch(() => "");
    }
  }

  throw new Error(`Falha ao listar áreas: ${lastStatus} ${lastText}`);
}
