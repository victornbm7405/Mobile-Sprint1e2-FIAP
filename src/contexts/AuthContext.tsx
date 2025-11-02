// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { http, setApiToken } from "../services/http";

type User = { username: string };

type AuthContextValue = {
  token: string | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  /** Login (alias: signIn) */
  login: (username: string, password: string) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  /** Cadastro (se não houver endpoint, lança erro amigável) */
  signUp: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({} as any);

const TOKEN_KEY = "@mottu:token";
const USER_KEY  = "@mottu:user";

/** Tenta uma lista de caminhos e retorna o primeiro Response OK, senão lança com último status/texto */
async function tryPaths(paths: string[], init?: RequestInit): Promise<Response> {
  let lastStatus = 0;
  let lastText = "";
  for (const p of paths) {
    const res = await http(p, init);
    if (res.ok) return res;
    lastStatus = res.status;
    lastText = (await res.text().catch(() => "")) || String(res.status);
  }
  const err = new Error(lastText || `Falha ${lastStatus}`);
  // @ts-ignore anexar status para debug opcional
  err.status = lastStatus;
  throw err;
}

/** Extrai token em formatos comuns do backend */
function extractToken(payload: any): string | null {
  if (!payload || typeof payload !== "object") return null;
  return (
    payload.token ??
    payload.accessToken ??
    payload.access_token ??
    payload.jwt ??
    null
  );
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user,  setUser]  = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Boot: carrega sessão salva
  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (storedToken) {
          setToken(storedToken);
          setApiToken(storedToken);
        }
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // --- LOGIN ---
  const login = async (username: string, password: string) => {
    const res = await tryPaths(
      [
        "/api/v1/auth/login",
        "/api/auth/login",
        "/api/v1/Auth/login",
        "/api/Auth/login",
      ],
      { method: "POST", body: JSON.stringify({ username, password }) }
    );

    const data = await res.json().catch(() => null);
    const t = extractToken(data);
    if (!t) throw new Error("Resposta inválida da API: token ausente");

    setToken(t);
    setApiToken(t);
    const u: User = { username };
    setUser(u);

    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, t),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(u)),
    ]);
  };

  // Alias para compat com telas antigas
  const signIn = login;

  // --- CADASTRO ---
  const signUp = async (username: string, password: string) => {
    // Tenta diferentes nomes/caixas para o endpoint de cadastro
    const endpoints = [
      "/api/v1/auth/register",
      "/api/auth/register",
      "/api/v1/auth/signup",
      "/api/auth/signup",
      "/api/v1/Auth/register",
      "/api/Auth/register",
      "/api/v1/Auth/signup",
      "/api/Auth/signup",
    ];

    let createdOk = false;
    try {
      const res = await tryPaths(
        endpoints,
        { method: "POST", body: JSON.stringify({ username, password }) }
      );
      // Alguns retornam 201 sem body, outros 200 com body
      if (res.ok) {
        createdOk = true;
        const data = await res.json().catch(() => null);
        const t = extractToken(data);
        // se já vier token, salva e retorna
        if (t) {
          setToken(t);
          setApiToken(t);
          const u: User = { username };
          setUser(u);
          await Promise.all([
            AsyncStorage.setItem(TOKEN_KEY, t),
            AsyncStorage.setItem(USER_KEY, JSON.stringify(u)),
          ]);
          return;
        }
      }
    } catch {
      // prossegue para tentativa de login em seguida
    }

    if (!createdOk) {
      throw new Error(
        "Cadastro indisponível nesta API. Use o Swagger para criar um usuário ou peça para o administrador habilitar o endpoint de registro."
      );
    }

    // Se cadastrou mas não retornou token, faz login agora
    await login(username, password);
  };

  // --- LOGOUT ---
  const logout = async () => {
    setToken(null);
    setUser(null);
    setApiToken(null);
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ]);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: !!token,
      login,
      signIn,
      signUp,
      logout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
