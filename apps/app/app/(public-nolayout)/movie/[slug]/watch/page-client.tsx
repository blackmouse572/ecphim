"use client";

import { SpinnerBallIcon } from "@phosphor-icons/react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useMemo, useRef } from "react";
import {
  getMovieWatchProgress,
  shouldRestoreProgress,
} from "@/lib/watch-progress";
import type { IMovie, IStreamServer } from "@/types/response";
import {
  EpisodeGrid,
  NextEpisodeSection,
  ServerSelector,
  VideoInfoPanel,
  VideoPlayerSection,
} from "./components";

type Props = {
  params: { slug: string };
  movie: IMovie;
  episodes: IStreamServer[];
};
export function MovieWatchClientPage(props: Props) {
  const { params, movie, episodes } = props;

  const movieSlug = params.slug as string;
  const [episodeSlug, setEpisodeSlug] = useQueryState("episode", parseAsString);
  const [serverName, setServerName] = useQueryState("server", parseAsString);

  // Auto-select based on progress when no URL params exist
  useEffect(() => {
    // Only auto-select if no URL parameters are set
    if (!episodeSlug && !serverName && episodes.length > 0) {
      const movieProgress = getMovieWatchProgress(movieSlug);

      // Find the most recently watched episode with restorable progress
      const recentProgress = movieProgress
        .filter(shouldRestoreProgress)
        .sort(
          (a, b) =>
            new Date(b.lastWatched).getTime() -
            new Date(a.lastWatched).getTime(),
        )[0];

      if (recentProgress) {
        // Find the server that contains this episode
        const targetServer = episodes.find((server) =>
          server.server_data.some(
            (ep) => ep.slug === recentProgress.episodeSlug,
          ),
        );

        if (targetServer) {
          // Set both episode and server to restore the user's last position
          setEpisodeSlug(recentProgress.episodeSlug);
          setServerName(targetServer.server_name);
        }
      } else {
        // If no restorable progress, default to first server and first episode
        const firstServer = episodes[0];
        if (firstServer && firstServer.server_data.length > 0) {
          setEpisodeSlug(firstServer.server_data[0].slug);
          setServerName(firstServer.server_name);
        }
      }
    }
  }, [
    episodeSlug,
    serverName,
    movieSlug,
    episodes,
    setEpisodeSlug,
    setServerName,
  ]);

  const playerRef = useRef<HTMLDivElement>(null);
  const currentServer = useMemo(() => {
    return episodes.find((s) => s.server_name === serverName) || episodes[0];
  }, [serverName, episodes]);
  const currentEpisode = useMemo(() => {
    return (
      currentServer?.server_data.find((ep) => ep.slug === episodeSlug) ||
      currentServer?.server_data[0]
    );
  }, [episodeSlug, currentServer]);

  const nextEpisode = useMemo(() => {
    if (!currentEpisode) return null;
    const currentIndex = currentServer.server_data.findIndex(
      (ep) => ep.slug === currentEpisode.slug,
    );
    return currentServer.server_data[currentIndex + 1] || null;
  }, [currentEpisode, currentServer]);
  const previousEpisode = useMemo(() => {
    if (!currentEpisode) return null;
    const currentIndex = currentServer.server_data.findIndex(
      (ep) => ep.slug === currentEpisode.slug,
    );
    return currentServer.server_data[currentIndex - 1] || null;
  }, [currentEpisode, currentServer]);

  // Scroll to player when episode/server changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      playerRef.current.focus();
    }
  }, [episodeSlug, serverName]);

  const handleServerChange = (serverIndex: IStreamServer) => {
    setServerName(serverIndex.server_name);
  };

  const router = useRouter();
  useHotkey("Escape", () => {
    router.push(`/movie/${movieSlug}`);
  });

  if (!currentEpisode) {
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
        episodeSlug={episodeSlug || "#"}
        movieSlug={movieSlug}
        serverName={serverName || "#"}
      />
      <div className="border-white/10 border-t bg-linear-to-t from-black via-zinc-950 to-zinc-900">
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
            {/* Episodes Grid */}
            <EpisodeGrid
              movie={movie}
              currentEpisodeSlug={currentEpisode.slug}
            />

            {/* Sidebar - Server Selection & Info */}
            <div className="space-y-6">
              {/* Continue Watching Suggestions */}
              {movie.type !== "single" && (
                <NextEpisodeSection
                  nextEpisode={nextEpisode}
                  onPlayNext={(ep) => setEpisodeSlug(ep.slug)}
                  previousEpisode={previousEpisode}
                  onPlayPrevious={(ep) => setEpisodeSlug(ep.slug)}
                />
              )}
              {/* Server Selector */}
              <ServerSelector
                servers={movie.episodes}
                currentServerName={currentServer.server_name}
                onServerSelect={handleServerChange}
              />

              {/* Video Quality & Language Info */}
              <VideoInfoPanel
                quality={movie.quality}
                language={movie.lang}
                duration={movie.time}
                status={movie.status}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
