import { tryPaths } from "./rest";

export type Motorcycle = {
  id: string | number;
  modelo: string;
  placa: string;
  createdAt?: string;
  areaId?: number;
  areaNome?: string;
};

type ServerMoto = {
  id: number;
  placa: string;
  modelo: string;
  idArea: number;
  createdAt?: string;
};

type Page<T> = {
  total: number;
  page: number;
  pageSize: number;
  items: T[];
  _links?: any;
};

function normalize(m: ServerMoto): Motorcycle {
  return {
    id: m.id,
    placa: m.placa,
    modelo: m.modelo,
    areaId: m.idArea,
    createdAt: m.createdAt ?? new Date().toISOString(),
  };
}

function isServerMoto(x: any): x is ServerMoto {
  return x && typeof x === "object" && "id" in x && "placa" in x && "modelo" in x && "idArea" in x;
}

function sanitizePlaca(p: string): string {
  return (p ?? "").replace(/[^A-Z0-9]/gi, "").toUpperCase();
}

function unwrapMaybeEnvelope(json: any): any {
  if (json && typeof json === "object" && "data" in json && isServerMoto(json.data)) return json.data;
  if (isServerMoto(json)) return json;
  if (json?.resource && isServerMoto(json.resource)) return json.resource;
  if (json?.item && isServerMoto(json.item)) return json.item;
  if (Array.isArray(json) && json.length && isServerMoto(json[0])) return json[0];
  return null;
}

async function getAll(): Promise<Motorcycle[]> {
  const res = await tryPaths([
    "/api/v1/Motos?page=1&pageSize=1000",
    "/api/Motos?page=1&pageSize=1000",
  ]);
  const data = await res.json().catch(() => null);
  if (Array.isArray(data)) return (data as ServerMoto[]).map(normalize);
  const page = (data ?? {}) as Page<ServerMoto>;
  return (page.items ?? []).map(normalize);
}

async function save(m: { modelo: string; placa: string; areaId: number }): Promise<Motorcycle> {
  const body = { modelo: m.modelo, placa: sanitizePlaca(m.placa), idArea: m.areaId };
  const res = await tryPaths(
    ["/api/v1/Motos", "/api/Motos"],
    { method: "POST", body: JSON.stringify(body) }
  );

  try {
    const json = await res.json().catch(() => null);
    const unwrapped = unwrapMaybeEnvelope(json);
    if (unwrapped) return normalize(unwrapped as ServerMoto);
  } catch {}
  return { id: "temp", modelo: body.modelo, placa: body.placa, areaId: body.idArea, createdAt: new Date().toISOString() };
}

async function update(id: string | number, m: Partial<Motorcycle>): Promise<Motorcycle> {
  const idNum = Number(id);
  const body: any = {
    id: idNum,
    modelo: m.modelo,
    placa: m.placa != null ? sanitizePlaca(m.placa) : undefined,
    idArea: m.areaId,
  };

  const res = await tryPaths(
    [`/api/v1/Motos/${idNum}`, `/api/Motos/${idNum}`],
    { method: "PUT", body: JSON.stringify(body) }
  );

  try {
    const json = await res.json().catch(() => null);
    const unwrapped = unwrapMaybeEnvelope(json);
    if (unwrapped) return normalize(unwrapped as ServerMoto);
  } catch {}
  return { id: idNum, modelo: body.modelo, placa: body.placa, areaId: body.idArea, createdAt: new Date().toISOString() };
}

async function remove(id: string | number): Promise<void> {
  const res = await tryPaths(
    [`/api/v1/Motos/${id}`, `/api/Motos/${id}`],
    { method: "DELETE" }
  );
  if (!res.ok && res.status !== 204) {
    const t = await res.text().catch(() => "");
    throw new Error(`Falha ao excluir moto: ${res.status} ${t}`);
  }
}

export const motorcycleService = { getAll, save, update, delete: remove };
