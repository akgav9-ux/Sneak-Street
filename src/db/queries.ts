// src/db/queries.ts
import { db } from "@/db";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import {
  appMeta,
  orders,
  posts,
  products,
  questions,
  reviews,
  subscribers,
} from "./schema";
import type { ProductColor, ProductSize } from "./schema";
import {
  SEED_POSTS,
  SEED_PRODUCTS,
  SEED_QUESTIONS,
  SEED_REVIEWS,
  SEED_VERSION,
} from "./seed-data";

export type ProductDTO = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  gender: string;
  shortDescription: string;
  description: string;
  material: string;
  care: string;
  price: number;
  oldPrice: number | null;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestseller: boolean;
  isActive: boolean;
};

export type PostDTO = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image: string;
  tags: string[];
  readMinutes: number;
  publishedAt: string;
};

export type ReviewDTO = {
  id: number;
  productSlug: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
};

export type QuestionDTO = {
  id: number;
  productSlug: string;
  productName: string;
  author: string;
  email: string;
  question: string;
  answer: string;
  status: string;
  createdAt: string;
  answeredAt: string | null;
};

const fallbackProducts: ProductDTO[] = SEED_PRODUCTS.map((p, i) => ({
  id: i + 1,
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  category: p.category,
  gender: p.gender,
  shortDescription: p.shortDescription,
  description: p.description,
  material: p.material,
  care: p.care,
  price: p.price,
  oldPrice: p.oldPrice ?? null,
  images: p.images,
  colors: p.colors,
  sizes: p.sizes,
  rating: p.rating,
  reviewCount: p.reviewCount,
  isNew: Boolean(p.isNew),
  isBestseller: Boolean(p.isBestseller),
  isActive: true,
}));

const baseDate = Date.UTC(2026, 0, 20);
const fallbackPosts: PostDTO[] = SEED_POSTS.map((p, i) => ({
  ...p,
  publishedAt: new Date(baseDate - i * 86400000 * 6).toISOString(),
}));

let seedPromise: Promise<void> | null = null;

async function seed(): Promise<void> {
  const [meta] = await db
    .select()
    .from(appMeta)
    .where(eq(appMeta.key, "seed_version"))
    .limit(1);

  if (meta?.value === SEED_VERSION) return;

  await db.delete(products);
  await db.delete(posts);
  await db.delete(reviews);
  await db.delete(questions);

  await db.insert(products).values(
    SEED_PRODUCTS.map((p, i) => ({
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      category: p.category,
      gender: p.gender,
      shortDescription: p.shortDescription,
      description: p.description,
      material: p.material,
      care: p.care,
      price: p.price,
      oldPrice: p.oldPrice ?? null,
      images: p.images,
      colors: p.colors,
      sizes: p.sizes,
      rating: p.rating,
      reviewCount: p.reviewCount,
      isNew: Boolean(p.isNew),
      isBestseller: Boolean(p.isBestseller),
      isActive: true,
      sortIndex: i,
    })),
  );

  await db.insert(posts).values(
    SEED_POSTS.map((p, i) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      category: p.category,
      author: p.author,
      image: p.image,
      tags: p.tags,
      readMinutes: p.readMinutes,
      publishedAt: new Date(baseDate - i * 86400000 * 6),
    })),
  );

  await db.insert(reviews).values(SEED_REVIEWS);

  await db.insert(questions).values(
    SEED_QUESTIONS.map((q, i) => ({
      ...q,
      createdAt: new Date(baseDate - i * 86400000),
      answeredAt: q.status === "answered" ? new Date(baseDate - i * 86400000 + 3600000) : null,
    })),
  );

  await db
    .insert(appMeta)
    .values({ key: "seed_version", value: SEED_VERSION })
    .onConflictDoUpdate({
      target: appMeta.key,
      set: { value: SEED_VERSION },
    });
}

export async function ensureSeeded(): Promise<boolean> {
  if (!seedPromise) {
    seedPromise = seed().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  try {
    await seedPromise;
    return true;
  } catch (error) {
    console.error("[seed] пропущен:", (error as Error).message);
    return false;
  }
}

function mapProduct(r: typeof products.$inferSelect): ProductDTO {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    brand: r.brand,
    category: r.category,
    gender: r.gender,
    shortDescription: r.shortDescription,
    description: r.description,
    material: r.material,
    care: r.care,
    price: r.price,
    oldPrice: r.oldPrice,
    images: r.images ?? [],
    colors: r.colors ?? [],
    sizes: r.sizes ?? [],
    rating: r.rating,
    reviewCount: r.reviewCount,
    isNew: r.isNew,
    isBestseller: r.isBestseller,
    isActive: r.isActive,
  };
}

