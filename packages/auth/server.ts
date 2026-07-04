/** biome-ignore-all lint/suspicious/useIterableCallbackReturn: <explanation> */
/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
/** biome-ignore-all lint/complexity/noForEach: <explanation> */
import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
import { getUserMetadata, getUserProfile } from "./typed";

export const createClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};

export const currentSession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
});

// Helper function to get the current user
export const currentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const currentProfile = cache(async () => {
  const user = await currentUser();

  return getUserProfile(user);
});

export const updateCurrentUserProfile = async ({
  avatar,
  name,
}: {
  avatar?: string | null;
  name: string;
}) => {
  const supabase = await createClient();

  return supabase.auth.updateUser({
    data: {
      avatar,
      name,
    },
  });
};

export const updateCurrentUserPassword = async (password: string) => {
  const supabase = await createClient();

  return supabase.auth.updateUser({
    password,
  });
};

export const sendCurrentUserPasswordReset = async (redirectTo: string) => {
  const user = await currentUser();

  if (!user?.email) {
    throw new Error("Current user does not have an email address.");
  }

  const supabase = await createClient();

  return supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo,
  });
};

// Helper function to get the current user's active organization
export const auth = async () => {
  const user = await currentUser();
  if (!user) {
    return { userId: null, orgId: null };
  }
  // Get active organization from user metadata
  const orgId = getUserMetadata(user).activeOrganizationId ?? null;
  return {
    userId: user.id,
    orgId,
  };
};
