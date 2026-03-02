"use client";

import { ArrowLeft } from "@phosphor-icons/react";
import { Button } from "@repo/design-system/components/ui/button";
import { PublicLayout } from "../../../components/public-layout";
import { MOCK_MOVIE } from "../data";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  VideoPlayerSection,
  WatchControlsPanel,
} from "./components";

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

export default function MovieWatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const movieSlug = params.slug as string;
  const episodeSlug = searchParams.get("episode") || "tap-01";
  const serverName = searchParams.get("server") || "0";

  const { movie, episodes } = MOCK_MOVIE;
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [currentServer, setCurrentServer] = useState<ServerData | null>(null)
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
    }
  }, [episodeSlug, serverName]);

  const handleEpisodeChange = (episode: Episode) => {
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
  }

  if (!currentEpisode || !currentServer) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-headline mb-4">Loading...</h2>
            <p className="text-body text-white/70">
              Preparing your video experience
            </p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-black">
        {/* Navigation */}
        <div className="absolute top-4 left-4 z-50">
          <Button
            intent="plain"
            className="bg-black/50 border border-white/20 text-white backdrop-blur-sm hover:bg-black/70 hover:scale-105 transition-all"
          >
            <Link href={`/movie/${movieSlug}`}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Movie
            </Link>
          </Button>
        </div>

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
    </PublicLayout>
  );
}