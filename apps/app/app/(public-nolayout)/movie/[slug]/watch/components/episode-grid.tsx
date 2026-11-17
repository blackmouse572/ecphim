"use client";

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

  const multipleServers = episodes.length > 1;

  return (
    <div className="grid gap-6">
      {episodes.map((server) => (
        <section
          aria-label={`Tập phim (${server.server_name})`}
          className="grid gap-3"
          key={server.server_name}
        >
          {multipleServers ? (
            <h3 className="font-medium text-muted-foreground text-sm">
              {server.server_name}
            </h3>
          ) : null}

          <ul className="grid grid-cols-[repeat(auto-fill,minmax(3.75rem,1fr))] gap-2">
            {server.server_data.map((episode) => {
              const status = getEpisodeStatus(episode);
              const progressPercentage = getProgressPercentage(episode);
              const isCurrent = currentEpisodeSlug === episode.slug;

              return (
                <li key={episode.slug}>
                  <Link
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "squircle relative flex h-11 items-center justify-center overflow-hidden rounded-(--radius-squircle-sm) px-2 font-medium font-mono text-sm tabular-nums outline-none transition-[transform,background-color,color] duration-100 ease-out focus-visible:ring-3 focus-visible:ring-ring/60 active:scale-[0.96] motion-reduce:active:scale-100",
                      isCurrent
                        ? "skeuo-primary"
                        : "bg-muted text-foreground/85 ring-1 ring-border hover:bg-accent hover:text-foreground",
                      status === "watched" &&
                        !isCurrent &&
                        "text-muted-foreground",
                    )}
                    href={`/movie/${movie.slug}/watch?episode=${episode.slug}&server=${encodeURIComponent(server.server_name)}`}
                    onClick={() => onEpisodeSelect?.(episode)}
                    title={
                      status === "watched"
                        ? "Đã xem"
                        : status === "inProgress"
                          ? "Đang xem dở"
                          : undefined
                    }
                  >
                    <span className="truncate">{episode.name}</span>
                    {status !== "unwatched" && !isCurrent ? (
                      <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                        style={{
                          width:
                            status === "watched"
                              ? "100%"
                              : `${progressPercentage}%`,
                        }}
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
