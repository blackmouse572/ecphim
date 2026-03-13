"use client";

import { buttonStyles } from "@repo/design-system/components/variants/buttonVariants";
import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
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
  return (
    <div className="space-y-8">
      {episodes.map((server) => (
        <div key={server.server_name}>
          <h3 className="mb-6 flex items-center gap-3 font-700 text-title text-white">
            <div className="h-6 w-1 rounded-full bg-accent-foreground" />
            Episodes ({server.server_name})
          </h3>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {server.server_data.map((episode) => (
              <Link
                key={episode.slug}
                href={`/movie/${movie.slug}/watch?episode=${episode.slug}&server=${server.server_name}`}
                onClick={() => onEpisodeSelect?.(episode)}
                className={cn(
                  buttonStyles({
                    intent:
                      currentEpisodeSlug === episode.slug
                        ? "primary"
                        : "outline",
                  }),
                  `aspect-square rounded-xl border-white/20 font-700 font-mono text-sm text-white transition-all hover:scale-110 hover:border-primary hover:bg-blue-400/10 hover:text-primary`,
                  {
                    "border-primary bg-primary text-white":
                      currentEpisodeSlug === episode.slug,
                  },
                )}
              >
                {episode.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}