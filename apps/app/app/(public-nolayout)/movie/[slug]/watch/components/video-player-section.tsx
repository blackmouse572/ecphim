"use client";

import { SpinnerBallIcon } from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import { forwardRef, useRef } from "react";
import { useWatchProgress } from "@/lib/use-watch-progress";
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
  poster: string;
  title: string;
  episodeSlug: string;
  movieSlug: string;
  serverName: string;
}

export const VideoPlayerSection = forwardRef<
  HTMLDivElement,
  VideoPlayerSectionProps
>(function VideoPlayerSection(
  { src, poster, title, episodeSlug, movieSlug, serverName },
  ref,
) {
  const internalRef = useRef<HTMLDivElement>(null);
  const videoPlayerRef = useRef<VideoJSReactPlayerRef>(null);

  // Progress tracking hook
  const { updateProgress, progress, isRestored } = useWatchProgress({
    movieSlug,
    episodeSlug,
    onProgressRestore: (currentTime) => {
      // Restore saved time when video loads
      if (videoPlayerRef.current) {
        videoPlayerRef.current.setCurrentTime(currentTime);
      }
    },
  });

  // Handle time updates from video player
  const handleTimeUpdate = (currentTime: number, duration: number) => {
    updateProgress({ currentTime, duration });
  };

  return (
    <div ref={ref || internalRef} className="relative h-screen w-full bg-black">
      <VideoPlayer
        ref={videoPlayerRef}
        key={movieSlug + serverName + episodeSlug}
        src={src}
        poster={poster}
        title={title}
        className="h-full w-full"
        autoPlay={true}
        onTimeUpdate={handleTimeUpdate}
      />
      
      {/* Progress indicator (optional visual feedback) */}
      {progress && isRestored && (
        <div className="absolute bottom-4 left-4 rounded bg-black/80 px-3 py-2 text-sm text-white">
          Resumed from {Math.floor(progress.currentTime / 60)}:{String(Math.floor(progress.currentTime % 60)).padStart(2, '0')}
        </div>
      )}
    </div>
  );
});
