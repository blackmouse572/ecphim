"use server";

import {
  normalizeCountries,
  type RawTaxonomyList,
  vsmovFetch,
} from "@/lib/services/vsmov";

interface Country {
  slug: string;
  name: string;
}

interface Year {
  name: string;
  slug: string;
}

interface Category {
  slug: string;
  name: string;
}

export interface NavbarData {
  countries: Country[];
  years: Year[];
  categories: Category[];
}

/**
 * VSMov has no release-year endpoint, so build the list locally
 * (current year back to 1970, same { name, slug } shape as before).
 */
function buildYears(): Year[] {
  const current = new Date().getFullYear();
  return Array.from({ length: current - 1969 }, (_, i) => {
    const year = String(current - i);
    return { name: year, slug: year };
  });
}

/**
 * Fetch navbar data from the VSMov API with server-side caching
 * Data is cached for 24 hours as it rarely changes
 */
export async function fetchNavbarData(): Promise<NavbarData> {
  const revalidate = 24 * 60 * 60; // Cache for 24 hours
  const [countries, categories] = await Promise.all([
    vsmovFetch<RawTaxonomyList>("/quoc-gia", {}, { revalidate })
      .then(normalizeCountries)
      .catch((error) => {
        console.error("Failed to fetch navbar countries:", error);
        return [];
      }),
    vsmovFetch<RawTaxonomyList>("/the-loai", {}, { revalidate })
      .then(normalizeCountries)
      .catch((error) => {
        console.error("Failed to fetch navbar categories:", error);
        return [];
      }),
  ]);

  return { countries, years: buildYears(), categories };
}
