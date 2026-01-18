import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma'; // Correct import path and name
import prisma from './prisma'; // Our existing Prisma client
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseUrl: process.env.BETTER_AUTH_URL!,
  database: prismaAdapter(prisma, { provider: 'postgresql' }), // Correct usage
  emailAndPassword: {
    enabled: true,
  },
  providers: [],
  signInPage: '/login',
  errorPage: '/error',
  plugins: [nextCookies()],
});

export const signUp = auth.api.signUpEmail;
export const signIn = auth.api.signInEmail;
export const signOut = auth.api.signOut;
