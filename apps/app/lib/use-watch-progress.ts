"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  calculateWatchPercentage,
  getMovieWatchProgress,
  getWatchProgress,
  removeWatchProgress,
  saveWatchProgress,
  shouldRestoreProgress,
} from "@/lib/watch-progress";
import {
  fetchCloudProgress,
  flushCloudSync,
  flushCloudSyncOnExit,
  queueCloudSync,
} from "@/lib/watch-progress-sync";
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
  /** Call on every `timeupdate`; saving is throttled internally. */
  updateProgress: (update: WatchProgressUpdate) => void;
  /** Save the latest position now (pause, seek, episode end). */
  flushProgress: () => void;
  clearProgress: () => void;

  // Getters
  getProgressForEpisode: (episodeSlug: string) => WatchProgress | null;
  getAllMovieProgress: () => WatchProgress[];

  // State
  isRestored: boolean;
}

/**
 * Watch progress, local-first with cloud sync.
 *
 * - localStorage is written at most once per SAVE_INTERVAL while playing
 *   (throttled with a trailing save, so continuous playback still persists).
 * - The cloud copy (signed-in users) is synced through `watch-progress-sync`,
 *   at most every CLOUD_SYNC_INTERVAL and one request at a time.
 * - Pause, end, episode change and tab hide save immediately; page unload
 *   saves locally and sends the cloud copy with a beacon.
 * - On load the local and cloud copies are reconciled: the furthest position
 *   wins locally, and a local position the cloud missed (e.g. the tab was
 *   closed before it synced) is pushed back up.
 */
export function useWatchProgress({
  movieSlug,
  episodeSlug,
  onProgressRestore,
}: UseWatchProgressOptions): UseWatchProgressReturn {
  const [progress, setProgress] = useState<WatchProgress | null>(null);
  const [isRestored, setIsRestored] = useState(false);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestProgressRef = useRef<WatchProgressUpdate | null>(null);
  const lastSaveAtRef = useRef(0);
  const restoreRef = useRef(onProgressRestore);
  restoreRef.current = onProgressRestore;

  // Persist whatever is pending, cancelling any trailing timer.
  const flush = useCallback(
    (forceCloud = false) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }

      const latestUpdate = latestProgressRef.current;
      if (!latestUpdate) {
        if (forceCloud) flushCloudSync();
        return;
      }
      latestProgressRef.current = null;

      saveWatchProgress(movieSlug, episodeSlug, latestUpdate);
      lastSaveAtRef.current = Date.now();
      queueCloudSync(movieSlug, episodeSlug, latestUpdate, {
        force: forceCloud,
      });
    },
    [movieSlug, episodeSlug],
  );

  // Load progress on mount or when the episode changes.
  useEffect(() => {
    latestProgressRef.current = null;
    lastSaveAtRef.current = 0;

    const savedProgress = getWatchProgress(movieSlug, episodeSlug);
    setProgress(savedProgress);
    let restoredAt = 0;
    if (savedProgress && shouldRestoreProgress(savedProgress)) {
      restoreRef.current?.(savedProgress.currentTime);
      restoredAt = savedProgress.currentTime;
      setIsRestored(true);
    } else {
      setIsRestored(false);
    }

    if (!(movieSlug && episodeSlug)) return;

    let cancelled = false;
    void fetchCloudProgress(movieSlug, episodeSlug)
      .then((result) => {
        if (cancelled || !result?.signedIn) return;
        const cloud = result.progress;
        const local = getWatchProgress(movieSlug, episodeSlug);
        const localTime = local?.currentTime ?? 0;

        // Local is ahead: the last session ended before the cloud caught up.
        if (
          local &&
          local.duration > 0 &&
          localTime > (cloud?.currentTime ?? 0)
        ) {
          queueCloudSync(
            movieSlug,
            episodeSlug,
            { currentTime: localTime, duration: local.duration },
            { force: true },
          );
          return;
        }
        if (!cloud || cloud.currentTime <= localTime) return;

        // Cloud is ahead (another device): adopt it without rewinding.
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
        saveWatchProgress(movieSlug, episodeSlug, {
          currentTime: cloud.currentTime,
          duration: cloud.duration,
          lastWatched: cloud.updatedAt,
        });

        // Only jump if the viewer hasn't already moved past the restore point.
        const playingAt = latestProgressRef.current?.currentTime ?? restoredAt;
        if (shouldRestoreProgress(merged) && playingAt <= restoredAt + 5) {
          restoreRef.current?.(cloud.currentTime);
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

  const updateProgress = useCallback(
    (update: WatchProgressUpdate) => {
      if (!(movieSlug && episodeSlug)) return;
      latestProgressRef.current = update;

      const elapsed = Date.now() - lastSaveAtRef.current;
      if (elapsed >= WATCH_PROGRESS_CONFIG.SAVE_INTERVAL) {
        flush();
      } else if (!saveTimeoutRef.current) {
        saveTimeoutRef.current = setTimeout(
          () => flush(),
          WATCH_PROGRESS_CONFIG.SAVE_INTERVAL - elapsed,
        );
      }
    },
    [flush, movieSlug, episodeSlug],
  );

  const flushProgress = useCallback(() => flush(true), [flush]);

  const clearProgress = useCallback(() => {
    removeWatchProgress(movieSlug, episodeSlug);
    setProgress(null);
    setIsRestored(false);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    latestProgressRef.current = null;
  }, [movieSlug, episodeSlug]);

  const getProgressForEpisode = useCallback(
    (targetEpisodeSlug: string) =>
      getWatchProgress(movieSlug, targetEpisodeSlug),
    [movieSlug],
  );

  const getAllMovieProgress = useCallback(
    () => getMovieWatchProgress(movieSlug),
    [movieSlug],
  );

  // Tab hidden / page unloading: save locally right away and get the cloud
  // copy out. `pagehide` covers F5, close and bfcache; `visibilitychange`
  // covers tab switches and mobile backgrounding. Effect cleanup alone does
  // not run on a hard refresh.
  useEffect(() => {
    const handlePageHide = () => {
      flush(false);
      flushCloudSyncOnExit();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flush(false);
        flushCloudSyncOnExit();
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [flush]);

  // Episode change / SPA navigation away: save the outgoing episode.
  useEffect(() => {
    return () => {
      flush(true);
    };
  }, [flush]);

  return {
    progress,
    updateProgress,
    flushProgress,
    clearProgress,
    getProgressForEpisode,
    getAllMovieProgress,
    isRestored,
  };
}
