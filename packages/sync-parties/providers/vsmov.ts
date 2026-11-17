import axios, { type AxiosInstance } from "axios";
import pino from "pino";
import prettyLogger from "pino-pretty";
import type { IProvider } from "@/types/provider";
import type {
  IActor,
  ICategory,
  ICountry,
  IMovie,
  IResponse,
  IYear,
} from "@/types/response";
export class VsmovProvider implements IProvider {
  private readonly client: AxiosInstance;
  private readonly logger: pino.Logger;
  private readonly baseUrl: string = "https://vsmov.com";

  constructor() {
    this.logger = pino(
      prettyLogger({
        colorize: true,
        levelFirst: true,
        translateTime: "HH:MM:ss",
      }),
    );
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 5000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        this.logger.info(
          `[VsmovProvider] Requesting ${config.method?.toUpperCase()} ${config.url}`,
        );
        return config;
      },
      (error) => {
        this.logger.error(`[VsmovProvider] Request error: ${error.message}`);
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response) => {
        this.logger.info(
          `[VsmovProvider] Received response for ${response.config.url} with status ${response.status}`,
        );
        return response;
      },
      (error) => {
        if (error.response) {
          this.logger.error(
            `[VsmovProvider] Response error: ${error.response.status} ${error.response.statusText} for ${error.config.url}`,
          );
        } else {
          this.logger.error(`[VsmovProvider] Response error: ${error.message}`);
        }
        return Promise.reject(error);
      },
    );
  }
  getCountries(): Promise<ICountry[]> {
    return this.client
      .get<
        IResponse<{
          items: ICountry[];
        }>
      >("/api/quoc-gia")
      .then((res) => res.data.data.items)
      .catch((err) => {
        this.logger.error(`Failed to fetch countries: ${err.message}`);

        return [];
      });
  }
  /** VSMov has no release-year endpoint, so build the list locally. */
  getYears(): Promise<IYear[]> {
    const current = new Date().getFullYear();
    return Promise.resolve(
      Array.from({ length: current - 1969 }, (_, i) => {
        const year = String(current - i);
        return { _id: year, name: year, slug: year };
      }),
    );
  }
  /**
   * Fetch movies with optional keyword, pagination, and limit parameters.
   * @param params - An object containing optional parameters:
   *   - keyword: A search term to filter movies by title or description.
   * **Important**: Filter by keyword or filter, not both. If both are provided, keyword will be used and filter will be ignored.
   *   - page: The page number for pagination (default is 1).
   *   - limit: The number of movies to return per page (default is 20).
   * @returns A promise that resolves to an array of movies matching the criteria.
   */
  getMovies(params: {
    keyword?: string;
    page?: number;
    category?: string;
    country?: string;
    year?: string;
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
    sortBy?: string;
    sortType?: "asc" | "desc";
    limit?: number;
  }): Promise<IMovie[]> {
    // VSMov list responses are { status, items, pagination } (no data wrapper).
    // /danh-sach ignores filters; /the-loai and /quoc-gia honour them.
    let path: string;
    if (params.keyword) {
      path = "/api/tim-kiem";
    } else if (params.category) {
      path = `/api/the-loai/${params.category}`;
    } else if (params.country) {
      path = `/api/quoc-gia/${params.country}`;
    } else {
      path = `/api/danh-sach/${params.slug || "phim-moi-cap-nhat"}`;
    }
    this.logger.debug(`Fetching movies from ${path}`);
    return this.client
      .get<{ items: IMovie[] }>(path, { params })
      .then((res) => res.data.items ?? [])
      .catch((err) => {
        this.logger.error(`Failed to fetch movies: ${err.message}`);
        return [];
      });
  }
  getMovieDetail(slug: string): Promise<IMovie> {
    return this.client
      .get<{ movie: IMovie; episodes: IMovie["episodes"] }>(`/api/phim/${slug}`)
      .then((res) => ({ ...res.data.movie, episodes: res.data.episodes ?? [] }))
      .catch((err) => {
        this.logger.error(
          `Failed to fetch movie detail for slug ${slug}: ${err.message}`,
        );
        throw err;
      });
  }
  /** VSMov has no cast endpoint. */
  getMovieActors?(_slug: string): Promise<IActor[]> {
    return Promise.resolve([]);
  }
  getMovieTrailers?(slug: string): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  /** VSMov returns keywords on the movie detail itself. */
  getMovieKeywords?(slug: string): Promise<string[]> {
    return this.client
      .get<{ movie: { keywords?: string[] } }>(`/api/phim/${slug}`)
      .then((res) => res.data.movie.keywords ?? [])
      .catch((err) => {
        this.logger.error(
          `Failed to fetch movie keywords for slug ${slug}: ${err.message}`,
        );
        return [];
      });
  }

  async getCategories(): Promise<ICategory[]> {
    return this.client
      .get<IResponse<{ items: ICategory[] }>>("/api/the-loai")
      .then((res) => res.data.data.items)
      .catch((err) => {
        this.logger.error(`Failed to fetch categories: ${err.message}`);
        return [];
      });
  }
}
