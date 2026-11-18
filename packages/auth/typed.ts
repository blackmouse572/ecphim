// Plain types and helpers, safe to import from client and server code.

/** The user shape better-auth returns (see the User model in schema.prisma). */
export type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthProfile = {
  avatar: string | null;
  email: string | null;
  id: string;
  name: string;
};

const getEmailName = (email: string | null | undefined) =>
  email?.split("@").at(0)?.trim() || "User";

export const getUserProfile = (
  user: Pick<User, "id" | "email" | "name" | "image"> | null | undefined,
): AuthProfile | null => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
    name: user.name?.trim() || getEmailName(user.email),
    avatar: user.image?.trim() || null,
  };
};

export const getUserInitials = (name: string | null | undefined) => {
  const trimmedName = name?.trim();

  if (!trimmedName) {
    return "U";
  }

  const parts = trimmedName.split(/\s+/).filter(Boolean).slice(0, 2);

  // Array.from splits by code point so emoji / astral names don't break.
  return parts.map((part) => Array.from(part)[0]?.toUpperCase() ?? "").join("");
};
