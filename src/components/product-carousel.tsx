"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ProductDTO } from "@/db/queries";
import { cx } from "@/lib/format";
import { ProductCard } from "./product-card";
import { ArrowLeft, ArrowRight } from "./icons";

export function ProductCarousel({ products }: { products: ProductDTO[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12"
      >
        {products.map((p) => (
          <div
            key={p.slug}
            className="w-[68%] shrink-0 snap-start sm:w-[42%] md:w-[31%] lg:w-[23.5%] xl:w-[19%]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous"
        onClick={() => scrollBy(-1)}
        className={cx(
          "absolute -left-1 top-[34%] hidden h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.4)] transition-all duration-300 hover:bg-[#111] hover:text-white lg:flex",
          atStart && "pointer-events-none opacity-0",
        )}
      >
        <ArrowLeft width={17} height={17} />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => scrollBy(1)}
        className={cx(
          "absolute -right-1 top-[34%] hidden h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.4)] transition-all duration-300 hover:bg-[#111] hover:text-white lg:flex",
          atEnd && "pointer-events-none opacity-0",
        )}
      >
        <ArrowRight width={17} height={17} />
      </button>
    </div>
  );
}
