export interface ICategory {
  _id: string;
  slug: string;
  name: string;
}
export interface ICountry extends ICategory {
  // nothing for now
}

export interface IYear extends ICategory {
  // nothing for now
}
export interface IEpisode {
  server_name: string;
  is_ai: boolean;
  server_data: IStreamServer[];
}

export interface IStreamServer {
  name: string;
  slug: string;
  filename?: string;
  link_embed: string;
  link_m3u8: string;
}

export interface ITmdb {
  type: string;
  id: string;
  season: number;
  vote_average: number;
  vote_count: number;
}

export interface IImdb {
  id: string;
  vote_average: number;
  vote_count: number;
}

export interface ITimeFormat {
  time: string;
}

export interface IMovie {
  tmdb: ITmdb;
  imdb: IImdb;
  created: ITimeFormat;
  modified: ITimeFormat;
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  alternative_names: string[];
  content: string;
  type: string;
  status: string;
  thumb_url: string;
  poster_url: string;
  is_copyright: boolean;
  sub_docquyen: boolean;
  chieurap: boolean;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  lang_key: string[];
  notify: string;
  showtimes: string;
  year: number;
  view: number;
  actor: string[];
  director: string[];
  category: ICategory[];
  country: ICountry[];
  episodes: IEpisode[];
}
export type IResponse<T> = {
  status: string;
  message: string;
  data: T;
};

export interface IData {
  seoOnPage: SeoOnPage;
  item: IMovie;
}

export interface SeoOnPage {
  og_type: string;
  titleHead: string;
  seoSchema: SeoSchema;
  descriptionHead: string;
  og_image: string[];
  updated_time: number;
  og_url: string;
}

export interface SeoSchema {
  "@context": string;
  "@type": string;
  name: string;
  dateModified: string;
  dateCreated: string;
  url: string;
  datePublished: string;
  image: string;
  director: string;
}

export interface IActor {
  tmdb_people_id: number;
  adult: boolean;
  gender: number;
  gender_name: string;
  name: string;
  original_name: string;
  character: string;
  known_for_department: string;
  profile_path: string;
  also_known_as: string[];
}
