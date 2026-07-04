/** biome-ignore-all lint/style/noNonNullAssertion: not null env */
"use client";

import { createBrowserClient } from "@supabase/ssr";
export type AuthClient = ReturnType<typeof createClient>;

type SignInWithPasswordInput = {
  email: string;
  password: string;
};

type SignInWithGoogleInput = {
  redirectTo: string;
};

type SignUpWithPasswordInput = SignInWithPasswordInput & {
  emailRedirectTo?: string;
  name: string;
};

type UpdateProfileInput = {
  avatar?: string | null;
  name: string;
};

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

export const getCurrentUser = async (client: AuthClient) => {
  const {
    data: { user },
  } = await client.auth.getUser();

  return user;
};

export const signInWithPassword = (
  client: AuthClient,
  input: SignInWithPasswordInput,
) => client.auth.signInWithPassword(input);

export const signInWithGoogle = (
  client: AuthClient,
  { redirectTo }: SignInWithGoogleInput,
) =>
  client.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

export const signUpWithPassword = (
  client: AuthClient,
  { emailRedirectTo, name, ...input }: SignUpWithPasswordInput,
) =>
  client.auth.signUp({
    ...input,
    options: {
      emailRedirectTo,
      data: {
        name,
      },
    },
  });

export const sendPasswordResetEmail = (
  client: AuthClient,
  email: string,
  redirectTo: string,
) =>
  client.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

export const updatePassword = (client: AuthClient, password: string) =>
  client.auth.updateUser({
    password,
  });

export const updateProfile = (
  client: AuthClient,
  { avatar, name }: UpdateProfileInput,
) =>
  client.auth.updateUser({
    data: {
      avatar,
      name,
    },
  });

export const signOut = (client: AuthClient) => client.auth.signOut();
