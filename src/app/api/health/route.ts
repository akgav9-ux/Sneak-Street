// src/app/api/health/route.ts
import { pool } from "@/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT 1 as connected");
    return Response.json({ 
      ok: true, 
      message: "✅ База данных подключена",
      result: result.rows 
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