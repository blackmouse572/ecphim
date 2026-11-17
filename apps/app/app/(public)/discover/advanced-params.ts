import type { AdvancedSearchFilters } from "@/lib/services/advanced-search-match";

/**
 * Search params for the advanced search part of /discover: a title keyword,
 * people, tags and year. When any of these is set, Discover switches from the
 * plain list to advanced search (see discover/page.tsx).
 */
export const ADVANCED_KEYS = ["q", "director", "actor", "tag", "year"] as const;
export type AdvancedKey = (typeof ADVANCED_KEYS)[number];

export type DiscoverParams = Partial<
  Record<
    AdvancedKey | "clt" | "ctg" | "cntry" | "sort_by" | "sort_order" | "page",
    string
  >
>;

const clean = (value?: string) => value?.trim() || undefined;

export function isAdvancedSearch(params: DiscoverParams) {
  return ADVANCED_KEYS.some((key) => clean(params[key]));
}

export function toAdvancedFilters(
  params: DiscoverParams,
): AdvancedSearchFilters {
  const year = Number.parseInt(params.year ?? "", 10);
  return {
    q: clean(params.q),
    // Discover sends several genres as "a,b"; VSMov takes one per request.
    ctg: clean(params.ctg?.split(",")[0]),
    cntry: clean(params.cntry),
    year: Number.isFinite(year) ? year : undefined,
    director: clean(params.director),
    actor: clean(params.actor),
    tag: clean(params.tag),
  };
}

/** Builds a /discover URL from params. Empty values are left out. */
export function discoverHref(params: DiscoverParams): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value.trim() !== "") search.set(key, value);
  }
  if (search.get("page") === "1") search.delete("page");
  const qs = search.toString();
  return qs ? `/discover?${qs}` : "/discover";
}
