import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const isProduction = process.env.NODE_ENV === "production";

// better-auth signs session cookies with this secret. In production a missing
// or weak secret must fail fast instead of falling back to a dev default.
const secret = isProduction
  ? z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters")
  : z.string().min(1).optional();

export const keys = () =>
  createEnv({
    server: {
      BETTER_AUTH_SECRET: secret,
      BETTER_AUTH_URL: z.string().url().optional(),
      GOOGLE_CLIENT_ID: z.string().min(1).optional(),
      GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
    },
    client: {
      NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    },
    runtimeEnv: {
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    },
  });
