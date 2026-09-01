import { db } from "@/db";
import { products } from "@/db/schema";
import type { ProductColor, ProductSize } from "@/db/schema";
import { ensureSeeded, getAllProductsRaw } from "@/db/queries";
import { forbidden, isAdmin } from "@/lib/admin-auth";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export type ProductPayload = {
  slug?: string;
  name?: string;
  brand?: string;
  category?: string;
  gender?: string;
  shortDescription?: string;
  description?: string;
  material?: string;
  care?: string;
  price?: number;
  oldPrice?: number | null;
  images?: string[];
  colors?: ProductColor[];
  sizes?: ProductSize[];
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isActive?: boolean;
};

export function slugify(input: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return input
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export async function GET() {
  if (!(await isAdmin())) return forbidden();
  const items = await getAllProductsRaw();
  return Response.json({ ok: true, items });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return forbidden();
  try {
    await ensureSeeded();
    const body = (await request.json()) as ProductPayload;

    if (!body.name || !body.price) {
      return Response.json(
        { ok: false, error: "Название и цена обязательны" },
        { status: 400 },
      );
    }

    const base = body.slug?.trim() || slugify(`${body.brand ?? ""} ${body.name}`);
    let slug = base || `tovar-${Date.now()}`;

    const [existing] = await db
      .select({ n: sql<number>`count(*)` })
      .from(products)
      .where(sql`slug = ${slug}`);
    if ((existing?.n ?? 0) > 0) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

    const [maxRow] = await db
      .select({ m: sql<number>`coalesce(max(sort_index), 0)` })
      .from(products);

    const [row] = await db
      .insert(products)
      .values({
        slug,
        name: body.name,
        brand: body.brand?.trim() || "Sneak&Street",
        category: body.category ?? "sneakers",
        gender: body.gender ?? "unisex",
        shortDescription: body.shortDescription ?? "",
        description: body.description ?? "",
        material: body.material ?? "",
        care: body.care ?? "",
        price: Math.max(0, Math.round(body.price)),
        oldPrice: body.oldPrice ? Math.round(body.oldPrice) : null,
        images: (body.images ?? []).filter(Boolean),
        colors: body.colors ?? [],
        sizes: body.sizes ?? [],
        rating: Math.min(50, Math.max(10, body.rating ?? 45)),
        reviewCount: Math.max(0, body.reviewCount ?? 0),
        isNew: body.isNew ?? true,
        isBestseller: body.isBestseller ?? false,
        isActive: body.isActive ?? true,
        sortIndex: (maxRow?.m ?? 0) + 1,
      })
      .returning();

    return Response.json({ ok: true, product: row });
  } catch (error) {
    console.error("[admin:products:post]", error);
    return Response.json({ ok: false, error: "Ошибка сервера" }, { status: 500 });
  }
}
