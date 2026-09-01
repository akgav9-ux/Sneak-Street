import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/db/queries";
import { formatDate } from "@/lib/format";
import { NewsletterForm } from "@/components/newsletter-form";
import { ArrowLeft, ArrowRight } from "@/components/icons";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Статья не найдена — SNEAK&STREET" };
  return { title: `${post.title} — SNEAK&STREET`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const [post, all] = await Promise.all([getPostBySlug(slug), getAllPosts()]);
  if (!post) notFound();

  const more = all.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-[1440px] px-4 pb-20 pt-10 md:px-8 lg:px-12">
      <nav className="flex flex-wrap items-center gap-2 text-[11.5px] tracking-[0.12em] text-[#8a8a8a]">
        <Link href="/" className="hover:text-[#111]">
          ГЛАВНАЯ
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-[#111]">
          БЛОГ
        </Link>
        <span>/</span>
        <span className="text-[#111]">{post.category.toUpperCase()}</span>
      </nav>

      <header className="mx-auto mt-8 max-w-[820px] text-center">
        <span className="bg-[#e50000] px-3 py-1.5 text-[10.5px] font-bold tracking-[0.16em] text-white">
          {post.category.toUpperCase()}
        </span>
        <h1 className="display mt-6 text-[clamp(30px,5vw,62px)]">{post.title}</h1>
        <p className="mt-5 text-[13px] tracking-[0.14em] text-[#8a8a8a]">
          АВТОР: {post.author.toUpperCase()} ·{" "}
          {formatDate(post.publishedAt).toUpperCase()} · {post.readMinutes} МИН ЧТЕНИЯ
        </p>
      </header>

      <div className="mt-10 aspect-[21/9] w-full overflow-hidden bg-[#f3f3f4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mx-auto mt-12 max-w-[720px]">
        <p className="border-l-2 border-[#e50000] pl-5 text-[18px] font-semibold leading-relaxed tracking-tight">
          {post.excerpt}
        </p>
        <div className="mt-9 space-y-6">
          {post.content.split("\n\n").map((para, i) => (
            <p key={i} className="text-[16px] leading-[1.85] text-[#3f3f43]">
              {para}
            </p>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Link
              key={t}
              href={`/blog?tag=${encodeURIComponent(t)}`}
              className="rounded-full border border-black/12 px-3.5 py-1.5 text-[11.5px] font-semibold transition-colors hover:border-[#111] hover:bg-[#111] hover:text-white"
            >
              #{t}
            </Link>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-4 border-y border-black/[0.07] py-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111] text-[15px] font-bold text-white">
            {post.author.charAt(0)}
          </span>
          <div>
            <p className="text-[14px] font-bold">{post.author}</p>
            <p className="text-[12.5px] text-[#8a8a8a]">
              Редактор Sneak&Street. Пишет о посадке, тканях и обуви.
            </p>
          </div>
        </div>

        <div className="mt-10 bg-[#f7f7f8] p-7">
          <p className="eyebrow text-[#e50000]">Не пропустите дроп</p>
          <p className="mt-3 text-[19px] font-bold tracking-tight">
            Получайте журнал на почту каждый четверг.
          </p>
          <div className="mt-5">
            <NewsletterForm />
          </div>
        </div>

        <Link
          href="/blog"
          className="group mt-10 inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.16em] hover:text-[#e50000]"
        >
          <ArrowLeft
            width={16}
            height={16}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          ВСЕ СТАТЬИ БЛОГА
        </Link>
      </div>

      <section className="mt-20 border-t border-black/[0.07] pt-12">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="display text-[clamp(24px,3.2vw,38px)]">ЧИТАЙТЕ ТАКЖЕ</h2>
          <Link
            href="/blog"
            className="flex items-center gap-2 text-[11.5px] font-bold tracking-[0.16em] hover:text-[#e50000]"
          >
            ВСЕ СТАТЬИ <ArrowRight width={14} height={14} />
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {more.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
              <div className="card-hover-zoom aspect-[16/10] overflow-hidden bg-[#f3f3f4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-4 text-[11px] tracking-[0.14em] text-[#8a8a8a]">
                {p.category.toUpperCase()} · {p.readMinutes} МИН
              </p>
              <h3 className="mt-2 text-[17px] font-bold leading-snug tracking-tight transition-colors group-hover:text-[#e50000]">
                {p.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
