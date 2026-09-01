// src/app/api/admin/login/route.ts
import { adminPassword, setAdminCookie } from "@/lib/admin-auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === adminPassword()) {
      await setAdminCookie(); // ✅ Используем новую функцию
      return Response.json({ ok: true });
    }

    return Response.json(
      { ok: false, error: "Неверный пароль" },
      { status: 401 }
    );
  } catch {
    return Response.json(
      { ok: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { isAdmin } = await import("@/lib/admin-auth");
  const authed = await isAdmin();
  return Response.json({ authenticated: authed });
}

export async function DELETE() {
  const { clearAdminCookie } = await import("@/lib/admin-auth");
  await clearAdminCookie();
  return Response.json({ ok: true });
}