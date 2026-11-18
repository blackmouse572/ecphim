import "server-only";

import { database } from "@repo/database";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { cache } from "react";
import { AUTH_BASE_PATH, MIN_PASSWORD_LENGTH } from "./config";
import { sendResetPasswordEmail, sendVerificationEmail } from "./emails";
import { keys } from "./keys";
import { getUserProfile } from "./typed";

const env = keys();

const baseURL = env.BETTER_AUTH_URL ?? env.NEXT_PUBLIC_APP_URL;

const trustedOrigins = [env.NEXT_PUBLIC_APP_URL, env.BETTER_AUTH_URL].filter(
  (origin): origin is string => Boolean(origin),
);

const socialProviders =
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      }
    : undefined;

export const serverAuth = betterAuth({
  appName: "EcPhim",
  basePath: AUTH_BASE_PATH,
  baseURL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: trustedOrigins.length > 0 ? trustedOrigins : undefined,
  database: prismaAdapter(database, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: MIN_PASSWORD_LENGTH,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, url);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, url);
    },
  },
  socialProviders,
  // Lets server actions set auth cookies (sign-in, sign-out, profile updates).
  plugins: [nextCookies()],
});

export const currentSession = cache(async () =>
  serverAuth.api.getSession({
    headers: await headers(),
  }),
);

export const currentUser = cache(async () => {
  const session = await currentSession();

  return session?.user ?? null;
});

export const currentProfile = cache(async () => {
  const user = await currentUser();

  return getUserProfile(user);
});

// Helper function to get the current user's active organization
export const auth = async () => {
  const user = await currentUser();

  if (!user) {
    return { userId: null, orgId: null };
  }

  // No explicit org switcher yet: the first membership is the active one.
  const membership = await database.organizationMember.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  return {
    userId: user.id,
    orgId: membership?.organizationId ?? null,
  };
};
