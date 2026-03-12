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
			<h3 className="text-title font-700 text-white mb-6 flex items-center gap-3">
				<div className="w-1 h-6 bg-accent-foreground rounded-full" />
				Episodes ({episodeCount})
			</h3>

			<div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
				{episodes.map((episode) => (
					<Button
						key={episode.slug}
						intent={currentEpisodeSlug === episode.slug ? "primary" : "outline"}
						onClick={() => onEpisodeSelect(episode)}
						className={`
              aspect-square border-white/20 text-white hover:border-primary hover:bg-blue-400/10 hover:text-primary transition-all hover:scale-110 rounded-xl font-mono font-700 text-sm
              ${
								currentEpisodeSlug === episode.slug
									? "bg-primary border-primary text-white"
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
