import type { IMovie } from "@/types/response";

export type AdvancedSearchFilters = {
  /** Title keyword. */
  q?: string;
  /** Genre slug. */
  ctg?: string;
  /** Country slug. */
  cntry?: string;
  year?: number;
  director?: string;
  actor?: string;
  /** One tag, or several separated by commas (all must match). */
  tag?: string;
};

/** Lowercase, strip Vietnamese diacritics and collapse spaces. */
export function foldText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function someIncludes(values: string[] | undefined, needle: string) {
  const folded = foldText(needle);
  if (!folded) return true;
  return (values ?? []).some((value) => foldText(value).includes(folded));
}

export function splitTags(tag?: string): string[] {
  return (tag ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function hasDetailFilters(filters: AdvancedSearchFilters) {
  return Boolean(
    filters.director?.trim() ||
      filters.actor?.trim() ||
      splitTags(filters.tag).length,
  );
}

/**
 * Whether a movie detail matches the director, actor and tag filters, plus
 * country and year when VSMov couldn't filter those itself.
 * Matching ignores case and diacritics and accepts partial names
 * ("nolan" matches "Christopher Nolan").
 */
export function matchesDetailFilters(
  movie: IMovie,
  filters: AdvancedSearchFilters,
  check: { country?: boolean; year?: boolean } = {},
): boolean {
  if (filters.director && !someIncludes(movie.director, filters.director)) {
    return false;
  }
  if (filters.actor && !someIncludes(movie.actor, filters.actor)) {
    return false;
  }
  // Tags match the keywords and also the genres, since people often type a
  // genre ("kinh dị") as a tag.
  const tagPool = [
    ...(movie.keywords ?? []),
    ...movie.category.map((c) => c.name),
  ];
  for (const tag of splitTags(filters.tag)) {
    if (!someIncludes(tagPool, tag)) return false;
  }
  if (
    check.country &&
    filters.cntry &&
    !movie.country.some((c) => c.slug === filters.cntry)
  ) {
    return false;
  }
  if (check.year && filters.year && movie.year !== filters.year) {
    return false;
  }
  return true;
}
