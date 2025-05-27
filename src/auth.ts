import NextAuth from 'next-auth';
import Github from 'next-auth/providers/github';
import Auth0 from 'next-auth/providers/auth0';
import { PrismaAdapter } from '@auth/prisma-adapter';
import db from '@/db';
import { UserType } from '@prisma/client';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  throw new Error('Missing github oauth credentials');
}

export const {
  handlers: { GET, POST },
  auth,
  signOut,
  signIn,
} = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Github({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    }),
    Auth0({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_DOMAIN,
      checks: ['none'] // https://github.com/nextauthjs/next-auth/discussions/7491
      // also consider https://github.com/nextauthjs/next-auth/discussions/6898
      // allowDangerousEmailAccountLinking: true
    }),
  ],

  callbacks: {
    // Usually not needed, here we are fixing a bug in nextauth
    async session({ session, user, token }) {
      if (session && user) {
        session.user.id = user.id;
      }
      return session;
    },
    // async jwt({ token, account, user }) {
    //   if (user) {
    //     token.id = user.id;
    //   }
    //   return token;
    // },
  },
  events: {
    signIn: async (message) => {
      const { user, account, isNewUser } = message;
      if (isNewUser) {
        const provider = account?.provider;
        const userTypes = [provider === 'github' ? UserType.ENGINEER : UserType.COMPANY];
        await db.user.update({ data: { userTypes }, where: { id: user.id } });
      }
    },
  },
  trustHost: true, // ✅ Required for Coolify or any non-Vercel host
  // pages: {
  //   signIn: '/auth/signin',
  // },
});
