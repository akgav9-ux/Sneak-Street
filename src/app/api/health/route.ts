// src/app/api/health/route.ts
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Правильный способ для Drizzle + SQLite
    const result = await db.run(sql`select 1`);
    return Response.json({ 
      ok: true, 
      message: "✅ База данных подключена",
      result: result 
    });
  } catch (error) {
    console.error("❌ Health check failed:", error);
    return Response.json({ 
      ok: false, 
      message: "❌ Ошибка подключения к БД",
      error: String(error)
    }, { status: 500 });
  }
}