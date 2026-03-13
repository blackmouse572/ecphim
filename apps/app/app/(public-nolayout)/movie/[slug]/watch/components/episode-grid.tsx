"use client";

import { Button } from "@repo/design-system/components/ui/button";

interface Episode {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

interface EpisodeGridProps {
  episodes: Episode[];
  currentEpisodeSlug: string;
  episodeCount: number;
  onEpisodeSelect: (episode: Episode) => void;
}

export function EpisodeGrid({
  episodes,
  currentEpisodeSlug,
  episodeCount,
  onEpisodeSelect,
}: EpisodeGridProps) {
  return (
    <div>
      <h3 className="mb-6 flex items-center gap-3 font-700 text-title text-white">
        <div className="h-6 w-1 rounded-full bg-accent-foreground" />
        Episodes ({episodeCount})
      </h3>

      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
        {episodes.map((episode) => (
          <Button
            key={episode.slug}
            intent={currentEpisodeSlug === episode.slug ? "primary" : "outline"}
            onClick={() => onEpisodeSelect(episode)}
            className={`aspect-square rounded-xl border-white/20 font-700 font-mono text-sm text-white transition-all hover:scale-110 hover:border-primary hover:bg-blue-400/10 hover:text-primary ${
              currentEpisodeSlug === episode.slug
                ? "border-primary bg-primary text-white"
                : ""
            }
            `}
          >
            {episode.name.replace("Tập ", "")}
          </Button>
        ))}
      </div>
    </div>
  );
}
