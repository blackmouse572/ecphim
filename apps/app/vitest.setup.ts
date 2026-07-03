import { vi } from "vitest";

const router = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => router,
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

vi.mock("@repo/auth/client", () => ({
  createClient: () => ({ auth: {} }),
  getCurrentUser: vi.fn(async () => null),
  sendPasswordResetEmail: vi.fn(async () => ({ error: null })),
  signInWithGoogle: vi.fn(async () => ({ error: null })),
  signInWithPassword: vi.fn(async () => ({ error: null })),
  signOut: vi.fn(async () => ({ error: null })),
  signUpWithPassword: vi.fn(async () => ({ error: null })),
  updatePassword: vi.fn(async () => ({ error: null })),
  updateProfile: vi.fn(async () => ({ error: null })),
}));
