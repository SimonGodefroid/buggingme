This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Deploy schema migrations

1. add prod env var to .env add `POSTGRES_URL_NON_POOLING`,`POSTGRES_PRISMA_URL`
2. run `npx prisma migrate deploy`

## Accounts for DEV

| email          | provider | role   | company         |
| -------------- | -------- | ------ | --------------- |
| +god_dev       | GOD      | Auth0  | N.A.            |
| +bugbusters    | COMPANY  | Auth0  | BugBusters      |
| +simonscompany | COMPANY  | Auth0  | Simon's Company |
| SimonGodefroid | ENGINEER | GitHUb | N.A.            |


## Run migration with specific .env

`$ npx prisma migrate dev --env-file .env.local --name <migration_name>`