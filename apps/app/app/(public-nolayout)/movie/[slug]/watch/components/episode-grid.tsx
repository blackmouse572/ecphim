"use client";

import { buttonStyles } from "@repo/design-system/components/variants/buttonVariants";
import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
import { useMemo } from "react";
import { getMovieWatchProgress, isVideoWatched } from "@/lib/watch-progress";
import type { IEpisode, IMovie } from "../../../../../../types/response";

interface EpisodeGridProps {
  movie: IMovie;
  currentEpisodeSlug?: string;
  onEpisodeSelect?: (episode: IEpisode) => void;
}

export function EpisodeGrid({
  movie,
  currentEpisodeSlug,
  onEpisodeSelect,
}: EpisodeGridProps) {
  const { episodes } = movie;

  // Get all progress for this movie
  const movieProgress = useMemo(() => {
    const progress = getMovieWatchProgress(movie.slug);
    const progressMap = new Map();
    for (const p of progress) {
      progressMap.set(p.episodeSlug, p);
    }
    return progressMap;
  }, [movie.slug]);

  const getEpisodeStatus = (episode: IEpisode) => {
    const progress = movieProgress.get(episode.slug);
    if (!progress) return "unwatched";
    if (isVideoWatched(progress.currentTime, progress.duration))
      return "watched";
    return "inProgress";
  };

  const getProgressPercentage = (episode: IEpisode) => {
    const progress = movieProgress.get(episode.slug);
    return progress ? progress.watchedPercentage : 0;
  };

  return (
    <div className="space-y-8">
      {episodes.map((server) => (
        <div key={server.server_name}>
          <h3 className="mb-6 flex items-center gap-3 font-700 text-title text-white">
            <div className="h-6 w-1 rounded-full bg-accent-foreground" />
            Tập ({server.server_name})
          </h3>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {server.server_data.map((episode) => {
              const status = getEpisodeStatus(episode);
              const progressPercentage = getProgressPercentage(episode);

              return (
                <div key={episode.slug} className="relative">
                  <Link
                    href={`/movie/${movie.slug}/watch?episode=${episode.slug}&server=${server.server_name}`}
                    onClick={() => onEpisodeSelect?.(episode)}
                    className={cn(
                      buttonStyles({
                        intent:
                          currentEpisodeSlug === episode.slug
                            ? "primary"
                            : "outline",
                      }),
                      `relative aspect-square size-18 overflow-hidden rounded-lg border-white/20 font-700 font-mono text-lg text-white transition-all hover:scale-110 hover:border-primary hover:bg-blue-400/10 hover:text-primary sm:size-16`,
                      {
                        "border-primary bg-primary text-white":
                          currentEpisodeSlug === episode.slug,
                        "border-green-500/30 bg-green-500/10":
                          status === "watched" &&
                          currentEpisodeSlug !== episode.slug,
                        "border-yellow-500/30 bg-yellow-500/10":
                          status === "inProgress" &&
                          currentEpisodeSlug !== episode.slug,
                      },
                    )}
                  >
                    {episode.name}

                    {/* Progress indicator */}
                    {status === "inProgress" && (
                      <div
                        className="absolute bottom-0 left-0 h-1 bg-yellow-400 transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    )}

                    {/* Watched indicator */}
                    {status === "watched" && (
                      <div className="absolute bottom-0 left-0 h-1 w-full bg-green-400" />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
