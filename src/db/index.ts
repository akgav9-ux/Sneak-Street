// src/db/index.ts
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsDb?: ReturnType<typeof createClient>;
};

const client =
  globalForDb.__arenaNextJsDb ??
  createClient({
    url: databaseUrl,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsDb = client;
}

export const db = drizzle(client);

// Экспортируем для совместимости
export const pool = client;
