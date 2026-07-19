import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "./schema";

if (process.env.NODE_ENV === "development") {
  config({ path: ".env.local" });
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

const db = drizzle(pool, { schema });

export default db;
