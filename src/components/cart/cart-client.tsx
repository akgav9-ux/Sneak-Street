"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/components/store";
import { cx, formatPrice, plural } from "@/lib/format";
import {
  COUPONS,
  COUPON_KEY,
  FREE_SHIPPING_THRESHOLD,
  computeTotals,
} from "@/lib/pricing";
import {
  ArrowLeft,
  ArrowRight,
  CartIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  ShieldIcon,
  TrashIcon,
  TruckIcon,
} from "@/components/icons";

export function CartClient() {
  const { cart, ready, setQuantity, removeFromCart, subtotal, pushToast } =
    useStore();
  const [coupon, setCoupon] = useState<string | null>(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(COUPON_KEY);
    if (stored) {
      setCoupon(stored);
      setCode(stored);
    }
  }, []);

  const totals = computeTotals(subtotal, coupon, "standard");

  const applyCoupon = () => {
    const upper = code.trim().toUpperCase();
    if (!COUPONS[upper]) {
      pushToast({ title: "Промокод не найден", description: upper, tone: "error" });
      return;
    }
    setCoupon(upper);
    window.localStorage.setItem(COUPON_KEY, upper);
    pushToast({
      title: "Промокод применён",
      description: COUPONS[upper].label,
      tone: "success",
    });
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCode("");
    window.localStorage.removeItem(COUPON_KEY);
  };

  if (!ready) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 lg:px-12">
        <div className="skeleton h-10 w-52" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-36 w-full" />
            ))}
          </div>
          <div className="skeleton h-80 w-full" />
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 py-24 text-center md:px-8 lg:px-12">
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[#f7f7f8]">
          <CartIcon width={46} height={46} className="text-[#c1c1c6]" />
          <span className="absolute -right-1 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#e50000] text-[13px] font-bold text-white">
            0
          </span>
        </div>
        <h1 className="display mt-8 text-[clamp(30px,4vw,48px)]">
          КОРЗИНА ПУСТА
        </h1>
        <p className="mt-4 max-w-[380px] text-[14px] leading-relaxed text-[#8a8a8a]">
          Пока пусто. Загляните в новинки или в раздел скидок — бесплатная доставка
          начинается от 5 000 ₽.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/catalog"
            className="btn-red px-9 py-4 text-[12px] font-bold tracking-[0.2em] text-white"
          >
            ПЕРЕЙТИ В КАТАЛОГ
          </Link>
          <Link
            href="/catalog?sale=1"
            className="border border-[#111] px-9 py-4 text-[12px] font-bold tracking-[0.2em] transition-colors hover:bg-[#111] hover:text-white"
          >
            СМОТРЕТЬ СКИДКИ
          </Link>
        </div>
      </div>
    );
  }

  const progress = Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-10 md:px-8 lg:px-12">
      <nav className="flex items-center gap-2 text-[11.5px] tracking-[0.12em] text-[#8a8a8a]">
        <Link href="/" className="hover:text-[#111]">
          ГЛАВНАЯ
        </Link>
        <span>/</span>
        <span className="text-[#111]">КОРЗИНА</span>
      </nav>

      <h1 className="display mt-5 text-[clamp(32px,4.6vw,56px)]">
        КОРЗИНА
      </h1>
      <p className="mt-2 text-[13px] text-[#8a8a8a]">
        {cart.length} {plural(cart.length, "товар", "товара", "товаров")} в корзине
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-6 border border-black/[0.08] p-4">
            <div className="flex items-center gap-3">
              <TruckIcon width={20} height={20} />
              <p className="text-[13px]">
                {totals.subtotal >= FREE_SHIPPING_THRESHOLD ? (
                  <span className="font-semibold text-emerald-600">
                    Доставка бесплатная 🎉
                  </span>
                ) : (
                  <>
                    Ещё{" "}
                    <strong>
                      {formatPrice(FREE_SHIPPING_THRESHOLD - totals.subtotal)}
                    </strong>{" "}
                    до бесплатной доставки
                  </>
                )}
              </p>
            </div>
            <div className="mt-3 h-1.5 w-full bg-[#efeff1]">
              <div
                className="h-full bg-[#e50000] transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ul className="divide-y divide-black/[0.07] border-y border-black/[0.07]">
            {cart.map((item) => (
              <li
                key={`${item.slug}-${item.size}-${item.color}`}
                className="flex gap-4 py-6"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="relative h-[136px] w-[108px] shrink-0 overflow-hidden bg-[#f3f3f4]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[10.5px] font-bold tracking-[0.16em] text-[#8a8a8a]">
                        {item.brand.toUpperCase()}
                      </p>
                      <Link
                        href={`/product/${item.slug}`}
                        className="mt-1 block truncate text-[15px] font-bold tracking-tight hover:text-[#e50000]"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1.5 text-[12.5px] text-[#8a8a8a]">
                        Размер: <span className="text-[#111]">{item.size}</span> · Цвет:{" "}
                        <span className="text-[#111]">{item.color}</span>
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        removeFromCart(item.slug, item.size, item.color)
                      }
                      aria-label="Удалить товар"
                      className="p-1.5 text-[#8a8a8a] transition-colors hover:text-[#e50000]"
                    >
                      <TrashIcon width={17} height={17} />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                    <div className="flex h-10 items-center border border-black/15">
                      <button
                        onClick={() =>
                          setQuantity(
                            item.slug,
                            item.size,
                            item.color,
                            item.quantity - 1,
                          )
                        }
                        className="flex h-full w-9 items-center justify-center transition-colors hover:bg-[#f4f4f5]"
                        aria-label="Уменьшить количество"
                      >
                        <MinusIcon width={14} height={14} />
                      </button>
                      <span className="w-9 text-center text-[13px] font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(
                            item.slug,
                            item.size,
                            item.color,
                            item.quantity + 1,
                          )
                        }
                        className="flex h-full w-9 items-center justify-center transition-colors hover:bg-[#f4f4f5]"
                        aria-label="Увеличить количество"
                      >
                        <PlusIcon width={14} height={14} />
                      </button>
                    </div>

                    <div className="text-right">
                      {item.oldPrice ? (
                        <p className="text-[12px] text-[#8a8a8a] line-through">
                          {formatPrice(item.oldPrice * item.quantity)}
                        </p>
                      ) : null}
                      <p className="text-[17px] font-bold text-[#e50000]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/catalog"
            className="group mt-7 inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.16em] hover:text-[#e50000]"
          >
            <ArrowLeft
              width={16}
              height={16}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            ПРОДОЛЖИТЬ ПОКУПКИ
          </Link>
        </div>

        {/* summary */}
        <aside className="h-fit lg:sticky lg:top-28">
          <div className="border border-black/[0.08] p-6">
            <p className="text-[13px] font-bold tracking-[0.16em]">ВАШ ЗАКАЗ</p>

            <dl className="mt-6 space-y-3 text-[13.5px]">
              <Row label="Товары" value={formatPrice(totals.subtotal)} />
              {totals.discount > 0 ? (
                <Row
                  label={`Скидка (${coupon})`}
                  value={`−${formatPrice(totals.discount)}`}
                  accent
                />
              ) : null}
              <Row
                label="Доставка"
                value={
                  totals.shipping === 0 ? "Бесплатно" : formatPrice(totals.shipping)
                }
              />
              
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t border-black/[0.08] pt-5">
              <span className="text-[13px] font-bold tracking-[0.14em]">ИТОГО</span>
              <span className="text-[26px] font-extrabold tracking-tight text-[#e50000]">
                {formatPrice(totals.total)}
              </span>
            </div>

            <div className="mt-6">
              <p className="eyebrow mb-2 text-[#8a8a8a]">Промокод</p>
              {coupon ? (
                <div className="flex items-center justify-between border border-emerald-500/40 bg-emerald-50 px-4 py-3">
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-emerald-700">
                    <CheckIcon width={15} height={15} /> {coupon}
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-[11.5px] font-bold tracking-[0.12em] text-emerald-700 hover:underline"
                  >
                    УБРАТЬ
                  </button>
                </div>
              ) : (
                <div className="flex">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="STREET30"
                    className="h-11 min-w-0 flex-1 border border-black/15 px-3 text-[13px] uppercase outline-none focus:border-[#111]"
                  />
                  <button
                    onClick={applyCoupon}
                    className="h-11 bg-[#111] px-5 text-[11px] font-bold tracking-[0.16em] text-white transition-colors hover:bg-[#e50000]"
                  >
                    ПРИМЕНИТЬ
                  </button>
                </div>
              )}
              <p className="mt-2 text-[11.5px] text-[#8a8a8a]">
                Введите <strong>STREET30</strong> и получите −30% на первый заказ.
              </p>
            </div>

            <Link
              href="/checkout"
              className={cx(
                "btn-red mt-6 flex items-center justify-center gap-2.5 py-4 text-[12px] font-bold tracking-[0.2em] text-white transition-transform duration-300 hover:-translate-y-0.5",
              )}
            >
              ОФОРМИТЬ ЗАКАЗ
              <ArrowRight width={16} height={16} />
            </Link>

            <div className="mt-5 flex items-center justify-center gap-5 text-[11px] text-[#8a8a8a]">
              <span className="flex items-center gap-1.5">
                <ShieldIcon width={15} height={15} /> Безопасная оплата
              </span>
              <span className="flex items-center gap-1.5">
                <CheckIcon width={15} height={15} /> SSL-шифрование
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 border border-black/[0.08] p-4 text-[10.5px] font-bold tracking-[0.14em] text-[#8a8a8a]">
            <span>VISA</span>
            <span>·</span>
            <span>MASTERCARD</span>
            <span>·</span>
            <span>PAYPAL</span>
            <span>·</span>
            <span>APPLE PAY</span>
            <span>·</span>
            <span>СБП</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-[#8a8a8a]">{label}</dt>
      <dd className={cx("font-semibold", accent && "text-emerald-600")}>{value}</dd>
    </div>
  );
}
