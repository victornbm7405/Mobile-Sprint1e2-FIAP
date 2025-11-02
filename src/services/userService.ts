// src/services/userService.ts
import { http } from "./http";

export type User = {
  id: number;
  nome: string;
  email: string;
  username: string;
  role: string;
};

type Page<T> = {
  total: number;
  page: number;
  pageSize: number;
  items: T[];
  _links?: any;
};

const API_PATH = "/api/Usuarios";
const defaultHeaders = { "x-api-version": "1.0" };

// —— helpers ————————————————————————————————————————————
function normalize(u: any): User {
  return {
    id: Number(u.id ?? u.ID_USUARIO ?? u.userId ?? 0),
    nome: u.nome ?? u.name ?? u.NM_USUARIO ?? "",
    email: u.email ?? u.DS_EMAIL ?? "",
    username: u.username ?? u.DS_USERNAME ?? "",
    role: u.role ?? u.DS_ROLE ?? "User",
  };
}

function unwrap<T = any>(json: any): T | null {
  if (!json) return null;
  if (Array.isArray(json)) return (json[0] ?? null) as T;
  if (json.data) return json.data as T;
  if (json.item) return json.item as T;
  if (json.resource) return json.resource as T;
  return json as T;
}

// —— CRUD ————————————————————————————————————————————————
async function list(): Promise<User[]> {
  const r = await http(`${API_PATH}?page=1&pageSize=1000`, { headers: defaultHeaders as any });
  if (!r.ok) throw new Error(`Falha ao listar usuários: ${r.status} ${await r.text().catch(()=>"")}`);
  const data = await r.json().catch(() => null);
  if (Array.isArray(data)) return data.map(normalize);
  const page = (data ?? {}) as Page<any>;
  return (page.items ?? []).map(normalize);
}

async function create(input: {
  nome: string;
  email: string;
  username: string;
  senha: string;          // <- no form chamamos de "senha"
  role?: "User" | "Admin";
}): Promise<User> {
  const body = {
    nome: input.nome,
    email: input.email,
    username: input.username,
    passwordhash: input.senha,     // <- backend espera "passwordhash"
    role: input.role ?? "User",
  };

  const r = await http(API_PATH, {
    method: "POST",
    headers: defaultHeaders as any,
    body: JSON.stringify(body),
  });

  if (!(r.status === 200 || r.status === 201)) {
    throw new Error(`Falha ao criar usuário: ${r.status} ${await r.text().catch(()=>"")}`);
  }

  const json = await r.json().catch(() => null);
  const u = unwrap(json);
  return normalize(u ?? body);
}

async function update(id: number, changes: {
  nome?: string;
  email?: string;
  username?: string;
  senha?: string;                // se informado, envia como passwordhash
  role?: "User" | "Admin";
}): Promise<User> {
  const body: any = {
    id,
    nome: changes.nome,
    email: changes.email,
    username: changes.username,
    role: changes.role,
  };
  if (changes.senha) body.passwordhash = changes.senha;

  const r = await http(`${API_PATH}/${id}`, {
    method: "PUT",
    headers: defaultHeaders as any,
    body: JSON.stringify(body),
  });

  if (!r.ok) throw new Error(`Falha ao atualizar usuário: ${r.status} ${await r.text().catch(()=>"")}`);

  const json = await r.json().catch(() => null);
  const u = unwrap(json);
  return normalize(u ?? body);
}

async function remove(id: number): Promise<void> {
  const r = await http(`${API_PATH}/${id}`, { method: "DELETE", headers: defaultHeaders as any });
  if (!r.ok && r.status !== 204) {
    throw new Error(`Falha ao excluir usuário: ${r.status} ${await r.text().catch(()=>"")}`);
  }
}

export const userService = { list, create, update, delete: remove };
