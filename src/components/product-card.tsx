"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProductDTO } from "@/db/queries";
import { cx, discountPercent, formatPrice, ratingToStars } from "@/lib/format";
import { useStore } from "./store";
import { CheckIcon, HeartIcon, PlusIcon, SpinnerIcon } from "./icons";
import { Stars } from "./stars";

type Props = {
  product: ProductDTO;
  className?: string;
  compact?: boolean;
};

export function ProductCard({ product, className, compact }: Props) {
  const { addToCart, toggleWishlist, isWished, pushToast } = useStore();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [beat, setBeat] = useState(false);

  const off = discountPercent(product.price, product.oldPrice);
  const wished = isWished(product.slug);
  const inStock = product.sizes.filter((s) => s.stock > 0);
  const secondary = product.images[1] ?? product.images[0];

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const quickAdd = (size: string) => {
    setState("loading");
    window.setTimeout(() => {
      addToCart({
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        image: product.images[0],
        size,
        color: product.colors[0]?.name ?? "Default",
        price: product.price,
        oldPrice: product.oldPrice,
        quantity: 1,
      });
      setState("done");
      pushToast({
        title: "Добавлено в корзину",
        description: `${product.name} · размер ${size}`,
        tone: "success",
      });
      window.setTimeout(() => {
        setState("idle");
        setPickerOpen(false);
      }, 900);
    }, 550);
  };

  return (
    <div
      className={cx("group relative flex flex-col", className)}
      onMouseLeave={() => setPickerOpen(false)}
    >
      <div className="relative">
      <Link
        href={`/product/${product.slug}`}
        className="relative block overflow-hidden bg-[#f3f3f4]"
      >
        <div className="relative aspect-[4/5] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.06] group-hover:opacity-0"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={secondary}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
          />
        </div>

        <div className="absolute left-0 top-3 flex flex-col items-start gap-1.5">
          {off > 0 ? (
            <span className="bg-[#e50000] px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-white">
              SALE −{off}%
            </span>
          ) : null}
          {product.isNew ? (
            <span className="bg-[#111] px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-white">
              NEW
            </span>
          ) : null}
        </div>
      </Link>

      <button
        type="button"
        onClick={handleWish}
        aria-label="В избранное"
        className={cx(
          "absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-all duration-300 hover:bg-white",
          wished ? "text-[#e50000]" : "text-[#111]",
          beat && "animate-heart",
        )}
      >
        <HeartIcon filled={wished} width={17} height={17} />
      </button>

      {/* quick add */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 hidden px-3 sm:block">
        <div className="pointer-events-auto translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {pickerOpen ? (
            <div className="animate-fade-in border border-black/10 bg-white p-2 shadow-[0_20px_40px_-18px_rgba(0,0,0,0.4)]">
              <p className="px-1 pb-1.5 text-[10px] font-bold tracking-[0.16em] text-[#8a8a8a]">
                ВЫБЕРИТЕ РАЗМЕР
              </p>
              <div className="flex flex-wrap gap-1">
                {inStock.slice(0, 8).map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    disabled={state !== "idle"}
                    onClick={() => quickAdd(s.label)}
                    className="min-w-9 border border-black/15 px-2 py-1.5 text-[11px] font-semibold transition-colors hover:border-[#111] hover:bg-[#111] hover:text-white disabled:opacity-40"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="flex w-full items-center justify-center gap-2 bg-[#111] py-3 text-[11px] font-bold tracking-[0.18em] text-white transition-colors hover:bg-[#e50000]"
            >
              {state === "loading" ? (
                <SpinnerIcon width={15} height={15} />
              ) : state === "done" ? (
                <CheckIcon width={15} height={15} />
              ) : (
                <PlusIcon width={14} height={14} />
              )}
              БЫСТРО В КОРЗИНУ
            </button>
          )}
        </div>
      </div>
      </div>

      <div className={cx("flex flex-1 flex-col pt-3", compact && "pt-2.5")}>
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[#8a8a8a]">
          {product.brand.toUpperCase()}
        </p>
        <Link
          href={`/product/${product.slug}`}
          className="mt-1 line-clamp-2 text-[13.5px] font-semibold leading-snug tracking-tight transition-colors hover:text-[#e50000]"
        >
          {product.name}
        </Link>

        <div className="mt-1.5 flex items-center gap-1.5">
          <Stars rating={product.rating} size={12} />
          <span className="text-[11px] text-[#8a8a8a]">
            {ratingToStars(product.rating).toFixed(1)} ({product.reviewCount})
          </span>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span
            className={cx(
              "text-[15px] font-bold tracking-tight",
              off > 0 ? "text-[#e50000]" : "text-[#111]",
            )}
          >
            {formatPrice(product.price)}
          </span>
          {product.oldPrice ? (
            <span className="text-[12px] text-[#8a8a8a] line-through">
              {formatPrice(product.oldPrice)}
            </span>
          ) : null}
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          {product.sizes.slice(0, 6).map((s) => (
            <span
              key={s.label}
              title={`${s.label} · ${s.stock > 0 ? "в наличии" : "нет в наличии"}`}
              className={cx(
                "h-1.5 w-1.5 rounded-full",
                s.stock > 6
                  ? "bg-[#111]"
                  : s.stock > 0
                    ? "bg-[#e5a300]"
                    : "bg-[#d9d9dd]",
              )}
            />
          ))}
          <span className="ml-1 text-[10px] tracking-wide text-[#8a8a8a]">
            {inStock.length} разм.
          </span>
        </div>

        <button
          type="button"
          onClick={() => quickAdd(inStock[0]?.label ?? "ONE SIZE")}
          disabled={state !== "idle" || inStock.length === 0}
          className="mt-3 flex items-center justify-center gap-2 border border-[#111] py-2.5 text-[11px] font-bold tracking-[0.16em] transition-colors hover:bg-[#111] hover:text-white sm:hidden"
        >
          {state === "loading" ? "ДОБАВЛЯЕМ…" : state === "done" ? "ДОБАВЛЕНО ✓" : "В КОРЗИНУ"}
        </button>
      </div>
    </div>
  );
}
