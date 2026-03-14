import { env } from "@/env";
import { CACHE_DURATION, CACHE_TAGS } from "@/lib/constants";
import type { ICategory, IMovie, IResponse, SeoOnPage } from "@/types/response";

/**
 * Movie service - handles all movie-related API calls
 * Follows the service pattern for better maintainability and testability
 */

/**
 * Fetch home page data with movies
 * Cached for 24 hours as homepage content updates daily
 */
export async function fetchHomeMovies() {
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
}

/**
 * Fetch all categories
 * Cached for 30 days as categories rarely change
 */
export async function fetchCategories() {
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
}

/**
 * Fetch movie images/poster
 * Cached for 7 days as these images are stored externally
 * @param slug - Movie slug identifier
 */
export async function fetchMovieImages(slug: string) {
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
          throw new Error(`Server error while fetching images for movie ${slug} (500). ${url}`, { cause: response });
        default:
          throw new Error(
            `Unexpected error ${response.status} while fetching images for movie ${slug}. ${url}`, {
            cause: response,
          }
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

    const basePath = imageData?.image_sizes.backdrop?.[size] ||
      imageData?.image_sizes.backdrop?.w1280 ||
      imageData?.image_sizes.backdrop?.original;

    return basePath + backdropImage.file_path;
  } catch (error) {
    console.error("Failed to extract backdrop URL:", error);
    return "/images/placeholder-thumbnail.webp";
  }
}

export async function fetchMovieDetail(slug: string) {
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
          throw new Error(`Server error while fetching movie ${slug} (500)`, { cause: response });
        default:
          throw new Error(
            `Unexpected error ${response.status} while fetching movie ${slug}`, {
            cause: response,
          }
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
}
