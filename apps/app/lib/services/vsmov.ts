import type {
  ICategory,
  ICountry,
  IMovie,
  IResponse,
  IResponseList,
  IStreamServer,
} from "@/types/response";

/**
 * VSMov API client (https://vsmov.com/api-document).
 *
 * VSMov replaces the old ophim/kkphim CMS API. Its responses differ from the
 * old shape, so everything here is normalized back into the types the app
 * already uses (IMovie, IResponse, IResponseList). Callers in lib/services
 * stay the same.
 *
 * Differences handled here:
 * - List endpoints return `{ status, items, pagination }` at the top level
 *   instead of `{ data: { items, params: { pagination } } }`.
 * - Movie detail returns `{ status, msg, movie, episodes }`.
 * - Image URLs are absolute. `poster_url` is sometimes `{}`. Like ophim,
 *   `thumb_url` holds the portrait poster and `poster_url` the landscape one.
 * - List items only carry a few fields (no category, quality, episode...).
 * - Episodes only have `link_embed` (an iframe player), no `link_m3u8`.
 * - `/danh-sach/{slug}` ignores category/country/year/sort filters, while
 *   `/the-loai/{slug}` and `/quoc-gia/{slug}` honour them.
 */

export const VSMOV_API_URL =
  process.env.VSMOV_API_URL?.replace(/\/$/, "") || "https://vsmov.com/api";

type FetchOptions = {
  revalidate?: number;
  tags?: string[];
};

export class VsmovError extends Error {
  readonly status: number;
  readonly url: string;
  constructor(status: number, url: string) {
    super(`VSMov API error ${status} for ${url}`);
    this.status = status;
    this.url = url;
  }
}

