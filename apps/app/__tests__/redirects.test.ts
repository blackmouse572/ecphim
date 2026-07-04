import { describe, expect, test } from "vitest";
import { getSafeNextPath } from "@/lib/auth/redirects";

const withChar = (code: number) => `/foo${String.fromCharCode(code)}bar`;

describe("getSafeNextPath", () => {
  test("keeps valid root-relative paths", () => {
    expect(getSafeNextPath("/account/settings")).toBe("/account/settings");
    expect(getSafeNextPath("/")).toBe("/");
    expect(getSafeNextPath("/search?q=abc&page=2")).toBe("/search?q=abc&page=2");
  });

  test("falls back on empty/nullish input", () => {
    expect(getSafeNextPath("")).toBe("/account");
    expect(getSafeNextPath(null)).toBe("/account");
    expect(getSafeNextPath(undefined)).toBe("/account");
  });

  test("blocks absolute and protocol-relative URLs (open redirect)", () => {
    expect(getSafeNextPath("https://evil.com")).toBe("/account");
    expect(getSafeNextPath("//evil.com")).toBe("/account");
    expect(getSafeNextPath("javascript:alert(1)")).toBe("/account");
  });

  test("blocks backslash tricks that browsers normalize to //", () => {
    expect(getSafeNextPath("/\\evil.com")).toBe("/account");
    expect(getSafeNextPath("\\/evil.com")).toBe("/account");
    expect(getSafeNextPath("/foo\\bar")).toBe("/account");
  });

  test("blocks control characters (tab, newline, NUL, DEL)", () => {
    expect(getSafeNextPath(withChar(9))).toBe("/account");
    expect(getSafeNextPath(withChar(10))).toBe("/account");
    expect(getSafeNextPath(withChar(0))).toBe("/account");
    expect(getSafeNextPath(withChar(127))).toBe("/account");
  });

  test("honors a custom fallback", () => {
    expect(getSafeNextPath("//evil.com", "/sign-in")).toBe("/sign-in");
  });
});
