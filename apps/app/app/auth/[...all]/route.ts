// better-auth handler. Mounted at /auth because next.config rewrites /api/*
// to the movie API before app routes run.
import { authHandlers } from "@repo/auth/next";

export const { GET, POST } = authHandlers;
