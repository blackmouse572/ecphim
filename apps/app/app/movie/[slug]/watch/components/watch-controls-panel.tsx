"use client";

import { CurrentEpisodeInfo } from "./current-episode-info";
import { EpisodeGrid } from "./episode-grid";
import { ServerSelector } from "./server-selector";
import { VideoInfoPanel } from "./video-info-panel";
import { NextEpisodeSection } from "./next-episode-section";

interface Episode {
    name: string;
    slug: string;
    filename: string;
    link_embed: string;
    link_m3u8: string;
}

interface ServerData {
    server_name: string;
    server_data: Episode[];
}

interface WatchControlsPanelProps {
    movieName: string;
    movieDescription: string;
    currentEpisode: Episode;
    currentServer: ServerData;
    servers: ServerData[];
    movieQuality: string;
    movieLanguage: string;
    movieDuration: string;
    movieStatus: string;
    onEpisodeSelect: (episode: Episode) => void;
    onServerSelect: (serverIndex: number) => void;
}

export function WatchControlsPanel({
    movieName,
    movieDescription,
    currentEpisode,
    currentServer,
    servers,
    movieQuality,
    movieLanguage,
    movieDuration,
    movieStatus,
    onEpisodeSelect,
    onServerSelect,
}: WatchControlsPanelProps) {
    const currentEpisodeIndex = currentServer.server_data.findIndex(
        (ep) => ep.slug === currentEpisode.slug
    );
    const nextEpisode =
        currentServer.server_data[currentEpisodeIndex + 1] || null;

    return (
        <div className="bg-linear-to-t from-black via-zinc-950 to-zinc-900 border-t border-white/10">
            <div className="container mx-auto max-w-7xl px-6 py-8">
                {/* Current Episode Info */}
                <CurrentEpisodeInfo
                    movieName={movieName}
                    episodeName={currentEpisode.name}
                    serverName={currentServer.server_name}
                    description={movieDescription}
                />

                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
                    {/* Episodes Grid */}
                    <EpisodeGrid
                        episodes={currentServer.server_data}
                        currentEpisodeSlug={currentEpisode.slug}
                        episodeCount={currentServer.server_data.length}
                        onEpisodeSelect={onEpisodeSelect}
                    />

                    {/* Sidebar - Server Selection & Info */}
                    <div className="space-y-6">
                        {/* Server Selector */}
                        <ServerSelector
                            servers={servers}
                            currentServerName={currentServer.server_name}
                            onServerSelect={onServerSelect}
                        />

                        {/* Video Quality & Language Info */}
                        <VideoInfoPanel
                            quality={movieQuality}
                            language={movieLanguage}
                            duration={movieDuration}
                            status={movieStatus}
                        />

                        {/* Continue Watching Suggestions */}
                        <NextEpisodeSection
                            nextEpisode={nextEpisode}
                            onPlayNext={(ep) => onEpisodeSelect(ep as Episode)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
