// src/db/schema.ts
import {
  sqliteTable,
  integer,
  text,
  real,
} from "drizzle-orm/sqlite-core";

export type ProductColor = { name: string; hex: string };
export type ProductSize = { label: string; stock: number };

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug", { length: 160 }).notNull().unique(),
  name: text("name", { length: 200 }).notNull(),
  brand: text("brand", { length: 80 }).notNull(),
  category: text("category", { length: 40 }).notNull(),
  gender: text("gender", { length: 20 }).notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  material: text("material").notNull().default(""),
  care: text("care").notNull().default(""),
  price: integer("price").notNull(),
  oldPrice: integer("old_price"),
  images: text("images", { mode: "json" }).$type<string[]>().notNull().default([]),
  colors: text("colors", { mode: "json" }).$type<ProductColor[]>().notNull().default([]),
  sizes: text("sizes", { mode: "json" }).$type<ProductSize[]>().notNull().default([]),
  rating: integer("rating").notNull().default(45),
  reviewCount: integer("review_count").notNull().default(0),
  isNew: integer("is_new", { mode: "boolean" }).notNull().default(false),
  isBestseller: integer("is_bestseller", { mode: "boolean" }).notNull().default(false),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  sortIndex: integer("sort_index").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productSlug: text("product_slug", { length: 160 }).notNull(),
  author: text("author", { length: 120 }).notNull(),
  rating: integer("rating").notNull(),
  title: text("title", { length: 200 }).notNull(),
  body: text("body").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export const questions = sqliteTable("questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productSlug: text("product_slug", { length: 160 }).notNull(),
  productName: text("product_name", { length: 200 }).notNull().default(""),
  author: text("author", { length: 120 }).notNull(),
  email: text("email", { length: 160 }).notNull().default(""),
  question: text("question").notNull(),
  answer: text("answer").notNull().default(""),
  status: text("status", { length: 20 }).notNull().default("new"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
  answeredAt: integer("answered_at", { mode: "timestamp" }),
});

export type OrderItem = {
  slug: string;
  name: string;
  brand: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
};

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderNumber: text("order_number", { length: 40 }).notNull().unique(),
  fullName: text("full_name", { length: 160 }).notNull(),
  email: text("email", { length: 160 }).notNull(),
  phone: text("phone", { length: 60 }).notNull().default(""),
  address: text("address").notNull().default(""),
  city: text("city", { length: 120 }).notNull().default(""),
  postalCode: text("postal_code", { length: 40 }).notNull().default(""),
  country: text("country", { length: 80 }).notNull().default(""),
  shippingMethod: text("shipping_method", { length: 60 }).notNull().default("standard"),
  paymentMethod: text("payment_method", { length: 40 }).notNull().default("card"),
  items: text("items", { mode: "json" }).$type<OrderItem[]>().notNull().default([]),
  subtotal: integer("subtotal").notNull().default(0),
  shipping: integer("shipping").notNull().default(0),
  tax: integer("tax").notNull().default(0),
  discount: integer("discount").notNull().default(0),
  total: integer("total").notNull().default(0),
  status: text("status", { length: 40 }).notNull().default("Новый"),
  trackingNumber: text("tracking_number", { length: 60 }).notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export const subscribers = sqliteTable("subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email", { length: 200 }).notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug", { length: 160 }).notNull().unique(),
  title: text("title", { length: 220 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category", { length: 60 }).notNull(),
  author: text("author", { length: 120 }).notNull(),
  image: text("image").notNull(),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default([]),
  readMinutes: integer("read_minutes").notNull().default(4),
  publishedAt: integer("published_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export const appMeta = sqliteTable("app_meta", {
  key: text("key", { length: 80 }).primaryKey(),
  value: text("value").notNull().default(""),
});

export type Product = typeof products.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Post = typeof posts.$inferSelect;