export async function getAllProducts(): Promise<ProductDTO[]> {
  const all = await getAllProductsRaw();
  return all.filter((p) => p.isActive);
}

export async function getAllProductsRaw(): Promise<ProductDTO[]> {
  const ok = await ensureSeeded();
  if (!ok) return fallbackProducts;
  try {
    const rows = await db
      .select()
      .from(products)
      .orderBy(asc(products.sortIndex), asc(products.id));
    if (rows.length === 0) return fallbackProducts;
    return rows.map(mapProduct);
  } catch (error) {
    console.error("[products] fallback:", (error as Error).message);
    return fallbackProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getReviewsForProduct(slug: string): Promise<ReviewDTO[]> {
  const ok = await ensureSeeded();
  if (ok) {
    try {
      const rows = await db
        .select()
        .from(reviews)
        .where(eq(reviews.productSlug, slug))
        .orderBy(desc(reviews.createdAt));
      return rows.map((r) => ({
        id: r.id,
        productSlug: r.productSlug,
        author: r.author,
        rating: r.rating,
        title: r.title,
        body: r.body,
        createdAt: r.createdAt.toISOString(),
      }));
    } catch {
      /* fallthrough */
    }
  }
  return SEED_REVIEWS.filter((r) => r.productSlug === slug).map((r, i) => ({
    id: i + 1,
    ...r,
    createdAt: new Date(baseDate).toISOString(),
  }));
}

function mapQuestion(r: typeof questions.$inferSelect): QuestionDTO {
  return {
    id: r.id,
    productSlug: r.productSlug,
    productName: r.productName,
    author: r.author,
    email: r.email,
    question: r.question,
    answer: r.answer,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    answeredAt: r.answeredAt ? r.answeredAt.toISOString() : null,
  };
}

export async function getAnsweredQuestions(slug: string): Promise<QuestionDTO[]> {
  const ok = await ensureSeeded();
  if (!ok) return [];
  try {
    const rows = await db
      .select()
      .from(questions)
      .where(and(eq(questions.productSlug, slug), eq(questions.status, "answered")))
      .orderBy(desc(questions.answeredAt));
    return rows.map(mapQuestion);
  } catch {
    return [];
  }
}

export async function getAllQuestions(): Promise<QuestionDTO[]> {
  await ensureSeeded();
  try {
    const rows = await db
      .select()
      .from(questions)
      .orderBy(asc(questions.status), desc(questions.createdAt));
    return rows.map(mapQuestion);
  } catch {
    return [];
  }
}

export async function getAllPosts(): Promise<PostDTO[]> {
  const ok = await ensureSeeded();
  if (!ok) return fallbackPosts;
  try {
    const rows = await db.select().from(posts).orderBy(desc(posts.publishedAt));
    if (rows.length === 0) return fallbackPosts;
    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      content: r.content,
      category: r.category,
      author: r.author,
      image: r.image,
      tags: r.tags ?? [],
      readMinutes: r.readMinutes,
      publishedAt: r.publishedAt.toISOString(),
    }));
  } catch {
    return fallbackPosts;
  }
}

export async function getPostBySlug(slug: string): Promise<PostDTO | null> {
  const all = await getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getOrdersByEmail(email: string) {
  await ensureSeeded();
  return db
    .select()
    .from(orders)
    .where(eq(orders.email, email.toLowerCase()))
    .orderBy(desc(orders.createdAt));
}

export async function getAllOrders() {
  await ensureSeeded();
  try {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  } catch {
    return [];
  }
}

export async function getOrderByNumber(orderNumber: string) {
  const [row] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);
  return row ?? null;
}

export async function addSubscriber(email: string) {
  await ensureSeeded();
  await db
    .insert(subscribers)
    .values({ email: email.toLowerCase() })
    .onConflictDoNothing();
}

export async function countStats() {
  await ensureSeeded();
  // ✅ УДАЛИЛ  везде
  const [p] = await db.select({ n: sql<number>`count(*)` }).from(products);
  const [o] = await db.select({ n: sql<number>`count(*)` }).from(orders);
  const [q] = await db
    .select({ n: sql<number>`count(*)` })
    .from(questions)
    .where(eq(questions.status, "new"));
  const [s] = await db.select({ n: sql<number>`count(*)` }).from(subscribers);
  const [rev] = await db
    .select({ n: sql<number>`coalesce(sum(total),0)` })
    .from(orders);
  return {
    products: p?.n ?? 0,
    orders: o?.n ?? 0,
    openQuestions: q?.n ?? 0,
    subscribers: s?.n ?? 0,
    revenue: rev?.n ?? 0,
  };
}
