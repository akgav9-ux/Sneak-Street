"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useStore, type Address } from "@/components/store";
import { cx, formatDate, formatPrice, plural } from "@/lib/format";
import {
  ArrowRight,
  CartIcon,
  CheckIcon,
  CloseIcon,
  HeartIcon,
  ShieldIcon,
  TrashIcon,
  TruckIcon,
  UserIcon,
} from "@/components/icons";

type OrderRow = {
  id: number;
  orderNumber: string;
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  shippingMethod: string;
  paymentMethod: string;
  items: {
    slug: string;
    name: string;
    brand: string;
    image: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  trackingNumber: string;
  createdAt: string;
};

const TABS = [
  { id: "dashboard", label: "Обзор" },
  { id: "orders", label: "Мои заказы" },
  { id: "wishlist", label: "Избранное" },
  { id: "addresses", label: "Адреса" },
  { id: "payments", label: "Способы оплаты" },
  { id: "settings", label: "Настройки" },
];

export function AccountClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "dashboard";

  const {
    profile,
    setProfile,
    wishlist,
    toggleWishlist,
    addToCart,
    addresses,
    saveAddress,
    removeAddress,
    pushToast,
    ready,
  } = useStore();

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<OrderRow | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    setLoading(true);
    fetch(`/api/orders?email=${encodeURIComponent(profile.email)}`)
      .then((r) => r.json())
      .then((d: { orders?: OrderRow[] }) => setOrders(d.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [ready, profile.email]);

  const setTab = (id: string) => {
    router.replace(`/account?tab=${id}`, { scroll: false });
    setMobileMenuOpen(false);
  };

  const initials = useMemo(
    () =>
      profile.name
        .split(" ")
        .map((p) => p.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    [profile.name],
  );

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-6 md:pt-10 md:px-8 lg:px-12">
      {/* Хлебные крошки */}
      <nav className="flex items-center gap-2 text-[10px] md:text-[11.5px] tracking-[0.12em] text-[#8a8a8a] overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-[#111]">
          ГЛАВНАЯ
        </Link>
        <span>/</span>
        <span className="text-[#111]">ЛИЧНЫЙ КАБИНЕТ</span>
      </nav>

      <div className="mt-4 md:mt-8 grid gap-6 md:gap-10 lg:grid-cols-[280px_1fr]">
        {/* Боковая панель */}
        <aside>
          {/* Профиль */}
          <div className="flex items-center gap-4 border border-black/[0.08] p-4 md:p-5">
            <span className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-[#111] text-[14px] md:text-[16px] font-bold text-white shrink-0">
              {initials || <UserIcon width={20} height={20} />}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[14px] md:text-[15px] font-bold tracking-tight">
                {profile.name}
              </p>
              <p className="truncate text-[11px] md:text-[12px] text-[#8a8a8a]">{profile.email}</p>
            </div>
          </div>

          {/* Мобильная кнопка меню */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full mt-3 md:hidden flex items-center justify-between border border-black/[0.08] px-4 py-3 text-[13px] font-semibold"
          >
            <span>{TABS.find((t) => t.id === tab)?.label || "Меню"}</span>
            <span className="text-[#8a8a8a]">{mobileMenuOpen ? "▲" : "▼"}</span>
          </button>

          {/* Навигация */}
          <nav
            className={cx(
              "mt-3 md:mt-4 flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-in-out",
              mobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 md:max-h-full md:opacity-100",
              "md:overflow-visible"
            )}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cx(
                  "w-full text-left px-4 py-3 text-[13px] font-semibold transition-colors whitespace-nowrap",
                  tab === t.id
                    ? "bg-[#111] text-white"
                    : "hover:bg-[#f5f5f6] border border-black/[0.08] md:border-0"
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {/* Помощь (скрыто на мобилках) */}
          <div className="hidden lg:block mt-4 border border-black/[0.08] p-5">
            <p className="eyebrow text-[#8a8a8a]">Нужна помощь?</p>
            <p className="mt-3 text-[13px] leading-relaxed text-[#5c5c60]">
              Отвечаем круглосуточно, обычно за 5 минут.
            </p>
            <Link
              href="/blog"
              className="mt-4 inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[0.14em] hover:text-[#e50000]"
            >
              ЦЕНТР ПОМОЩИ <ArrowRight width={14} height={14} />
            </Link>
          </div>
        </aside>

        {/* Контент */}
        <div className="min-w-0">
          {tab === "dashboard" ? (
            <Dashboard
              name={profile.name}
              orders={orders}
              loading={loading}
              wishlistCount={wishlist.length}
              addressCount={addresses.length}
              onTab={setTab}
              onDetail={setDetail}
            />
          ) : null}

          {tab === "orders" ? (
            <OrdersTable
              orders={orders}
              loading={loading}
              onDetail={setDetail}
            />
          ) : null}

          {tab === "wishlist" ? (
            <WishlistTab
              wishlist={wishlist}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              pushToast={pushToast}
            />
          ) : null}

          {tab === "addresses" ? (
            <AddressBook
              addresses={addresses}
              onSave={saveAddress}
              onRemove={removeAddress}
              onToast={(t) => pushToast({ title: t, tone: "success" })}
            />
          ) : null}

          {tab === "payments" ? (
            <PaymentsTab profile={profile} pushToast={pushToast} />
          ) : null}

          {tab === "settings" ? (
            <Settings
              profile={profile}
              onSave={(p) => {
                setProfile(p);
                pushToast({ title: "Профиль обновлён", tone: "success" });
              }}
              onDelete={() => {
                window.localStorage.clear();
                pushToast({
                  title: "Данные аккаунта очищены",
                  description: "Локальные демо-данные удалены.",
                  tone: "info",
                });
                window.setTimeout(() => window.location.assign("/"), 900);
              }}
            />
          ) : null}
        </div>
      </div>

      {/* Модалка деталей заказа (адаптивная) */}
      {detail ? (
        <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-6">
          <button
            aria-label="Закрыть"
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={() => setDetail(null)}
          />
          <div className="animate-fade-up relative max-h-[92vh] w-full max-w-[720px] overflow-y-auto bg-white p-4 sm:p-9 rounded-t-2xl sm:rounded-2xl">
            <button
              onClick={() => setDetail(null)}
              className="absolute right-4 top-4 sm:right-5 sm:top-5"
              aria-label="Закрыть"
            >
              <CloseIcon />
            </button>
            <p className="eyebrow text-[#8a8a8a]">Детали заказа</p>
            <h3 className="display mt-2 text-[24px] sm:text-[30px]">#{detail.orderNumber}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-[12.5px] text-[#8a8a8a]">
              <span>{formatDate(detail.createdAt)}</span>
              <StatusChip status={detail.status} />
              {detail.trackingNumber && (
                <span className="font-mono text-[10px] sm:text-[12px] break-all">{detail.trackingNumber}</span>
              )}
            </div>

            <ul className="mt-6 divide-y divide-black/[0.07] border-y border-black/[0.07]">
              {detail.items.map((item, i) => (
                <li key={`${item.slug}-${i}`} className="flex items-center gap-3 sm:gap-4 py-4">
                  <div className="h-16 w-12 sm:h-20 sm:w-16 shrink-0 overflow-hidden bg-[#f3f3f4]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] sm:text-[13.5px] font-semibold truncate">{item.name}</p>
                    <p className="mt-0.5 text-[10px] sm:text-[12px] text-[#8a8a8a]">
                      {item.size} · {item.color} · ×{item.quantity}
                    </p>
                  </div>
                  <p className="text-[12px] sm:text-[13.5px] font-bold shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="eyebrow text-[#8a8a8a]">Адрес доставки</p>
                <p className="mt-2 text-[12px] sm:text-[13.5px] leading-relaxed break-words">
                  {detail.fullName}
                  <br />
                  {detail.address}
                  <br />
                  {detail.city} {detail.postalCode}
                  <br />
                  {detail.country}
                </p>
              </div>
              <div>
                <p className="eyebrow text-[#8a8a8a]">Расчёт</p>
                <dl className="mt-2 space-y-1.5 text-[12px] sm:text-[13px]">
                  <div className="flex justify-between">
                    <dt className="text-[#8a8a8a]">Товары</dt>
                    <dd>{formatPrice(detail.subtotal)}</dd>
                  </div>
                  {detail.discount ? (
                    <div className="flex justify-between">
                      <dt className="text-[#8a8a8a]">Скидка</dt>
                      <dd className="text-emerald-600">
                        −{formatPrice(detail.discount)}
                      </dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between">
                    <dt className="text-[#8a8a8a]">Доставка</dt>
                    <dd>
                      {detail.shipping === 0
                        ? "Бесплатно"
                        : formatPrice(detail.shipping)}
                    </dd>
                  </div>
                  
                  <div className="flex justify-between border-t border-black/[0.07] pt-2 text-[14px] sm:text-[15px] font-bold">
                    <dt>Итого</dt>
                    <dd className="text-[#e50000]">{formatPrice(detail.total)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// =============== ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ===============

function Head({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-4 sm:mb-7">
      <h1 className="text-[20px] sm:text-[26px] md:text-[clamp(26px,3.4vw,40px)] font-extrabold tracking-tight">
        {title}
      </h1>
      <p className="mt-1 sm:mt-2 text-[12px] sm:text-[13px] text-[#8a8a8a]">{sub}</p>
    </div>
  );
}

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex flex-col items-center border border-dashed border-black/12 py-12 sm:py-20 text-center px-4">
      <p className="text-[15px] sm:text-[16px] font-bold">{title}</p>
      <p className="mt-2 max-w-[320px] text-[12px] sm:text-[13px] text-[#8a8a8a]">{text}</p>
      <Link
        href="/catalog"
        className="btn-red mt-6 px-6 sm:px-7 py-3 text-[10px] sm:text-[11px] font-bold tracking-[0.18em] text-white"
      >
        В КАТАЛОГ
      </Link>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const tone =
    status === "Доставлен"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Отправлен"
        ? "bg-blue-100 text-blue-700"
        : "bg-amber-100 text-amber-700";
  return (
    <span className={cx("px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[11px] font-bold", tone)}>{status}</span>
  );
}

// =============== DASHBOARD ===============

function Dashboard({
  name,
  orders,
  loading,
  wishlistCount,
  addressCount,
  onTab,
  onDetail,
}: {
  name: string;
  orders: OrderRow[];
  loading: boolean;
  wishlistCount: number;
  addressCount: number;
  onTab: (id: string) => void;
  onDetail: (o: OrderRow) => void;
}) {
  const spent = orders.reduce((n, o) => n + o.total, 0);
  return (
    <section>
      <Head
        title={`С ВОЗВРАЩЕНИЕМ, ${name.split(" ")[0].toUpperCase()}`}
        sub="Коротко о том, что происходит с вашим аккаунтом."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Всего заказов", value: String(orders.length), icon: TruckIcon },
          { label: "В избранном", value: String(wishlistCount), icon: HeartIcon },
          { label: "Потрачено всего", value: formatPrice(spent), icon: CartIcon },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="border border-black/[0.08] p-4 sm:p-5">
            <Icon width={18} height={18} className="text-[#8a8a8a]" />
            <p className="mt-2 sm:mt-4 text-[20px] sm:text-[26px] font-extrabold tracking-tight">{value}</p>
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[12px] tracking-[0.12em] text-[#8a8a8a]">
              {label.toUpperCase()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 sm:mt-8">
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <p className="text-[11px] sm:text-[13px] font-bold tracking-[0.16em]">ПОСЛЕДНИЕ ЗАКАЗЫ</p>
          <button
            onClick={() => onTab("orders")}
            className="text-[10px] sm:text-[11.5px] font-bold tracking-[0.14em] hover:text-[#e50000]"
          >
            ВСЕ ЗАКАЗЫ
          </button>
        </div>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-14 sm:h-16 w-full" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Empty
            title="Заказов пока нет"
            text="Оформите первый заказ — он появится здесь."
          />
        ) : (
          <ul className="divide-y divide-black/[0.07] border border-black/[0.08]">
            {orders.slice(0, 3).map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4"
              >
                <div className="min-w-0">
                  <p className="text-[12px] sm:text-[13.5px] font-bold">#{o.orderNumber}</p>
                  <p className="text-[10px] sm:text-[12px] text-[#8a8a8a]">
                    {formatDate(o.createdAt)} · {o.items.length}{" "}
                    {plural(o.items.length, "товар", "товара", "товаров")}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <StatusChip status={o.status} />
                  <p className="text-[13px] sm:text-[15px] font-bold">{formatPrice(o.total)}</p>
                  <button
                    onClick={() => onDetail(o)}
                    className="text-[10px] sm:text-[11.5px] font-bold tracking-[0.14em] hover:text-[#e50000] shrink-0"
                  >
                    ПОДРОБНЕЕ
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Отследить посылку", tab: "orders" },
          { label: "Мои адреса", tab: "addresses" },
          { label: "Настройки аккаунта", tab: "settings" },
        ].map((q) => (
          <button
            key={q.tab}
            onClick={() => onTab(q.tab)}
            className="flex items-center justify-between border border-black/[0.08] p-4 sm:p-5 text-left text-[12px] sm:text-[13.5px] font-semibold transition-colors hover:border-[#111]"
          >
            {q.label}
            <ArrowRight width={14} height={14} />
          </button>
        ))}
      </div>
    </section>
  );
}

// =============== ЗАКАЗЫ ===============

function OrdersTable({
  orders,
  loading,
  onDetail,
}: {
  orders: OrderRow[];
  loading: boolean;
  onDetail: (o: OrderRow) => void;
}) {
  return (
    <section>
      <Head title="МОИ ЗАКАЗЫ"
        sub={`${orders.length} ${plural(orders.length, "заказ оформлен", "заказа оформлено", "заказов оформлено")}`} />
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-12 sm:h-14 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Empty
          title="Заказов пока нет"
          text="История заказов появится здесь после первой покупки."
        />
      ) : (
        <>
          {/* Десктопная таблица */}
          <div className="hidden md:block overflow-x-auto border border-black/[0.08]">
            <table className="w-full min-w-[620px] text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-black/[0.08] text-[10.5px] tracking-[0.16em] text-[#8a8a8a]">
                  <th className="p-4">НОМЕР</th>
                  <th className="p-4">ДАТА</th>
                  <th className="p-4">ТОВАРОВ</th>
                  <th className="p-4">СУММА</th>
                  <th className="p-4">СТАТУС</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-black/[0.06] transition-colors last:border-b-0 hover:bg-[#fafafa]"
                  >
                    <td className="p-4 font-bold">#{o.orderNumber}</td>
                    <td className="p-4 text-[#8a8a8a]">{formatDate(o.createdAt)}</td>
                    <td className="p-4 text-[#8a8a8a]">{o.items.length}</td>
                    <td className="p-4 font-bold">{formatPrice(o.total)}</td>
                    <td className="p-4">
                      <StatusChip status={o.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onDetail(o)}
                        className="text-[11.5px] font-bold tracking-[0.14em] hover:text-[#e50000]"
                      >
                        ОТКРЫТЬ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Мобильные карточки */}
          <div className="block md:hidden space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="border border-black/[0.08] p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm">#{o.orderNumber}</p>
                    <p className="text-xs text-[#8a8a8a]">{formatDate(o.createdAt)}</p>
                  </div>
                  <StatusChip status={o.status} />
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-[#8a8a8a]">{o.items.length} {plural(o.items.length, "товар", "товара", "товаров")}</span>
                  <span className="font-bold text-[#e50000]">{formatPrice(o.total)}</span>
                </div>
                <button
                  onClick={() => onDetail(o)}
                  className="w-full mt-3 border border-black/[0.08] py-2.5 text-xs font-bold tracking-[0.14em] hover:border-[#e50000] hover:text-[#e50000]"
                >
                  ПОДРОБНЕЕ
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

// =============== ИЗБРАННОЕ ===============

function WishlistTab({
  wishlist,
  addToCart,
  toggleWishlist,
  pushToast,
}: {
  wishlist: any[];
  addToCart: (item: any) => void;
  toggleWishlist: (item: any) => void;
  pushToast: (t: any) => void;
}) {
  return (
    <section>
      <Head title="ИЗБРАННОЕ"
        sub={`${wishlist.length} ${plural(wishlist.length, "сохранённый товар", "сохранённых товара", "сохранённых товаров")}`} />
      {wishlist.length === 0 ? (
        <Empty
          title="Пока пусто"
          text="Нажмите на сердечко у любого товара, чтобы сохранить его здесь."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8">
          {wishlist.map((w) => (
            <div key={w.slug}>
              <Link
                href={`/product/${w.slug}`}
                className="card-hover-zoom block aspect-[4/5] overflow-hidden bg-[#f3f3f4]"
              >
                <img
                  src={w.image}
                  alt={w.name}
                  className="h-full w-full object-cover"
                />
              </Link>
              <p className="mt-2 sm:mt-3 text-[9px] sm:text-[10px] font-bold tracking-[0.16em] text-[#8a8a8a] truncate">
                {w.brand.toUpperCase()}
              </p>
              <Link
                href={`/product/${w.slug}`}
                className="mt-0.5 sm:mt-1 block line-clamp-2 text-[12px] sm:text-[13.5px] font-semibold hover:text-[#e50000]"
              >
                {w.name}
              </Link>
              <p className="mt-1 sm:mt-1.5 text-[13px] sm:text-[15px] font-bold text-[#e50000]">
                {formatPrice(w.price)}
              </p>
              <div className="mt-2 sm:mt-3 flex gap-2">
                <button
                  onClick={() => {
                    addToCart({
                      slug: w.slug,
                      name: w.name,
                      brand: w.brand,
                      image: w.image,
                      size: "M",
                      color: "Default",
                      price: w.price,
                      oldPrice: w.oldPrice,
                      quantity: 1,
                    });
                    pushToast({
                      title: "Добавлено в корзину",
                      description: w.name,
                      tone: "success",
                    });
                  }}
                  className="flex-1 bg-[#111] py-2 text-[9px] sm:text-[10.5px] font-bold tracking-[0.14em] text-white transition-colors hover:bg-[#e50000]"
                >
                  В КОРЗИНУ
                </button>
                <button
                  onClick={() => {
                    toggleWishlist(w);
                    pushToast({
                      title: "Удалено из избранного",
                      description: w.name,
                      tone: "info",
                    });
                  }}
                  aria-label="Удалить"
                  className="border border-black/15 px-2 sm:px-3 transition-colors hover:border-[#e50000] hover:text-[#e50000]"
                >
                  <TrashIcon width={14} height={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// =============== АДРЕСА ===============

function AddressBook({
  addresses,
  onSave,
  onRemove,
  onToast,
}: {
  addresses: Address[];
  onSave: (a: Address) => void;
  onRemove: (id: string) => void;
  onToast: (t: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Address>({
    id: "",
    label: "Home",
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "United States",
    phone: "",
    isDefault: false,
  });

  return (
    <section>
      <Head title="АДРЕСА"
        sub={`${addresses.length} ${plural(addresses.length, "сохранённый адрес", "сохранённых адреса", "сохранённых адресов")}`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {addresses.map((a) => (
          <div key={a.id} className="border border-black/[0.08] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] sm:text-[13px] font-bold tracking-[0.14em]">
                {a.label.toUpperCase()}
              </p>
              {a.isDefault ? (
                <span className="bg-[#111] px-2 py-0.5 sm:py-1 text-[8px] sm:text-[9.5px] font-bold tracking-[0.14em] text-white">
                  ОСНОВНОЙ
                </span>
              ) : null}
            </div>
            <p className="mt-2 sm:mt-3 text-[12px] sm:text-[13.5px] leading-relaxed break-words">
              {a.fullName}
              <br />
              {a.street}
              <br />
              {a.city} {a.postalCode}
              <br />
              {a.country}
              <br />
              {a.phone}
            </p>
            <div className="mt-3 sm:mt-4 flex flex-wrap gap-3 text-[10px] sm:text-[11.5px] font-bold tracking-[0.14em]">
              {!a.isDefault ? (
                <button
                  onClick={() => {
                    onSave({ ...a, isDefault: true });
                    onToast("Основной адрес обновлён");
                  }}
                  className="hover:text-[#e50000]"
                >
                  СДЕЛАТЬ ОСНОВНЫМ
                </button>
              ) : null}
              <button
                onClick={() => {
                  onRemove(a.id);
                  onToast("Адрес удалён");
                }}
                className="text-[#8a8a8a] hover:text-[#e50000]"
              >
                УДАЛИТЬ
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-[160px] sm:min-h-[180px] items-center justify-center border border-dashed border-black/20 text-[11px] sm:text-[12px] font-bold tracking-[0.16em] text-[#8a8a8a] transition-colors hover:border-[#111] hover:text-[#111]"
        >
          + ДОБАВИТЬ АДРЕС
        </button>
      </div>

      {open ? (
        <div className="animate-fade-in mt-4 sm:mt-6 border border-black/[0.08] p-4 sm:p-6">
          <p className="text-[12px] sm:text-[13px] font-bold tracking-[0.16em]">НОВЫЙ АДРЕС</p>
          <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {(
              [
                ["label", "Название (Дом, Работа)"],
                ["fullName", "Имя получателя"],
                ["street", "Улица, дом, квартира"],
                ["city", "Город"],
                ["postalCode", "Индекс"],
                ["country", "Страна"],
                ["phone", "Телефон"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block">
                <span className="eyebrow text-[#8a8a8a] text-[10px] sm:text-[11px]">{label}</span>
                <input
                  value={draft[key] as string}
                  onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                  className="mt-1 sm:mt-2 h-10 sm:h-12 w-full border border-black/15 px-3 text-[12px] sm:text-[13.5px] outline-none focus:border-[#111]"
                />
              </label>
            ))}
          </div>
          <button
            onClick={() => {
              if (!draft.fullName || !draft.street) {
                onToast("Заполните имя и адрес");
                return;
              }
              onSave({ ...draft, id: `addr-${Date.now()}` });
              setOpen(false);
              setDraft({ ...draft, fullName: "", street: "", city: "", postalCode: "" });
              onToast("Адрес сохранён");
            }}
            className="btn-red mt-4 sm:mt-5 px-6 sm:px-8 py-3 sm:py-3.5 text-[10px] sm:text-[11.5px] font-bold tracking-[0.16em] text-white"
          >
            СОХРАНИТЬ АДРЕС
          </button>
        </div>
      ) : null}
    </section>
  );
}

// =============== ОПЛАТА ===============

function PaymentsTab({
  profile,
  pushToast,
}: {
  profile: { name: string };
  pushToast: (t: any) => void;
}) {
  return (
    <section>
      <Head title="СПОСОБЫ ОПЛАТЫ" sub="Сохранённые карты и кошельки" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {[
          { brand: "VISA", last4: "4242", exp: "04/28", primary: true },
          { brand: "MASTERCARD", last4: "8319", exp: "11/27", primary: false },
        ].map((c) => (
          <div
            key={c.last4}
            className={cx(
              "relative flex h-36 sm:h-44 flex-col justify-between overflow-hidden p-4 sm:p-6 text-white",
              c.primary ? "bg-[#111]" : "bg-[#2a2a2a]",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-[13px] font-bold tracking-[0.18em]">
                {c.brand}
              </span>
              {c.primary ? (
                <span className="bg-[#e50000] px-2 py-0.5 sm:py-1 text-[8px] sm:text-[9.5px] font-bold tracking-[0.14em]">
                  ОСНОВНАЯ
                </span>
              ) : null}
            </div>
            <div>
              <p className="font-mono text-[15px] sm:text-[19px] tracking-[0.18em]">
                •••• •••• •••• {c.last4}
              </p>
              <p className="mt-1 sm:mt-2 text-[10px] sm:text-[11.5px] text-white/60">
                Действует до {c.exp} · {profile.name}
              </p>
            </div>
            <span className="absolute -right-8 -top-8 h-28 sm:h-32 w-28 sm:w-32 rounded-full bg-white/5" />
          </div>
        ))}
        <button
          onClick={() =>
            pushToast({
              title: "Демо-режим",
              description: "Сохранение карт отключено в демо-версии.",
              tone: "info",
            })
          }
          className="flex h-36 sm:h-44 items-center justify-center border border-dashed border-black/20 text-[11px] sm:text-[12px] font-bold tracking-[0.16em] text-[#8a8a8a] transition-colors hover:border-[#111] hover:text-[#111]"
        >
          + ДОБАВИТЬ КАРТУ
        </button>
      </div>
    </section>
  );
}

// =============== НАСТРОЙКИ ===============

function Settings({
  profile,
  onSave,
  onDelete,
}: {
  profile: { name: string; email: string; phone: string };
  onSave: (p: { name: string; email: string; phone: string }) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState(profile);
  const [prefs, setPrefs] = useState({ drops: true, sales: true, blog: false });

  useEffect(() => setDraft(profile), [profile]);

  return (
    <section className="space-y-6 sm:space-y-8">
      <Head title="НАСТРОЙКИ" sub="Профиль и параметры уведомлений" />

      <div className="border border-black/[0.08] p-4 sm:p-6">
        <p className="text-[12px] sm:text-[13px] font-bold tracking-[0.16em]">ПРОФИЛЬ</p>
        <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {(
            [
              ["name", "Имя и фамилия"],
              ["email", "E-mail"],
              ["phone", "Телефон"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block">
              <span className="eyebrow text-[#8a8a8a] text-[10px] sm:text-[11px]">{label}</span>
              <input
                value={draft[key]}
                onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                className="mt-1 sm:mt-2 h-10 sm:h-12 w-full border border-black/15 px-3 text-[12px] sm:text-[13.5px] outline-none focus:border-[#111]"
              />
            </label>
          ))}
        </div>
        <button
          onClick={() => onSave(draft)}
          className="mt-4 sm:mt-5 bg-[#111] px-6 sm:px-8 py-3 sm:py-3.5 text-[10px] sm:text-[11.5px] font-bold tracking-[0.16em] text-white transition-colors hover:bg-[#e50000]"
        >
          СОХРАНИТЬ
        </button>
      </div>

      <div className="border border-black/[0.08] p-4 sm:p-6">
        <p className="text-[12px] sm:text-[13px] font-bold tracking-[0.16em]">СМЕНА ПАРОЛЯ</p>
        <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {["Текущий пароль", "Новый пароль", "Повторите пароль"].map((l) => (
            <label key={l} className="block">
              <span className="eyebrow text-[#8a8a8a] text-[10px] sm:text-[11px]">{l}</span>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1 sm:mt-2 h-10 sm:h-12 w-full border border-black/15 px-3 text-[12px] sm:text-[13.5px] outline-none focus:border-[#111]"
              />
            </label>
          ))}
        </div>
        <p className="mt-3 sm:mt-4 flex items-center gap-2 text-[11px] sm:text-[12px] text-[#8a8a8a]">
          <ShieldIcon width={14} height={14} /> Пароли хранятся в виде bcrypt-хэша и никогда не сохраняются в открытом виде.
        </p>
      </div>

      <div className="border border-black/[0.08] p-4 sm:p-6">
        <p className="text-[12px] sm:text-[13px] font-bold tracking-[0.16em]">УВЕДОМЛЕНИЯ</p>
        <div className="mt-4 sm:mt-5 space-y-2 sm:space-y-3">
          {(
            [
              ["drops", "Анонсы новых дропов"],
              ["sales", "Скидки и акции"],
              ["blog", "Дайджест блога о стиле"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPrefs({ ...prefs, [key]: !prefs[key] })}
              className="flex w-full items-center justify-between text-[12px] sm:text-[13.5px]"
            >
              {label}
              <span
                className={cx(
                  "relative h-5 w-9 rounded-full transition-colors duration-300 shrink-0",
                  prefs[key] ? "bg-[#e50000]" : "bg-[#dcdce0]",
                )}
              >
                <span
                  className={cx(
                    "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-300",
                    prefs[key] ? "left-[18px]" : "left-0.5",
                  )}
                />
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 sm:mt-5 flex items-center gap-2 text-[11px] sm:text-[12px] text-emerald-600">
          <CheckIcon width={14} height={14} /> Настройки сохраняются автоматически.
        </p>
      </div>

      <div className="border border-[#e50000]/30 bg-[#e50000]/[0.03] p-4 sm:p-6">
        <p className="text-[12px] sm:text-[13px] font-bold tracking-[0.16em] text-[#e50000]">
          ОПАСНАЯ ЗОНА
        </p>
        <p className="mt-2 sm:mt-3 max-w-[520px] text-[12px] sm:text-[13px] leading-relaxed text-[#5c5c60]">
          Удаление аккаунта очистит профиль, корзину, избранное и сохранённые адреса
          на этом устройстве. История заказов остаётся у службы доставки для
          бухгалтерской отчётности.
        </p>
        <button
          onClick={onDelete}
          className="mt-4 sm:mt-5 border border-[#e50000] px-5 sm:px-7 py-3 sm:py-3.5 text-[10px] sm:text-[11.5px] font-bold tracking-[0.16em] text-[#e50000] transition-colors hover:bg-[#e50000] hover:text-white"
        >
          УДАЛИТЬ АККАУНТ
        </button>
      </div>
    </section>
  );
}