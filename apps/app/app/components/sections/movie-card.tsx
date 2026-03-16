import { Play, Star } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { extractPosterUrl, fetchMovieImages } from "@/lib/services/movie";
import type { IMovie } from "@/types/response";
import { QualityTag } from "./quality-tag";

interface MovieCardProps {
  movie: IMovie;
  cdnUrl?: string;
}

export async function MovieCard({ movie, cdnUrl }: MovieCardProps) {
  // Ensure poster URL is available, fetch if needed
  let posterUrl: string;

  if (cdnUrl) {
    posterUrl = `${cdnUrl}/uploads/movies/${movie.poster_url}`;
  } else {
    try {
      const imageData = await fetchMovieImages(movie.slug);
      posterUrl = extractPosterUrl(imageData);
    } catch (error) {
      console.error(`Failed to load poster for ${movie.slug}`, error);
      posterUrl = "/images/placeholder-poster.webp"; // Fallback poster
    }
  }

  return (
    <Link href={`/movie/${movie.slug}`} className="group block">
      <div className="hover:-translate-y-2 relative aspect-2/3 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 transition-all duration-700 hover:scale-105 hover:border-white/30">
        <Image
          alt={movie.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          height={450}
          src={posterUrl}
          width={300}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
            <Play weight="fill" className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Rating badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
          <Star weight="fill" className="h-3 w-3 text-yellow-400" />
          <span className="font-700 font-mono text-white text-xs">
            {movie.imdb.vote_average.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <h3 className="line-clamp-2 font-600 text-body text-white transition-colors group-hover:text-white/80">
          {movie.name}
        </h3>
        <div className="flex items-center gap-3 text-white/50 text-xs">
          <span className="font-mono">{movie.year}</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span className="font-mono uppercase tracking-wider">
            {movie.category[0]?.name || "Unknown"}
          </span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span className="font-mono uppercase tracking-wider">
            {movie.episode_current || "Unknown"}
          </span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <QualityTag movie={movie} />
        </div>
      </div>
    </Link>
  );
}
