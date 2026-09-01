import Link from "next/link";
import { getAllPosts, getAllProducts } from "@/db/queries";
import { IMG } from "@/db/seed-data";
import { Hero } from "@/components/home/hero";
import { ProductCarousel } from "@/components/product-carousel";
import { ProductCard } from "@/components/product-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { CATEGORIES } from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import {
  ArrowRight,
  ReturnIcon,
  ShieldIcon,
  SupportIcon,
  TruckIcon,
  InstagramIcon,
  StarIcon,
} from "@/components/icons";

export const dynamic = "force-dynamic";

const BRANDS = [
  "NIKE",
  "ADIDAS",
  "PUMA",
  "NEW BALANCE",
  "VANS",
  "CONVERSE",
  "CARHARTT WIP",
  "STÜSSY",
];

const BRAND_LINKS: Record<string, string> = {
  NIKE: "Nike",
  ADIDAS: "Adidas",
  PUMA: "Puma",
  "NEW BALANCE": "New Balance",
  VANS: "Vans",
  CONVERSE: "Converse",
  "CARHARTT WIP": "Carhartt WIP",
  "STÜSSY": "Stüssy",
};

const ADVANTAGES = [
  {
    icon: TruckIcon,
    title: "Бесплатная доставка",
    text: "На все заказы от 5 000 ₽ по всему миру.",
  },
  {
    icon: ReturnIcon,
    title: "Возврат 30 дней",
    text: "Передумали? Вернём деньги без вопросов.",
  },
  {
    icon: ShieldIcon,
    title: "Безопасная оплата",
    text: "SSL-шифрование. Карта, СБП, Apple Pay.",
  },
  {
    icon: SupportIcon,
    title: "Поддержка 24/7",
    text: "Живые люди, средний ответ — 5 минут.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Заказал в понедельник, в четверг уже носил. Одна упаковка выглядит как отдельный дроп.",
    name: "Марк Т.",
    role: "Москва",
  },
  {
    quote:
      "Тяжёлое худи — это правда 480 г/м². После целого сезона выглядит как новое.",
    name: "Юки Н.",
    role: "Санкт-Петербург",
  },
  {
    quote:
      "Таблицы размеров реально точные, что редкость. Ничего не возвращала, всё оставила.",
    name: "София Р.",
    role: "Казань",
  },
];

