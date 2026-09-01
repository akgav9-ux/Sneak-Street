"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cx } from "@/lib/format";
import { ArrowRight } from "@/components/icons";

const SLIDES = [
  {
    label: "Мужское · Худи",
    caption: "Худи Heavyweight Boxy",
    href: "/product/heavyweight-boxy-hoodie-black",
  },
  {
    label: "Женское · Флис",
    caption: "Укороченное худи на молнии",
    href: "/product/cropped-zip-hoodie-white",
  },
  {
    label: "Унисекс · Кроссовки",
    caption: "Air Force 1 '07 Triple White",
    href: "/product/air-force-1-07-triple-white",
  },
];

function useCountdown(targetMs: number) {
  const [left, setLeft] = useState(targetMs);
  useEffect(() => {
    const end = Date.now() + targetMs;
    const t = window.setInterval(() => {
      setLeft(Math.max(0, end - Date.now()));
    }, 1000);
    return () => window.clearInterval(t);
  }, [targetMs]);
  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return [h, m, s].map((v) => String(v).padStart(2, "0"));
}

export function Hero({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [h, m, s] = useCountdown(2 * 3600000 + 14 * 60000 + 38 * 1000);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const t = window.setInterval(
      () => setActive((a) => (a + 1) % SLIDES.length),
      5000,
    );
    return () => window.clearInterval(t);
  }, []);

  return (
    <section className="relative grid min-h-[560px] grid-cols-1 lg:min-h-[calc(90vh-148px)] lg:grid-cols-2">
      {/* left */}
      <div className="relative z-10 flex flex-col justify-center bg-[#111] px-6 py-16 text-white sm:px-10 lg:px-14 xl:px-20">
        <div className="animate-fade-up">
          <span className="eyebrow inline-flex items-center gap-2 text-[#e50000]">
            <span className="h-[6px] w-[6px] rounded-full bg-[#e50000]" />
            Новая коллекция 2026
          </span>
          <h1 className="display mt-6 text-[clamp(46px,8.2vw,104px)]">
            НАЙДИ
            <br />
            СВОЙ
            <br />
            <span className="text-[#e50000]">СТИЛЬ</span>
          </h1>
          <p className="mt-6 max-w-[420px] text-[14.5px] leading-relaxed text-white/60">
            Streetwear для города. Плотный футер, архивные силуэты и те самые
            кроссовки, про которые все спрашивают — доставка за 3–5 дней.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/catalog"
              className="btn-red group flex items-center gap-3 px-8 py-4 text-[12px] font-bold tracking-[0.2em] text-white transition-transform duration-300 hover:-translate-y-0.5"
            >
              В КАТАЛОГ
              <ArrowRight
                width={17}
                height={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/catalog?new=1"
              className="border border-white/25 px-8 py-4 text-[12px] font-bold tracking-[0.2em] transition-colors hover:border-white hover:bg-white hover:text-[#111]"
            >
              НОВИНКИ
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-8">
            <div>
              <p className="eyebrow text-white/40">До конца акции</p>
              <div className="mt-2 flex items-center gap-1.5 font-mono text-[26px] font-bold tabular-nums">
                {mounted ? (
                  <>
                    <span className="bg-white/10 px-2.5 py-1">{h}</span>
                    <span className="text-[#e50000]">:</span>
                    <span className="bg-white/10 px-2.5 py-1">{m}</span>
                    <span className="text-[#e50000]">:</span>
                    <span className="bg-white/10 px-2.5 py-1">{s}</span>
                  </>
                ) : (
                  <span className="bg-white/10 px-2.5 py-1">02:14:38</span>
                )}
              </div>
            </div>
            <div className="hidden h-12 w-px bg-white/15 sm:block" />
            <div className="flex gap-8">
              <div>
                <p className="text-[22px] font-extrabold">32k+</p>
                <p className="text-[11px] tracking-[0.14em] text-white/40">
                  ЗАКАЗОВ ДОСТАВЛЕНО
                </p>
              </div>
              <div>
                <p className="text-[22px] font-extrabold">4.8★</p>
                <p className="text-[11px] tracking-[0.14em] text-white/40">
                  СРЕДНЯЯ ОЦЕНКА
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* right */}
      <div className="relative min-h-[420px] overflow-hidden bg-[#f7f7f8] lg:min-h-full">
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={SLIDES[i]?.caption ?? "Лукбук"}
            className={cx(
              "absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-out",
              i === active ? "scale-100 opacity-100" : "scale-105 opacity-0",
            )}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        {/* floating discount tag */}
        <div className="absolute right-5 top-5 rotate-3 bg-[#e50000] px-4 py-3 text-white shadow-[0_16px_40px_-12px_rgba(229,0,0,0.7)] sm:right-8 sm:top-8">
          <p className="text-[26px] font-extrabold leading-none tracking-tight">
            −30%
          </p>
          <p className="mt-1 text-[10px] font-bold tracking-[0.16em]">
            НА ПЕРВЫЙ ЗАКАЗ
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-8">
          <Link href={SLIDES[active].href} className="group text-white">
            <p className="eyebrow text-white/70">{SLIDES[active].label}</p>
            <p className="mt-1 flex items-center gap-2 text-[17px] font-bold tracking-tight">
              {SLIDES[active].caption}
              <ArrowRight
                width={16}
                height={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </p>
          </Link>
          <div className="flex gap-2">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.caption}
                type="button"
                aria-label={`Слайд ${i + 1}`}
                onClick={() => setActive(i)}
                className={cx(
                  "h-[3px] transition-all duration-300",
                  i === active ? "w-10 bg-white" : "w-5 bg-white/40",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
