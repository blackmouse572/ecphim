"use client";

import type React from "react";
import { forwardRef, useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./videojs-react-player.css";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import "videojs-hotkeys";
import { cn } from "@repo/design-system/lib/utils";

export interface VideoJSReactPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  controls?: boolean;
  fluid?: boolean;
  responsive?: boolean;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: any) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export interface VideoJSReactPlayerRef {
  player: ReturnType<typeof videojs> | null;
}

const VideoJSReactPlayer = forwardRef<
  VideoJSReactPlayerRef,
  VideoJSReactPlayerProps
>(function VideoJSReactPlayer(
  {
    src,
    poster,
    title,
    autoPlay = false,
    controls = true,
    fluid = true,
    responsive = true,
    width,
    height,
    className = "",
    style,
    onReady,
    onPlay,
    onPause,
    onEnded,
    onError,
    onTimeUpdate,
  },
  ref,
) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);
      const options = {
        playinline: true,
        preload: "auto",
      };
      const player = videojs(videoElement, options, () => {});
      playerRef.current = player;

      player.src(src);
      if (poster) player.poster(poster);
      player.autoplay(autoPlay);
      player.controls(controls);
      player.fluid(fluid);
      if (width) player.width(width);
      if (height) player.height(height);
      (player as any).qualityLevels();
      (player as any).hlsQualitySelector();
      (player as any).hotkeys({
        volumeStep: 0.1,
        seekStep: 5,
        enableModifiersForNumbers: false,
      });
    } else {
      const player = playerRef.current;
      player.src(src);
      if (poster) player.poster(poster);
      player.autoplay(autoPlay);
      player.controls(controls);
      player.fluid(fluid);
      if (width) player.width(width);
      if (height) player.height(height);
    }
  }, [
    src,
    autoPlay,
    controls,
    fluid,
    responsive,
    width,
    height,
    poster,
    onReady,
    onPlay,
    onPause,
    onEnded,
    onError,
    onTimeUpdate,
    ref,
  ]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className={cn("video-player", className)}>
      <div className={"size-full"} ref={videoRef} />
    </div>
  );
});

export default VideoJSReactPlayer;
