import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

// Database configuration
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "caautobackend",
});

const db = drizzle(pool);

async function main() {
  console.log("🚀 Starting database migration...");
  
  try {
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("✅ Database migration completed successfully!");
  } catch (error) {
    console.error("❌ Database migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
    console.log("🔌 Database connection closed");
  }
}

main();
