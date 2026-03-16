/**
 * Cache duration constants (in seconds)
 * Used for Next.js revalidate configuration
 */
export const CACHE_DURATION = {
  // Data that changes frequently
  RECENT: 60 * 60, // 1 hour

  // Data that changes daily
  DAILY: 24 * 60 * 60, // 24 hours

  // Data that changes weekly
  WEEKLY: 7 * 24 * 60 * 60, // 7 days

  // Data that rarely changes (monthly)
  MONTHLY: 30 * 24 * 60 * 60, // 30 days

  // Data that almost never changes
  FOREVER: 365 * 24 * 60 * 60, // 1 year
} as const;

/**
 * Cache tags for on-demand revalidation
 * Structure: namespace/resource/type
 */
export const CACHE_TAGS = {
  // Movie related
  MOVIE: "movie",
  MOVIE_IMAGES: "movie-images",
  MOVIE_DETAIL: "movie-detail",

  // Home page
  HOME_DATA: "home-data",
  FEATURED_MOVIES: "featured-movies",

  // Categories/Genres
  CATEGORIES: "categories",
  GENRES: "genres",
  COUNTRIES: "countries",
  SEARCH: "search",
  // Generate tag for specific movie
  movieImages: (slug: string) => `movie-images:${slug}`,
  movieDetail: (slug: string) => `movie-detail:${slug}`,
  movieList: (slug: string) => `movie-list:${slug}`,
  searchResults: (query: string) => `search-results:${query}`,
} as const;
