import { db } from "@/db";
import { questions } from "@/db/schema";
import { ensureSeeded, getAnsweredQuestions } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) {
    return Response.json({ ok: false, error: "slug обязателен" }, { status: 400 });
  }
  const items = await getAnsweredQuestions(slug);
  return Response.json({ ok: true, items });
}

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = (await request.json()) as {
      productSlug?: string;
      productName?: string;
      author?: string;
      email?: string;
      question?: string;
    };

    if (!body.productSlug || !body.question || body.question.trim().length < 5) {
      return Response.json(
        { ok: false, error: "Заполните вопрос (минимум 5 символов)" },
        { status: 400 },
      );
    }

    const [row] = await db
      .insert(questions)
      .values({
        productSlug: body.productSlug,
        productName: body.productName ?? "",
        author: (body.author ?? "").trim() || "Гость",
        email: (body.email ?? "").trim(),
        question: body.question.trim(),
        status: "new",
      })
      .returning();

    return Response.json({ ok: true, question: row });
  } catch (error) {
    console.error("[questions:post]", error);
    return Response.json({ ok: false, error: "Ошибка сервера" }, { status: 500 });
  }
}
