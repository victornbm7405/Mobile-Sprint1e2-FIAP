import { tryPaths } from "./rest";

export type Area = { id: number; nome: string };
type Page<T> = { items: T[]; total: number; page: number; pageSize: number };

export async function listAreas(): Promise<Area[]> {
  const res = await tryPaths([
    "/api/v1/Area?page=1&pageSize=1000",
    "/api/Area?page=1&pageSize=1000",
    "/api/v1/Areas?page=1&pageSize=1000",
    "/api/Areas?page=1&pageSize=1000",
  ]);

  const data = await res.json().catch(() => null);
  if (Array.isArray(data)) return data as Area[];

  const page = (data ?? {}) as Page<Area>;
  return page.items ?? [];
}
