import { countStats, getAllOrders } from "@/db/queries";
import { forbidden, isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return forbidden();
  const [orders, stats] = await Promise.all([getAllOrders(), countStats()]);
  return Response.json({ ok: true, orders, stats });
}
