"use client";

import { SpinnerBallIcon } from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import { forwardRef, useEffect, useRef } from "react";
import { useWatchProgress } from "@/lib/use-watch-progress";
import {
  markEpisodeVisited,
  shouldRestoreProgress,
} from "@/lib/watch-progress";
import type { VideoJSReactPlayerRef } from "./videojs-react-player";

const VideoPlayer = dynamic(
  () => import("./videojs-react-player").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center text-center text-white">
          <SpinnerBallIcon
            className="mb-4 animate-spin text-muted-fg"
            size={48}
          />
          <p className="text-body text-white/70">Preparing your player</p>
        </div>
      </div>
    ),
  },
);

interface VideoPlayerSectionProps {
  src: string;
  /** Iframe player URL, used when there is no HLS `src` (VSMov only has embeds). */
  embedSrc?: string;
  poster: string;
  title: string;
  movieSlug?: string;
  episodeSlug?: string;
  onEnded?: () => void;
}

export const VideoPlayerSection = forwardRef<
  HTMLDivElement,
  VideoPlayerSectionProps
>(function VideoPlayerSection(
  { src, embedSrc, poster, title, movieSlug, episodeSlug, onEnded },
  ref,
) {
  const internalRef = useRef<HTMLDivElement>(null);
  const videoPlayerRef = useRef<VideoJSReactPlayerRef>(null);

  // Progress tracking hook
  const { updateProgress, flushProgress, progress } = useWatchProgress({
    movieSlug: movieSlug || "",
    episodeSlug: episodeSlug || "",
    onProgressRestore: (currentTime) => {
      // Queued by the player until the source's metadata has loaded.
      videoPlayerRef.current?.setCurrentTime(currentTime);
    },
  });

  const isEmbed = !src && Boolean(embedSrc);

  // Embed players can't report their time, but remember the episode so
  // "continue watching" reopens it.
  useEffect(() => {
    if (isEmbed && movieSlug && episodeSlug) {
      markEpisodeVisited(movieSlug, episodeSlug);
    }
  }, [isEmbed, movieSlug, episodeSlug]);

  const lastTimeRef = useRef({ currentTime: 0, duration: 0 });

  // Handle time updates from video player
  const handleTimeUpdate = (currentTime: number, duration: number) => {
    lastTimeRef.current = { currentTime, duration };
    updateProgress({ currentTime, duration });
  };

  const handlePause = () => {
    flushProgress();
  };

  const handleEnded = () => {
    // Record the episode as finished before auto-next switches away.
    const { duration } = lastTimeRef.current;
    if (duration > 0) {
      updateProgress({ currentTime: duration, duration });
    }
    flushProgress();
    onEnded?.();
  };

  if (isEmbed) {
    // Cross-origin iframe: playback progress and auto-next can't be tracked.
    return (
      <div
        ref={ref || internalRef}
        className="relative h-screen w-full bg-black"
      >
        <iframe
          src={embedSrc}
          title={title}
          className="h-full w-full border-0"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="origin"
        />
      </div>
    );
  }

  return (
    <div ref={ref || internalRef} className="relative h-screen w-full bg-black">
      <VideoPlayer
        ref={videoPlayerRef}
        src={src}
        poster={poster}
        title={title}
        className="h-full w-full"
        autoPlay={true}
        onTimeUpdate={handleTimeUpdate}
        onPause={handlePause}
        onEnded={handleEnded}
        currentTime={
          progress && shouldRestoreProgress(progress) ? progress.currentTime : 0
        }
      />
    </div>
  );
});
