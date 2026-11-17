"use client";

import type React from "react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./videojs-react-player.css";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import "videojs-hotkeys";
import { cn } from "@repo/design-system/lib/utils";

const VOLUME_STORAGE_KEY = "videojs-volume";

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
  currentTime?: number; // Optional prop to set current time from outside - initial once
}

export interface VideoJSReactPlayerRef {
  player: ReturnType<typeof videojs> | null;
  setCurrentTime: (time: number) => void;
}

const VideoJSReactPlayer = forwardRef<
  VideoJSReactPlayerRef,
  VideoJSReactPlayerProps
>(function VideoJSReactPlayer(
  {
    src,
    poster,
    autoPlay = false,
    currentTime,
    controls = true,
    fluid = true,
    responsive = true,
    width,
    height,
    className = "",
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

  // Event handlers are read from a ref so the player never has to be rebuilt
  // (or its source reset) when the parent re-renders with new callbacks. They
  // also always see the latest closure, e.g. the current episode slug after
  // auto-next, instead of the one captured when the player was created.
  const callbacksRef = useRef({
    onReady,
    onPlay,
    onPause,
    onEnded,
    onError,
    onTimeUpdate,
  });
  callbacksRef.current = {
    onReady,
    onPlay,
    onPause,
    onEnded,
    onError,
    onTimeUpdate,
  };

  // Seek target applied once the current source has loaded its metadata.
  const pendingSeekRef = useRef<number>(currentTime ?? 0);
  const loadedSrcRef = useRef<string | null>(null);

  const applyPendingSeek = () => {
    const player = playerRef.current;
    const target = pendingSeekRef.current;
    if (!player || player.isDisposed() || !(target > 0)) return;
    // readyState >= 1 (HAVE_METADATA) means seeking will stick.
    if ((player.readyState() ?? 0) >= 1) {
      player.currentTime(target);
      pendingSeekRef.current = 0;
    }
  };

  // Create the player once and dispose it on unmount.
  useEffect(() => {
    if (!videoRef.current || playerRef.current) return;

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

    loadedSrcRef.current = src;
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
      enableVolumeScroll: false,
      alwaysCaptureHotkeys: true,
    });

    player.ready(() => callbacksRef.current.onReady?.());
    player.on("play", () => callbacksRef.current.onPlay?.());
    player.on("pause", () => callbacksRef.current.onPause?.());
    player.on("ended", () => callbacksRef.current.onEnded?.());
    player.on("error", (e: unknown) => callbacksRef.current.onError?.(e));
    player.on("loadedmetadata", applyPendingSeek);
    player.on("timeupdate", () => {
      const cb = callbacksRef.current.onTimeUpdate;
      if (!cb) return;
      cb(player.currentTime() || 0, player.duration() || 0);
    });

    // Restore saved volume from localStorage
    try {
      const savedVolume = localStorage.getItem(VOLUME_STORAGE_KEY);
      if (savedVolume !== null) {
        const parsed = parseFloat(savedVolume);
        if (!Number.isNaN(parsed)) {
          player.volume(parsed);
          player.muted(parsed === 0);
        }
      }
    } catch {
      // localStorage unavailable (e.g. private browsing or SSR)
    }

    // Persist volume changes to localStorage
    player.on("volumechange", () => {
      try {
        const vol = player.muted() ? 0 : (player.volume() ?? 1);
        localStorage.setItem(VOLUME_STORAGE_KEY, String(vol));
      } catch {
        // localStorage unavailable or quota exceeded
      }
    });

    return () => {
      if (!player.isDisposed()) {
        player.dispose();
      }
      playerRef.current = null;
      loadedSrcRef.current = null;
    };
  }, []);

  // Swap the source only when it actually changes (e.g. next episode). The
  // new episode's resume point arrives through `setCurrentTime`.
  useEffect(() => {
    const player = playerRef.current;
    if (!player || player.isDisposed() || loadedSrcRef.current === src) return;
    loadedSrcRef.current = src;
    pendingSeekRef.current = 0;
    player.src(src);
  }, [src]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || player.isDisposed()) return;
    if (poster) player.poster(poster);
    player.autoplay(autoPlay);
    player.controls(controls);
    player.fluid(fluid);
    if (width) player.width(width);
    if (height) player.height(height);
  }, [poster, autoPlay, controls, fluid, width, height]);

  // Expose methods via ref
  useImperativeHandle(
    ref,
    () => ({
      get player() {
        return playerRef.current;
      },
      setCurrentTime: (time: number) => {
        // Defer until metadata is loaded; seeking earlier is silently lost.
        pendingSeekRef.current = time;
        applyPendingSeek();
      },
    }),
    [],
  );

  return (
    <div data-vjs-player className={cn("video-player", className)}>
      <div className={"size-full"} ref={videoRef} />
    </div>
  );
});

export default VideoJSReactPlayer;
