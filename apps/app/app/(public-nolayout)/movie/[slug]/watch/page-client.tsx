"use client";

import { SpinnerBallIcon } from "@phosphor-icons/react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { type ReactNode, useEffect, useMemo, useRef } from "react";
import { getResumeEpisode } from "@/lib/watch-progress";
import type { IMovie, IStreamServer } from "@/types/response";
import { EpisodeGrid, VideoPlayerSection, WatchToolbar } from "./components";
import { episodeLabel } from "./components/watch-toolbar";

type Props = {
  params: { slug: string };
  movie: IMovie;
  episodes: IStreamServer[];
  /** Shown under the episodes; rendered by the server page (e.g. related films). */
  children?: ReactNode;
};
export function MovieWatchClientPage(props: Props) {
  const { params, movie, episodes, children } = props;

  const movieSlug = params.slug as string;
  const [episodeSlug, setEpisodeSlug] = useQueryState("episode", parseAsString);
  const [serverName, setServerName] = useQueryState("server", parseAsString);

  // Auto-select based on progress when no URL params exist
  useEffect(() => {
    // Only auto-select if no URL parameters are set
    if (!episodeSlug && !serverName && episodes.length > 0) {
      // The most recently watched, unfinished episode (embed visits included)
      const recentProgress = getResumeEpisode(movieSlug);

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

  // Handle auto-navigation to next episode when video ends
  const handleVideoEnded = () => {
    if (nextEpisode) {
      setEpisodeSlug(nextEpisode.slug);
    }
  };

  const router = useRouter();
  useHotkey("Escape", () => {
    router.push(`/movie/${movieSlug}`);
  });

  if (!currentEpisode) {
    return (
      <>
        <div className="flex aspect-video max-h-[calc(100svh-3.5rem)] w-full items-center justify-center bg-black">
          <div className="flex flex-col items-center text-center text-white">
            <SpinnerBallIcon
              className="mb-4 animate-spin text-muted-fg"
              size={48}
            />
            <p className="text-body text-white/70">Đang chuẩn bị video</p>
          </div>
        </div>
      </>
    );
  }

  const episodeCount = episodes.reduce(
    (most, server) => Math.max(most, server.server_data.length),
    0,
  );
  const isSeries = movie.type !== "single" && episodeCount > 1;

  return (
    <div>
      <div className="bg-black">
        <VideoPlayerSection
          embedSrc={currentEpisode.link_embed}
          episodeSlug={currentEpisode.slug}
          key={`${serverName}-${episodeSlug}`}
          movieSlug={movieSlug}
          onEnded={handleVideoEnded}
          poster={movie.thumb_url}
          ref={playerRef}
          src={currentEpisode.link_m3u8}
          title={`${movie.name} - ${episodeLabel(currentEpisode.name)}`}
        />
      </div>

      <div className="container mx-auto grid max-w-7xl gap-10 px-4 py-6 md:px-6">
        <WatchToolbar
          currentServerName={currentServer.server_name}
          episode={currentEpisode}
          isSeries={isSeries}
          nextEpisode={nextEpisode}
          onSelectEpisode={(ep) => setEpisodeSlug(ep.slug)}
          onSelectServer={handleServerChange}
          previousEpisode={previousEpisode}
          servers={episodes}
          title={movie.name}
        />

        {isSeries ? (
          <section aria-labelledby="episodes" className="grid gap-4">
            <h2
              className="font-semibold text-lg tracking-[-0.015em]"
              id="episodes"
            >
              Danh sách tập
            </h2>
            <EpisodeGrid
              currentEpisodeSlug={currentEpisode.slug}
              movie={{ ...movie, episodes: [currentServer] }}
            />
          </section>
        ) : null}
      </div>
      {children}
    </div>
  );
}
