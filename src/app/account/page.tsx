import { Suspense } from "react";
import type { Metadata } from "next";
import { AccountClient } from "@/components/account/account-client";

export const metadata: Metadata = {
  title: "Личный кабинет — SNEAK&STREET",
};

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 lg:px-12">
          <div className="skeleton h-10 w-56" />
          <div className="mt-8 grid gap-10 lg:grid-cols-[280px_1fr]">
            <div className="skeleton h-96 w-full" />
            <div className="skeleton h-96 w-full" />
          </div>
        </div>
      }
    >
      <AccountClient />
    </Suspense>
  );
}
