import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Оформление заказа — SNEAK&STREET",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
