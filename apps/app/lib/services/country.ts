import type { ICountry } from "../../types/response";
import { CACHE_DURATION, CACHE_TAGS } from "../constants";
import { normalizeCountries, type RawTaxonomyList, vsmovFetch } from "./vsmov";

/**
 * Fetch all available countries for movies. This is used to display country filters and information on movie details.
 * Cached forever since country data rarely changes, and tagged for easy cache invalidation when needed.
 */
export async function fetchCountries(): Promise<{ items: ICountry[] }> {
  try {
    const raw = await vsmovFetch<RawTaxonomyList>(
      "/quoc-gia",
      {},
      {
        revalidate: CACHE_DURATION.FOREVER,
        tags: [CACHE_TAGS.COUNTRIES],
      },
    );
    return { items: normalizeCountries(raw) };
  } catch (error) {
    console.error(`Failed to fetch countries: ${(error as Error).message}`);
    throw error;
  }
}
