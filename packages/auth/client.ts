"use client";

import { createAuthClient } from "better-auth/react";

const client = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

export type AuthClient = ReturnType<typeof createAuthClient>;

export const authClient: AuthClient = client;

export const getAuthClient = (): AuthClient => authClient;
export const createClient = getAuthClient;
