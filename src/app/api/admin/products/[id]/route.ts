import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { forbidden, isAdmin } from "@/lib/admin-auth";
import type { ProductPayload } from "../route";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  if (!(await isAdmin())) return forbidden();
  try {
    const { id } = await ctx.params;
    const body = (await request.json()) as ProductPayload;

    const [row] = await db
      .update(products)
      .set({
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.brand !== undefined ? { brand: body.brand } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.gender !== undefined ? { gender: body.gender } : {}),
        ...(body.shortDescription !== undefined
          ? { shortDescription: body.shortDescription }
          : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.material !== undefined ? { material: body.material } : {}),
        ...(body.care !== undefined ? { care: body.care } : {}),
        ...(body.price !== undefined ? { price: Math.round(body.price) } : {}),
        oldPrice: body.oldPrice ? Math.round(body.oldPrice) : null,
        ...(body.images !== undefined
          ? { images: body.images.filter(Boolean) }
          : {}),
        ...(body.colors !== undefined ? { colors: body.colors } : {}),
        ...(body.sizes !== undefined ? { sizes: body.sizes } : {}),
        ...(body.rating !== undefined ? { rating: body.rating } : {}),
        ...(body.reviewCount !== undefined ? { reviewCount: body.reviewCount } : {}),
        ...(body.isNew !== undefined ? { isNew: body.isNew } : {}),
        ...(body.isBestseller !== undefined
          ? { isBestseller: body.isBestseller }
          : {}),
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
      })
      .where(eq(products.id, Number(id)))
      .returning();

    if (!row) {
      return Response.json({ ok: false, error: "Товар не найден" }, { status: 404 });
    }
    return Response.json({ ok: true, product: row });
  } catch (error) {
    console.error("[admin:products:put]", error);
    return Response.json({ ok: false, error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  if (!(await isAdmin())) return forbidden();
  try {
    const { id } = await ctx.params;
    await db.delete(products).where(eq(products.id, Number(id)));
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[admin:products:delete]", error);
    return Response.json({ ok: false, error: "Ошибка сервера" }, { status: 500 });
  }
}
