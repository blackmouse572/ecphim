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

/** A poster card for one movie: maps the API movie onto the design system. */
export async function MovieCard({ movie, cdnUrl }: MovieCardProps) {
  const poster = await resolvePoster(movie, cdnUrl);

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
          items={movie.episode_current ? [movie.episode_current] : []}
          rating={movie.imdb?.vote_average || undefined}
          year={movie.year}
        />
      }
      render={<Link href={`/movie/${movie.slug}`} />}
      title={movie.name}
    />
  );
}
