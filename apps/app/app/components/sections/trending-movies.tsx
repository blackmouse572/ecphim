import {
  MediaRow,
  MediaRowItem,
  mediaRowActionClassName,
} from "@repo/design-system/components/ecphim/media-row";
import Link from "next/link";
import type { IMovie } from "@/types/response";
import { MovieCard } from "./movie-card";

interface TrendingMoviesProps {
  movies: IMovie[];
  title?: string;
  viewAllUrl?: string;
  cdnUrl?: string;
}

/** A home page row of posters that scrolls sideways. */
export function TrendingMovies({
  movies,
  title = "Phim mới",
  viewAllUrl = "/discover",
  cdnUrl,
}: TrendingMoviesProps) {
  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <MediaRow
        action={
          <Link className={mediaRowActionClassName} href={viewAllUrl}>
            Xem tất cả
          </Link>
        }
        title={title}
      >
        {movies.map((movie) => (
          <MediaRowItem key={movie._id}>
            <MovieCard cdnUrl={cdnUrl} movie={movie} />
          </MediaRowItem>
        ))}
      </MediaRow>
    </div>
  );
}
