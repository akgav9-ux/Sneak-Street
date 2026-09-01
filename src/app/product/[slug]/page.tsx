import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllProducts,
  getAnsweredQuestions,
  getProductBySlug,
  getReviewsForProduct,
} from "@/db/queries";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductCarousel } from "@/components/product-carousel";
import { Stars } from "@/components/stars";
import { formatDate, ratingToStars } from "@/lib/format";
import { CATEGORIES, categoryLabel as catLabel } from "@/lib/catalog";
import { ProductQuestions } from "@/components/product/product-questions";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Товар не найден — SNEAK&STREET" };
  return {
    title: `${product.name} — ${product.brand} | SNEAK&STREET`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const [product, all] = await Promise.all([
    getProductBySlug(slug),
    getAllProducts(),
  ]);

  if (!product) notFound();

  const [reviews, faq] = await Promise.all([
    getReviewsForProduct(slug),
    getAnsweredQuestions(slug),
  ]);
  const related = all
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => {
      const score = (x: typeof a) =>
        (x.category === product.category ? 2 : 0) +
        (x.brand === product.brand ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, 8);

  const categoryTitle = catLabel(product.category);
  void CATEGORIES;

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-8 md:px-8 lg:px-12">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-[11.5px] tracking-[0.12em] text-[#8a8a8a]">
        <Link href="/" className="hover:text-[#111]">
          ГЛАВНАЯ
        </Link>
        <span>/</span>
        <Link
          href={`/catalog?gender=${product.gender === "unisex" ? "men" : product.gender}`}
          className="hover:text-[#111]"
        >
          {product.gender === "women"
            ? "ЖЕНСКОЕ"
            : product.gender === "men"
              ? "МУЖСКОЕ"
              : "УНИСЕКС"}
        </Link>
        <span>/</span>
        <Link
          href={`/catalog?category=${product.category}`}
          className="hover:text-[#111]"
        >
          {categoryTitle.toUpperCase()}
        </Link>
        <span>/</span>
        <span className="text-[#111]">{product.name.toUpperCase()}</span>
      </nav>

      <ProductDetail product={product} />

      <ProductQuestions
        slug={product.slug}
        productName={product.name}
        initial={faq}
      />

      {/* REVIEWS */}
      <section id="reviews" className="mt-20 border-t border-black/[0.07] pt-12">
        <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
          <div>
            <p className="eyebrow text-[#8a8a8a]">Мнения покупателей</p>
            <h2 className="display mt-3 text-[34px]">ОТЗЫВЫ</h2>
            <div className="mt-6 flex items-end gap-3">
              <span className="text-[52px] font-extrabold leading-none tracking-tight">
                {ratingToStars(product.rating).toFixed(1)}
              </span>
              <div className="pb-1.5">
                <Stars rating={product.rating} size={16} />
                <p className="mt-1 text-[12px] text-[#8a8a8a]">
                  {product.reviewCount} проверенных отзывов
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const pct =
                  star === 5 ? 72 : star === 4 ? 19 : star === 3 ? 6 : star === 2 ? 2 : 1;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-8 text-[11.5px] text-[#8a8a8a]">{star}★</span>
                    <span className="h-1.5 flex-1 bg-[#efeff1]">
                      <span
                        className="block h-full bg-[#111]"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="w-8 text-right text-[11.5px] text-[#8a8a8a]">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            {reviews.length === 0 ? (
              <p className="text-[14px] text-[#8a8a8a]">
                Письменных отзывов пока нет — будьте первым, кто расскажет о посадке.
              </p>
            ) : (
              reviews.map((r) => (
                <article
                  key={r.id}
                  className="border border-black/[0.08] p-6 transition-shadow duration-300 hover:shadow-[0_18px_40px_-28px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111] text-[12px] font-bold text-white">
                        {r.author.charAt(0)}
                      </span>
                      <div>
                        <p className="text-[13.5px] font-bold">{r.author}</p>
                        <p className="text-[11.5px] text-[#8a8a8a]">
                          Проверенная покупка · {formatDate(r.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Stars rating={r.rating * 10} size={13} />
                  </div>
                  <p className="mt-4 text-[14px] font-bold">{r.title}</p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#5c5c60]">
                    {r.body}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="mt-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow text-[#8a8a8a]">Дополните образ</p>
            <h2 className="display mt-3 text-[clamp(26px,3.4vw,42px)]">
              ВАМ ТАКЖЕ ПОНРАВИТСЯ
            </h2>
          </div>
          <Link
            href={`/catalog?category=${product.category}`}
            className="text-[11.5px] font-bold tracking-[0.16em] hover:text-[#e50000]"
          >
            СМОТРЕТЬ ВСЕ
          </Link>
        </div>
        <ProductCarousel products={related} />
      </section>
    </div>
  );
}
