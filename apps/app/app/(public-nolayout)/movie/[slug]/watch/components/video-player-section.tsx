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
  const { updateProgress, progress } = useWatchProgress({
    movieSlug: movieSlug || "",
    episodeSlug: episodeSlug || "",
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

  if (!src && embedSrc) {
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
        onEnded={onEnded}
        currentTime={progress?.currentTime || 0}
      />
    </div>
  );
});