export async function vsmovFetch<T>(
  path: string,
  query: Record<string, string | number | undefined> = {},
  { revalidate, tags }: FetchOptions = {},
): Promise<T> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  const url = `${VSMOV_API_URL}${path}${qs ? `?${qs}` : ""}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate, tags },
  });
  if (!response.ok) {
    throw new VsmovError(response.status, url);
  }
  return (await response.json()) as T;
}

// ---------------------------------------------------------------------------
// Raw VSMov shapes
// ---------------------------------------------------------------------------

type RawTaxonomy = {
  _id?: number | string;
  id?: number | string;
  name: string;
  slug: string;
};

type RawMovie = Partial<
  Omit<
    IMovie,
    | "_id"
    | "poster_url"
    | "thumb_url"
    | "category"
    | "country"
    | "tmdb"
    | "imdb"
  >
> & {
  _id: number | string;
  name: string;
  slug: string;
  poster_url?: unknown;
  thumb_url?: unknown;
  tmdb?: Partial<Record<keyof IMovie["tmdb"], unknown>>;
  imdb?: Partial<Record<keyof IMovie["imdb"], unknown>>;
  category?: RawTaxonomy[];
  country?: RawTaxonomy[];
  keywords?: string[];
};

type RawEpisodeServer = {
  server_name?: string;
  server_data?: {
    name: string;
    slug: string;
    filename?: string;
    link_embed?: string;
    link_m3u8?: string;
  }[];
};

export type RawPagination = {
  totalItems: number | string;
  totalItemsPerPage: number | string;
  currentPage: number | string;
  totalPages?: number | string;
};

export type RawList = {
  status: boolean | string;
  msg?: string;
  message?: string;
  items?: RawMovie[];
  pagination?: RawPagination;
  pathImage?: string;
};

export type RawDetail = {
  status: boolean | string;
  msg?: string;
  movie: RawMovie;
  episodes?: RawEpisodeServer[];
};

export type RawTaxonomyList = IResponse<{ items: RawTaxonomy[] }>;

// ---------------------------------------------------------------------------
// Normalizers
// ---------------------------------------------------------------------------

const toNumber = (value: unknown, fallback = 0): number => {
  const n =
    typeof value === "number" ? value : Number.parseFloat(String(value));
  return Number.isFinite(n) ? n : fallback;
};

const toImageUrl = (value: unknown, pathImage?: string): string => {
  if (typeof value !== "string" || value.trim() === "") return "";
  if (/^https?:\/\//.test(value)) return value;
  return pathImage
    ? `${pathImage.replace(/\/$/, "")}/${value.replace(/^\//, "")}`
    : value;
};

export function normalizeTaxonomy(raw: RawTaxonomy): ICategory {
  return {
    _id: String(raw._id ?? raw.id ?? raw.slug),
    name: raw.name,
    slug: raw.slug,
  };
}

export function normalizeEpisodes(
  raw: RawEpisodeServer[] = [],
): IStreamServer[] {
  return raw.map((server) => ({
    // VSMov pads server_name with "\r\n" and spaces, e.g. "Vietsub\r\n   #1".
    server_name: (server.server_name ?? "").replace(/\s+/g, " ").trim(),
    is_ai: false,
    server_data: (server.server_data ?? []).map((ep) => ({
      name: ep.name,
      slug: ep.slug,
      filename: ep.filename,
      link_embed: ep.link_embed ?? "",
      link_m3u8: ep.link_m3u8 ?? "",
    })),
  }));
}

export function normalizeMovie(
  raw: RawMovie,
  episodes?: RawEpisodeServer[],
  pathImage?: string,
): IMovie {
  const tmdbVote = toNumber(raw.tmdb?.vote_average);
  const tmdbCount = toNumber(raw.tmdb?.vote_count);
  const thumb = toImageUrl(raw.thumb_url, pathImage);
  const poster = toImageUrl(raw.poster_url, pathImage);

  return {
    tmdb: {
      type: String(raw.tmdb?.type ?? ""),
      id: String(raw.tmdb?.id ?? ""),
      season: toNumber(raw.tmdb?.season),
      vote_average: tmdbVote,
      vote_count: tmdbCount,
    },
    imdb: {
      id: String(raw.imdb?.id ?? ""),
      // VSMov has no IMDb score, so fall back to the TMDB one.
      vote_average: toNumber(raw.imdb?.vote_average, tmdbVote),
      vote_count: toNumber(raw.imdb?.vote_count, tmdbCount),
    },
    created: raw.created ?? raw.modified ?? { time: "" },
    modified: raw.modified ?? { time: "" },
    _id: String(raw._id),
    name: raw.name,
    slug: raw.slug,
    origin_name: raw.origin_name ?? "",
    alternative_names: raw.alternative_names ?? [],
    content: raw.content ?? "",
    type: raw.type ?? "",
    status: raw.status ?? "",
    // Keep the ophim convention: thumb_url = portrait, poster_url = landscape.
    thumb_url: thumb || poster,
    poster_url: poster || thumb,
    is_copyright: raw.is_copyright ?? false,
    sub_docquyen: raw.sub_docquyen ?? false,
    chieurap: raw.chieurap ?? false,
    trailer_url: raw.trailer_url ?? "",
    time: raw.time ?? "",
    episode_current: raw.episode_current ?? "",
    episode_total: raw.episode_total ?? "",
    quality: raw.quality ?? "",
    lang: raw.lang ?? "",
    lang_key: raw.lang_key ?? (raw.lang ? [raw.lang] : []),
    notify: raw.notify ?? "",
    showtimes: raw.showtimes ?? "",
    year: toNumber(raw.year),
    view: toNumber(raw.view),
    actor: raw.actor ?? [],
    director: raw.director ?? [],
    keywords: raw.keywords ?? [],
    category: (raw.category ?? []).map(normalizeTaxonomy),
    country: (raw.country ?? []).map(normalizeTaxonomy),
    episodes: normalizeEpisodes(episodes),
  };
}

export type MovieListData = IResponseList<{
  items: IMovie[];
  total_pages: number;
  current_page: number;
}>["data"];

export function normalizeList(
  raw: RawList,
  filters: {
    type_slug?: string;
    category?: string;
    country?: string;
    year?: string | number;
    sort_field?: "_id" | "modified.time" | "year";
    sort_type?: "asc" | "desc";
  } = {},
): MovieListData {
  const items = (raw.items ?? []).map((item) =>
    normalizeMovie(item, undefined, raw.pathImage),
  );
  const totalItems = toNumber(raw.pagination?.totalItems, items.length);
  const totalItemsPerPage = toNumber(
    raw.pagination?.totalItemsPerPage,
    items.length || 1,
  );
  const currentPage = toNumber(raw.pagination?.currentPage, 1);
  const totalPages = toNumber(
    raw.pagination?.totalPages,
    Math.ceil(totalItems / Math.max(totalItemsPerPage, 1)),
  );

  return {
    items,
    total_pages: totalPages,
    current_page: currentPage,
    params: {
      type_slug: filters.type_slug ?? "",
      filterCategory: filters.category ? [filters.category] : [],
      filterCountry: filters.country ? [filters.country] : [],
      filterYear: filters.year ? String(filters.year) : "",
      filterType: "",
      sortField: filters.sort_field ?? "_id",
      sortType: filters.sort_type ?? "desc",
      pagination: {
        totalItems,
        totalItemsPerPage,
        currentPage,
        pageRanges: totalPages,
      },
    },
    APP_DOMAIN_FRONTEND: "",
    // VSMov image URLs are absolute; consumers use resolveImageUrl().
    APP_DOMAIN_CDN_IMAGE: "",
  };
}

export function normalizeCountries(raw: RawTaxonomyList): ICountry[] {
  return (raw.data?.items ?? []).map(normalizeTaxonomy);
}
