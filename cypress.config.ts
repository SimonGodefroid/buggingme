// cypress.config.ts
import { defineConfig } from "cypress";
import { seed } from "./prisma/seed-tests";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

function requireEnv(name: string): string {
  const val = process.env[name] || 'mock-env-variable';
  if (!val) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return val;
}

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    video: false,
    setupNodeEvents(on, config) {
      on("task", {
        async seedDatabase() {
          try {
            // eslint-disable-next-line no-console
            console.error(">>> Seeding DB with prisma/seed-tests.ts");
            await seed();
            return { success: true };
          } catch (err) {
            // dump stack trace to CI logs
            console.error("Seeding failed:", err instanceof Error ? err.stack : err);
            // returning an error object makes Cypress fail the test cleanly
            return { success: false, error: err instanceof Error ? err.message : String(err) };
          }
        },
      });
    },
  },
  env: {
    // auth0_username: requireEnv("AUTH0_USERNAME"),
    // auth0_password: requireEnv("AUTH0_PASSWORD"),
    auth0_domain: requireEnv("AUTH0_DOMAIN"),
    nextauth_secret: requireEnv("NEXTAUTH_SECRET"),
    auth0_client_id: requireEnv("AUTH0_CLIENT_ID"),
    auth0_client_secret: requireEnv("AUTH0_CLIENT_SECRET"),
  },
});
