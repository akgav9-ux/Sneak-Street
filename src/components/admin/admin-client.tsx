"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ProductDTO, QuestionDTO } from "@/db/queries";
import type { ProductColor, ProductSize } from "@/db/schema";
import { useStore } from "@/components/store";
import { cx, formatDateTime, formatPrice, plural } from "@/lib/format";
import {
  APPAREL_SIZES,
  BRANDS,
  CATEGORIES,
  COLOR_OPTIONS,
  GENDERS,
  LIGHT_HEX,
  SHOE_SIZES,
  categoryLabel,
} from "@/lib/catalog";
import { ORDER_STATUSES } from "@/lib/pricing";
import {
  CheckIcon,
  CloseIcon,
  PlusIcon,
  SearchIcon,
  SpinnerIcon,
  TrashIcon,
} from "@/components/icons";

type OrderRow = {
  id: number;
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  items: { name: string; size: string; color: string; quantity: number; price: number }[];
  total: number;
  status: string;
  createdAt: string;
};

type Stats = {
  products: number;
  orders: number;
  openQuestions: number;
  subscribers: number;
  revenue: number;
};

const EMPTY_FORM = {
  id: 0,
  name: "",
  brand: "Sneak&Street",
  category: "sneakers",
  gender: "unisex",
  shortDescription: "",
  description: "",
  material: "",
  care: "",
  price: 0,
  oldPrice: 0,
  images: ["", "", "", ""],
  colors: [] as ProductColor[],
  sizes: [] as ProductSize[],
  rating: 45,
  reviewCount: 0,
  isNew: true,
  isBestseller: false,
  isActive: true,
};

type FormState = typeof EMPTY_FORM;

