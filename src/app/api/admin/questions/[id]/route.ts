import { db } from "@/db";
import { questions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { forbidden, isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  if (!(await isAdmin())) return forbidden();
  try {
    const { id } = await ctx.params;
    const body = (await request.json()) as { answer?: string };
    const answer = (body.answer ?? "").trim();

    const [row] = await db
      .update(questions)
      .set({
        answer,
        status: answer ? "answered" : "new",
        answeredAt: answer ? new Date() : null,
      })
      .where(eq(questions.id, Number(id)))
      .returning();

    if (!row) {
      return Response.json({ ok: false, error: "Вопрос не найден" }, { status: 404 });
    }
    return Response.json({ ok: true, question: row });
  } catch (error) {
    console.error("[admin:questions:put]", error);
    return Response.json({ ok: false, error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  if (!(await isAdmin())) return forbidden();
  try {
    const { id } = await ctx.params;
    await db.delete(questions).where(eq(questions.id, Number(id)));
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[admin:questions:delete]", error);
    return Response.json({ ok: false, error: "Ошибка сервера" }, { status: 500 });
  }
}
