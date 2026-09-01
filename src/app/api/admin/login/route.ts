// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (password === adminPassword) {
      // ✅ Устанавливаем куку
      const cookieStore = await cookies();
      cookieStore.set("admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24 часа
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Неверный пароль" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

// Проверка авторизации
export async function GET() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth");
  
  return NextResponse.json({ 
    authenticated: auth?.value === "true" 
  });
}

// Выход
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
  
  return NextResponse.json({ success: true });
}
