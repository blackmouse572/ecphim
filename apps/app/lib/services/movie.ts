import { cache } from "react";
import { env } from "@/env";
import { CACHE_DURATION, CACHE_TAGS } from "@/lib/constants";
import type {
  ICategory,
  IMovie,
  IResponse,
  IResponseList,
  SeoOnPage,
} from "@/types/response";

/**
 * Movie service - handles all movie-related API calls
 * Follows the service pattern for better maintainability and testability
 */

/**
 * Fetch home page data with movies
 * Cached for 24 hours as homepage content updates daily
 */
export const fetchHomeMovies = cache(async () => {
  const params = new URLSearchParams({
    sort_field: "_id",
    sort_type: "desc",
    page: "1",
  });

  const baseUrl = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/home?${params.toString()}`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: CACHE_DURATION.DAILY,
        tags: [CACHE_TAGS.HOME_DATA, CACHE_TAGS.FEATURED_MOVIES],
      },
    });

    if (!response.ok) {
      throw new Error(`Home API error: ${response.status}`);
    }

    const data = (await response.json()) as IResponse<{
      seoOnPage: SeoOnPage;
      items: IMovie[];
    }>;

    return data.data.items;
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

export const fetchMovieList = cache(async (params: FetchMovieListParams) => {
  const options: Record<string, string> = {
    page: params.page?.toString() || "1",
    limit: params.limit?.toString() || "20",
    sort_field: (params.sort_field as string) || "_id",
    sort_type: (params.sort_type as string) || "desc",
    ...(params.category ? { category: params.category } : {}),
    ...(params.country ? { country: params.country } : {}),
    ...(params.year ? { year: params.year.toString() } : {}),
  };
  const queryParams = new URLSearchParams(options);

  const baseUrl = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/danh-sach/${params.slug}?${queryParams.toString()}`;
  console.log("Fetching movie list with options:", url);

  try {
    const response = await fetch(url, {
      next: {
        revalidate: CACHE_DURATION.DAILY,
        tags: [
          CACHE_TAGS.HOME_DATA,
          CACHE_TAGS.movieList(params.slug || "default"),
        ],
      },
    });

    if (!response.ok) {
      throw new Error(`Latest movies API error: ${response.status}`);
    }

    const data = (await response.json()) as IResponseList<{
      items: IMovie[];
      total_pages: number;
      current_page: number;
    }>;

    return data.data;
  } catch (error) {
    console.error("Failed to fetch latest movies:", error);
    throw error;
  }
});

/**
 * Fetch all categories
 * Cached for 30 days as categories rarely change
 */
export const fetchCategories = cache(async () => {
  const baseUrl = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/the-loai`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: CACHE_DURATION.MONTHLY,
        tags: [CACHE_TAGS.CATEGORIES],
      },
    });

    if (!response.ok) {
      throw new Error(`Categories API error: ${response.status}`);
    }

    const data = (await response.json()) as IResponse<{
      items: ICategory[];
    }>;

    return data.data.items;
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
export const getMovieImages = cache(async (slug: string) => {
  const baseUrl = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/phim/${slug}/images`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: CACHE_DURATION.WEEKLY,
        tags: [CACHE_TAGS.MOVIE_IMAGES, CACHE_TAGS.movieImages(slug)],
      },
    });

    if (!response.ok) {
      switch (response.status) {
        case 404:
          throw new Error(`Images for movie ${slug} not found (404)`);
        case 500:
          throw new Error(
            `Server error while fetching images for movie ${slug} (500). ${url}`,
            { cause: response },
          );
        default:
          throw new Error(
            `Unexpected error ${response.status} while fetching images for movie ${slug}. ${url}`,
            {
              cause: response,
            },
          );
      }
    }

    const data = (await response.json()) as IResponse<{
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
    }>;

    return data.data;
  } catch (error) {
    console.error(`Failed to fetch images for movie ${slug}:`, error);
    throw error;
  }
});

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
export const getMovieDetail = cache(async (slug: string) => {
  const baseUrl = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/phim/${slug}`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: CACHE_DURATION.DAILY,
        tags: [CACHE_TAGS.MOVIE_DETAIL, CACHE_TAGS.movieDetail(slug)],
      },
    });

    if (!response.ok) {
      switch (response.status) {
        case 404:
          throw new Error(`Movie with slug ${slug} not found (404)`);
        case 500:
          throw new Error(`Server error while fetching movie ${slug} (500)`, {
            cause: response,
          });
        default:
          throw new Error(
            `Unexpected error ${response.status} while fetching movie ${slug}`,
            {
              cause: response,
            },
          );
      }
    }

    const data = (await response.json()) as IResponse<{
      item: IMovie;
    }>;

    return data.data.item;
  } catch (error) {
    console.error(`Failed to fetch details for movie ${slug}:`, error);
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
  const baseUrl = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/tim-kiem?keyword=${encodeURIComponent(
    keyword,
  )}&page=${query.page}&limit=${query.limit}`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: CACHE_DURATION.RECENT,
        tags: [CACHE_TAGS.SEARCH, CACHE_TAGS.searchResults(keyword)],
      },
    });

    if (!response.ok) {
      throw new Error(`Search API error: ${response.status}`);
    }

    const data = (await response.json()) as IResponseList<{
      items: IMovie[];
      total_pages: number;
      current_page: number;
    }>;

    return data.data;
  } catch (error) {
    console.error(`Failed to search movies with keyword "${keyword}":`, error);
    throw error;
  }
}
