import { MediaMeta } from "@repo/design-system/components/ecphim/media-tile";
import { PosterCard } from "@repo/design-system/components/ecphim/poster-card";
import Image from "next/image";
import Link from "next/link";
import {
  extractPosterUrl,
  fetchMovieImages,
  resolveImageUrl,
} from "@/lib/services/movie";
import type { IMovie } from "@/types/response";

interface MovieCardProps {
  movie: IMovie;
  cdnUrl?: string;
}

async function resolvePoster(movie: IMovie, cdnUrl?: string) {
  if (movie.thumb_url) {
    // The API swaps the naming: `thumb_url` is the portrait 2:3 poster,
    // while `poster_url` is a landscape backdrop that gets cropped wrong here.
    return resolveImageUrl(movie.thumb_url, cdnUrl);
  }
  try {
    return extractPosterUrl(await fetchMovieImages(movie.slug));
  } catch (error) {
    console.error(`Failed to load poster for ${movie.slug}`, error);
    return "/images/placeholder-poster.webp";
  }
}

/**
 * The details a card can show. VSMov list items often have no genre, episode,
 * quality or score, so only show what we have. Without a genre, fall back to
 * the TMDB type (tv = series, movie = single), and hide a zero rating.
 */
function cardMeta(movie: IMovie) {
  const rating = movie.imdb?.vote_average || movie.tmdb?.vote_average || 0;
  const typeLabel =
    movie.tmdb?.type === "tv"
      ? "Phim bộ"
      : movie.tmdb?.type === "movie"
        ? "Phim lẻ"
        : "";
  return {
    rating: rating > 0 ? rating : undefined,
    year: movie.year || undefined,
    items: [
      movie.category?.[0]?.name || typeLabel,
      movie.episode_current,
    ].filter((item): item is string => Boolean(item)),
  };
}

/** A poster card for one movie: maps the API movie onto the design system. */
export async function MovieCard({ movie, cdnUrl }: MovieCardProps) {
  const poster = await resolvePoster(movie, cdnUrl);
  const { rating, year, items } = cardMeta(movie);

  return (
    <PosterCard
      artwork={
        <Image
          alt=""
          height={264}
          sizes="(min-width: 1024px) 176px, (min-width: 640px) 160px, 144px"
          src={poster}
          width={176}
        />
      }
      badge={movie.quality || undefined}
      meta={
        <MediaMeta
          className="text-muted-foreground"
          items={items}
          rating={rating}
          year={year}
        />
      }
      render={<Link href={`/movie/${movie.slug}`} />}
      title={movie.name}
    />
  );
}
