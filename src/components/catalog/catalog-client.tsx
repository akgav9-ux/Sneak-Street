"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ProductDTO } from "@/db/queries";
import {
  APPAREL_SIZES,
  BRANDS,
  CATEGORIES,
  COLOR_OPTIONS,
  LIGHT_HEX,
  categoryLabel,
  SHOE_SIZES,
  SORT_OPTIONS,
} from "@/lib/catalog";
import { cx, formatPrice, plural } from "@/lib/format";
import { ProductCard } from "@/components/product-card";
import {
  CheckIcon,
  ChevronDown,
  CloseIcon,
  FilterIcon,
  SearchIcon,
  SpinnerIcon,
  StarIcon,
} from "@/components/icons";

const PAGE_SIZE = 9;
const MAX_PRICE = 25000;

export function CatalogClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qs = searchParams.toString();

  const [items, setItems] = useState<ProductDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [appending, setAppending] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [brandQuery, setBrandQuery] = useState("");

  useEffect(() => {
    setPage(1);
  }, [qs]);

  useEffect(() => {
    let cancelled = false;
    if (page === 1) setLoading(true);
    else setAppending(true);

    fetch(`/api/products?${qs}&page=${page}&limit=${PAGE_SIZE}`)
      .then((r) => r.json())
      .then((data: { items: ProductDTO[]; total: number }) => {
        if (cancelled) return;
        setTotal(data.total);
        setItems((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
        setAppending(false);
      });

    return () => {
      cancelled = true;
    };
  }, [qs, page]);

  const values = useMemo(() => {
    const list = (key: string) =>
      searchParams.getAll(key).flatMap((v) => v.split(",")).filter(Boolean);
    return {
      category: list("category"),
      brand: list("brand"),
      color: list("color"),
      size: list("size"),
      gender: searchParams.get("gender") ?? "",
      sort: searchParams.get("sort") ?? "popular",
      minPrice: Number(searchParams.get("minPrice") ?? 0),
      maxPrice: Number(searchParams.get("maxPrice") ?? MAX_PRICE),
      minRating: Number(searchParams.get("minRating") ?? 0),
      sale: searchParams.get("sale") === "1",
      isNew: searchParams.get("new") === "1",
      q: searchParams.get("q") ?? "",
    };
  }, [searchParams]);

  const apply = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      router.replace(`/catalog?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const toggleMulti = (key: string, value: string) =>
    apply((p) => {
      const current = p.getAll(key).flatMap((v) => v.split(",")).filter(Boolean);
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      p.delete(key);
      if (next.length) p.set(key, next.join(","));
    });

  const setSingle = (key: string, value: string | null) =>
    apply((p) => {
      if (!value) p.delete(key);
      else p.set(key, value);
    });

  const clearAll = () => router.replace("/catalog", { scroll: false });

  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  values.category.forEach((c) =>
    chips.push({
      key: `c-${c}`,
      label: categoryLabel(c),
      onRemove: () => toggleMulti("category", c),
    }),
  );
  values.brand.forEach((b) =>
    chips.push({ key: `b-${b}`, label: b, onRemove: () => toggleMulti("brand", b) }),
  );
  values.color.forEach((c) =>
    chips.push({
      key: `col-${c}`,
      label: `Цвет: ${c}`,
      onRemove: () => toggleMulti("color", c),
    }),
  );
  values.size.forEach((s) =>
    chips.push({
      key: `s-${s}`,
      label: `Размер: ${s}`,
      onRemove: () => toggleMulti("size", s),
    }),
  );
  if (values.gender)
    chips.push({
      key: "g",
      label: values.gender === "men" ? "Мужское" : "Женское",
      onRemove: () => setSingle("gender", null),
    });
  if (values.sale)
    chips.push({ key: "sale", label: "Со скидкой", onRemove: () => setSingle("sale", null) });
  if (values.isNew)
    chips.push({ key: "new", label: "Новинки", onRemove: () => setSingle("new", null) });
  if (values.minRating)
    chips.push({
      key: "rating",
      label: `от ${values.minRating}★`,
      onRemove: () => setSingle("minRating", null),
    });
  if (values.q)
    chips.push({
      key: "q",
      label: `“${values.q}”`,
      onRemove: () => setSingle("q", null),
    });
  if (
    searchParams.get("minPrice") ||
    (searchParams.get("maxPrice") && values.maxPrice < MAX_PRICE)
  )
    chips.push({
      key: "price",
      label: `${formatPrice(values.minPrice)} – ${formatPrice(values.maxPrice)}`,
      onRemove: () =>
        apply((p) => {
          p.delete("minPrice");
          p.delete("maxPrice");
        }),
    });

  const filters = (
    <Filters
      values={values}
      brandQuery={brandQuery}
      setBrandQuery={setBrandQuery}
      toggleMulti={toggleMulti}
      setSingle={setSingle}
      apply={apply}
      clearAll={clearAll}
    />
  );

  const crumbTail = values.category.length
    ? categoryLabel(values.category[0])
    : values.sale
      ? "Распродажа"
      : values.isNew
        ? "Новинки"
        : "Все товары";

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-8 md:px-8 lg:px-12">
      <nav className="flex flex-wrap items-center gap-2 text-[11.5px] tracking-[0.12em] text-[#8a8a8a]">
        <Link href="/" className="hover:text-[#111]">
          ГЛАВНАЯ
        </Link>
        <span>/</span>
        {values.gender ? (
          <>
            <Link
              href={`/catalog?gender=${values.gender}`}
              className="hover:text-[#111]"
            >
              {values.gender === "men" ? "МУЖСКОЕ" : "ЖЕНСКОЕ"}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <span className="text-[#111]">{crumbTail?.toUpperCase()}</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[clamp(30px,4.4vw,54px)]">
            {values.q ? `“${values.q}”` : crumbTail?.toUpperCase()}
          </h1>
          <p className="mt-2 text-[13px] text-[#8a8a8a]">
            {loading
              ? "Загружаем товары…"
              : `Найдено ${total} ${plural(total, "товар", "товара", "товаров")}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-2 border border-black/12 px-4 py-3 text-[11.5px] font-bold tracking-[0.14em] lg:hidden"
          >
            <FilterIcon width={16} height={16} /> ФИЛЬТРЫ
          </button>
          <div className="relative">
            <select
              value={values.sort}
              onChange={(e) => setSingle("sort", e.target.value)}
              className="appearance-none border border-black/12 bg-white py-3 pl-4 pr-10 text-[12px] font-semibold outline-none transition-colors hover:border-[#111]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  Сортировка: {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              width={15}
              height={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      </div>

      {chips.length ? (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              onClick={chip.onRemove}
              className="flex items-center gap-2 rounded-full bg-[#f2f2f4] px-3.5 py-2 text-[11.5px] font-semibold transition-colors hover:bg-[#111] hover:text-white"
            >
              {chip.label}
              <CloseIcon width={12} height={12} />
            </button>
          ))}
          <button
            onClick={clearAll}
            className="px-2 text-[11.5px] font-bold tracking-[0.12em] text-[#e50000] hover:underline"
          >
            СБРОСИТЬ ВСЁ
          </button>
        </div>
      ) : null}

      <div className="mt-8 flex gap-10">
        <aside className="hidden w-[280px] shrink-0 lg:block">{filters}</aside>

        <div className="min-w-0 flex-1">
          {loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <div className="skeleton aspect-[4/5] w-full" />
                  <div className="skeleton mt-3 h-3 w-20" />
                  <div className="skeleton mt-2 h-3 w-full" />
                  <div className="skeleton mt-2 h-3 w-16" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-dashed border-black/12 py-24 text-center">
              <p className="display text-[28px]">НИЧЕГО НЕ НАЙДЕНО</p>
              <p className="mt-3 max-w-[320px] text-[13.5px] text-[#8a8a8a]">
                Под эти фильтры нет товаров. Попробуйте убрать пару условий.
              </p>
              <button
                onClick={clearAll}
                className="btn-red mt-6 px-7 py-3 text-[11px] font-bold tracking-[0.18em] text-white"
              >
                СБРОСИТЬ ФИЛЬТРЫ
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
                {items.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>

              {items.length < total ? (
                <div className="mt-14 flex flex-col items-center gap-4">
                  <div className="h-[3px] w-52 bg-[#ececed]">
                    <div
                      className="h-full bg-[#111] transition-all duration-500"
                      style={{ width: `${(items.length / total) * 100}%` }}
                    />
                  </div>
                  <p className="text-[12px] text-[#8a8a8a]">
                    Показано {items.length} из {total}
                  </p>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={appending}
                    className="flex items-center gap-2 border border-[#111] px-10 py-4 text-[11.5px] font-bold tracking-[0.18em] transition-colors hover:bg-[#111] hover:text-white disabled:opacity-60"
                  >
                    {appending ? (
                      <>
                        <SpinnerIcon width={15} height={15} /> ЗАГРУЖАЕМ…
                      </>
                    ) : (
                      "ПОКАЗАТЬ ЕЩЁ"
                    )}
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* mobile bottom sheet */}
      {sheetOpen ? (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            aria-label="Закрыть фильтры"
            className="absolute inset-0 bg-black/45"
            onClick={() => setSheetOpen(false)}
          />
          <div className="animate-sheet absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-2xl bg-white">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/[0.07] bg-white px-5 py-4">
              <p className="text-[13px] font-bold tracking-[0.16em]">ФИЛЬТРЫ</p>
              <button onClick={() => setSheetOpen(false)} aria-label="Закрыть">
                <CloseIcon />
              </button>
            </div>
            <div className="px-5 py-5">{filters}</div>
            <div className="sticky bottom-0 grid grid-cols-2 gap-2 border-t border-black/[0.07] bg-white p-4">
              <button
                onClick={clearAll}
                className="border border-[#111] py-3.5 text-[11.5px] font-bold tracking-[0.16em]"
              >
                СБРОСИТЬ
              </button>
              <button
                onClick={() => setSheetOpen(false)}
                className="btn-red py-3.5 text-[11.5px] font-bold tracking-[0.16em] text-white"
              >
                ПОКАЗАТЬ {total}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type FiltersProps = {
  values: {
    category: string[];
    brand: string[];
    color: string[];
    size: string[];
    gender: string;
    minPrice: number;
    maxPrice: number;
    minRating: number;
    sale: boolean;
    isNew: boolean;
  };
  brandQuery: string;
  setBrandQuery: (v: string) => void;
  toggleMulti: (key: string, value: string) => void;
  setSingle: (key: string, value: string | null) => void;
  apply: (mutate: (p: URLSearchParams) => void) => void;
  clearAll: () => void;
};

function Filters({
  values,
  brandQuery,
  setBrandQuery,
  toggleMulti,
  setSingle,
  apply,
  clearAll,
}: FiltersProps) {
  return (
    <div className="space-y-8">
      <Group title="Категория">
        <ul className="space-y-2.5">
          {CATEGORIES.map((c) => {
            const checked = values.category.includes(c.slug);
            return (
              <li key={c.slug}>
                <button
                  onClick={() => toggleMulti("category", c.slug)}
                  className="flex w-full items-center gap-3 text-left text-[13.5px] transition-colors hover:text-[#e50000]"
                >
                  <span
                    className={cx(
                      "flex h-[18px] w-[18px] items-center justify-center border transition-all",
                      checked ? "border-[#111] bg-[#111] text-white" : "border-black/20",
                    )}
                  >
                    {checked ? <CheckIcon width={12} height={12} /> : null}
                  </span>
                  {c.label}
                </button>
              </li>
            );
          })}
        </ul>
      </Group>

      <Group title="Пол">
        <div className="flex gap-2">
          {[
            { v: "", l: "Все" },
            { v: "men", l: "Муж." },
            { v: "women", l: "Жен." },
          ].map((g) => (
            <button
              key={g.l}
              onClick={() => setSingle("gender", g.v || null)}
              className={cx(
                "flex-1 border px-3 py-2 text-[12px] font-semibold transition-all",
                values.gender === g.v
                  ? "border-[#111] bg-[#111] text-white"
                  : "border-black/15 hover:border-[#111]",
              )}
            >
              {g.l}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Размер">
        <p className="mb-2 text-[10.5px] tracking-[0.14em] text-[#8a8a8a]">ОДЕЖДА</p>
        <div className="flex flex-wrap gap-2">
          {APPAREL_SIZES.map((s) => (
            <SizePill
              key={s}
              label={s}
              active={values.size.includes(s)}
              onClick={() => toggleMulti("size", s)}
            />
          ))}
        </div>
        <p className="mb-2 mt-4 text-[10.5px] tracking-[0.14em] text-[#8a8a8a]">
          ОБУВЬ · EU
        </p>
        <div className="flex flex-wrap gap-2">
          {SHOE_SIZES.map((s) => (
            <SizePill
              key={s}
              label={s}
              active={values.size.includes(s)}
              onClick={() => toggleMulti("size", s)}
            />
          ))}
        </div>
      </Group>

      <Group title="Цвет">
        <div className="flex flex-wrap gap-2.5">
          {COLOR_OPTIONS.map((c) => {
            const active = values.color.includes(c.name);
            return (
              <button
                key={c.name}
                title={c.name}
                onClick={() => toggleMulti("color", c.name)}
                className={cx(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300",
                  active ? "border-[#111] scale-110" : "border-black/10 hover:scale-105",
                )}
                style={{ backgroundColor: c.hex }}
              >
                {active ? (
                  <CheckIcon
                    width={13}
                    height={13}
                    className={
                      LIGHT_HEX.includes(c.hex)
                        ? "text-[#111]"
                        : "text-white"
                    }
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Цена">
        <div className="flex items-center justify-between text-[12px] font-semibold">
          <span>{formatPrice(values.minPrice)}</span>
          <span>{formatPrice(values.maxPrice)}</span>
        </div>
        <div className="mt-3 space-y-2">
          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            step={500}
            value={values.minPrice}
            onChange={(e) =>
              apply((p) => {
                const v = Math.min(Number(e.target.value), values.maxPrice - 500);
                p.set("minPrice", String(v));
              })
            }
            className="w-full"
          />
          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            step={500}
            value={values.maxPrice}
            onChange={(e) =>
              apply((p) => {
                const v = Math.max(Number(e.target.value), values.minPrice + 500);
                p.set("maxPrice", String(v));
              })
            }
            className="w-full"
          />
        </div>
      </Group>

      <Group title="Бренд">
        <div className="relative mb-3">
          <SearchIcon
            width={14}
            height={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]"
          />
          <input
            value={brandQuery}
            onChange={(e) => setBrandQuery(e.target.value)}
            placeholder="Поиск бренда"
            className="h-10 w-full border border-black/12 pl-9 pr-3 text-[12.5px] outline-none focus:border-[#111]"
          />
        </div>
        <ul className="thin-scrollbar max-h-[190px] space-y-2.5 overflow-y-auto pr-1">
          {BRANDS.filter((b) =>
            b.toLowerCase().includes(brandQuery.toLowerCase()),
          ).map((b) => {
            const checked = values.brand.includes(b);
            return (
              <li key={b}>
                <button
                  onClick={() => toggleMulti("brand", b)}
                  className="flex w-full items-center gap-3 text-left text-[13.5px] transition-colors hover:text-[#e50000]"
                >
                  <span
                    className={cx(
                      "flex h-[18px] w-[18px] items-center justify-center border transition-all",
                      checked ? "border-[#111] bg-[#111] text-white" : "border-black/20",
                    )}
                  >
                    {checked ? <CheckIcon width={12} height={12} /> : null}
                  </span>
                  {b}
                </button>
              </li>
            );
          })}
        </ul>
      </Group>

      <Group title="Рейтинг">
        <div className="space-y-2">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() =>
                setSingle("minRating", values.minRating === r ? null : String(r))
              }
              className={cx(
                "flex w-full items-center gap-2 border px-3 py-2 text-[12.5px] transition-all",
                values.minRating === r
                  ? "border-[#111] bg-[#111] text-white"
                  : "border-black/12 hover:border-[#111]",
              )}
            >
              <span className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon key={i} filled={i <= r} width={12} height={12} />
                ))}
              </span>
              и выше
            </button>
          ))}
        </div>
      </Group>

      <Group title="Предложения">
        <div className="space-y-2">
          <Toggle
            label="Только со скидкой"
            active={values.sale}
            onClick={() => setSingle("sale", values.sale ? null : "1")}
          />
          <Toggle
            label="Новинки"
            active={values.isNew}
            onClick={() => setSingle("new", values.isNew ? null : "1")}
          />
        </div>
      </Group>

      <div className="hidden gap-2 lg:grid lg:grid-cols-2">
        <button
          onClick={clearAll}
          className="border border-[#111] py-3 text-[11px] font-bold tracking-[0.14em] transition-colors hover:bg-[#111] hover:text-white"
        >
          СБРОСИТЬ
        </button>
        <span className="btn-red flex items-center justify-center py-3 text-[11px] font-bold tracking-[0.14em] text-white">
          ПРИМЕНЯЕТСЯ СРАЗУ
        </span>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-black/[0.07] pb-7 last:border-b-0">
      <p className="eyebrow mb-4">{title}</p>
      {children}
    </div>
  );
}

function SizePill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "min-w-[46px] border px-3 py-2 text-[12px] font-semibold transition-all duration-200",
        active
          ? "border-[#111] bg-[#111] text-white"
          : "border-black/15 hover:border-[#111]",
      )}
    >
      {label}
    </button>
  );
}

function Toggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between text-[13.5px]"
    >
      {label}
      <span
        className={cx(
          "relative h-5 w-9 rounded-full transition-colors duration-300",
          active ? "bg-[#e50000]" : "bg-[#dcdce0]",
        )}
      >
        <span
          className={cx(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-300",
            active ? "left-[18px]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}
