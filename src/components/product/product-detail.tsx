"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProductDTO } from "@/db/queries";
import { cx, discountPercent, formatPrice, ratingToStars } from "@/lib/format";
import { LIGHT_HEX, categoryLabel } from "@/lib/catalog";
import { useStore } from "@/components/store";
import { Stars } from "@/components/stars";
import {
  CheckIcon,
  CloseIcon,
  HeartIcon,
  MinusIcon,
  PlayIcon,
  PlusIcon,
  ReturnIcon,
  ShieldIcon,
  SpinnerIcon,
  TruckIcon,
  ZoomIcon,
} from "@/components/icons";

const SIZE_CHART = [
  { size: "XS", chest: "86–91", waist: "71–76", length: "66" },
  { size: "S", chest: "91–97", waist: "76–81", length: "68" },
  { size: "M", chest: "97–102", waist: "81–86", length: "71" },
  { size: "L", chest: "102–107", waist: "86–91", length: "73" },
  { size: "XL", chest: "107–112", waist: "91–97", length: "76" },
  { size: "XXL", chest: "112–122", waist: "97–107", length: "78" },
];

const SHOE_CHART = [
  { size: "39", uk: "6", us: "6.5", cm: "24.5" },
  { size: "40", uk: "6.5", us: "7.5", cm: "25.0" },
  { size: "41", uk: "7.5", us: "8.5", cm: "26.0" },
  { size: "42", uk: "8", us: "9", cm: "26.5" },
  { size: "43", uk: "9", us: "10", cm: "27.5" },
  { size: "44", uk: "9.5", us: "10.5", cm: "28.0" },
  { size: "45", uk: "10.5", us: "11.5", cm: "29.0" },
  { size: "46", uk: "11", us: "12", cm: "29.5" },
];

