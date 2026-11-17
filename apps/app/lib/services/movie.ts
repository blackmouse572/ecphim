import { cache } from "react";
import { CACHE_DURATION, CACHE_TAGS } from "@/lib/constants";
import type { ICategory, IMovie } from "@/types/response";
import {
  normalizeCountries,
  normalizeList,
  normalizeMovie,
  type RawDetail,
  type RawList,
  type RawTaxonomyList,
  VsmovError,
  vsmovFetch,
} from "./vsmov";

/**
 * Movie service - handles all movie-related API calls
 * Follows the service pattern for better maintainability and testability
 */

/**
 * Fetch home page data with movies
 * Cached for 24 hours as homepage content updates daily
 *
 * VSMov has no /home endpoint, so this uses the "recently updated" list.
 * List items only carry name/slug/images/year, so the first few (the ones
 * the hero shows) are enriched with their detail record.
 */
const HOME_ENRICH_COUNT = 10;

export const fetchHomeMovies = cache(async () => {
  try {
    const raw = await vsmovFetch<RawList>(
      "/danh-sach/phim-moi-cap-nhat",
      { page: 1 },
      {
        revalidate: CACHE_DURATION.DAILY,
        tags: [CACHE_TAGS.HOME_DATA, CACHE_TAGS.FEATURED_MOVIES],
      },
    );
    const { items } = normalizeList(raw);

    const enriched = await Promise.all(
      items
        .slice(0, HOME_ENRICH_COUNT)
        .map((movie) => getMovieDetail(movie.slug).catch(() => movie)),
    );

    return [...enriched, ...items.slice(HOME_ENRICH_COUNT)];
  } catch (error) {
    console.error("Failed to fetch home movies:", error);
    throw error;
  }
});
export type FetchMovieListParams = {
  slug?:
    | "phim-moi"
    | "phim-bo"
    | "phim-le"
    | "tv-shows"
    | "hoat-hinh"
    | "phim-vietsub"
    | "phim-thuyet-minh"
    | "phim-long-tien"
    | "phim-bo-dang-chieu"
    | "phim-bo-hoan-thanh"
    | "phim-sap-chieu"
    | "subteam"
    | "phim-chieu-rap";
  page?: number;
  limit?: number;
  sort_field?: "modified.time" | "year" | "_id";
  sort_type?: "asc" | "desc";
  category?: string;
  country?: string;
  year?: number;
};

/**
 * Pick the VSMov endpoint for a list query.
 * `/danh-sach/{slug}` ignores filters, so a genre or country filter goes to
 * `/the-loai/{slug}` or `/quoc-gia/{slug}`, which do honour the rest.
 */
function resolveListPath(params: FetchMovieListParams): string {
  // The filter form sends several genres as "a,b", but VSMov takes one genre
  // per request (a comma list returns nothing), so filter by the first one.
  const category = params.category?.split(",")[0]?.trim();
  if (category) return `/the-loai/${category}`;
  if (params.country) return `/quoc-gia/${params.country}`;
  const slug = params.slug || "phim-moi";
  if (slug === "phim-moi" && params.sort_field === "modified.time") {
    return "/danh-sach/phim-moi-cap-nhat";
  }
  return `/danh-sach/${slug}`;
}

export const fetchMovieList = cache(async (params: FetchMovieListParams) => {
  const path = resolveListPath(params);
  const query = {
    page: params.page || 1,
    limit: params.limit || 20,
    sort_field: params.sort_field || "_id",
    sort_type: params.sort_type || "desc",
    country: params.category ? params.country : undefined,
    year: params.year,
  };
  const options = {
    revalidate: CACHE_DURATION.DAILY,
    tags: [
      CACHE_TAGS.HOME_DATA,
      CACHE_TAGS.movieList(params.slug || "default"),
    ],
  };
  const filters = {
    type_slug: params.slug,
    category: params.category,
    country: params.country,
    year: params.year,
    sort_field: params.sort_field,
    sort_type: params.sort_type,
  };

  try {
    const raw = await vsmovFetch<RawList>(path, query, options);
    return normalizeList(raw, filters);
  } catch (error) {
    // Some ophim list slugs (hoat-hinh, tv-shows, phim-vietsub...) don't
    // exist on VSMov. Try a genre with the same slug, else show an empty list.
    if (
      error instanceof VsmovError &&
      error.status >= 400 &&
      error.status < 500 &&
      path.startsWith("/danh-sach/")
    ) {
      try {
        const raw = await vsmovFetch<RawList>(
          `/the-loai/${params.slug}`,
          query,
          options,
        );
        return normalizeList(raw, filters);
      } catch {
        console.warn(`VSMov has no list for "${params.slug}"`);
        return normalizeList({ status: false, items: [] }, filters);
      }
    }
    console.error("Failed to fetch latest movies:", error);
    throw error;
  }
});

/**
 * Fetch all categories
 * Cached for 30 days as categories rarely change
 */
