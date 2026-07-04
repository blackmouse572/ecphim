"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getCloudWatchProgress,
  saveWatchProgressToCloud,
} from "@/lib/watch-progress-cloud";
import {
  calculateWatchPercentage,
  getMovieWatchProgress,
  getWatchProgress,
  removeWatchProgress,
  saveWatchProgress,
  shouldRestoreProgress,
} from "@/lib/watch-progress";
import type {
  WatchProgress,
  WatchProgressUpdate,
} from "@/types/watch-progress";
import { WATCH_PROGRESS_CONFIG } from "@/types/watch-progress";

export interface UseWatchProgressOptions {
  movieSlug: string;
  episodeSlug: string;
  onProgressRestore?: (currentTime: number) => void;
}

export interface UseWatchProgressReturn {
  // Current progress state
  progress: WatchProgress | null;

  // Actions
  updateProgress: (update: WatchProgressUpdate) => void;
  clearProgress: () => void;

  // Getters
  getProgressForEpisode: (episodeSlug: string) => WatchProgress | null;
  getAllMovieProgress: () => WatchProgress[];

  // State
  isRestored: boolean;
}

/**
 * Custom hook for managing watch progress with localStorage persistence.
 *
 * Progress is throttled (saved at most once per SAVE_INTERVAL while playing)
 * rather than debounced, so continuous playback still persists — a plain
 * debounce never fires because `timeupdate` keeps resetting the timer. Pending
 * progress is also flushed on tab-hide / page-unload since React effect cleanup
 * does not reliably run on a hard refresh (F5) or tab close.
 */
export function useWatchProgress({
  movieSlug,
  episodeSlug,
  onProgressRestore,
}: UseWatchProgressOptions): UseWatchProgressReturn {
  const [progress, setProgress] = useState<WatchProgress | null>(null);
  const [isRestored, setIsRestored] = useState(false);

  // Refs hold the latest pending update and throttle bookkeeping.
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestProgressRef = useRef<WatchProgressUpdate | null>(null);
  const lastSaveAtRef = useRef(0);

  // Persist whatever is pending immediately, cancelling any trailing timer.
  const flush = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    const latestUpdate = latestProgressRef.current;
    if (latestUpdate) {
      saveWatchProgress(movieSlug, episodeSlug, latestUpdate);
      lastSaveAtRef.current = Date.now();
      // Best-effort cloud sync; the action no-ops for guests.
      void saveWatchProgressToCloud(movieSlug, episodeSlug, latestUpdate).catch(
        () => {
          // Ignore cloud failures — localStorage remains the source of truth.
        },
      );
    }
  }, [movieSlug, episodeSlug]);

  // Load initial progress on mount or when episode changes.
  useEffect(() => {
    // Reset throttle state so the new episode saves promptly and can't
    // inherit the previous episode's pending position.
    latestProgressRef.current = null;
    lastSaveAtRef.current = 0;

    const savedProgress = getWatchProgress(movieSlug, episodeSlug);
    setProgress(savedProgress);
    // Auto-restore progress if it exists and should be restored
    if (
      savedProgress &&
      shouldRestoreProgress(savedProgress) &&
      onProgressRestore
    ) {
      onProgressRestore(savedProgress.currentTime);
      setIsRestored(true);
    } else {
      setIsRestored(false);
    }

    // Merge cloud progress (logged-in users). Adopt it only when it's ahead of
    // the local position so switching devices resumes from the furthest point
    // without ever rewinding. No-ops / returns null for guests.
    let cancelled = false;
    void getCloudWatchProgress(movieSlug, episodeSlug)
      .then((cloud) => {
        if (cancelled || !cloud) {
          return;
        }

        const localTime = savedProgress?.currentTime ?? 0;
        if (cloud.currentTime <= localTime) {
          return;
        }

        const merged: WatchProgress = {
          movieSlug,
          episodeSlug,
          currentTime: cloud.currentTime,
          duration: cloud.duration,
          lastWatched: cloud.updatedAt,
          watchedPercentage: calculateWatchPercentage(
            cloud.currentTime,
            cloud.duration,
          ),
        };

        setProgress(merged);
        // Mirror into localStorage so subsequent loads have it immediately.
        saveWatchProgress(movieSlug, episodeSlug, {
          currentTime: cloud.currentTime,
          duration: cloud.duration,
        });

        if (shouldRestoreProgress(merged) && onProgressRestore) {
          onProgressRestore(cloud.currentTime);
          setIsRestored(true);
        }
      })
      .catch(() => {
        // Ignore cloud failures — localStorage remains the source of truth.
      });

    return () => {
      cancelled = true;
    };
  }, [movieSlug, episodeSlug]);

  // Update progress, throttled to at most one save per SAVE_INTERVAL with a
  // trailing save so the final position is never dropped.
  const updateProgress = useCallback(
    (update: WatchProgressUpdate) => {
      latestProgressRef.current = update;

      const elapsed = Date.now() - lastSaveAtRef.current;
      if (elapsed >= WATCH_PROGRESS_CONFIG.SAVE_INTERVAL) {
        flush();
      } else if (!saveTimeoutRef.current) {
        saveTimeoutRef.current = setTimeout(
          flush,
          WATCH_PROGRESS_CONFIG.SAVE_INTERVAL - elapsed,
        );
      }
    },
    [flush],
  );

  // Clear progress for current episode
  const clearProgress = useCallback(() => {
    removeWatchProgress(movieSlug, episodeSlug);
    setProgress(null);
    setIsRestored(false);

    // Clear any pending saves
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    latestProgressRef.current = null;
  }, [movieSlug, episodeSlug]);

  // Get progress for a specific episode in the same movie
  const getProgressForEpisode = useCallback(
    (targetEpisodeSlug: string) => {
      return getWatchProgress(movieSlug, targetEpisodeSlug);
    },
    [movieSlug],
  );

  // Get all progress for the current movie
  const getAllMovieProgress = useCallback(() => {
    return getMovieWatchProgress(movieSlug);
  }, [movieSlug]);

  // Flush pending progress when the tab is hidden or the page is unloaded.
  // `pagehide` covers F5 / close / back-forward cache; `visibilitychange`
  // covers tab switches and mobile backgrounding — both more reliable than
  // effect cleanup, which does not run on a hard refresh.
  useEffect(() => {
    const handlePageHide = () => flush();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flush();
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [flush]);

  // Save any pending progress on unmount / episode change (SPA navigation).
  useEffect(() => {
    return () => {
      flush();
    };
  }, [flush]);

  return {
    progress,
    updateProgress,
    clearProgress,
    getProgressForEpisode,
    getAllMovieProgress,
    isRestored,
  };
}
