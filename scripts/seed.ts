import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../src/lib/schema";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  const password = await bcrypt.hash("admin123456", 10);
  
  await db.insert(users).values({
    name: "Admin",
    email: "admin@translook.press",
    password,
    role: "admin",
  }).onConflictDoNothing();

  console.log("✅ Admin user created: admin@translook.press / admin123456");
  process.exit(0);
}

seed().catch(console.error);
