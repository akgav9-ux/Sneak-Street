import type { Metadata } from "next";
import { CartClient } from "@/components/cart/cart-client";

export const metadata: Metadata = {
  title: "Корзина — SNEAK&STREET",
};

export default function CartPage() {
  return <CartClient />;
}