export const fetchCategories = cache(async () => {
  try {
    const raw = await vsmovFetch<RawTaxonomyList>(
      "/the-loai",
      {},
      {
        revalidate: CACHE_DURATION.MONTHLY,
        tags: [CACHE_TAGS.CATEGORIES],
      },
    );
    return normalizeCountries(raw) as ICategory[];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
});

/**
 * Fetch movie images/poster with per-request deduplication
 * Multiple calls to getMovieImages(slug) in same request = 1 API call
 * Cached for 7 days as these images are stored externally and rarely change
 * @param slug - Movie slug identifier
 */
export type MovieImages = {
  image_sizes: {
    backdrop: {
      original: string;
      w1280: string;
      w300: string;
      w780: string;
    };
    poster: {
      original: string;
      w154: string;
      w185: string;
      w342: string;
      w500: string;
      w780: string;
      w92: string;
    };
  };
  images: {
    width: number;
    height: number;
    type: "backdrop" | "poster";
    file_path: string;
  }[];
};

const EMPTY_SIZES: MovieImages["image_sizes"] = {
  backdrop: { original: "", w1280: "", w300: "", w780: "" },
  poster: {
    original: "",
    w154: "",
    w185: "",
    w342: "",
    w500: "",
    w780: "",
    w92: "",
  },
};

/**
 * Fetch movie images/poster with per-request deduplication
 *
 * VSMov has no images endpoint. The images come from the movie detail
 * (already cached), in the old TMDB-like shape so that extractPosterUrl /
 * extractBackdropUrl keep working. URLs are absolute, so size bases are empty.
 * @param slug - Movie slug identifier
 */
export const getMovieImages = cache(
  async (slug: string): Promise<MovieImages> => {
    try {
      const movie = await getMovieDetail(slug);
      const images: MovieImages["images"] = [];
      if (movie.thumb_url) {
        images.push({
          type: "poster",
          file_path: movie.thumb_url,
          width: 0,
          height: 0,
        });
      }
      if (movie.poster_url) {
        images.push({
          type: "backdrop",
          file_path: movie.poster_url,
          width: 0,
          height: 0,
        });
      }
      return { image_sizes: EMPTY_SIZES, images };
    } catch (error) {
      console.error(`Failed to fetch images for movie ${slug}:`, error);
      throw error;
    }
  },
);

/**
 * Legacy function for backwards compatibility
 * @deprecated Use getMovieImages instead
 */
export async function fetchMovieImages(slug: string) {
  return getMovieImages(slug);
}

/**
 * Extract poster URL from movie images data
 * Returns w500 size for optimal balance between quality and load time
 * Falls back to original if w500 is not available
 */
export function extractPosterUrl(
  imageData?: Awaited<ReturnType<typeof fetchMovieImages>>,
  size: "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w500",
): string {
  try {
    const posterImage = imageData?.images.find((img) => img.type === "poster");

    if (!posterImage) {
      return "/images/placeholder-poster.webp";
    }

    const basePath =
      imageData?.image_sizes.poster?.[size] ||
      imageData?.image_sizes.poster?.original;

    return basePath + posterImage.file_path;
  } catch (error) {
    console.error("Failed to extract poster URL:", error);
    return "/images/placeholder-poster.webp";
  }
}

export function extractBackdropUrl(
  imageData?: Awaited<ReturnType<typeof fetchMovieImages>>,
  size: "w1280" | "original" = "w1280",
): string {
  try {
    const backdropImage = imageData?.images.find(
      (img) => img.type === "backdrop",
    );

    if (!backdropImage) {
      return "/images/placeholder-thumbnail.webp";
    }

    const basePath =
      imageData?.image_sizes.backdrop?.[size] ||
      imageData?.image_sizes.backdrop?.w1280 ||
      imageData?.image_sizes.backdrop?.original;

    return basePath + backdropImage.file_path;
  } catch (error) {
    console.error("Failed to extract backdrop URL:", error);
    return "/images/placeholder-thumbnail.webp";
  }
}

/**
 * Fetch movie detail with per-request deduplication
 * Multiple calls to getMovieDetail(slug) in same request = 1 API call
 * Cached for 1 day as movie data updates infrequently
 */
export const getMovieDetail = cache(async (slug: string): Promise<IMovie> => {
  try {
    const raw = await vsmovFetch<RawDetail>(
      `/phim/${slug}`,
      {},
      {
        revalidate: CACHE_DURATION.DAILY,
        tags: [CACHE_TAGS.MOVIE_DETAIL, CACHE_TAGS.movieDetail(slug)],
      },
    );
    if (!raw.movie) {
      throw new Error(`Movie with slug ${slug} not found (404)`);
    }
    return normalizeMovie(raw.movie, raw.episodes);
  } catch (error) {
    if (error instanceof VsmovError && error.status === 404) {
      console.error(`Movie with slug ${slug} not found (404)`);
    } else {
      console.error(`Failed to fetch details for movie ${slug}:`, error);
    }
    throw error;
  }
});

/**
 * Legacy function for backwards compatibility
 * @deprecated Use getMovieDetail instead
 */
export async function fetchMovieDetail(slug: string) {
  return getMovieDetail(slug);
}

/**
 * Search movies by keyword
 * Cached for 1 hour as search results can change frequently but not too often
 * @param keyword - Search keyword
 * @param page - Page number for pagination
 * @param limit - Number of results per page
 */
export async function fetchSearchMovies(
  keyword: string,
  query: {
    page?: number;
    limit?: number;
  },
) {
  try {
    const raw = await vsmovFetch<RawList>(
      "/tim-kiem",
      { keyword, page: query.page, limit: query.limit },
      {
        revalidate: CACHE_DURATION.RECENT,
        tags: [CACHE_TAGS.SEARCH, CACHE_TAGS.searchResults(keyword)],
      },
    );
    return normalizeList(raw);
  } catch (error) {
    console.error(`Failed to search movies with keyword "${keyword}":`, error);
    throw error;
  }
}

export { resolveImageUrl } from "./image-url";
