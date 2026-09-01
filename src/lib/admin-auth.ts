// src/lib/admin-auth.ts
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ss_admin";

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "admin123";
}

export function adminToken(): string {
  const pass = adminPassword();
  let hash = 0;
  for (let i = 0; i < pass.length; i += 1) {
    hash = (hash << 5) - hash + pass.charCodeAt(i);
    hash |= 0;
  }
  return `ss${Math.abs(hash).toString(36)}`;
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === adminToken();
}

export function forbidden() {
  return Response.json(
    { ok: false, error: "Требуется вход в админ-панель" },
    { status: 401 },
  );
}

// ✅ НОВАЯ ФУНКЦИЯ: установка куки с правильными настройками
export async function setAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // ✅ для HTTPS на Vercel
    sameSite: "lax",                               // ✅ важно для Vercel
    maxAge: 60 * 60 * 24,                          // 24 часа
    path: "/",
  });
}

// ✅ НОВАЯ ФУНКЦИЯ: удаление куки (выход)
export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}