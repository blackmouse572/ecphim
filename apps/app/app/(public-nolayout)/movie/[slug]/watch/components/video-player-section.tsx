"use client";

import { SpinnerBallIcon } from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import { forwardRef, useRef } from "react";

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

  return (
    <div ref={ref || internalRef} className="relative h-screen w-full bg-black">
      <VideoPlayer
        key={movieSlug + serverName + episodeSlug}
        src={src}
        poster={poster}
        title={title}
        className="h-full w-full"
        autoPlay={true}
      />
    </div>
  );
});
