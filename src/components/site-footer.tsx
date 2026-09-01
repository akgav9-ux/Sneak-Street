"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NewsletterForm } from "./newsletter-form";
import { InstagramIcon, TelegramIcon, YoutubeIcon } from "./icons";

const shop = [
  { label: "Мужское", href: "/catalog?gender=men" },
  { label: "Женское", href: "/catalog?gender=women" },
  { label: "Новинки", href: "/catalog?new=1" },
  { label: "Распродажа", href: "/catalog?sale=1" },
  { label: "Кроссовки", href: "/catalog?category=sneakers" },
];

const help = [
  { label: "Доставка", href: "/blog/care-guide-keep-your-white-sneakers-white" },
  { label: "Возврат", href: "/blog/care-guide-keep-your-white-sneakers-white" },
  { label: "Таблица размеров", href: "/blog/hoodie-fit-guide-oversized-vs-boxy" },
  { label: "Вопросы и ответы", href: "/blog" },
  { label: "Личный кабинет", href: "/account" },
  { label: "Админ-панель", href: "/admin" },
];

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 border-t border-white/10 bg-[#111] text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-[19px] font-extrabold tracking-[-0.03em]">
              SNEAK<span className="text-[#e50000]">&</span>STREET
            </p>
            <p className="mt-4 max-w-[280px] text-[13px] leading-relaxed text-white/55">
              Отобранный streetwear и кроссовки с доставкой по всему миру.
              Оригинальные вещи, редакционные образы, ничего лишнего — с 2019 года.
            </p>
            <div className="mt-6 flex gap-2">
              {[InstagramIcon, TelegramIcon, YoutubeIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="https://t.me"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-white/15 transition-colors hover:border-[#e50000] hover:bg-[#e50000]"
                >
                  <Icon width={18} height={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow text-white/45">Магазин</p>
            <ul className="mt-5 space-y-3">
              {shop.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13.5px] text-white/75 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-white/45">Помощь</p>
            <ul className="mt-5 space-y-3">
              {help.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13.5px] text-white/75 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-white/45">Рассылка</p>
            <p className="mt-5 text-[13px] leading-relaxed text-white/55">
              Анонсы дропов, возвраты в наличие и −30% на первый заказ.
            </p>
            <div className="mt-4">
              <NewsletterForm dark />
            </div>
            <p className="mt-3 text-[11px] text-white/35">
              Подписываясь, вы соглашаетесь с политикой конфиденциальности.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-4 py-6 text-[11.5px] text-white/45 md:flex-row md:px-8 lg:px-12">
          <p>© 2026 Sneak&Street. Все права защищены.</p>
          <div className="flex gap-6">
            <Link href="/blog" className="hover:text-white">
              Политика конфиденциальности
            </Link>
            <Link href="/blog" className="hover:text-white">
              Условия использования
            </Link>
            <Link href="/blog" className="hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
