// Applies db/schema.sql then db/seed.sql to the Neon database.
// Run with: npm run db:setup
// No ORM, no magic — every statement is raw SQL, visible in db/*.sql.
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

// Read the connection string from .env.local ourselves — this script runs
// outside Next.js, so Next's automatic .env loading does not apply.
const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const match = env.match(/^DATABASE_URL=(.*)$/m);
if (!match) {
  console.error("DATABASE_URL not found in .env.local — aborting.");
  process.exit(1);
}
const sql = neon(match[1].trim());

async function runFile(file) {
  const contents = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
  // The Neon HTTP driver runs one statement per call, so split on semicolons.
  // (None of our SQL contains a semicolon inside a string, so this is safe.)
  const statements = contents
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log(`✓ ${file} — ${statements.length} statement(s) applied`);
}

console.log("Applying schema...");
await runFile("db/schema.sql");
console.log("Seeding data...");
await runFile("db/seed.sql");

const restaurants = await sql.query("SELECT * FROM restaurants ORDER BY id");
const reviews = await sql.query("SELECT * FROM reviews ORDER BY id");
console.log("\nrestaurants table:");
console.table(restaurants);
console.log("reviews table:");
console.table(reviews);
