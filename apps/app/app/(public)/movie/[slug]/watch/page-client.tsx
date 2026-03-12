"use client";

import { SpinnerBallIcon } from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { IEpisode, IMovie, IStreamServer } from "@/types/response";
import { VideoPlayerSection, WatchControlsPanel } from "./components";

type Props = {
    params: { slug: string };
    movie: IMovie;
    episodes: IEpisode[];
};
export function MovieWatchClientPage(props: Props) {
    const { params, movie, episodes } = props;
    const searchParams = useSearchParams();
    const movieSlug = params.slug as string;
    const episodeSlug = searchParams.get("episode") || "tap-01";
    const serverName = searchParams.get("server") || "0";

    const [currentEpisode, setCurrentEpisode] = useState<IEpisode | null>(null);
    const [currentServer, setCurrentServer] = useState<IStreamServer | null>(
        null,
    );
    const playerRef = useRef<HTMLDivElement>(null);

    // Find current episode and server
    useEffect(() => {
        const serverIndex = parseInt(serverName) || 0;
        const server = episodes[serverIndex];
        const episode =
            server?.server_data.find((ep) => ep.slug === episodeSlug) ||
            server?.server_data[0];

        setCurrentServer(server);
        setCurrentEpisode(episode);
    }, [episodeSlug, serverName, episodes]);

    // Scroll to player when episode/server changes
    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            playerRef.current.focus();
        }
    }, [episodeSlug, serverName]);

    const handleEpisodeChange = (episode: IEpisode) => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("episode", episode.slug);
        window.history.pushState({}, "", newUrl);
        setCurrentEpisode(episode);
    };

    const handleServerChange = (serverIndex: number) => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("server", serverIndex.toString());
        newUrl.searchParams.set("episode", "tap-01"); // Reset to first episode
        window.history.pushState({}, "", newUrl);

        const newServer = episodes[serverIndex];
        setCurrentServer(newServer);
        setCurrentEpisode(newServer.server_data[0]);
    };

    if (!currentEpisode || !currentServer) {
        return (
            <>
                <div className="flex min-h-screen items-center justify-center bg-black">
                    <div className="flex flex-col items-center text-center text-white">
                        <SpinnerBallIcon
                            className="mb-4 animate-spin text-muted-fg"
                            size={48}
                        />
                        <p className="text-body text-white/70">
                            Preparing your video experience
                        </p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Video Player */}
            <VideoPlayerSection
                ref={playerRef}
                src={currentEpisode.link_m3u8}
                poster={movie.thumb_url}
                title={`${movie.name} - ${currentEpisode.name}`}
                episodeSlug={episodeSlug}
                movieSlug={movieSlug}
                serverName={serverName}
            />
            {/* Watch Controls & Episode Selection */}
            <WatchControlsPanel
                movieName={movie.name}
                movieDescription={movie.content.substring(0, 200) + "..."}
                currentEpisode={currentEpisode}
                currentServer={currentServer}
                servers={episodes}
                movieQuality={movie.quality}
                movieLanguage={movie.lang}
                movieDuration={movie.time}
                movieStatus={movie.status}
                onEpisodeSelect={handleEpisodeChange}
                onServerSelect={handleServerChange}
            />
        </div>
    );
}
