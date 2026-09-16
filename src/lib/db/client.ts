import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error("Missing required environment variable: DATABASE_URL");
  }

  return databaseUrl;
}

let dbInstance: NeonHttpDatabase<typeof schema> | undefined;

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (!dbInstance) {
    const sql = neon(getDatabaseUrl());
    dbInstance = drizzle(sql, { schema });
  }

  return dbInstance;
}

export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, property) {
    const database = getDb();
    const value = database[property as keyof NeonHttpDatabase<typeof schema>];

    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(database);
    }

    return value;
  },
});
