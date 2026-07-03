import { describe, expect, test } from "vitest";
import {
  getSafeNextPathFromRequest,
  isMatchingRoute,
  matchesAny,
} from "@repo/auth/route-match";

describe("isMatchingRoute", () => {
  test("matches exact path and sub-paths", () => {
    expect(isMatchingRoute("/account", "/account")).toBe(true);
    expect(isMatchingRoute("/account/settings", "/account")).toBe(true);
  });

  test("does not match a route that is only a name prefix", () => {
    // "/accounts" must NOT be treated as under "/account"
    expect(isMatchingRoute("/accounts", "/account")).toBe(false);
    expect(isMatchingRoute("/account-x", "/account")).toBe(false);
  });
});

describe("matchesAny", () => {
  const guarded = ["/account", "/search", "/webhooks"];

  test("true when pathname falls under any guarded route", () => {
    expect(matchesAny("/search", guarded)).toBe(true);
    expect(matchesAny("/webhooks/stripe", guarded)).toBe(true);
  });

  test("false for unguarded paths", () => {
    expect(matchesAny("/", guarded)).toBe(false);
    expect(matchesAny("/movie/abc", guarded)).toBe(false);
    expect(matchesAny("/searching", guarded)).toBe(false);
  });
});

describe("getSafeNextPathFromRequest", () => {
  test("keeps valid root-relative path with query", () => {
    expect(getSafeNextPathFromRequest("/search", "?q=1", "/account")).toBe(
      "/search?q=1",
    );
  });

  test("falls back on protocol-relative and backslash tricks", () => {
    expect(getSafeNextPathFromRequest("//evil.com", "", "/account")).toBe(
      "/account",
    );
    expect(getSafeNextPathFromRequest("/\\evil.com", "", "/account")).toBe(
      "/account",
    );
  });
});
