import type { User, UserMetadata } from "@supabase/supabase-js";

export type { User } from "@supabase/supabase-js";

export type AuthUserMetadata = UserMetadata & {
  activeOrganizationId?: string | null;
  avatar?: string | null;
  name?: string | null;
  // OAuth providers (e.g. Google) populate these instead of avatar/name.
  avatar_url?: string | null;
  picture?: string | null;
  full_name?: string | null;
};

export type AuthProfile = {
  avatar: string | null;
  email: string | null;
  id: string;
  name: string;
};

const getEmailName = (email: string | null | undefined) =>
  email?.split("@").at(0)?.trim() ?? "User";

export const getUserMetadata = (
  user: User | null | undefined,
): AuthUserMetadata => (user?.user_metadata ?? {}) as AuthUserMetadata;

export const getUserProfile = (
  user: User | null | undefined,
): AuthProfile | null => {
  if (!user) {
    return null;
  }

  const metadata = getUserMetadata(user);
  const name =
    metadata.name?.trim() ||
    metadata.full_name?.trim() ||
    getEmailName(user.email);
  const avatar =
    metadata.avatar?.trim() ||
    metadata.avatar_url?.trim() ||
    metadata.picture?.trim() ||
    null;

  return {
    id: user.id,
    email: user.email ?? null,
    name,
    avatar,
  };
};

export const getUserInitials = (name: string | null | undefined) => {
  const trimmedName = name?.trim();

  if (!trimmedName) {
    return "U";
  }

  const parts = trimmedName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  // Array.from splits by code point so emoji / astral names don't break.
  return parts.map((part) => Array.from(part)[0]?.toUpperCase() ?? "").join("");
};
