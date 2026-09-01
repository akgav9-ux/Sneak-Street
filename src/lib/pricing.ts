export const SHIPPING_METHODS = [
  {
    id: "standard",
    label: "Стандартная доставка",
    detail: "3–5 рабочих дней",
    price: 490,
  },
  {
    id: "express",
    label: "Экспресс-доставка",
    detail: "1–2 рабочих дня",
    price: 990,
  },
  {
    id: "nextday",
    label: "Доставка на следующий день",
    detail: "При заказе до 14:00",
    price: 1990,
  },
] as const;

export const COUPONS: Record<
  string,
  { type: "percent" | "fixed"; value: number; label: string }
> = {
  STREET30: { type: "percent", value: 30, label: "−30% на первый заказ" },
  SNEAK10: { type: "percent", value: 10, label: "−10% для участников клуба" },
  FLAT2000: { type: "fixed", value: 2000, label: "−2 000 ₽ на заказ" },
};

export const FREE_SHIPPING_THRESHOLD = 5000;
export const TAX_RATE = 0;

export const ORDER_STATUSES = [
  "Новый",
  "В обработке",
  "Отправлен",
  "Доставлен",
  "Отменён",
] as const;

export type Totals = {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
};

export function computeTotals(
  subtotal: number,
  couponCode?: string | null,
  shippingMethod: string = "standard",
): Totals {
  const coupon = couponCode ? COUPONS[couponCode.toUpperCase()] : undefined;
  const discount = !coupon
    ? 0
    : coupon.type === "percent"
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal);

  const discounted = Math.max(0, subtotal - discount);

  const method = SHIPPING_METHODS.find((m) => m.id === shippingMethod);
  let shipping: number = method ? method.price : 0;
  if (shippingMethod === "standard") {
    shipping =
      discounted >= FREE_SHIPPING_THRESHOLD || discounted === 0 ? 0 : 490;
  }

  const tax = Math.round(discounted * TAX_RATE);
  const total = discounted + shipping + tax;

  return { subtotal, discount, shipping, tax, total };
}

export const COUPON_KEY = "ss.coupon.v1";
