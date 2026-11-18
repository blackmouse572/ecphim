import { CACHE_DURATION, CACHE_TAGS } from "@/lib/constants";
import type { IMovie } from "@/types/response";
import {
  type AdvancedSearchFilters,
  hasDetailFilters,
  matchesDetailFilters,
} from "./advanced-search-match";
import { getMovieDetail } from "./movie";
import { normalizeList, type RawList, vsmovFetch } from "./vsmov";

export * from "./advanced-search-match";

/**
 * Advanced search (keyword, genre, country, year, director, actor, tag).
 *
 * VSMov can only search titles (`/tim-kiem`) and list by genre or country.
 * It has no endpoint for directors, actors or tags, and list items don't carry
 * them: they only exist on the movie detail. So:
 *
 * 1. Pick a source list that VSMov can filter itself (keyword, genre,
 *    country, year).
 * 2. When a director, actor or tag filter is set, read the detail of every
 *    movie on a few source pages and keep the ones that match. Details are
 *    cached for a day, so repeat searches are cheap.
 *
 * This finds people and tags only within the source list, so a keyword or a
 * genre narrows it the most. Without either, it scans the latest updates.
 */

/** Source pages read per result page when filtering on detail data. */
export const SCAN_PAGES = 2;
/** VSMov returns 24 items per page. */
const SOURCE_PAGE_SIZE = 24;
/** Parallel detail requests. VSMov rate-limits bursts. */
const DETAIL_CONCURRENCY = 6;

export type AdvancedSearchResult = {
  items: IMovie[];
  /** "direct": VSMov filtered everything. "scan": we filtered details. */
  mode: "direct" | "scan";
  page: number;
  totalPages: number;
  /** Size of the source list VSMov returned before detail filtering. */
  sourceTotal: number;
  /** Movies whose detail was checked so far, counting earlier pages. */
  scannedUpTo: number;
  /** The source list is the latest updates, not a filtered list. */
  scansLatest: boolean;
};

type Source = { path: string; query: Record<string, string | number> };

function resolveSource(filters: AdvancedSearchFilters): Source {
  const { q, ctg, cntry, year } = filters;
  const base: Record<string, string | number> = {};
  if (year) base.year = year;

  if (q) {
    // /tim-kiem honours category and year. Country isn't confirmed, so a
    // country is checked on the detail instead (see needsCountryCheck).
    return {
      path: "/tim-kiem",
      query: { ...base, keyword: q, ...(ctg ? { category: ctg } : {}) },
    };
  }
  if (ctg) {
    return {
      path: `/the-loai/${ctg}`,
      query: { ...base, ...(cntry ? { country: cntry } : {}) },
    };
  }
  if (cntry) {
    return { path: `/quoc-gia/${cntry}`, query: base };
  }
  // /danh-sach ignores filters, so a year alone is checked on the detail.
  return { path: "/danh-sach/phim-moi-cap-nhat", query: {} };
}

function needsCountryCheck(filters: AdvancedSearchFilters) {
  return Boolean(filters.cntry && filters.q);
}

function needsYearCheck(filters: AdvancedSearchFilters) {
  return Boolean(filters.year && !filters.q && !filters.ctg && !filters.cntry);
}

async function fetchSource(source: Source, page: number) {
  const raw = await vsmovFetch<RawList>(
    source.path,
    { ...source.query, page, limit: SOURCE_PAGE_SIZE },
    {
      revalidate: CACHE_DURATION.RECENT,
      tags: [CACHE_TAGS.SEARCH],
    },
  );
  return normalizeList(raw);
}

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await fn(items[index]);
      }
    },
  );
  await Promise.all(workers);
  return results;
}

export async function advancedSearch(
  filters: AdvancedSearchFilters,
  page = 1,
): Promise<AdvancedSearchResult> {
  const source = resolveSource(filters);
  const scansLatest = source.path.startsWith("/danh-sach/");
  const scan =
    hasDetailFilters(filters) ||
    needsCountryCheck(filters) ||
    needsYearCheck(filters);

  if (!scan) {
    const list = await fetchSource(source, page);
    const sourceTotal = list.params.pagination.totalItems;
    return {
      items: list.items,
      mode: "direct",
      page: list.current_page,
      totalPages: list.total_pages,
      sourceTotal,
      scannedUpTo: sourceTotal,
      scansLatest,
    };
  }

  const firstSourcePage = (page - 1) * SCAN_PAGES + 1;
  const first = await fetchSource(source, firstSourcePage);
  const sourcePages = first.total_pages;
  const rest = await Promise.all(
    Array.from({ length: SCAN_PAGES - 1 }, (_, i) => firstSourcePage + i + 1)
      .filter((p) => p <= sourcePages)
      .map((p) => fetchSource(source, p).catch(() => null)),
  );
  const candidates = [first, ...rest].flatMap((list) => list?.items ?? []);

  const details = await mapLimit(candidates, DETAIL_CONCURRENCY, (movie) =>
    getMovieDetail(movie.slug).catch(() => null),
  );

  const items = details.filter(
    (movie): movie is IMovie =>
      movie !== null &&
      matchesDetailFilters(movie, filters, {
        country: needsCountryCheck(filters),
        year: needsYearCheck(filters),
      }),
  );

  const sourceTotal = first.params.pagination.totalItems;
  return {
    items,
    mode: "scan",
    page,
    totalPages: Math.max(1, Math.ceil(sourcePages / SCAN_PAGES)),
    sourceTotal,
    scannedUpTo: Math.min(
      sourceTotal,
      (firstSourcePage - 1) * SOURCE_PAGE_SIZE + candidates.length,
    ),
    scansLatest,
  };
}
