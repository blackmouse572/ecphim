import type { AdvancedSearchFilters } from "@/lib/services/advanced-search-match";

export type SearchPageParams = {
  q?: string;
  ctg?: string;
  cntry?: string;
  year?: string;
  director?: string;
  actor?: string;
  tag?: string;
  page?: string;
};

const clean = (value?: string) => value?.trim() || undefined;

export function parseSearchParams(params: SearchPageParams): {
  filters: AdvancedSearchFilters;
  page: number;
} {
  const year = Number.parseInt(params.year ?? "", 10);
  const page = Number.parseInt(params.page ?? "", 10);
  return {
    filters: {
      q: clean(params.q),
      ctg: clean(params.ctg),
      cntry: clean(params.cntry),
      year: Number.isFinite(year) ? year : undefined,
      director: clean(params.director),
      actor: clean(params.actor),
      tag: clean(params.tag),
    },
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function hasAnyFilter(filters: AdvancedSearchFilters) {
  return Object.values(filters).some(
    (value) => value !== undefined && value !== "",
  );
}

/** Builds a /tim-kiem URL. Empty values are left out. */
export function searchHref(
  filters: AdvancedSearchFilters,
  page?: number,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/tim-kiem?${qs}` : "/tim-kiem";
}
