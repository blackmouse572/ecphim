import { IActor, ICategory, ICountry, IMovie, IYear } from "./response";

export interface IProvider {
  getCategories(): Promise<ICategory[]>;
  getCountries(): Promise<ICountry[]>;
  getYears(): Promise<IYear[]>;
  getMovies(params: any): Promise<IMovie[]>;
  getMovieDetail(slug: string): Promise<IMovie>;
  getMovieImages?(slug: string): Promise<string[]>;
  getMovieActors?(slug: string): Promise<IActor[]>;
  getMovieTrailers?(slug: string): Promise<string[]>;
  getMovieKeywords?(slug: string): Promise<string[]>;
}
