import dotenv from "dotenv";
import { migrate } from "drizzle-orm/neon-serverless/migrator";

dotenv.config({ path: ".env.local", override: true });

import db from "./index";

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: "./db/migrations" });
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

main();
