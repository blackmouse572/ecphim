import { createMetadata } from "@repo/seo/metadata";
import {
  extractBackdropUrl,
  fetchMovieDetail,
  fetchMovieImages,
} from "../../../../../lib/services/movie";
import { MovieWatchClientPage } from "./page-client";

type Props = {
  params: Promise<{ slug: string }>;
};
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const movie = await fetchMovieDetail(slug);
  return createMetadata({
    title: movie.name,
    description: movie.content,
  });
}

export default async function MovieWatchPage({ params }: Props) {
  const { slug } = await params;
  const movie = await fetchMovieDetail(slug);
  const imageData = await fetchMovieImages(slug);
  const backdrop = extractBackdropUrl(imageData, "original");

  return (
    <MovieWatchClientPage
      params={{ slug }}
      movie={{ ...movie, thumb_url: backdrop }}
      episodes={movie.episodes}
    />
  );
}
