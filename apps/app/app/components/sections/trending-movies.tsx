import {
  MotionFadeIn,
  MotionItem,
  MotionList,
} from "@repo/design-system/components/motion";
import Link from "next/link";
import type { IMovie } from "@/types/response";
import { MovieCard } from "./movie-card";
import { BGPattern } from "../bg-pattern";

interface TrendingMoviesProps {
  movies: IMovie[];
  title?: string;
  viewAllUrl?: string;
  cdnUrl?: string;
}

export function TrendingMovies({
  movies,
  title = "Trending Now",
  viewAllUrl = "/browse",
  cdnUrl,
}: TrendingMoviesProps) {
  return (
    <section className="py-24 relative">
      <BGPattern
        className="max-h-[50vh]"
        variant="vertical-lines"
        size={60}
        mask="fade-bottom"
      />
      <div className="container mx-auto max-w-7xl px-">
        <MotionFadeIn>
          <div className="relative mb-12 flex items-center justify-between">
            <h2 className="font-900 text-headline text-white">{title}</h2>
            <Link
              href={viewAllUrl}
              className="border-white/20 border-b pb-1 font-400 text-body text-white/60 transition-colors hover:border-white/60 hover:text-white"
            >
              Xem tất cả
            </Link>
          </div>
        </MotionFadeIn>

        <MotionList className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-4">
          {movies.map((movie, index) => (
            <MotionItem whileInView key={movie._id} delay={index * 0.05}>
              <MovieCard movie={movie} cdnUrl={cdnUrl} />
            </MotionItem>
          ))}
        </MotionList>
      </div>
    </section>
  );
}