export function AdminClient() {
  const { pushToast } = useStore();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [tab, setTab] = useState<"products" | "questions" | "orders">("products");

  const [items, setItems] = useState<ProductDTO[]>([]);
  const [qs, setQs] = useState<QuestionDTO[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/login")
      .then((r) => r.json())
      .then((d: { authenticated: boolean }) => setAuthed(d.authenticated))
      .catch(() => setAuthed(false));
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [p, q, o] = await Promise.all([
        fetch("/api/admin/products").then((r) => r.json()),
        fetch("/api/admin/questions").then((r) => r.json()),
        fetch("/api/admin/orders").then((r) => r.json()),
      ]);
      setItems(p.items ?? []);
      setQs(q.items ?? []);
      setOrders(o.orders ?? []);
      setStats(o.stats ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) void reload();
  }, [authed, reload]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoggingIn(false);
    if (res.ok) {
      setAuthed(true);
      pushToast({ title: "Вход выполнен", tone: "success" });
    } else {
      pushToast({ title: "Неверный пароль", tone: "error" });
    }
  };

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
    setPassword("");
  };

  if (authed === null) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-24 md:px-8">
        <div className="skeleton mx-auto h-64 w-full max-w-[420px]" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="mx-auto flex max-w-[440px] flex-col px-4 py-24">
        <p className="eyebrow text-[#e50000]">Панель управления</p>
        <h1 className="display mt-4 text-[40px]">ВХОД ДЛЯ АДМИНА</h1>
        <p className="mt-4 text-[13.5px] leading-relaxed text-[#8a8a8a]">
          Введите пароль администратора, чтобы управлять товарами, отвечать на
          вопросы покупателей и обрабатывать заказы.
        </p>
        <form onSubmit={login} className="mt-8">
          <label className="block">
            <span className="eyebrow text-[#8a8a8a]">Пароль</span>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 h-12 w-full border border-black/15 px-3 text-[14px] outline-none focus:border-[#111]"
            />
          </label>
          <button
            type="submit"
            disabled={loggingIn}
            className="btn-red mt-5 flex w-full items-center justify-center gap-2 py-4 text-[12px] font-bold tracking-[0.2em] text-white"
          >
            {loggingIn ? <SpinnerIcon width={16} height={16} /> : null}
            ВОЙТИ
          </button>
        </form>
        <p className="mt-5 border border-dashed border-black/15 p-4 text-[12.5px] text-[#8a8a8a]">
          Пароль по умолчанию: <strong className="text-[#111]">admin123</strong>.
          Его можно изменить через переменную окружения{" "}
          <code className="text-[#111]">ADMIN_PASSWORD</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-10 md:px-8 lg:px-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-[#e50000]">Sneak&Street</p>
          <h1 className="display mt-3 text-[clamp(30px,4.4vw,52px)]">
            АДМИН-ПАНЕЛЬ
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="border border-[#111] px-5 py-3 text-[11.5px] font-bold tracking-[0.14em] transition-colors hover:bg-[#111] hover:text-white"
          >
            НА САЙТ
          </Link>
          <button
            onClick={logout}
            className="border border-black/15 px-5 py-3 text-[11.5px] font-bold tracking-[0.14em] text-[#8a8a8a] transition-colors hover:border-[#e50000] hover:text-[#e50000]"
          >
            ВЫЙТИ
          </button>
        </div>
      </div>

      {stats ? (
        <div className="mt-8 grid grid-cols-2 gap-px bg-black/[0.08] lg:grid-cols-5">
          {[
            { l: "Товаров", v: String(stats.products) },
            { l: "Заказов", v: String(stats.orders) },
            { l: "Новых вопросов", v: String(stats.openQuestions), hot: stats.openQuestions > 0 },
            { l: "Подписчиков", v: String(stats.subscribers) },
            { l: "Выручка", v: formatPrice(stats.revenue) },
          ].map((s) => (
            <div key={s.l} className="bg-white p-5">
              <p
                className={cx(
                  "text-[24px] font-extrabold tracking-tight",
                  s.hot && "text-[#e50000]",
                )}
              >
                {s.v}
              </p>
              <p className="mt-1 text-[11px] tracking-[0.14em] text-[#8a8a8a]">
                {s.l.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <nav className="mt-8 flex gap-2 border-b border-black/[0.08]">
        {(
          [
            ["products", `Товары (${items.length})`],
            ["questions", `Вопросы (${qs.filter((q) => q.status === "new").length})`],
            ["orders", `Заказы (${orders.length})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cx(
              "relative px-1 pb-4 pr-6 text-[13px] font-bold tracking-[0.1em] transition-colors",
              tab === id ? "text-[#111]" : "text-[#8a8a8a] hover:text-[#111]",
            )}
          >
            {label.toUpperCase()}
            <span
              className={cx(
                "absolute inset-x-0 -bottom-px h-[2px] origin-left bg-[#e50000] transition-transform duration-300",
                tab === id ? "scale-x-100" : "scale-x-0",
              )}
            />
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {loading ? <div className="skeleton mb-6 h-1 w-full" /> : null}
        {tab === "products" ? (
          <ProductsTab items={items} onReload={reload} />
        ) : null}
        {tab === "questions" ? (
          <QuestionsTab items={qs} onReload={reload} />
        ) : null}
        {tab === "orders" ? <OrdersTab orders={orders} onReload={reload} /> : null}
      </div>
    </div>
  );
}

/* ------------------------------- ТОВАРЫ ------------------------------- */

function ProductsTab({
  items,
  onReload,
}: {
  items: ProductDTO[];
  onReload: () => Promise<void>;
}) {
  const { pushToast } = useStore();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      items.filter((p) =>
        `${p.name} ${p.brand}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [items, search],
  );

  const sizeSet = form.category === "sneakers" ? SHOE_SIZES : form.category === "accessories" ? ["ONE SIZE"] : APPAREL_SIZES;

  const startCreate = () => {
    setForm({ ...EMPTY_FORM, sizes: [] });
    setEditing(false);
    setOpen(true);
  };

  const startEdit = (p: ProductDTO) => {
    setForm({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      gender: p.gender,
      shortDescription: p.shortDescription,
      description: p.description,
      material: p.material,
      care: p.care,
      price: p.price,
      oldPrice: p.oldPrice ?? 0,
      images: [0, 1, 2, 3].map((i) => p.images[i] ?? ""),
      colors: p.colors,
      sizes: p.sizes,
      rating: p.rating,
      reviewCount: p.reviewCount,
      isNew: p.isNew,
      isBestseller: p.isBestseller,
      isActive: p.isActive,
    });
    setEditing(true);
    setOpen(true);
  };

  // Функция загрузки фото на сервер
  const uploadImage = async (file: File, index: number) => {
    setUploading(index);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const next = form.images.slice();
        next[index] = data.url;
        setForm({ ...form, images: next });
        pushToast({
          title: "Фото загружено",
          description: file.name,
          tone: "success",
        });
      } else {
        const error = await res.json();
        pushToast({
          title: "Ошибка загрузки",
          description: error.error || "Неизвестная ошибка",
          tone: "error",
        });
      }
    } catch (error) {
      pushToast({
        title: "Ошибка соединения",
        description: "Не удалось загрузить фото",
        tone: "error",
      });
    } finally {
      setUploading(null);
    }
  };

  // Загрузка нескольких фото сразу
  const uploadMultipleImages = async (files: FileList) => {
    let uploaded = 0;
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          const next = [...form.images];
          const emptyIndex = next.findIndex((x) => !x);
          if (emptyIndex !== -1) {
            next[emptyIndex] = data.url;
          } else {
            next.push(data.url);
          }
          setForm({ ...form, images: next });
          uploaded++;
        }
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      }
    }

    if (uploaded > 0) {
      pushToast({
        title: `Загружено ${uploaded} фото`,
        tone: "success",
      });
    }
  };

  const save = async () => {
    if (!form.name.trim() || !form.price) {
      pushToast({ title: "Укажите название и цену", tone: "error" });
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      oldPrice: form.oldPrice > 0 ? form.oldPrice : null,
      images: form.images.filter(Boolean),
    };
    const res = await fetch(
      editing ? `/api/admin/products/${form.id}` : "/api/admin/products",
      {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    setSaving(false);
    if (res.ok) {
      pushToast({
        title: editing ? "Товар обновлён" : "Товар добавлен",
        description: form.name,
        tone: "success",
      });
      setOpen(false);
      await onReload();
    } else {
      pushToast({ title: "Не удалось сохранить", tone: "error" });
    }
  };

  const remove = async (p: ProductDTO) => {
    const res = await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    if (res.ok) {
      pushToast({ title: "Товар удалён", description: p.name, tone: "info" });
      await onReload();
    }
  };

  const toggleActive = async (p: ProductDTO) => {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive, oldPrice: p.oldPrice }),
    });
    await onReload();
  };

  const toggleSize = (label: string) => {
    const exists = form.sizes.find((s) => s.label === label);
    setForm({
      ...form,
      sizes: exists
        ? form.sizes.filter((s) => s.label !== label)
        : [...form.sizes, { label, stock: 10 }],
    });
  };

  const setStock = (label: string, stock: number) =>
    setForm({
      ...form,
      sizes: form.sizes.map((s) => (s.label === label ? { ...s, stock } : s)),
    });

  const toggleColor = (c: ProductColor) => {
    const exists = form.colors.find((x) => x.name === c.name);
    setForm({
      ...form,
      colors: exists
        ? form.colors.filter((x) => x.name !== c.name)
        : [...form.colors, c],
    });
  };

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-[320px]">
          <SearchIcon
            width={15}
            height={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8a]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию или бренду"
            className="h-11 w-full border border-black/12 pl-10 pr-3 text-[13px] outline-none focus:border-[#111]"
          />
        </div>
        <button
          onClick={startCreate}
          className="btn-red flex items-center gap-2 px-7 py-3.5 text-[11.5px] font-bold tracking-[0.16em] text-white"
        >
          <PlusIcon width={15} height={15} /> ДОБАВИТЬ ТОВАР
        </button>
      </div>

      <div className="overflow-x-auto border border-black/[0.08]">
        <table className="w-full min-w-[840px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-black/[0.08] text-[10.5px] tracking-[0.14em] text-[#8a8a8a]">
              <th className="p-4">ФОТО</th>
              <th className="p-4">НАЗВАНИЕ</th>
              <th className="p-4">КАТЕГОРИЯ</th>
              <th className="p-4">ЦЕНА</th>
              <th className="p-4">ОСТАТОК</th>
              <th className="p-4">СТАТУС</th>
              <th className="p-4 text-right">ДЕЙСТВИЯ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const stock = p.sizes.reduce((n, s) => n + s.stock, 0);
              return (
                <tr
                  key={p.id}
                  className="border-b border-black/[0.06] last:border-b-0 hover:bg-[#fafafa]"
                >
                  <td className="p-3">
                    <div className="h-14 w-12 overflow-hidden bg-[#f3f3f4]">
                      {p.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.images[0]}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-[11.5px] text-[#8a8a8a]">{p.brand}</p>
                  </td>
                  <td className="p-4 text-[#8a8a8a]">{categoryLabel(p.category)}</td>
                  <td className="p-4">
                    <p className="font-bold">{formatPrice(p.price)}</p>
                    {p.oldPrice ? (
                      <p className="text-[11.5px] text-[#8a8a8a] line-through">
                        {formatPrice(p.oldPrice)}
                      </p>
                    ) : null}
                  </td>
                  <td
                    className={cx(
                      "p-4 font-semibold",
                      stock === 0 ? "text-[#e50000]" : stock < 20 ? "text-amber-600" : "",
                    )}
                  >
                    {stock} шт.
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(p)}
                      className={cx(
                        "px-2.5 py-1 text-[11px] font-bold",
                        p.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-[#f0f0f2] text-[#8a8a8a]",
                      )}
                    >
                      {p.isActive ? "В продаже" : "Скрыт"}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/product/${p.slug}`}
                        className="text-[11.5px] font-bold tracking-[0.12em] text-[#8a8a8a] hover:text-[#111]"
                      >
                        СМОТРЕТЬ
                      </Link>
                      <button
                        onClick={() => startEdit(p)}
                        className="text-[11.5px] font-bold tracking-[0.12em] hover:text-[#e50000]"
                      >
                        ИЗМЕНИТЬ
                      </button>
                      <button
                        onClick={() => remove(p)}
                        aria-label="Удалить"
                        className="text-[#8a8a8a] transition-colors hover:text-[#e50000]"
                      >
                        <TrashIcon width={16} height={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Модальное окно добавления/редактирования */}
      {open ? (
        <div className="fixed inset-0 z-[130] flex items-end justify-center sm:items-center sm:p-6">
          <button
            aria-label="Закрыть"
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div className="animate-fade-up relative max-h-[92vh] w-full max-w-[860px] overflow-y-auto bg-white p-6 sm:p-9">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5"
              aria-label="Закрыть"
            >
              <CloseIcon />
            </button>
            <p className="eyebrow text-[#e50000]">
              {editing ? "Редактирование" : "Новая позиция"}
            </p>
            <h3 className="display mt-3 text-[30px]">
              {editing ? "ИЗМЕНИТЬ ТОВАР" : "ДОБАВИТЬ ТОВАР"}
            </h3>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <Input
                label="Название *"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                className="sm:col-span-2"
              />
              <label className="block">
                <span className="eyebrow text-[#8a8a8a]">Бренд</span>
                <input
                  list="brands-list"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="mt-2 h-12 w-full border border-black/15 px-3 text-[13.5px] outline-none focus:border-[#111]"
                />
                <datalist id="brands-list">
                  {BRANDS.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </label>
              <Select
                label="Категория"
                value={form.category}
                onChange={(v) => setForm({ ...form, category: v, sizes: [] })}
                options={CATEGORIES.map((c) => ({ value: c.slug, label: c.label }))}
              />
              <Select
                label="Пол"
                value={form.gender}
                onChange={(v) => setForm({ ...form, gender: v })}
                options={GENDERS}
              />
              <Input
                label="Цена, ₽ *"
                type="number"
                value={String(form.price || "")}
                onChange={(v) => setForm({ ...form, price: Number(v) || 0 })}
              />
              <Input
                label="Старая цена, ₽ (для скидки)"
                type="number"
                value={String(form.oldPrice || "")}
                onChange={(v) => setForm({ ...form, oldPrice: Number(v) || 0 })}
              />
              <Input
                label="Рейтинг ×10 (например 47 = 4.7)"
                type="number"
                value={String(form.rating)}
                onChange={(v) => setForm({ ...form, rating: Number(v) || 45 })}
              />
              <Input
                label="Краткое описание"
                value={form.shortDescription}
                onChange={(v) => setForm({ ...form, shortDescription: v })}
                className="sm:col-span-2"
              />
              <Textarea
                label="Полное описание"
                value={form.description}
                onChange={(v) => setForm({ ...form, description: v })}
                className="sm:col-span-2"
              />
              <Textarea
                label="Состав / материал"
                value={form.material}
                onChange={(v) => setForm({ ...form, material: v })}
              />
              <Textarea
                label="Уход"
                value={form.care}
                onChange={(v) => setForm({ ...form, care: v })}
              />
            </div>

            {/* ===== НОВЫЙ БЛОК С ФОТО (с загрузкой из галереи) ===== */}
            <div className="mt-7">
              <p className="eyebrow text-[#8a8a8a]">📸 Фотографии товара</p>
              <p className="mt-1 text-[11px] text-[#8a8a8a]">
                Загрузите фото из галереи или вставьте ссылку
              </p>

              {/* Drag & Drop зона для быстрой загрузки нескольких фото */}
              <label
                className={cx(
                  "mt-3 block w-full cursor-pointer border-2 border-dashed border-black/10 p-4 text-center transition-colors",
                  "hover:border-[#e50000] hover:bg-[#fff5f5]"
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      uploadMultipleImages(e.target.files);
                    }
                  }}
                />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[24px]">📤</span>
                  <span className="text-[12px] font-semibold">
                    Перетащите фото или нажмите для выбора
                  </span>
                  <span className="text-[10px] text-[#8a8a8a]">
                    JPEG, PNG, WEBP до 5MB
                  </span>
                </div>
              </label>

              {/* Список полей для фото */}
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {form.images.map((img, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    {/* Превью */}
                    <div className="h-16 w-14 shrink-0 overflow-hidden bg-[#f3f3f4] border border-black/5 rounded">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[#ccc] text-[10px]">
                          №{i + 1}
                        </div>
                      )}
                    </div>

                    {/* Поле ввода URL */}
                    <input
                      value={img}
                      placeholder={`Ссылка на фото ${i + 1}`}
                      onChange={(e) => {
                        const next = form.images.slice();
                        next[i] = e.target.value;
                        setForm({ ...form, images: next });
                      }}
                      className="h-10 min-w-0 flex-1 border border-black/15 px-3 text-[12.5px] outline-none focus:border-[#111]"
                    />

                    {/* Кнопка загрузки из галереи */}
                    <label className="shrink-0 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadImage(file, i);
                        }}
                      />
                      <button
                        type="button"
                        disabled={uploading === i}
                        className={cx(
                          "border px-3 py-1.5 text-[10px] font-bold tracking-[0.08em] transition-colors min-w-[80px]",
                          uploading === i
                            ? "border-black/15 text-[#8a8a8a] cursor-wait"
                            : "hover:border-[#e50000] hover:text-[#e50000]"
                        )}
                      >
                        {uploading === i ? (
                          <SpinnerIcon width={14} height={14} />
                        ) : (
                          "📁 ЗАГРУЗИТЬ"
                        )}
                      </button>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 grid gap-7 sm:grid-cols-2">
              <div>
                <p className="eyebrow text-[#8a8a8a]">Цвета</p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {COLOR_OPTIONS.map((c) => {
                    const active = form.colors.some((x) => x.name === c.name);
                    return (
                      <button
                        key={c.name}
                        title={c.name}
                        onClick={() => toggleColor(c)}
                        className={cx(
                          "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                          active ? "scale-110 border-[#111]" : "border-black/10",
                        )}
                        style={{ backgroundColor: c.hex }}
                      >
                        {active ? (
                          <CheckIcon
                            width={13}
                            height={13}
                            className={
                              LIGHT_HEX.includes(c.hex) ? "text-[#111]" : "text-white"
                            }
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="eyebrow text-[#8a8a8a]">Размеры и остатки</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sizeSet.map((label) => {
                    const active = form.sizes.some((s) => s.label === label);
                    return (
                      <button
                        key={label}
                        onClick={() => toggleSize(label)}
                        className={cx(
                          "min-w-[52px] border px-3 py-2 text-[12px] font-semibold transition-all",
                          active
                            ? "border-[#111] bg-[#111] text-white"
                            : "border-black/15 hover:border-[#111]",
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {form.sizes.length ? (
                  <div className="mt-3 space-y-2">
                    {form.sizes.map((s) => (
                      <div key={s.label} className="flex items-center gap-3">
                        <span className="w-16 text-[12.5px] font-semibold">
                          {s.label}
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={s.stock}
                          onChange={(e) => setStock(s.label, Number(e.target.value) || 0)}
                          className="h-9 w-24 border border-black/15 px-2 text-[12.5px] outline-none focus:border-[#111]"
                        />
                        <span className="text-[11.5px] text-[#8a8a8a]">шт. на складе</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-6">
              <Toggle
                label="Новинка"
                active={form.isNew}
                onClick={() => setForm({ ...form, isNew: !form.isNew })}
              />
              <Toggle
                label="Хит продаж"
                active={form.isBestseller}
                onClick={() => setForm({ ...form, isBestseller: !form.isBestseller })}
              />
              <Toggle
                label="Показывать на сайте"
                active={form.isActive}
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={save}
                disabled={saving}
                className="btn-red flex items-center gap-2 px-9 py-4 text-[12px] font-bold tracking-[0.18em] text-white"
              >
                {saving ? <SpinnerIcon width={16} height={16} /> : null}
                {editing ? "СОХРАНИТЬ ИЗМЕНЕНИЯ" : "ДОБАВИТЬ ТОВАР"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="border border-[#111] px-9 py-4 text-[12px] font-bold tracking-[0.18em] transition-colors hover:bg-[#111] hover:text-white"
              >
                ОТМЕНА
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

/* ------------------------------- ВОПРОСЫ ------------------------------- */

function QuestionsTab({
  items,
  onReload,
}: {
  items: QuestionDTO[];
  onReload: () => Promise<void>;
}) {
  const { pushToast } = useStore();
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [busy, setBusy] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "answered">("new");

  const list = items.filter((q) => (filter === "all" ? true : q.status === filter));

  const answer = async (q: QuestionDTO) => {
    const text = (drafts[q.id] ?? q.answer).trim();
    if (text.length < 2) {
      pushToast({ title: "Напишите ответ", tone: "error" });
      return;
    }
    setBusy(q.id);
    const res = await fetch(`/api/admin/questions/${q.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: text }),
    });
    setBusy(null);
    if (res.ok) {
      pushToast({
        title: "Ответ опубликован",
        description: "Покупатель увидит его на странице товара",
        tone: "success",
      });
      await onReload();
    }
  };

  const remove = async (q: QuestionDTO) => {
    await fetch(`/api/admin/questions/${q.id}`, { method: "DELETE" });
    pushToast({ title: "Вопрос удалён", tone: "info" });
    await onReload();
  };

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {(
          [
            ["new", "Без ответа"],
            ["answered", "Отвеченные"],
            ["all", "Все"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={cx(
              "border px-5 py-2.5 text-[12px] font-semibold transition-all",
              filter === id
                ? "border-[#111] bg-[#111] text-white"
                : "border-black/12 hover:border-[#111]",
            )}
          >
            {label} ({items.filter((q) => (id === "all" ? true : q.status === id)).length})
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="border border-dashed border-black/12 py-20 text-center">
          <p className="text-[16px] font-bold">Вопросов нет</p>
          <p className="mt-2 text-[13px] text-[#8a8a8a]">
            Здесь появятся вопросы, которые покупатели задают на страницах товаров.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((q) => (
            <article key={q.id} className="border border-black/[0.08] p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cx(
                        "px-2.5 py-1 text-[10.5px] font-bold tracking-[0.12em]",
                        q.status === "new"
                          ? "bg-[#e50000] text-white"
                          : "bg-emerald-100 text-emerald-700",
                      )}
                    >
                      {q.status === "new" ? "НУЖЕН ОТВЕТ" : "ОТВЕЧЕН"}
                    </span>
                    <Link
                      href={`/product/${q.productSlug}`}
                      className="text-[12.5px] font-semibold hover:text-[#e50000]"
                    >
                      {q.productName || q.productSlug}
                    </Link>
                  </div>
                  <p className="mt-3 text-[15px] font-semibold leading-snug">
                    «{q.question}»
                  </p>
                  <p className="mt-2 text-[12px] text-[#8a8a8a]">
                    {q.author}
                    {q.email ? ` · ${q.email}` : ""} · {formatDateTime(q.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => remove(q)}
                  aria-label="Удалить"
                  className="p-1.5 text-[#8a8a8a] transition-colors hover:text-[#e50000]"
                >
                  <TrashIcon width={16} height={16} />
                </button>
              </div>

              <div className="mt-5">
                <p className="eyebrow text-[#8a8a8a]">Ваш ответ</p>
                <textarea
                  rows={3}
                  value={drafts[q.id] ?? q.answer}
                  onChange={(e) => setDrafts({ ...drafts, [q.id]: e.target.value })}
                  placeholder="Напишите ответ — он появится на странице товара для всех покупателей"
                  className="mt-2 w-full resize-y border border-black/15 p-3 text-[13.5px] leading-relaxed outline-none focus:border-[#111]"
                />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => answer(q)}
                    disabled={busy === q.id}
                    className="btn-red flex items-center gap-2 px-7 py-3 text-[11.5px] font-bold tracking-[0.16em] text-white"
                  >
                    {busy === q.id ? <SpinnerIcon width={15} height={15} /> : null}
                    {q.status === "answered" ? "ОБНОВИТЬ ОТВЕТ" : "ОПУБЛИКОВАТЬ ОТВЕТ"}
                  </button>
                  {q.answeredAt ? (
                    <span className="text-[11.5px] text-[#8a8a8a]">
                      Отвечено {formatDateTime(q.answeredAt)}
                    </span>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/* ------------------------------- ЗАКАЗЫ ------------------------------- */

function OrdersTab({
  orders,
  onReload,
}: {
  orders: OrderRow[];
  onReload: () => Promise<void>;
}) {
  const { pushToast } = useStore();

  const setStatus = async (o: OrderRow, status: string) => {
    await fetch(`/api/admin/orders/${o.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    pushToast({ title: `Заказ #${o.orderNumber}: ${status}`, tone: "success" });
    await onReload();
  };

  if (orders.length === 0) {
    return (
      <div className="border border-dashed border-black/12 py-20 text-center">
        <p className="text-[16px] font-bold">Заказов пока нет</p>
        <p className="mt-2 text-[13px] text-[#8a8a8a]">
          Оформите тестовый заказ на сайте, чтобы увидеть его здесь.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <article key={o.id} className="border border-black/[0.08] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[17px] font-extrabold tracking-tight">
                #{o.orderNumber}
              </p>
              <p className="mt-1 text-[12.5px] text-[#8a8a8a]">
                {formatDateTime(o.createdAt)} · {o.items.length}{" "}
                {plural(o.items.length, "позиция", "позиции", "позиций")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[20px] font-extrabold text-[#e50000]">
                {formatPrice(o.total)}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="eyebrow text-[#8a8a8a]">Покупатель</p>
              <p className="mt-2 text-[13.5px] leading-relaxed">
                {o.fullName}
                <br />
                {o.email}
                <br />
                {o.phone}
                <br />
                {o.city}, {o.address}
              </p>
            </div>
            <div>
              <p className="eyebrow text-[#8a8a8a]">Состав заказа</p>
              <ul className="mt-2 space-y-1 text-[13px]">
                {o.items.map((it, i) => (
                  <li key={i} className="flex justify-between gap-3">
                    <span className="truncate">
                      {it.name} · {it.size} × {it.quantity}
                    </span>
                    <span className="shrink-0 font-semibold">
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {ORDER_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(o, s)}
                className={cx(
                  "border px-4 py-2 text-[11.5px] font-semibold transition-all",
                  o.status === s
                    ? "border-[#111] bg-[#111] text-white"
                    : "border-black/12 hover:border-[#111]",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

/* ------------------------------- ПОЛЯ ------------------------------- */

function Input({
  label,
  value,
  onChange,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <label className={cx("block", className)}>
      <span className="eyebrow text-[#8a8a8a]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-12 w-full border border-black/15 px-3 text-[13.5px] outline-none focus:border-[#111]"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={cx("block", className)}>
      <span className="eyebrow text-[#8a8a8a]">{label}</span>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full resize-y border border-black/15 p-3 text-[13.5px] leading-relaxed outline-none focus:border-[#111]"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="eyebrow text-[#8a8a8a]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-12 w-full border border-black/15 bg-white px-3 text-[13.5px] outline-none focus:border-[#111]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
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
    <button onClick={onClick} className="flex items-center gap-3 text-[13.5px]">
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
      {label}
    </button>
  );
}
