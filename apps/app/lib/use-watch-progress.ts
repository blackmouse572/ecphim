"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getMovieWatchProgress,
  getServerMovieWatchProgress,
  getServerWatchProgress,
  getWatchProgress,
  removeServerWatchProgress,
  removeWatchProgress,
  saveServerWatchProgress,
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
  isAuthenticated?: boolean;
  onProgressRestore?: (currentTime: number) => void;
}

export interface UseWatchProgressReturn {
  progress: WatchProgress | null;
  updateProgress: (update: WatchProgressUpdate) => void;
  clearProgress: () => void;
  getProgressForEpisode: (episodeSlug: string) => WatchProgress | null;
  getAllMovieProgress: () => WatchProgress[];
  isRestored: boolean;
}

export function useWatchProgress({
  movieSlug,
  episodeSlug,
  isAuthenticated = false,
  onProgressRestore,
}: UseWatchProgressOptions): UseWatchProgressReturn {
  const [progress, setProgress] = useState<WatchProgress | null>(null);
  const [allMovieProgress, setAllMovieProgress] = useState<WatchProgress[]>([]);
  const [isRestored, setIsRestored] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const latestProgressRef = useRef<WatchProgressUpdate | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadProgress = async () => {
      const movieProgress = isAuthenticated
        ? await getServerMovieWatchProgress(movieSlug)
        : getMovieWatchProgress(movieSlug);

      const episodeProgress = isAuthenticated
        ? await getServerWatchProgress(movieSlug, episodeSlug)
        : getWatchProgress(movieSlug, episodeSlug);

      if (isCancelled) {
        return;
      }

      setAllMovieProgress(movieProgress);
      setProgress(episodeProgress);

      if (
        episodeProgress &&
        shouldRestoreProgress(episodeProgress) &&
        onProgressRestore
      ) {
        onProgressRestore(episodeProgress.currentTime);
        setIsRestored(true);
      } else {
        setIsRestored(false);
      }
    };

    if (movieSlug && episodeSlug) {
      void loadProgress();
    }

    return () => {
      isCancelled = true;
    };
  }, [movieSlug, episodeSlug, isAuthenticated, onProgressRestore]);

  const debouncedSave = useCallback(
    (update: WatchProgressUpdate) => {
      latestProgressRef.current = update;

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        const latestUpdate = latestProgressRef.current;

        if (!latestUpdate) {
          return;
        }

        if (isAuthenticated) {
          void saveServerWatchProgress(movieSlug, episodeSlug, latestUpdate).then(
            (saved) => {
              if (!saved) {
                return;
              }

              setProgress(saved);
              setAllMovieProgress((current) => {
                const map = new Map(current.map((item) => [item.episodeSlug, item]));
                map.set(saved.episodeSlug, saved);
                return Array.from(map.values());
              });
            },
          );
          return;
        }

        saveWatchProgress(movieSlug, episodeSlug, latestUpdate);
        const latestLocalProgress = getWatchProgress(movieSlug, episodeSlug);
        if (latestLocalProgress) {
          setProgress(latestLocalProgress);
        }
        setAllMovieProgress(getMovieWatchProgress(movieSlug));
      }, WATCH_PROGRESS_CONFIG.SAVE_INTERVAL);
    },
    [movieSlug, episodeSlug, isAuthenticated],
  );

  const updateProgress = useCallback(
    (update: WatchProgressUpdate) => {
      debouncedSave(update);
    },
    [debouncedSave],
  );

  const clearProgress = useCallback(() => {
    if (isAuthenticated) {
      void removeServerWatchProgress(movieSlug, episodeSlug);
    } else {
      removeWatchProgress(movieSlug, episodeSlug);
    }

    setProgress(null);
    setAllMovieProgress((current) =>
      current.filter((item) => item.episodeSlug !== episodeSlug),
    );
    setIsRestored(false);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    latestProgressRef.current = null;
  }, [movieSlug, episodeSlug, isAuthenticated]);

  const progressByEpisode = useMemo(
    () => new Map(allMovieProgress.map((item) => [item.episodeSlug, item])),
    [allMovieProgress],
  );

  const getProgressForEpisode = useCallback(
    (targetEpisodeSlug: string) => {
      return progressByEpisode.get(targetEpisodeSlug) ?? null;
    },
    [progressByEpisode],
  );

  const getAllMovieProgress = useCallback(() => {
    return allMovieProgress;
  }, [allMovieProgress]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      const latestUpdate = latestProgressRef.current;
      if (!latestUpdate) {
        return;
      }

      if (isAuthenticated) {
        void saveServerWatchProgress(movieSlug, episodeSlug, latestUpdate);
        return;
      }

      saveWatchProgress(movieSlug, episodeSlug, latestUpdate);
    };
  }, [movieSlug, episodeSlug, isAuthenticated]);

  return {
    progress,
    updateProgress,
    clearProgress,
    getProgressForEpisode,
    getAllMovieProgress,
    isRestored,
  };
}
