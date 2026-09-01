import { getAllProducts } from "@/db/queries";
import { filterProducts, parseFilters } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sp = url.searchParams;
  const page = Math.max(1, Number(sp.get("page") ?? "1"));
  const limit = Math.min(48, Math.max(1, Number(sp.get("limit") ?? "9")));

  const all = await getAllProducts();
  const filtered = filterProducts(all, parseFilters(sp));
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return Response.json({
    items,
    total: filtered.length,
    page,
    limit,
    hasMore: start + limit < filtered.length,
  });
}
