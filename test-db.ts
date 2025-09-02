#!/usr/bin/env bun

// Simple database connection test
import { Pool } from "pg";

async function testDatabaseConnection() {
  console.log("🧪 Testing database connection...");
  
  const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "caautobackend",
  });

  try {
    const client = await pool.connect();
    console.log("✅ Database connection successful!");
    
    // Test basic query
    const result = await client.query("SELECT version()");
    console.log("📊 PostgreSQL version:", result.rows[0].version);
    
    client.release();
    await pool.end();
    
    console.log("🎉 Database test completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error("Error:", error);
    console.error("\n💡 Make sure:");
    console.error("1. PostgreSQL is running");
    console.error("2. Database 'caautobackend' exists");
    console.error("3. User credentials are correct in .env file");
    console.error("4. Database server is accessible");
    
    await pool.end();
    return false;
  }
}

testDatabaseConnection()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });
