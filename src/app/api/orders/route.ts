import { db } from "@/db";
import { orders, type OrderItem } from "@/db/schema";
import { ensureSeeded, getOrdersByEmail } from "@/db/queries";

export const dynamic = "force-dynamic";

type Payload = {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  shippingMethod?: string;
  paymentMethod?: string;
  items?: OrderItem[];
  subtotal?: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  total?: number;
};

function orderNumber() {
  const n = Math.floor(100000 + Math.random() * 899999);
  return `SNK-${n}`;
}

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email");
  if (!email) {
    return Response.json({ ok: false, error: "нужен email" }, { status: 400 });
  }
  try {
    const rows = await getOrdersByEmail(email);
    return Response.json({ ok: true, orders: rows });
  } catch (error) {
    console.error("[orders:get]", error);
    return Response.json({ ok: true, orders: [] });
  }
}

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = (await request.json()) as Payload;

    if (!body.fullName || !body.email || !body.items?.length) {
      return Response.json(
        { ok: false, error: "Не заполнены обязательные поля" },
        { status: 400 },
      );
    }

    const number = orderNumber();
    const [row] = await db
      .insert(orders)
      .values({
        orderNumber: number,
        fullName: body.fullName,
        email: body.email.toLowerCase(),
        phone: body.phone ?? "",
        address: body.address ?? "",
        city: body.city ?? "",
        postalCode: body.postalCode ?? "",
        country: body.country ?? "",
        shippingMethod: body.shippingMethod ?? "standard",
        paymentMethod: body.paymentMethod ?? "card",
        items: body.items,
        subtotal: body.subtotal ?? 0,
        shipping: body.shipping ?? 0,
        tax: body.tax ?? 0,
        discount: body.discount ?? 0,
        total: body.total ?? 0,
        status: "Новый",
        trackingNumber: `TRK${Math.floor(10000000 + Math.random() * 89999999)}`,
      })
      .returning();

    return Response.json({ ok: true, order: row });
  } catch (error) {
    console.error("[orders:post]", error);
    return Response.json({ ok: false, error: "Ошибка сервера" }, { status: 500 });
  }
}
