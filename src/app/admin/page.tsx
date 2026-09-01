import type { Metadata } from "next";
import { AdminClient } from "@/components/admin/admin-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Админ-панель — SNEAK&STREET",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
