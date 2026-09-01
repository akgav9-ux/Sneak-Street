// scripts/seed.ts
import { config } from "dotenv";
import { resolve } from "path";

// Загружаем .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { db } from "../src/db";
import { products } from "../src/db/schema";
import { SEED_PRODUCTS } from "../src/db/seed-data";

async function main() {
  console.log("📦 Загружаем товары...");
  
  for (const p of SEED_PRODUCTS) {
    await db.insert(products).values({
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
      sortIndex: 0,
    });
  }
  
  console.log("✅ Товары загружены!");
}

main().catch(console.error);