import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { truncateSync } from "fs";

config ({path:".env.local"});

export default defineConfig({
    schema:"./db/schema.ts",
    driver:"pg",
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!,
    },
    verbose:true,
    strict:true,
});

