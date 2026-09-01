import { getAllQuestions } from "@/db/queries";
import { forbidden, isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return forbidden();
  const items = await getAllQuestions();
  return Response.json({ ok: true, items });
}
