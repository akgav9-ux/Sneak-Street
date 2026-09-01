"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cx, formatPrice, plural } from "@/lib/format";
import { CATEGORIES } from "@/lib/catalog";
import { useStore } from "./store";
import {
  CartIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
  ArrowRight,
  TrashIcon,
} from "./icons";

const NAV: {
  label: string;
  href: string;
  panel?: { title: string; links: { label: string; href: string }[] }[];
}[] = [
  {
    label: "Мужское",
    href: "/catalog?gender=men",
    panel: [
      {
        title: "Категории",
        links: CATEGORIES.map((c) => ({
          label: c.label,
          href: `/catalog?gender=men&category=${c.slug}`,
        })),
      },
      {
        title: "Подборки",
        links: [
          { label: "Новинки", href: "/catalog?gender=men&new=1" },
          { label: "Хиты продаж", href: "/catalog?gender=men&sort=popular" },
          { label: "Распродажа", href: "/catalog?gender=men&sale=1" },
          { label: "До 10 000 ₽", href: "/catalog?gender=men&maxPrice=10000" },
        ],
      },
    ],
  },
  {
    label: "Женское",
    href: "/catalog?gender=women",
    panel: [
      {
        title: "Категории",
        links: CATEGORIES.map((c) => ({
          label: c.label,
          href: `/catalog?gender=women&category=${c.slug}`,
        })),
      },
      {
        title: "Подборки",
        links: [
          { label: "Новинки", href: "/catalog?gender=women&new=1" },
          { label: "Хиты продаж", href: "/catalog?gender=women&sort=popular" },
          { label: "Распродажа", href: "/catalog?gender=women&sale=1" },
          { label: "Высокий рейтинг", href: "/catalog?gender=women&sort=rating" },
        ],
      },
    ],
  },
  { label: "Новинки", href: "/catalog?new=1" },
  { label: "Распродажа", href: "/catalog?sale=1" },
  {
    label: "Бренды",
    href: "/catalog",
    panel: [
      {
        title: "Кроссовки",
        links: [
          { label: "Nike", href: "/catalog?brand=Nike" },
          { label: "Adidas", href: "/catalog?brand=Adidas" },
          { label: "Puma", href: "/catalog?brand=Puma" },
          { label: "New Balance", href: "/catalog?brand=New%20Balance" },
        ],
      },
      {
        title: "Одежда",
        links: [
          { label: "Carhartt WIP", href: "/catalog?brand=Carhartt%20WIP" },
          { label: "Stüssy", href: "/catalog?brand=St%C3%BCssy" },
          { label: "The North Face", href: "/catalog?brand=The%20North%20Face" },
          { label: "Sneak&Street", href: "/catalog?brand=Sneak%26Street" },
        ],
      },
    ],
  },
  { label: "Блог", href: "/blog" },
];

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount, wishlist, cart, subtotal, removeFromCart } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [openNav, setOpenNav] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCartOpen(false);
    setOpenNav(null);
  }, [pathname]);

  useEffect(() => {
    if (cartCount === 0) return;
    setBump(true);
    const t = window.setTimeout(() => setBump(false), 400);
    return () => window.clearTimeout(t);
  }, [cartCount]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/catalog?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <div className="relative z-[60] overflow-hidden bg-[#111] py-2 text-white">
        <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap text-[10.5px] font-semibold tracking-[0.24em]">
          {Array.from({ length: 2 }).map((_, block) => (
            <span key={block} className="flex items-center gap-10">
              <span>БЕСПЛАТНАЯ ДОСТАВКА ОТ 5 000 ₽</span>
              <span className="text-[#e50000]">★</span>
              <span>−30% НА ПЕРВЫЙ ЗАКАЗ · ПРОМОКОД STREET30</span>
              <span className="text-[#e50000]">★</span>
              <span>ВОЗВРАТ 30 ДНЕЙ ПО ВСЕЙ РОССИИ</span>
              <span className="text-[#e50000]">★</span>
              <span>НОВЫЕ ДРОПЫ КАЖДЫЙ ЧЕТВЕРГ В 10:00</span>
              <span className="text-[#e50000]">★</span>
            </span>
          ))}
        </div>
      </div>

      <header
        className={cx(
          "sticky top-0 z-[70] w-full transition-all duration-300",
          scrolled
            ? "bg-white/95 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.55)] backdrop-blur-md"
            : "bg-white",
        )}
        onMouseLeave={() => setOpenNav(null)}
      >
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-4 px-4 md:h-20 md:px-8 lg:px-12">
          <button
            type="button"
            aria-label="Открыть меню"
            className="-ml-1 p-2 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </button>

          <Link
            href="/"
            className="shrink-0 text-[17px] font-extrabold tracking-[-0.03em] md:text-[19px]"
          >
            SNEAK<span className="text-[#e50000]">&</span>STREET
          </Link>

          <form
            onSubmit={submitSearch}
            className="relative mx-auto hidden w-full max-w-[420px] md:block"
          >
            <SearchIcon
              width={17}
              height={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8a8a]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск кроссовок, худи..."
              className="h-11 w-full rounded-full border border-black/10 bg-[#f7f7f8] pl-11 pr-4 text-[13px] outline-none transition-all duration-300 placeholder:text-[#8a8a8a] focus:border-[#111] focus:bg-white"
            />
          </form>

          <div className="ml-auto flex items-center gap-0.5 md:gap-1">
            <button
              type="button"
              aria-label="Поиск"
              onClick={() => setSearchOpen((s) => !s)}
              className="p-2.5 transition-colors hover:text-[#e50000] md:hidden"
            >
              <SearchIcon />
            </button>
            <Link
              href="/account"
              aria-label="Личный кабинет"
              className="hidden p-2.5 transition-colors hover:text-[#e50000] sm:block"
            >
              <UserIcon />
            </Link>
            <Link
              href="/account?tab=wishlist"
              aria-label="Избранное"
              className="relative p-2.5 transition-colors hover:text-[#e50000]"
            >
              <HeartIcon />
              {wishlist.length > 0 ? (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#111] px-1 text-[9px] font-bold text-white">
                  {wishlist.length}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              aria-label="Корзина"
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 transition-colors hover:text-[#e50000]"
            >
              <CartIcon />
              {cartCount > 0 ? (
                <span
                  className={cx(
                    "absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e50000] px-1 text-[9px] font-bold text-white",
                    bump && "animate-pop",
                  )}
                >
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {/* десктопное меню */}
        <nav className="hidden border-t border-black/[0.06] lg:block">
          <div className="mx-auto flex max-w-[1440px] items-center gap-8 px-12">
            {NAV.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenNav(item.panel ? item.label : null)}
              >
                <Link
                  href={item.href}
                  className={cx(
                    "flex h-12 items-center text-[11.5px] font-bold tracking-[0.16em] transition-colors",
                    item.label === "Распродажа"
                      ? "text-[#e50000]"
                      : "hover:text-[#e50000]",
                  )}
                >
                  {item.label.toUpperCase()}
                </Link>
                <span
                  className={cx(
                    "absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-[#111] transition-transform duration-300",
                    openNav === item.label && "scale-x-100",
                  )}
                />
              </div>
            ))}
            <span className="ml-auto text-[11px] tracking-[0.16em] text-[#8a8a8a]">
              ДОСТАВКА ПО ВСЕМУ МИРУ · ПОДДЕРЖКА 24/7
            </span>
          </div>

          {NAV.filter((n) => n.panel).map((item) => (
            <div
              key={`${item.label}-panel`}
              onMouseEnter={() => setOpenNav(item.label)}
              className={cx(
                "absolute inset-x-0 top-full origin-top border-t border-black/[0.06] bg-white shadow-[0_28px_50px_-30px_rgba(0,0,0,0.5)] transition-all duration-300",
                openNav === item.label
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-2 opacity-0",
              )}
            >
              <div className="mx-auto grid max-w-[1440px] grid-cols-4 gap-10 px-12 py-9">
                {item.panel!.map((col) => (
                  <div key={col.title}>
                    <p className="eyebrow mb-4 text-[#8a8a8a]">{col.title}</p>
                    <ul className="space-y-2.5">
                      {col.links.map((l) => (
                        <li key={l.label}>
                          <Link
                            href={l.href}
                            className="text-[13.5px] font-medium transition-colors hover:text-[#e50000]"
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="col-span-2 flex items-end justify-between bg-[#f7f7f8] p-7">
                  <div>
                    <p className="eyebrow text-[#e50000]">Дроп 04 · 2026</p>
                    <p className="display mt-2 text-3xl">
                      MIDNIGHT
                      <br />
                      RUNNER PACK
                    </p>
                    <Link
                      href="/catalog?new=1"
                      className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] hover:text-[#e50000]"
                    >
                      СМОТРЕТЬ ДРОП <ArrowRight width={15} height={15} />
                    </Link>
                  </div>
                  <span className="display text-[64px] leading-none text-black/5">
                    04
                  </span>
                </div>
              </div>
            </div>
          ))}
        </nav>

        {searchOpen ? (
          <form
            onSubmit={submitSearch}
            className="animate-fade-in border-t border-black/[0.06] bg-white p-3 md:hidden"
          >
            <div className="relative">
              <SearchIcon
                width={17}
                height={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8a8a]"
              />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск кроссовок, худи..."
                className="h-11 w-full rounded-full border border-black/10 bg-[#f7f7f8] pl-11 pr-4 text-[13px] outline-none focus:border-[#111]"
              />
            </div>
          </form>
        ) : null}
      </header>

     {/* мобильное меню */}
{mobileOpen ? (
  <div className="fixed inset-0 z-[100] lg:hidden">
    <button
      aria-label="Закрыть меню"
      className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      onClick={() => setMobileOpen(false)}
    />
    <div className="animate-drawer absolute inset-y-0 left-0 flex w-[86%] max-w-[340px] flex-col bg-white shadow-2xl">
      <div className="flex h-16 items-center justify-between border-b border-black/[0.06] px-5">
        <span className="text-[15px] font-extrabold tracking-[-0.03em] text-[#111111]">
          SNEAK<span className="text-[#e50000]">&</span>STREET
        </span>
        <button onClick={() => setMobileOpen(false)} aria-label="Закрыть" className="text-[#111111]">
          <CloseIcon />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-6 bg-white">
        <ul className="space-y-1">
          {NAV.map((n) => (
            <li key={n.label}>
              <Link
                href={n.href}
                className={cx(
                  "block py-3 text-[18px] font-bold tracking-tight text-[#111111]",
                  n.label === "Распродажа" && "text-[#e50000]",
                )}
                onClick={() => setMobileOpen(false)}
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="eyebrow mt-8 text-[#8a8a8a]">Категории</p>
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/catalog?category=${c.slug}`}
                className="block border border-black/10 px-3 py-2.5 text-[12px] font-semibold text-[#111111] hover:border-[#e50000] hover:text-[#e50000]"
                onClick={() => setMobileOpen(false)}
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 space-y-2 border-t border-black/[0.06] pt-6">
          <Link href="/account" className="block py-2 text-[13px] font-semibold text-[#111111] hover:text-[#e50000]" onClick={() => setMobileOpen(false)}>
            Личный кабинет
          </Link>
          <Link href="/cart" className="block py-2 text-[13px] font-semibold text-[#111111] hover:text-[#e50000]" onClick={() => setMobileOpen(false)}>
            Корзина ({cartCount})
          </Link>
        </div>
      </div>
    </div>
  </div>
) : null}

      {/* корзина-шторка */}
      {cartOpen ? (
        <div className="fixed inset-0 z-[110]">
          <button
            aria-label="Закрыть корзину"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={() => setCartOpen(false)}
          />
          <aside className="animate-drawer absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-white">
            <div className="flex h-[68px] items-center justify-between border-b border-black/[0.06] px-6">
              <p className="text-[13px] font-bold tracking-[0.16em]">
                КОРЗИНА ({cartCount})
              </p>
              <button onClick={() => setCartOpen(false)} aria-label="Закрыть">
                <CloseIcon />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f7f7f8]">
                  <CartIcon width={30} height={30} className="text-[#8a8a8a]" />
                </span>
                <p className="text-[15px] font-bold">Корзина пуста</p>
                <p className="text-[13px] text-[#8a8a8a]">
                  Добавьте что-нибудь свежее, чтобы начать.
                </p>
                <button
                  onClick={() => {
                    setCartOpen(false);
                    router.push("/catalog");
                  }}
                  className="btn-red mt-2 px-7 py-3 text-[11px] font-bold tracking-[0.18em] text-white"
                >
                  ПЕРЕЙТИ В КАТАЛОГ
                </button>
              </div>
            ) : (
              <>
                <div className="thin-scrollbar flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  {cart.map((item) => (
                    <div
                      key={`${item.slug}-${item.size}-${item.color}`}
                      className="flex gap-3"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-24 w-20 shrink-0 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold tracking-[0.14em] text-[#8a8a8a]">
                          {item.brand.toUpperCase()}
                        </p>
                        <p className="truncate text-[13px] font-semibold">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-[11.5px] text-[#8a8a8a]">
                          {item.size} · {item.color} · ×{item.quantity}
                        </p>
                        <p className="mt-1 text-[13px] font-bold text-[#e50000]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          removeFromCart(item.slug, item.size, item.color)
                        }
                        aria-label="Удалить"
                        className="self-start p-1 text-[#8a8a8a] transition-colors hover:text-[#e50000]"
                      >
                        <TrashIcon width={16} height={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-black/[0.06] px-6 py-5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#8a8a8a]">
                      Итого · {cartCount}{" "}
                      {plural(cartCount, "товар", "товара", "товаров")}
                    </span>
                    <span className="text-[16px] font-bold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-[11.5px] text-[#8a8a8a]">
                    {subtotal >= 5000
                      ? "🎉 Доставка бесплатная"
                      : `Ещё ${formatPrice(5000 - subtotal)} до бесплатной доставки`}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        router.push("/cart");
                      }}
                      className="border border-[#111] py-3 text-[11px] font-bold tracking-[0.16em] transition-colors hover:bg-[#111] hover:text-white"
                    >
                      В КОРЗИНУ
                    </button>
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        router.push("/checkout");
                      }}
                      className="btn-red py-3 text-[11px] font-bold tracking-[0.16em] text-white"
                    >
                      ОФОРМИТЬ
                    </button>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      ) : null}
    </>
  );
}
