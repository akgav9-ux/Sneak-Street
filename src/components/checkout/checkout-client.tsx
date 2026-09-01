"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/components/store";
import { cx, formatPrice } from "@/lib/format";
import { COUPON_KEY, SHIPPING_METHODS, computeTotals } from "@/lib/pricing";
import {
  ArrowLeft,
  CheckIcon,
  ShieldIcon,
  SpinnerIcon,
} from "@/components/icons";

const COUNTRIES = [
  "Россия",
  "Казахстан",
  "Беларусь",
  "Армения",
  "Грузия",
  "Узбекистан",
  "Германия",
  "Польша",
  "Сербия",
  "ОАЭ",
  "Турция",
  "Кипр",
];

const PAYMENTS = [
  { id: "card", label: "Карта" },
  { id: "sbp", label: "СБП" },
  { id: "applepay", label: "Apple Pay" },
  { id: "cash", label: "При получении" },
];

type Form = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  save: boolean;
};

export function CheckoutClient() {
  const router = useRouter();
  const { cart, subtotal, clearCart, profile, addresses, ready, pushToast } =
    useStore();

  const [step, setStep] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [payment, setPayment] = useState("card");
  const [coupon, setCoupon] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  const [form, setForm] = useState<Form>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Россия",
    save: true,
  });

  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", save: true });
  const [billingSame, setBillingSame] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setShowAll(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    setCoupon(window.localStorage.getItem(COUPON_KEY));
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const def = addresses.find((a) => a.isDefault) ?? addresses[0];
    setForm((f) => ({
      ...f,
      fullName: f.fullName || profile.name,
      email: f.email || profile.email,
      phone: f.phone || profile.phone,
      address: f.address || def?.street || "",
      city: f.city || def?.city || "",
      postalCode: f.postalCode || def?.postalCode || "",
      country: def?.country || f.country,
    }));
  }, [ready, profile, addresses]);

  const totals = useMemo(
    () => computeTotals(subtotal, coupon, shippingMethod),
    [subtotal, coupon, shippingMethod],
  );

  const errors = useMemo(() => {
    const e: Partial<Record<keyof Form | "card", string>> = {};
    if (form.fullName.trim().length < 3) e.fullName = "Укажите имя и фамилию";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Введите корректный e-mail";
    if (form.phone.replace(/\D/g, "").length < 7) e.phone = "Введите корректный телефон";
    if (form.address.trim().length < 5) e.address = "Укажите улицу и дом";
    if (form.city.trim().length < 2) e.city = "Укажите город";
    if (form.postalCode.trim().length < 3) e.postalCode = "Укажите индекс";
    if (payment === "card") {
      const digits = card.number.replace(/\D/g, "");
      if (digits.length < 15 || !/^\d{2}\/\d{2}$/.test(card.expiry) || card.cvc.length < 3)
        e.card = "Заполните данные карты";
    }
    return e;
  }, [form, card, payment]);

  const shippingValid =
    !errors.fullName &&
    !errors.email &&
    !errors.phone &&
    !errors.address &&
    !errors.city &&
    !errors.postalCode;
 const isValid = shippingValid && (payment === "cash" || !errors.card) && cart.length > 0;

 const placeOrder = async () => {
  setTouched(true);
  
  // Проверяем, что все поля заполнены
  if (!shippingValid) {
    pushToast({
      title: "Проверьте данные",
      description: "Некоторые обязательные поля не заполнены.",
      tone: "error",
    });
    setStep(1);
    return;
  }

  // ✅ Если оплата при получении — не проверяем карту!
  if (payment !== "cash") {
    // Проверяем карту ТОЛЬКО если НЕ cash
    if (errors.card) {
      pushToast({
        title: "Проверьте данные карты",
        description: errors.card,
        tone: "error",
      });
      return;
    }
  }

  // ✅ Если оплата при получении — пропускаем проверку карты
  if (cart.length === 0) {
    pushToast({
      title: "Корзина пуста",
      description: "Добавьте товары перед оформлением.",
      tone: "error",
    });
    return;
  }

  setSubmitting(true);
  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        country: form.country,
        shippingMethod,
        paymentMethod: payment,
        items: cart.map((c) => ({
          slug: c.slug,
          name: c.name,
          brand: c.brand,
          image: c.image,
          size: c.size,
          color: c.color,
          price: c.price,
          quantity: c.quantity,
        })),
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        discount: totals.discount,
        total: totals.total,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.order) {
      console.error("Order error:", data);
      throw new Error(data.error || "Ошибка оформления заказа");
    }

    clearCart();
    window.localStorage.removeItem(COUPON_KEY);
    router.push(`/checkout/success?order=${data.order.orderNumber}`);
  } catch (error) {
    console.error("Checkout error:", error);
    setSubmitting(false);
    pushToast({
      title: "Ошибка оформления заказа",
      description: error instanceof Error ? error.message : "Попробуйте ещё раз через минуту.",
      tone: "error",
    });
  }
};

  if (ready && cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 py-24 text-center md:px-8">
        <h1 className="display text-[clamp(30px,4vw,48px)]">НЕЧЕГО ОФОРМЛЯТЬ</h1>
        <p className="mt-4 max-w-[380px] text-[14px] text-[#8a8a8a]">
          Корзина пуста. Добавьте пару вещей и возвращайтесь — промокод подождёт.
        </p>
        <Link
          href="/catalog"
          className="btn-red mt-8 px-9 py-4 text-[12px] font-bold tracking-[0.2em] text-white"
        >
          ПЕРЕЙТИ В КАТАЛОГ
        </Link>
      </div>
    );
  }

  const visible = (n: number) => showAll || step === n;

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-10 md:px-8 lg:px-12">
      <nav className="flex items-center gap-2 text-[11.5px] tracking-[0.12em] text-[#8a8a8a]">
        <Link href="/" className="hover:text-[#111]">
          ГЛАВНАЯ
        </Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-[#111]">
          КОРЗИНА
        </Link>
        <span>/</span>
        <span className="text-[#111]">ОФОРМЛЕНИЕ</span>
      </nav>

      <h1 className="display mt-5 text-[clamp(32px,4.6vw,56px)]">ОФОРМЛЕНИЕ ЗАКАЗА</h1>

      {/* stepper */}
      <div className="mt-8 hidden items-center gap-4 md:flex">
        {["Данные получателя", "Способ доставки", "Оплата"].map((label, i) => {
          const n = i + 1;
          const done = step > n;
          return (
            <button
              key={label}
              onClick={() => setStep(n)}
              className="flex flex-1 items-center gap-3"
            >
              <span
                className={cx(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[12.5px] font-bold transition-all duration-300",
                  done
                    ? "border-[#111] bg-[#111] text-white"
                    : step === n
                      ? "border-[#e50000] bg-[#e50000] text-white"
                      : "border-black/15 text-[#8a8a8a]",
                )}
              >
                {done ? <CheckIcon width={15} height={15} /> : n}
              </span>
              <span
                className={cx(
                  "text-left text-[12.5px] font-bold tracking-[0.1em]",
                  step === n ? "text-[#111]" : "text-[#8a8a8a]",
                )}
              >
                {label.toUpperCase()}
              </span>
              {n < 3 ? <span className="h-px flex-1 bg-black/10" /> : null}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          {/* STEP 1 */}
          <section
            className={cx(
              "border border-black/[0.08] p-6 md:p-8",
              !visible(1) && "hidden",
            )}
          >
            <p className="eyebrow text-[#e50000]">Шаг 1</p>
            <h2 className="mt-2 text-[20px] font-bold tracking-tight">
              Данные получателя
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                label="Имя и фамилия"
                value={form.fullName}
                onChange={(v) => setForm({ ...form, fullName: v })}
                error={touched ? errors.fullName : undefined}
                className="sm:col-span-2"
              />
              <Field
                label="E-mail"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                error={touched ? errors.email : undefined}
              />
              <Field
                label="Телефон"
                type="tel"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                error={touched ? errors.phone : undefined}
              />
              <Field
                label="Улица, дом, квартира"
                value={form.address}
                onChange={(v) => setForm({ ...form, address: v })}
                error={touched ? errors.address : undefined}
                className="sm:col-span-2"
              />
              <Field
                label="Город"
                value={form.city}
                onChange={(v) => setForm({ ...form, city: v })}
                error={touched ? errors.city : undefined}
              />
              <Field
                label="Почтовый индекс"
                value={form.postalCode}
                onChange={(v) => setForm({ ...form, postalCode: v })}
                error={touched ? errors.postalCode : undefined}
              />
              <label className="sm:col-span-2">
                <span className="eyebrow text-[#8a8a8a]">Страна</span>
                <select
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="mt-2 h-12 w-full border border-black/15 bg-white px-3 text-[13.5px] outline-none focus:border-[#111]"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>

            <Check
              checked={form.save}
              onChange={(v) => setForm({ ...form, save: v })}
              label="Сохранить данные для следующего заказа"
              className="mt-5"
            />

            <div className="mt-7 hidden md:block">
              <button
                onClick={() => {
                  setTouched(true);
                  if (shippingValid) setStep(2);
                }}
                className="bg-[#111] px-8 py-4 text-[12px] font-bold tracking-[0.18em] text-white transition-colors hover:bg-[#e50000]"
              >
                ПЕРЕЙТИ К ДОСТАВКЕ
              </button>
            </div>
          </section>

          {/* STEP 2 */}
          <section
            className={cx(
              "border border-black/[0.08] p-6 md:p-8",
              !visible(2) && "hidden",
            )}
          >
            <p className="eyebrow text-[#e50000]">Шаг 2</p>
            <h2 className="mt-2 text-[20px] font-bold tracking-tight">
              Способ доставки
            </h2>

            <div className="mt-6 space-y-3">
              {SHIPPING_METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setShippingMethod(m.id)}
                  className={cx(
                    "flex w-full items-center justify-between border p-4 text-left transition-all duration-300",
                    shippingMethod === m.id
                      ? "border-[#111] bg-[#fafafa]"
                      : "border-black/12 hover:border-[#111]",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cx(
                        "flex h-5 w-5 items-center justify-center rounded-full border transition-all",
                        shippingMethod === m.id
                          ? "border-[#e50000] bg-[#e50000]"
                          : "border-black/25",
                      )}
                    >
                      {shippingMethod === m.id ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      ) : null}
                    </span>
                    <span>
                      <span className="block text-[14px] font-bold">{m.label}</span>
                      <span className="block text-[12.5px] text-[#8a8a8a]">
                        {m.detail}
                      </span>
                    </span>
                  </span>
                  <span className="text-[14px] font-bold">
                    {m.id === "standard" && totals.subtotal >= 5000
                      ? "Бесплатно"
                      : formatPrice(m.price)}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-7 hidden gap-3 md:flex">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 border border-[#111] px-6 py-4 text-[12px] font-bold tracking-[0.18em] transition-colors hover:bg-[#111] hover:text-white"
              >
                <ArrowLeft width={15} height={15} /> НАЗАД
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-[#111] px-8 py-4 text-[12px] font-bold tracking-[0.18em] text-white transition-colors hover:bg-[#e50000]"
              >
                ПЕРЕЙТИ К ОПЛАТЕ
              </button>
            </div>
          </section>

          {/* STEP 3 */}
          <section
            className={cx(
              "border border-black/[0.08] p-6 md:p-8",
              !visible(3) && "hidden",
            )}
          >
            <p className="eyebrow text-[#e50000]">Шаг 3</p>
            <h2 className="mt-2 text-[20px] font-bold tracking-tight">Оплата</h2>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PAYMENTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPayment(p.id)}
                  className={cx(
                    "border py-3 text-[12px] font-bold tracking-[0.1em] transition-all duration-300",
                    payment === p.id
                      ? "border-[#111] bg-[#111] text-white"
                      : "border-black/12 hover:border-[#111]",
                  )}
                >
                  {p.label.toUpperCase()}
                </button>
              ))}
            </div>

            {payment === "card" ? (
              <div className="animate-fade-in mt-6 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Номер карты"
                  value={card.number}
                  placeholder="4242 4242 4242 4242"
                  onChange={(v) =>
                    setCard({
                      ...card,
                      number: v
                        .replace(/\D/g, "")
                        .slice(0, 16)
                        .replace(/(.{4})/g, "$1 ")
                        .trim(),
                    })
                  }
                  error={touched ? errors.card : undefined}
                  className="sm:col-span-2"
                />
                <Field
                  label="Срок (ММ/ГГ)"
                  value={card.expiry}
                  placeholder="04/28"
                  onChange={(v) => {
                    const d = v.replace(/\D/g, "").slice(0, 4);
                    setCard({
                      ...card,
                      expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d,
                    });
                  }}
                />
                <Field
                  label="CVC"
                  value={card.cvc}
                  placeholder="123"
                  onChange={(v) => setCard({ ...card, cvc: v.replace(/\D/g, "").slice(0, 4) })}
                />
                <Check
                  checked={card.save}
                  onChange={(v) => setCard({ ...card, save: v })}
                  label="Сохранить карту для следующих покупок"
                  className="sm:col-span-2"
                />
                <Check
                  checked={billingSame}
                  onChange={setBillingSame}
                  label="Адрес плательщика совпадает с адресом доставки"
                  className="sm:col-span-2"
                />
              </div>
            ) : (
              <div className="animate-fade-in mt-6 border border-dashed border-black/15 p-6 text-center">
                <p className="text-[14px] font-semibold">
                  Вы перейдёте к подтверждению оплаты:{" "}
                  {PAYMENTS.find((p) => p.id === payment)?.label}.
                </p>
                <p className="mt-2 text-[12.5px] text-[#8a8a8a]">
                  Данные карты не хранятся на наших серверах.
                </p>
              </div>
            )}

            <div className="mt-7 border-t border-black/[0.07] pt-6">
              <dl className="space-y-2 text-[13.5px]">
                <SummaryRow label="Товары" value={formatPrice(totals.subtotal)} />
                {totals.discount ? (
                  <SummaryRow
                    label="Скидка"
                    value={`−${formatPrice(totals.discount)}`}
                    accent
                  />
                ) : null}
                <SummaryRow
                  label="Доставка"
                  value={
                    totals.shipping === 0 ? "Бесплатно" : formatPrice(totals.shipping)
                  }
                />
              </dl>
            </div>

            <button
              onClick={placeOrder}
              disabled={submitting || (touched && !isValid)}
              className={cx(
                "btn-red mt-6 flex w-full items-center justify-center gap-2.5 py-4 text-[12.5px] font-bold tracking-[0.2em] text-white transition-transform duration-300 hover:-translate-y-0.5",
                (submitting || (touched && !isValid)) &&
                  "cursor-not-allowed opacity-60 hover:translate-y-0",
              )}
            >
              {submitting ? (
                <>
                  <SpinnerIcon width={17} height={17} /> ПРОВОДИМ ОПЛАТУ…
                </>
              ) : (
                <>ОФОРМИТЬ ЗАКАЗ · {formatPrice(totals.total)}</>
              )}
            </button>

            <p className="mt-4 flex items-center justify-center gap-2 text-[11.5px] text-[#8a8a8a]">
              <ShieldIcon width={15} height={15} /> Защищено 256-битным SSL-шифрованием
            </p>
          </section>
        </div>

        {/* summary */}
        <aside className="h-fit lg:sticky lg:top-28">
          <div className="border border-black/[0.08] p-6">
            <p className="text-[13px] font-bold tracking-[0.16em]">
              ВАШ ЗАКАЗ ({cart.length})
            </p>
            <ul className="mt-5 space-y-4">
              {cart.map((item) => (
                <li
                  key={`${item.slug}-${item.size}-${item.color}`}
                  className="flex gap-3"
                >
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-[#f3f3f4]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center bg-[#111] text-[10px] font-bold text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">{item.name}</p>
                    <p className="mt-0.5 text-[11.5px] text-[#8a8a8a]">
                      {item.size} · {item.color}
                    </p>
                  </div>
                  <p className="text-[13px] font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2.5 border-t border-black/[0.07] pt-5 text-[13.5px]">
              <SummaryRow label="Товары" value={formatPrice(totals.subtotal)} />
              {totals.discount ? (
                <SummaryRow
                  label={`Скидка (${coupon})`}
                  value={`−${formatPrice(totals.discount)}`}
                  accent
                />
              ) : null}
              <SummaryRow
                label="Доставка"
                value={
                  totals.shipping === 0 ? "Бесплатно" : formatPrice(totals.shipping)
                }
              />
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t border-black/[0.07] pt-5">
              <span className="text-[13px] font-bold tracking-[0.14em]">ИТОГО</span>
              <span className="text-[26px] font-extrabold tracking-tight text-[#e50000]">
                {formatPrice(totals.total)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={cx("block", className)}>
      <span className="eyebrow text-[#8a8a8a]">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cx(
          "mt-2 h-12 w-full border px-3 text-[13.5px] outline-none transition-colors",
          error ? "border-[#e50000]" : "border-black/15 focus:border-[#111]",
        )}
      />
      {error ? (
        <span className="mt-1.5 block text-[11.5px] font-semibold text-[#e50000]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function Check({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cx("flex items-center gap-3 text-left text-[13px]", className)}
    >
      <span
        className={cx(
          "flex h-[18px] w-[18px] items-center justify-center border transition-all",
          checked ? "border-[#111] bg-[#111] text-white" : "border-black/25",
        )}
      >
        {checked ? <CheckIcon width={12} height={12} /> : null}
      </span>
      {label}
    </button>
  );
}

function SummaryRow({
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