export function ProductDetail({ product }: { product: ProductDTO }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isWished, pushToast } = useStore();

  const firstAvailable = product.sizes.find((s) => s.stock > 0)?.label ?? "";
  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState(product.colors[0]?.name ?? "Default");
  const [size, setSize] = useState(firstAvailable);
  const [qty, setQty] = useState(1);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [tab, setTab] = useState<"description" | "size" | "delivery">("description");
  const [accordion, setAccordion] = useState<
    "description" | "size" | "delivery" | null
  >("description");
  const [beat, setBeat] = useState(false);

  const off = discountPercent(product.price, product.oldPrice);
  const wished = isWished(product.slug);
  const isShoe = product.category === "sneakers";
  const selectedStock =
    product.sizes.find((s) => s.label === size)?.stock ?? 0;

  const handleAdd = (thenCheckout = false) => {
    if (!size) {
      pushToast({ title: "Сначала выберите размер", tone: "error" });
      return;
    }
    setState("loading");
    window.setTimeout(() => {
      addToCart({
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        image: product.images[0],
        size,
        color,
        price: product.price,
        oldPrice: product.oldPrice,
        quantity: qty,
      });
      setState("done");
      pushToast({
        title: "Добавлено в корзину",
        description: `${product.name} · ${size} · ${color}`,
        tone: "success",
      });
      if (thenCheckout) {
        router.push("/checkout");
        return;
      }
      window.setTimeout(() => setState("idle"), 1400);
    }, 620);
  };

  const handleWish = () => {
    const added = toggleWishlist({
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.images[0],
      price: product.price,
      oldPrice: product.oldPrice,
      rating: product.rating,
      reviewCount: product.reviewCount,
    });
    setBeat(true);
    window.setTimeout(() => setBeat(false), 500);
    pushToast({
      title: added ? "Добавлено в избранное" : "Удалено из избранного",
      description: product.name,
      tone: added ? "success" : "info",
    });
  };

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* GALLERY */}
        <div>
          <div
            className="group relative aspect-square w-full overflow-hidden bg-[#f3f3f4]"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({
                x: ((e.clientX - r.left) / r.width) * 100,
                y: ((e.clientY - r.top) / r.height) * 100,
              });
            }}
            onMouseLeave={() => setZoom(null)}
          >
            {product.images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={product.name}
                className={cx(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                  i === activeImage ? "opacity-100" : "opacity-0",
                )}
                style={
                  i === activeImage && zoom
                    ? {
                        transform: "scale(1.9)",
                        transformOrigin: `${zoom.x}% ${zoom.y}%`,
                        transition: "transform 0.2s ease-out",
                      }
                    : undefined
                }
              />
            ))}

            <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
              {off > 0 ? (
                <span className="bg-[#e50000] px-3 py-1.5 text-[10.5px] font-bold tracking-[0.16em] text-white">
                  SALE −{off}%
                </span>
              ) : null}
              {product.isNew ? (
                <span className="bg-[#111] px-3 py-1.5 text-[10.5px] font-bold tracking-[0.16em] text-white">
                  NEW
                </span>
              ) : null}
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <span className="flex items-center gap-1.5 bg-white/90 px-3 py-2 text-[10.5px] font-bold tracking-[0.14em] backdrop-blur">
                <ZoomIcon width={14} height={14} /> НАВЕДИТЕ ДЛЯ ZOOM
              </span>
              <button
                type="button"
                onClick={() =>
                  pushToast({
                    title: "Обзор 360°",
                    description: "Скоро добавим объёмный просмотр для этого товара.",
                    tone: "info",
                  })
                }
                className="flex items-center gap-1.5 bg-[#111] px-3 py-2 text-[10.5px] font-bold tracking-[0.14em] text-white"
              >
                <PlayIcon width={14} height={14} /> 360°
              </button>
            </div>
          </div>

          <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto">
            {product.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActiveImage(i)}
                className={cx(
                  "relative h-24 w-20 shrink-0 overflow-hidden border-2 transition-all duration-300",
                  i === activeImage ? "border-[#111]" : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* INFO */}
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#8a8a8a]">
            {product.brand.toUpperCase()}
          </p>
          <h1 className="display mt-2 text-[clamp(28px,3.6vw,44px)]">
            {product.name}
          </h1>

          <a
            href="#reviews"
            className="mt-3 inline-flex items-center gap-2 text-[13px] text-[#8a8a8a] hover:text-[#111]"
          >
            <Stars rating={product.rating} size={14} />
            <span className="font-semibold text-[#111]">
              {ratingToStars(product.rating).toFixed(1)}
            </span>
            ({product.reviewCount} отзывов)
          </a>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              className={cx(
                "animate-price-flash text-[30px] font-extrabold tracking-tight",
                off > 0 ? "text-[#e50000]" : "text-[#111]",
              )}
            >
              {formatPrice(product.price)}
            </span>
            {product.oldPrice ? (
              <>
                <span className="text-[17px] text-[#8a8a8a] line-through">
                  {formatPrice(product.oldPrice)}
                </span>
                <span className="bg-[#111] px-2.5 py-1 text-[10.5px] font-bold tracking-[0.14em] text-white">
                  ВЫГОДА {off}%
                </span>
              </>
            ) : null}
          </div>

          <p className="mt-5 max-w-[520px] text-[14px] leading-relaxed text-[#5c5c60]">
            {product.shortDescription}
          </p>

          {/* colors */}
          <div className="mt-8">
            <p className="text-[12px] font-bold tracking-[0.14em]">
              ЦВЕТ: <span className="text-[#8a8a8a]">{color}</span>
            </p>
            <div className="mt-3 flex gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  title={c.name}
                  className={cx(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                    color === c.name
                      ? "scale-110 border-[#111]"
                      : "border-black/10 hover:scale-105",
                  )}
                  style={{ backgroundColor: c.hex }}
                >
                  {color === c.name ? (
                    <CheckIcon
                      width={15}
                      height={15}
                      className={
                        LIGHT_HEX.includes(c.hex)
                          ? "text-[#111]"
                          : "text-white"
                      }
                    />
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          {/* sizes */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-bold tracking-[0.14em]">
                РАЗМЕР: <span className="text-[#8a8a8a]">{size || "—"}</span>
              </p>
              <button
                onClick={() => setGuideOpen(true)}
                className="text-[12px] font-semibold underline underline-offset-4 hover:text-[#e50000]"
              >
                Таблица размеров
              </button>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {product.sizes.map((s) => {
                const disabled = s.stock === 0;
                return (
                  <button
                    key={s.label}
                    disabled={disabled}
                    onClick={() => setSize(s.label)}
                    className={cx(
                      "relative border py-3 text-[13px] font-semibold transition-all duration-200",
                      disabled
                        ? "cursor-not-allowed border-black/8 bg-[#fafafa] text-[#c4c4c8] line-through"
                        : size === s.label
                          ? "border-[#111] bg-[#111] text-white"
                          : "border-black/15 hover:border-[#111]",
                    )}
                  >
                    {s.label}
                    {!disabled ? (
                      <span
                        className={cx(
                          "absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full",
                          s.stock > 6 ? "bg-emerald-500" : "bg-amber-500",
                        )}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
            <p className="mt-2.5 flex items-center gap-4 text-[11.5px] text-[#8a8a8a]">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> В наличии
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Заканчивается
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d5d5d9]" /> Нет в наличии
              </span>
            </p>
            {size && selectedStock > 0 && selectedStock <= 6 ? (
              <p className="mt-2 text-[12px] font-semibold text-[#e50000]">
                Осталось {selectedStock} шт. размера {size} — успейте заказать.
              </p>
            ) : null}
          </div>

          {/* qty + actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex h-[54px] items-center border border-black/15">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-full w-12 items-center justify-center transition-colors hover:bg-[#f4f4f5]"
                aria-label="Уменьшить"
              >
                <MinusIcon width={15} height={15} />
              </button>
              <span className="w-10 text-center text-[14px] font-bold tabular-nums">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                className="flex h-full w-12 items-center justify-center transition-colors hover:bg-[#f4f4f5]"
                aria-label="Увеличить"
              >
                <PlusIcon width={15} height={15} />
              </button>
            </div>

            <button
              onClick={() => handleAdd(false)}
              disabled={state !== "idle"}
              className="btn-red flex h-[54px] min-w-[220px] flex-1 items-center justify-center gap-2.5 text-[12px] font-bold tracking-[0.2em] text-white transition-transform duration-300 hover:-translate-y-0.5 disabled:translate-y-0"
            >
              {state === "loading" ? (
                <>
                  <SpinnerIcon width={17} height={17} /> ДОБАВЛЯЕМ…
                </>
              ) : state === "done" ? (
                <>
                  <CheckIcon width={17} height={17} /> ДОБАВЛЕНО В КОРЗИНУ
                </>
              ) : (
                <>В КОРЗИНУ · {formatPrice(product.price * qty)}</>
              )}
            </button>

            <button
              onClick={handleWish}
              aria-label="В избранное"
              className={cx(
                "flex h-[54px] w-[54px] items-center justify-center border transition-all duration-300",
                wished
                  ? "border-[#e50000] bg-[#e50000] text-white"
                  : "border-black/15 hover:border-[#111]",
                beat && "animate-heart",
              )}
            >
              <HeartIcon filled={wished} width={19} height={19} />
            </button>
          </div>

          <button
            onClick={() => handleAdd(true)}
            className="mt-3 h-[54px] w-full border border-[#111] text-[12px] font-bold tracking-[0.2em] transition-colors hover:bg-[#111] hover:text-white"
          >
            КУПИТЬ В 1 КЛИК
          </button>

          <div className="mt-8 grid gap-px overflow-hidden border border-black/[0.07] bg-black/[0.07] sm:grid-cols-3">
            {[
              { icon: TruckIcon, title: "Бесплатная доставка", text: "От 5 000 ₽" },
              { icon: ShieldIcon, title: "В наличии", text: "Отправка за 24 часа" },
              { icon: ReturnIcon, title: "Возврат 30 дней", text: "Бесплатно и просто" },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-center gap-3 bg-white p-4">
                <Icon width={22} height={22} className="shrink-0 text-[#111]" />
                <div>
                  <p className="text-[12.5px] font-bold">{title}</p>
                  <p className="text-[11.5px] text-[#8a8a8a]">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="mt-16 border-t border-black/[0.07] pt-10">
        <div className="hidden gap-8 border-b border-black/[0.07] md:flex">
          {(
            [
              ["description", "Описание"],
              ["size", "Таблица размеров"],
              ["delivery", "Доставка и возврат"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cx(
                "relative pb-4 text-[12.5px] font-bold tracking-[0.14em] transition-colors",
                tab === key ? "text-[#111]" : "text-[#8a8a8a] hover:text-[#111]",
              )}
            >
              {label.toUpperCase()}
              <span
                className={cx(
                  "absolute inset-x-0 -bottom-px h-[2px] origin-left bg-[#111] transition-transform duration-300",
                  tab === key ? "scale-x-100" : "scale-x-0",
                )}
              />
            </button>
          ))}
        </div>

        <div className="hidden pt-8 md:block">
          <TabBody
            tab={tab}
            product={product}
            isShoe={isShoe}
          />
        </div>

        {/* mobile accordion */}
        <div className="md:hidden">
          {(
            [
              ["description", "Описание"],
              ["size", "Таблица размеров"],
              ["delivery", "Доставка и возврат"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="border-b border-black/[0.07]">
              <button
                onClick={() => setAccordion(accordion === key ? null : key)}
                className="flex w-full items-center justify-between py-4 text-left text-[13px] font-bold tracking-[0.12em]"
              >
                {label.toUpperCase()}
                <PlusIcon
                  width={16}
                  height={16}
                  className={cx(
                    "transition-transform duration-300",
                    accordion === key && "rotate-45",
                  )}
                />
              </button>
              {accordion === key ? (
                <div className="animate-fade-in pb-6">
                  <TabBody tab={key} product={product} isShoe={isShoe} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* SIZE GUIDE MODAL */}
      {guideOpen ? (
        <div className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <button
            aria-label="Закрыть таблицу"
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={() => setGuideOpen(false)}
          />
          <div className="animate-fade-up relative max-h-[85vh] w-full max-w-[720px] overflow-y-auto bg-white p-6 sm:p-9">
            <button
              onClick={() => setGuideOpen(false)}
              className="absolute right-5 top-5"
              aria-label="Close"
            >
              <CloseIcon />
            </button>
            <p className="eyebrow text-[#e50000]">Как измерить</p>
            <h3 className="display mt-3 text-[30px]">ТАБЛИЦА РАЗМЕРОВ</h3>
            <SizeTable isShoe={isShoe} />
            <p className="mt-6 text-[13px] leading-relaxed text-[#8a8a8a]">
              Замеры указаны в сантиметрах по изделию в разложенном виде. Если вы
              между размерами — берите больший для свободной посадки. Сомневаетесь?
              Поддержка отвечает круглосуточно за пять минут.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

function TabBody({
  tab,
  product,
  isShoe,
}: {
  tab: "description" | "size" | "delivery";
  product: ProductDTO;
  isShoe: boolean;
}) {
  if (tab === "description") {
    return (
      <div className="grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <p className="whitespace-pre-line text-[14.5px] leading-[1.85] text-[#4a4a4e]">
            {product.description}
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <p className="eyebrow text-[#8a8a8a]">Материал</p>
            <p className="mt-2 text-[13.5px] leading-relaxed">{product.material}</p>
          </div>
          <div>
            <p className="eyebrow text-[#8a8a8a]">Уход</p>
            <p className="mt-2 text-[13.5px] leading-relaxed">{product.care}</p>
          </div>
          <div>
            <p className="eyebrow text-[#8a8a8a]">Детали</p>
            <ul className="mt-2 space-y-1.5 text-[13.5px]">
              <li>Категория: {categoryLabel(product.category)}</li>
              <li>Посадка: {isShoe ? "Размер в размер" : "Свободная"}</li>
              <li>Импорт · Этичное производство</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  if (tab === "size") {
    return (
      <div>
        <SizeTable isShoe={isShoe} />
        <p className="mt-5 max-w-[640px] text-[13.5px] leading-relaxed text-[#8a8a8a]">
          <strong className="text-[#111]">Как измерить:</strong> разложите вещь на
          плоскости и измерьте ширину груди на 2–3 см ниже проймы. Для обуви встаньте
          на лист бумаги, отметьте пятку и самый длинный палец и измерьте расстояние
          в сантиметрах.
        </p>
      </div>
    );
  }
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {[
        {
          title: "Сроки доставки",
          body: "Стандартная — 3–5 рабочих дней (бесплатно от 5 000 ₽). Экспресс — 1–2 рабочих дня за 990 ₽. Доставка на следующий день — 1 990 ₽ при заказе до 14:00.",
        },
        {
          title: "Условия возврата",
          body: "30 дней с момента получения, вещь неношеная, с бирками и в оригинальной упаковке. Бланк возврата вложен в каждую посылку. Деньги возвращаем в течение 3 рабочих дней.",
        },
        {
          title: "Частые вопросы",
          body: "Да, все товары оригинальные и приходят от официальных поставщиков. Да, мы доставляем по всему миру. Да, адрес можно изменить в течение часа после заказа.",
        },
      ].map((b) => (
        <div key={b.title}>
          <p className="text-[13.5px] font-bold">{b.title}</p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[#8a8a8a]">
            {b.body}
          </p>
        </div>
      ))}
    </div>
  );
}

function SizeTable({ isShoe }: { isShoe: boolean }) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b border-black/10 text-[11px] tracking-[0.14em] text-[#8a8a8a]">
            {isShoe ? (
              <>
                <th className="py-3">EU</th>
                <th className="py-3">UK</th>
                <th className="py-3">US</th>
                <th className="py-3">СТОПА (СМ)</th>
              </>
            ) : (
              <>
                <th className="py-3">РАЗМЕР</th>
                <th className="py-3">ГРУДЬ</th>
                <th className="py-3">ТАЛИЯ</th>
                <th className="py-3">ДЛИНА</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {isShoe
            ? SHOE_CHART.map((r) => (
                <tr key={r.size} className="border-b border-black/[0.06]">
                  <td className="py-3 font-semibold">{r.size}</td>
                  <td className="py-3">{r.uk}</td>
                  <td className="py-3">{r.us}</td>
                  <td className="py-3">{r.cm}</td>
                </tr>
              ))
            : SIZE_CHART.map((r) => (
                <tr key={r.size} className="border-b border-black/[0.06]">
                  <td className="py-3 font-semibold">{r.size}</td>
                  <td className="py-3">{r.chest}</td>
                  <td className="py-3">{r.waist}</td>
                  <td className="py-3">{r.length}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
