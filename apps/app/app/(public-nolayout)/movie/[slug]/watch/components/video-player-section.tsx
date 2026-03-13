"use client";

import type { VideoPlayerProps } from "@ntxmjs/react-custom-video-player";
import {
  ArrowLeftIcon,
  ArrowsInSimpleIcon,
  CheckIcon,
  ClosedCaptioningIcon,
  CornersInIcon,
  CornersOutIcon,
  GearIcon,
  HighDefinitionIcon,
  PauseIcon,
  PictureInPictureIcon,
  PlayIcon,
  SpeakerHighIcon,
  SpeakerXIcon,
  SpeedometerIcon,
  SpinnerBallIcon,
  TimerIcon,
} from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import { type ComponentType, forwardRef, useRef, useState } from "react";

const playerIcons = {
  play: <PlayIcon size={18} />,
  pause: <PauseIcon size={18} />,
  volume: <SpeakerHighIcon size={18} />,
  volumeMute: <SpeakerXIcon size={18} />,
  fullscreen: <CornersOutIcon size={18} />,
  exitFullscreen: <CornersInIcon size={18} />,
  pip: <PictureInPictureIcon size={18} />,
  settings: <GearIcon weight="fill" size={18} />,
  speed: <SpeedometerIcon weight="fill" size={18} />,
  cc: <ClosedCaptioningIcon weight="fill" size={18} />,
  back: <ArrowLeftIcon size={18} />,
  theater: <ArrowsInSimpleIcon size={18} />,
  check: <CheckIcon size={18} />,
  hdChip: <HighDefinitionIcon weight="fill" size={18} />,
  sleepTimer: <TimerIcon weight="fill" size={18} />,
};

const VideoPlayer = dynamic(
  async () => {
    const mod = (await import("@ntxmjs/react-custom-video-player")) as any;
    return mod.CustomVideoPlayer as ComponentType<
      VideoPlayerProps & {
        icons: Record<string, React.ReactNode>;
        type?: "auto" | "html5";
        controlSize?: number;
        enablePreviewOnHover?: boolean;
      }
    >;
  },
  {
    ssr: false,
    loading: () => (
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (internalRef.current?.requestFullscreen) {
        internalRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div ref={ref || internalRef} className="relative h-screen w-full bg-black">
      <VideoPlayer
        key={movieSlug + serverName + episodeSlug}
        src={src}
        poster={poster}
        title={title}
        className="h-full w-full"
        autoPlay
        controls
        playsInline
        crossOrigin="anonymous"
        icons={playerIcons}
        type="auto"
        enablePreviewOnHover={true}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#000",
        }}
        preload="metadata"
        controlsList="nodownload"
      />
    </div>
  );
});
