import "server-only";

import { database } from "@repo/database";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";
import { headers } from "next/headers";
import { keys } from "./keys";

const env = keys();

const socialProviders =
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      }
    : undefined;

const trustedOrigins = [
  env.NEXT_PUBLIC_APP_URL,
  env.BETTER_AUTH_URL,
].filter((origin): origin is string => Boolean(origin));

export const serverAuth = betterAuth({
  database: prismaAdapter(database, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders,
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL ?? env.NEXT_PUBLIC_APP_URL,
  trustedOrigins: trustedOrigins.length > 0 ? trustedOrigins : undefined,
});

export const currentUser = async () => {
  const session = await serverAuth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
};

export const auth = async () => {
  const user = await currentUser();

  if (!user) {
    return { userId: null, orgId: null };
  }

  const membership = await database.organizationMember.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  return {
    userId: user.id,
    orgId: membership?.organizationId ?? null,
  };
};
