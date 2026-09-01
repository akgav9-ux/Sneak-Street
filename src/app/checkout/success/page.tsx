import Link from "next/link";
import type { Metadata } from "next";
import { getOrderByNumber } from "@/db/queries";
import { formatDate, formatPrice } from "@/lib/format";
import { SHIPPING_METHODS } from "@/lib/pricing";
import { ArrowRight, CheckIcon, TruckIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Заказ оформлен — SNEAK&STREET",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const order = orderNumber ? await getOrderByNumber(orderNumber).catch(() => null) : null;

  const method =
    SHIPPING_METHODS.find((m) => m.id === order?.shippingMethod) ??
    SHIPPING_METHODS[0];

  return (
    <div className="mx-auto max-w-[900px] px-4 pb-24 pt-16 md:px-8">
      <div className="flex flex-col items-center text-center">
        <span className="animate-pop flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckIcon width={38} height={38} />
        </span>
        <p className="eyebrow mt-8 text-[#8a8a8a]">Заказ подтверждён</p>
        <h1 className="display mt-4 text-[clamp(30px,4.6vw,54px)]">
          СПАСИБО!
          <br />
          ЗАКАЗ ОФОРМЛЕН
        </h1>
        <p className="mt-5 max-w-[460px] text-[14px] leading-relaxed text-[#8a8a8a]">
          Письмо с подтверждением уже летит на{" "}
          <strong className="text-[#111]">{order?.email ?? "вашу почту"}</strong>.
          Напишем снова, как только посылка покинет склад.
        </p>
      </div>

      <div className="mt-12 border border-black/[0.08]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/[0.08] p-6">
          <div>
            <p className="eyebrow text-[#8a8a8a]">Номер заказа</p>
            <p className="mt-1.5 text-[22px] font-extrabold tracking-tight">
              #{order?.orderNumber ?? orderNumber ?? "SNK-000000"}
            </p>
          </div>
          <div>
            <p className="eyebrow text-[#8a8a8a]">Дата оформления</p>
            <p className="mt-1.5 text-[14px] font-semibold">
              {order ? formatDate(order.createdAt) : formatDate(new Date())}
            </p>
          </div>
          <div>
            <p className="eyebrow text-[#8a8a8a]">Статус</p>
            <p className="mt-1.5 inline-flex items-center gap-2 bg-amber-100 px-3 py-1 text-[12px] font-bold text-amber-700">
              {order?.status ?? "Новый"}
            </p>
          </div>
          <div>
            <p className="eyebrow text-[#8a8a8a]">Сумма</p>
            <p className="mt-1.5 text-[22px] font-extrabold tracking-tight text-[#e50000]">
              {formatPrice(order?.total ?? 0)}
            </p>
          </div>
        </div>

        {order?.items?.length ? (
          <ul className="divide-y divide-black/[0.07]">
            {order.items.map((item, i) => (
              <li key={`${item.slug}-${i}`} className="flex items-center gap-4 p-6">
                <div className="h-20 w-16 shrink-0 overflow-hidden bg-[#f3f3f4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] font-bold tracking-[0.16em] text-[#8a8a8a]">
                    {item.brand.toUpperCase()}
                  </p>
                  <p className="truncate text-[14px] font-semibold">{item.name}</p>
                  <p className="mt-0.5 text-[12.5px] text-[#8a8a8a]">
                    {item.size} · {item.color} · ×{item.quantity}
                  </p>
                </div>
                <p className="text-[14px] font-bold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="grid gap-6 border-t border-black/[0.08] p-6 sm:grid-cols-3">
          <div>
            <p className="eyebrow text-[#8a8a8a]">Адрес доставки</p>
            <p className="mt-2 text-[13.5px] leading-relaxed">
              {order?.fullName}
              <br />
              {order?.address}
              <br />
              {order?.city} {order?.postalCode}
              <br />
              {order?.country}
            </p>
          </div>
          <div>
            <p className="eyebrow text-[#8a8a8a]">Доставка</p>
            <p className="mt-2 flex items-center gap-2 text-[13.5px]">
              <TruckIcon width={17} height={17} /> {method.label}
            </p>
            <p className="mt-1 text-[12.5px] text-[#8a8a8a]">{method.detail}</p>
          </div>
          <div>
            <p className="eyebrow text-[#8a8a8a]">Трек-номер</p>
            <p className="mt-2 font-mono text-[13.5px]">
              {order?.trackingNumber ?? "Появится в течение 24 часов"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/account?tab=orders"
          className="btn-red flex items-center gap-2.5 px-9 py-4 text-[12px] font-bold tracking-[0.2em] text-white"
        >
          ОТСЛЕДИТЬ ЗАКАЗ <ArrowRight width={16} height={16} />
        </Link>
        <Link
          href="/catalog"
          className="border border-[#111] px-9 py-4 text-[12px] font-bold tracking-[0.2em] transition-colors hover:bg-[#111] hover:text-white"
        >
          ПРОДОЛЖИТЬ ПОКУПКИ
        </Link>
      </div>
    </div>
  );
}
