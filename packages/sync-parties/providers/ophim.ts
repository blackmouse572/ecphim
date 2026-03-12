import { IProvider } from "@/types/provider";
import pino from "pino";
import {
	IActor,
	ICategory,
	ICountry,
	IMovie,
	IResponse,
	IYear,
} from "@/types/response";
import axios, { AxiosInstance } from "axios";
import prettyLogger from "pino-pretty";
export class OphimProvider implements IProvider {
	private readonly client: AxiosInstance;
	private readonly logger: pino.Logger;
	private readonly baseUrl: string = "https://ophim1.com";

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
					`[OphimProvider] Requesting ${config.method?.toUpperCase()} ${config.url}`,
				);
				return config;
			},
			(error) => {
				this.logger.error(`[OphimProvider] Request error: ${error.message}`);
				return Promise.reject(error);
			},
		);

		this.client.interceptors.response.use(
			(response) => {
				this.logger.info(
					`[OPhimProvider] Received response for ${response.config.url} with status ${response.status}`,
				);
				return response;
			},
			(error) => {
				if (error.response) {
					this.logger.error(
						`[OPhimProvider] Response error: ${error.response.status} ${error.response.statusText} for ${error.config.url}`,
					);
				} else {
					this.logger.error(`[OPhimProvider] Response error: ${error.message}`);
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
			>("/v1/api/quoc-gia")
			.then((res) => res.data.data.items)
			.catch((err) => {
				this.logger.error(`Failed to fetch countries: ${err.message}`);

				return [];
			});
	}
	getYears(): Promise<IYear[]> {
		return this.client
			.get<IResponse<{ items: IYear[] }>>("/v1/api/nam-phat-hanh")
			.then((res) => res.data.data.items)
			.catch((err) => {
				this.logger.error(`Failed to fetch years: ${err.message}`);
				return [];
			});
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
		if (params.keyword) {
			this.logger.debug(
				`Fetching movies with keyword: ${params.keyword}, page: ${params.page || 1}, limit: ${params.limit || 20}`,
			);
			return this.client
				.get<IResponse<IMovie[]>>("/v1/api/tim-kiem", { params })
				.then((res) => res.data.data)
				.catch((err) => {
					this.logger.error(`Failed to fetch movies: ${err.message}`);
					return [];
				});
		} else {
			this.logger.debug(
				`Fetching movies with filters: category=${params.category}, country=${params.country}, year=${params.year}, slug=${params.slug}, sortBy=${params.sortBy}, sortType=${params.sortType}, page=${params.page || 1}, limit=${params.limit || 20}`,
			);
			return this.client
				.get<IResponse<{ items: IMovie[] }>>(
					`/v1/api/danh-sach/${params.slug}`,
					{ params },
				)
				.then((res) => res.data.data.items)
				.catch((err) => {
					this.logger.error(`Failed to fetch movies: ${err.message}`);
					return [];
				});
		}
	}
	getMovieDetail(slug: string): Promise<IMovie> {
		return this.client
			.get<IResponse<IMovie>>(`/v1/api/phim/${slug}`)
			.then((res) => res.data.data)
			.catch((err) => {
				this.logger.error(
					`Failed to fetch movie detail for slug ${slug}: ${err.message}`,
				);
				throw err;
			});
	}
	getMovieActors?(slug: string): Promise<IActor[]> {
		return this.client
			.get<IResponse<{ peoples: IActor[] }>>(`/v1/api/phim/${slug}/peoples`)
			.then((res) => {
				return res.data.data.peoples.map((actor) => ({
					...actor,
					profile_path: this.getActorProfileUrl(actor),
				}));
			})
			.catch((err) => {
				this.logger.error(
					`Failed to fetch movie actors for slug ${slug}: ${err.message}`,
				);
				return [];
			});
	}
	private getActorProfileUrl(actor: IActor): string {
		return `https://image.tmdb.org/t/p/w45/${actor.profile_path}`;
	}
	getMovieTrailers?(slug: string): Promise<string[]> {
		throw new Error("Method not implemented.");
	}
	getMovieKeywords?(slug: string): Promise<string[]> {
		return this.client
			.get<IResponse<{ keywords: { name: string; name_vn: string }[] }>>(
				`/v1/api/phim/${slug}/keywords`,
			)
			.then((res) => res.data.data.keywords.map((keyword) => keyword.name_vn))
			.catch((err) => {
				this.logger.error(
					`Failed to fetch movie keywords for slug ${slug}: ${err.message}`,
				);
				return [];
			});
	}

	async getCategories(): Promise<ICategory[]> {
		return this.client
			.get<IResponse<{ items: ICategory[] }>>("/v1/api/the-loai")
			.then((res) => res.data.data.items)
			.catch((err) => {
				this.logger.error(`Failed to fetch categories: ${err.message}`);
				return [];
			});
	}
}
