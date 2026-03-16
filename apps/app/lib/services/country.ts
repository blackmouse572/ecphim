import { env } from "../../env";
import type { ICountry, IResponse } from "../../types/response";
import { CACHE_DURATION, CACHE_TAGS } from "../constants";

/**
 * Fetch all available countries for movies. This is used to display country filters and information on movie details.
 * Cached forever since country data rarely changes, and tagged for easy cache invalidation when needed.
 */
export async function fetchCountries() {
  const baseUrl = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/quoc-gia`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: CACHE_DURATION.FOREVER,
        tags: [CACHE_TAGS.COUNTRIES],
      },
    });

    if (!response.ok) {
      switch (response.status) {
        case 404:
          throw new Error(`Countries not found (404). ${url}`, {
            cause: response,
          });
        case 500:
          throw new Error(
            `Server error (500) while fetching countries. ${url}`,
            { cause: response },
          );
        default:
          throw new Error(
            `Unexpected error (${response.status}) while fetching countries. ${url}`,
            {
              cause: response,
            },
          );
      }
    }

    const data = (await response.json()) as IResponse<{
      items: ICountry[];
    }>;

    return data.data;
  } catch (error) {
    console.error(`Failed to fetch countries: ${(error as Error).message}`);
    throw error;
  }
}
