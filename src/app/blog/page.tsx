import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/db/queries";
import { formatDate } from "@/lib/format";
import { NewsletterForm } from "@/components/newsletter-form";
import { ArrowRight, SearchIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Блог о стиле — SNEAK&STREET",
  description: "Гиды по дропам, посадке и уходу от команды Sneak&Street.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string }>;
}) {
  const { q, category, tag } = await searchParams;
  const posts = await getAllPosts();

  const filtered = posts.filter((p) => {
    if (q && !`${p.title} ${p.excerpt} ${p.content}`.toLowerCase().includes(q.toLowerCase()))
      return false;
    if (category && p.category !== category) return false;
    if (tag && !p.tags.includes(tag)) return false;
    return true;
  });

  const categories = Array.from(new Set(posts.map((p) => p.category)));
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-10 md:px-8 lg:px-12">
      <nav className="flex items-center gap-2 text-[11.5px] tracking-[0.12em] text-[#8a8a8a]">
        <Link href="/" className="hover:text-[#111]">
          ГЛАВНАЯ
        </Link>
        <span>/</span>
        <span className="text-[#111]">БЛОГ</span>
      </nav>

      <header className="mt-6 border-b border-black/[0.07] pb-10">
        <p className="eyebrow text-[#e50000]">Журнал</p>
        <h1 className="display mt-4 text-[clamp(36px,6vw,80px)]">БЛОГ О СТИЛЕ</h1>
        <p className="mt-4 max-w-[520px] text-[14.5px] leading-relaxed text-[#8a8a8a]">
          Актуальные тренды, гиды по дропам, советы по посадке и уходу — от тех, кто
          собирает ваши посылки.
        </p>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_300px]">
        <div>
          {filtered.length === 0 ? (
            <div className="border border-dashed border-black/12 py-24 text-center">
              <p className="display text-[26px]">СТАТЕЙ НЕ НАЙДЕНО</p>
              <Link
                href="/blog"
                className="mt-5 inline-block text-[12px] font-bold tracking-[0.16em] text-[#e50000] hover:underline"
              >
                СБРОСИТЬ ФИЛЬТРЫ
              </Link>
            </div>
          ) : (
            <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((post) => (
                <article key={post.slug} className="group flex flex-col">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="card-hover-zoom relative block aspect-[16/10] overflow-hidden bg-[#f3f3f4]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-3 top-3 bg-[#e50000] px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-white">
                      {post.category.toUpperCase()}
                    </span>
                  </Link>
                  <p className="mt-4 text-[11px] tracking-[0.14em] text-[#8a8a8a]">
                    {formatDate(post.publishedAt).toUpperCase()} · {post.readMinutes}{" "}
                    МИН ЧТЕНИЯ
                  </p>
                  <h2 className="mt-2 text-[19px] font-bold leading-snug tracking-tight">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition-colors hover:text-[#e50000]"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-[#8a8a8a]">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between pt-2">
                    <span className="flex items-center gap-2 text-[12px] text-[#8a8a8a]">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#111] text-[10px] font-bold text-white">
                        {post.author.charAt(0)}
                      </span>
                      {post.author}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] transition-colors group-hover:text-[#e50000]"
                    >
                      ЧИТАТЬ <ArrowRight width={14} height={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-9">
          <div>
            <p className="eyebrow mb-3">Поиск</p>
            <form method="get" className="relative">
              <SearchIcon
                width={15}
                height={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8a]"
              />
              <input
                name="q"
                defaultValue={q ?? ""}
                placeholder="Поиск по статьям"
                className="h-11 w-full border border-black/12 pl-10 pr-3 text-[13px] outline-none focus:border-[#111]"
              />
            </form>
          </div>

          <div>
            <p className="eyebrow mb-3">Категории</p>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    href={`/blog?category=${encodeURIComponent(c)}`}
                    className={`flex items-center justify-between text-[13.5px] transition-colors hover:text-[#e50000] ${
                      category === c ? "font-bold" : ""
                    }`}
                  >
                    {c}
                    <span className="text-[11.5px] text-[#8a8a8a]">
                      {posts.filter((p) => p.category === c).length}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-3">Свежие статьи</p>
            <ul className="space-y-4">
              {posts.slice(0, 4).map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="group flex gap-3">
                    <span className="h-16 w-16 shrink-0 overflow-hidden bg-[#f3f3f4]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-2 text-[13px] font-semibold leading-snug transition-colors group-hover:text-[#e50000]">
                        {p.title}
                      </span>
                      <span className="mt-1 block text-[11px] text-[#8a8a8a]">
                        {formatDate(p.publishedAt)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-3">Теги</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Link
                  key={t}
                  href={`/blog?tag=${encodeURIComponent(t)}`}
                  className={`rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition-all hover:border-[#111] hover:bg-[#111] hover:text-white ${
                    tag === t ? "border-[#111] bg-[#111] text-white" : "border-black/12"
                  }`}
                >
                  #{t}
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-[#111] p-6 text-white">
            <p className="eyebrow text-[#e50000]">Рассылка</p>
            <p className="mt-3 text-[15px] font-bold leading-snug">
              Журнал и анонсы дропов — прямо на почту.
            </p>
            <div className="mt-4">
              <NewsletterForm dark />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