export default async function HomePage() {
  const [products, posts] = await Promise.all([getAllProducts(), getAllPosts()]);

  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 8);
  const saleItems = products.filter((p) => p.oldPrice).slice(0, 4);
  const heroImages = [IMG.heroMen, IMG.heroWomen, IMG.heroKicks];

  return (
    <>
      <Hero images={heroImages} />

      {/* КАТЕГОРИИ */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <SectionHead
          eyebrow="Выбрать по"
          title="КАТЕГОРИЯМ"
          href="/catalog"
          linkLabel="Все товары"
        />
        <div className="grid gap-4 md:grid-cols-3">
          <CategoryCard
            title="МУЖСКОЕ"
            subtitle="248 товаров"
            image={IMG.men}
            href="/catalog?gender=men"
          />
          <CategoryCard
            title="ЖЕНСКОЕ"
            subtitle="196 товаров"
            image={IMG.women}
            href="/catalog?gender=women"
          />
          <Link
            href="/catalog?sale=1"
            className="group relative flex min-h-[300px] flex-col justify-between overflow-hidden bg-[#e50000] p-7 text-white transition-transform duration-500 hover:-translate-y-1 md:min-h-[440px]"
          >
            <div>
              <p className="eyebrow text-white/70">Финальная уценка</p>
              <p className="display mt-3 text-[64px] md:text-[86px]">−50%</p>
              <p className="mt-2 max-w-[220px] text-[13.5px] text-white/80">
                Скидки до половины стоимости на кроссовки, футер и верхнюю одежду.
              </p>
            </div>
            <span className="flex items-center gap-3 text-[12px] font-bold tracking-[0.2em]">
              СМОТРЕТЬ СКИДКИ
              <ArrowRight
                width={18}
                height={18}
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              />
            </span>
            <span className="display pointer-events-none absolute -bottom-8 -right-4 text-[160px] leading-none text-white/10">
              %
            </span>
          </Link>
        </div>
      </section>

      {/* ХИТЫ ПРОДАЖ */}
      <section className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8 md:pb-24 lg:px-12">
        <SectionHead
          eyebrow="🔥 Чаще всего берут"
          title="ХИТЫ ПРОДАЖ"
          href="/catalog?sort=popular"
          linkLabel="Смотреть все"
        />
        <ProductCarousel products={bestsellers} />
      </section>

      {/* ПРОМО */}
      <section className="bg-[#f7f7f8]">
        <div className="mx-auto grid max-w-[1440px] items-stretch gap-0 md:grid-cols-2">
          <div className="relative min-h-[320px] overflow-hidden md:min-h-[520px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMG.sale}
              alt="Лукбук Дроп 04"
              className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center px-6 py-14 sm:px-10 md:px-14 lg:px-20">
            <p className="eyebrow text-[#e50000]">Дроп 04 · Midnight Runner</p>
            <h2 className="display mt-4 text-[clamp(34px,4.6vw,60px)]">
              ПАК, КОТОРЫЙ
              <br />
              РАЗОБРАЛИ
              <br />
              ЗА 9 МИНУТ
            </h2>
            <p className="mt-5 max-w-[440px] text-[14px] leading-relaxed text-[#8a8a8a]">
              Возврат в наличие всего на 48 часов. Технологичные раннеры, тональный
              футер и рипстоп-карго для передвижений после заката.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/catalog?new=1"
                className="bg-[#111] px-8 py-4 text-[12px] font-bold tracking-[0.2em] text-white transition-colors hover:bg-[#e50000]"
              >
                СМОТРЕТЬ ДРОП
              </Link>
              <Link
                href="/blog"
                className="border border-[#111] px-8 py-4 text-[12px] font-bold tracking-[0.2em] transition-colors hover:bg-[#111] hover:text-white"
              >
                ЧИТАТЬ ИСТОРИЮ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* НОВИНКИ */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <SectionHead
          eyebrow="Только что приехало"
          title="НОВИНКИ"
          href="/catalog?new=1"
          linkLabel="Смотреть все"
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {newArrivals.map((p, i) => (
            <div
              key={p.slug}
              className={i % 4 === 1 || i % 4 === 2 ? "lg:mt-12" : undefined}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* БРЕНДЫ */}
      <section className="border-y border-black/[0.07] bg-white py-10">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 lg:px-12">
          <p className="eyebrow mb-7 text-center text-[#8a8a8a]">
            Официальный продавец брендов
          </p>
          <div className="grid grid-cols-2 items-center gap-y-6 sm:grid-cols-4 lg:grid-cols-8">
            {BRANDS.map((b) => (
              <Link
                key={b}
                href={`/catalog?brand=${encodeURIComponent(BRAND_LINKS[b] ?? b)}`}
                className="text-center text-[13px] font-extrabold tracking-[0.12em] text-[#c3c3c7] transition-all duration-300 hover:scale-105 hover:text-[#111]"
              >
                {b}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА */}
      <section className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-20 lg:px-12">
        <div className="grid grid-cols-2 gap-px overflow-hidden bg-black/[0.07] lg:grid-cols-4">
          {ADVANTAGES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group flex flex-col gap-3 bg-white p-6 transition-colors duration-300 hover:bg-[#f7f7f8] md:p-8"
            >
              <Icon
                width={26}
                height={26}
                className="text-[#111] transition-colors duration-300 group-hover:text-[#e50000]"
              />
              <p className="text-[14px] font-bold tracking-tight">{title}</p>
              <p className="text-[12.5px] leading-relaxed text-[#8a8a8a]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* РАСПРОДАЖА */}
      <section className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8 md:pb-24 lg:px-12">
        <SectionHead
          eyebrow="Ограниченное время"
          title="СЕЙЧАС СО СКИДКОЙ"
          href="/catalog?sale=1"
          linkLabel="Все скидки"
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {saleItems.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* БЫСТРЫЕ КАТЕГОРИИ */}
      <section className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8 md:pb-24 lg:px-12">
        <div className="flex flex-wrap items-center gap-3">
          <span className="eyebrow mr-2 text-[#8a8a8a]">Быстрый переход</span>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/catalog?category=${c.slug}`}
              className="rounded-full border border-black/12 px-5 py-2.5 text-[12px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-[#111] hover:bg-[#111] hover:text-white"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ОТЗЫВЫ */}
      <section className="bg-[#111] py-16 text-white md:py-24">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 lg:px-12">
          <p className="eyebrow text-[#e50000]">Оценка 4.8 / 5 от 12 400 покупателей</p>
          <h2 className="display mt-4 text-[clamp(30px,4vw,54px)]">
            ЧТО ГОВОРИТ УЛИЦА
          </h2>
          <div className="mt-12 grid gap-px bg-white/10 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="bg-[#111] p-8">
                <div className="flex gap-1 text-[#e50000]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon key={i} filled width={14} height={14} />
                  ))}
                </div>
                <blockquote className="mt-5 text-[15px] leading-relaxed text-white/85">
                  «{t.quote}»
                </blockquote>
                <figcaption className="mt-6 text-[12px] tracking-[0.14em] text-white/40">
                  {t.name.toUpperCase()} · {t.role.toUpperCase()}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* БЛОГ */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <SectionHead
          eyebrow="Журнал о стиле"
          title="ИЗ БЛОГА"
          href="/blog"
          linkLabel="Все статьи"
        />
        <div className="grid gap-8 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <div className="card-hover-zoom relative aspect-[16/10] overflow-hidden bg-[#f3f3f4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 bg-white px-2.5 py-1 text-[10px] font-bold tracking-[0.14em]">
                  {post.category.toUpperCase()}
                </span>
              </div>
              <p className="mt-4 text-[11px] tracking-[0.14em] text-[#8a8a8a]">
                {formatDate(post.publishedAt).toUpperCase()} · {post.readMinutes} МИН
              </p>
              <h3 className="mt-2 text-[18px] font-bold leading-snug tracking-tight transition-colors group-hover:text-[#e50000]">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-[#8a8a8a]">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8 md:pb-24 lg:px-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow text-[#8a8a8a]">Сообщество</p>
            <h2 className="display mt-3 flex items-center gap-3 text-[clamp(28px,3.6vw,44px)]">
              <InstagramIcon width={30} height={30} />
              МЫ В СЕТИ @SNEAKSTREET
            </h2>
          </div>
          <a
            href="https://t.me"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-[11.5px] font-bold tracking-[0.16em] hover:text-[#e50000]"
          >
            ОТКРЫТЬ ПРОФИЛЬ <ArrowRight width={15} height={15} />
          </a>
        </div>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
          {IMG.insta.map((src, i) => (
            <a
              key={src}
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden bg-[#f3f3f4]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Публикация ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-[#111]/0 text-white opacity-0 transition-all duration-300 group-hover:bg-[#111]/45 group-hover:opacity-100">
                <InstagramIcon width={22} height={22} />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* РАССЫЛКА */}
      <section className="mx-auto max-w-[1440px] px-4 pb-8 md:px-8 lg:px-12">
        <div className="grid items-center gap-8 bg-[#f7f7f8] px-6 py-12 md:grid-cols-2 md:px-14 md:py-16">
          <div>
            <p className="eyebrow text-[#e50000]">Получите −30% сегодня</p>
            <h2 className="display mt-3 text-[clamp(28px,3.6vw,46px)]">
              ПОДПИШИТЕСЬ.
              <br />
              НЕ ПРОПУСТИТЕ ДРОП.
            </h2>
          </div>
          <div>
            <NewsletterForm />
            <p className="mt-3 text-[12px] text-[#8a8a8a]">
              Одно письмо на дроп. Отписаться можно в любой момент.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHead({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-3 md:mb-10">
      <div>
        <p className="eyebrow text-[#8a8a8a]">{eyebrow}</p>
        <h2 className="display mt-3 text-[clamp(28px,3.8vw,48px)]">{title}</h2>
      </div>
      <Link
        href={href}
        className="group flex items-center gap-2 text-[11.5px] font-bold tracking-[0.16em] transition-colors hover:text-[#e50000]"
      >
        {linkLabel.toUpperCase()}
        <ArrowRight
          width={15}
          height={15}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}

function CategoryCard({
  title,
  subtitle,
  image,
  href,
}: {
  title: string;
  subtitle: string;
  image: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="card-hover-zoom group relative min-h-[300px] overflow-hidden bg-[#f3f3f4] transition-transform duration-500 hover:-translate-y-1 md:min-h-[440px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-7 text-white">
        <div>
          <p className="display text-[36px] md:text-[48px]">{title}</p>
          <p className="mt-1 text-[12px] tracking-[0.16em] text-white/70">
            {subtitle.toUpperCase()}
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#111] transition-all duration-300 group-hover:bg-[#e50000] group-hover:text-white">
          <ArrowRight width={18} height={18} />
        </span>
      </div>
    </Link>
  );
}
