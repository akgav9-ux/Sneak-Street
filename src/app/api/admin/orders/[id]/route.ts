import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { forbidden, isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  if (!(await isAdmin())) return forbidden();
  try {
    const { id } = await ctx.params;
    const body = (await request.json()) as { status?: string };
    const [row] = await db
      .update(orders)
      .set({ status: body.status ?? "Новый" })
      .where(eq(orders.id, Number(id)))
      .returning();
    if (!row) {
      return Response.json({ ok: false, error: "Заказ не найден" }, { status: 404 });
    }
    return Response.json({ ok: true, order: row });
  } catch (error) {
    console.error("[admin:orders:put]", error);
    return Response.json({ ok: false, error: "Ошибка сервера" }, { status: 500 });
  }
}
