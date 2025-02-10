import { defineConfig } from "cypress";
import { seed } from "./prisma/seed-tests";

require('dotenv').config({ path: ['.env.test',], })

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    video: false,
    //  https://github.com/nextauthjs/next-auth/discussions/2053
    setupNodeEvents(on, config) {
      on('task', {
        async seedDatabase() {
          console.log('@'.repeat(200), 'we\'re seeding')
          await seed();
          return null;
        }
      })
      // implement node event listeners here
    },
  },
  env: {
    auth0_username: process.env.AUTH0_USERNAME,
    auth0_password: process.env.AUTH0_PASSWORD,
    auth0_domain: process.env.AUTH0_DOMAIN,
    nextauth_secret: process.env.NEXTAUTH_SECRET,
    // auth0_audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    // auth0_scope: process.env.REACT_APP_AUTH0_SCOPE,
    auth0_client_id: process.env.AUTH0_CLIENT_ID,
    auth0_client_secret: process.env.AUTH0_CLIENT_SECRET,
  },
});
