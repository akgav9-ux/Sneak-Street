import { addSubscriber } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = (body.email ?? "").trim();
    if (!email.includes("@") || email.length < 5) {
      return Response.json({ ok: false, error: "Некорректный e-mail" }, { status: 400 });
    }
    await addSubscriber(email);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[newsletter]", error);
    return Response.json({ ok: false, error: "Ошибка сервера" }, { status: 500 });
  }
}
