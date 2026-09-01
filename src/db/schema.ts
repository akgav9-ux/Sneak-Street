// src/db/schema.ts
import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";

export type ProductColor = { name: string; hex: string };
export type ProductSize = { label: string; stock: number };

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  brand: varchar("brand", { length: 80 }).notNull(),
  category: varchar("category", { length: 40 }).notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  material: text("material").notNull().default(""),
  care: text("care").notNull().default(""),
  price: integer("price").notNull(),
  oldPrice: integer("old_price"),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  colors: jsonb("colors").$type<ProductColor[]>().notNull().default([]),
  sizes: jsonb("sizes").$type<ProductSize[]>().notNull().default([]),
  rating: integer("rating").notNull().default(45),
  reviewCount: integer("review_count").notNull().default(0),
  isNew: boolean("is_new").notNull().default(false),
  isBestseller: boolean("is_bestseller").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  sortIndex: integer("sort_index").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productSlug: varchar("product_slug", { length: 160 }).notNull(),
  author: varchar("author", { length: 120 }).notNull(),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  productSlug: varchar("product_slug", { length: 160 }).notNull(),
  productName: varchar("product_name", { length: 200 }).notNull().default(""),
  author: varchar("author", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull().default(""),
  question: text("question").notNull(),
  answer: text("answer").notNull().default(""),
  status: varchar("status", { length: 20 }).notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  answeredAt: timestamp("answered_at"),
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

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 40 }).notNull().unique(),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 60 }).notNull().default(""),
  address: text("address").notNull().default(""),
  city: varchar("city", { length: 120 }).notNull().default(""),
  postalCode: varchar("postal_code", { length: 40 }).notNull().default(""),
  country: varchar("country", { length: 80 }).notNull().default(""),
  shippingMethod: varchar("shipping_method", { length: 60 }).notNull().default("standard"),
  paymentMethod: varchar("payment_method", { length: 40 }).notNull().default("card"),
  items: jsonb("items").$type<OrderItem[]>().notNull().default([]),
  subtotal: integer("subtotal").notNull().default(0),
  shipping: integer("shipping").notNull().default(0),
  tax: integer("tax").notNull().default(0),
  discount: integer("discount").notNull().default(0),
  total: integer("total").notNull().default(0),
  status: varchar("status", { length: 40 }).notNull().default("Новый"),
  trackingNumber: varchar("tracking_number", { length: 60 }).notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 220 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  author: varchar("author", { length: 120 }).notNull(),
  image: text("image").notNull(),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  readMinutes: integer("read_minutes").notNull().default(4),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
});

export const appMeta = pgTable("app_meta", {
  key: varchar("key", { length: 80 }).primaryKey(),
  value: text("value").notNull().default(""),
});

export type Product = typeof products.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Post = typeof posts.$inferSelect;