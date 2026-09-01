import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogClient } from "@/components/catalog/catalog-client";

export const metadata: Metadata = {
  title: "Каталог — SNEAK&STREET",
  description:
    "Кроссовки, худи, футболки, деним и верхняя одежда. Фильтры по размеру, цвету, бренду и цене.",
};

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 lg:px-12">
          <div className="skeleton h-10 w-64" />
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton aspect-[4/5] w-full" />
                <div className="skeleton mt-3 h-3 w-24" />
                <div className="skeleton mt-2 h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <CatalogClient />
    </Suspense>
  );
}
