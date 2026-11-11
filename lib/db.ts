// The database connection. One file, because there is exactly one database.
// Reads DATABASE_URL from .env.local (Next.js loads it automatically here).
// Raw SQL only — every query in this app is written by hand, so you can see
// AVG(rating) and COUNT(*) with your own eyes.
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "DATABASE_URL is not set. It lives in .env.local (dev) and in Vercel project settings (production)."
  );
}

// neon(url) returns a function whose .query(statement, params) runs raw SQL.
export const sql = neon(url);

export type Row = Record<string, unknown>;
