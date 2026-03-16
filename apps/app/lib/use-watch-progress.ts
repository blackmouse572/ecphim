"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
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
 * Custom hook for managing watch progress with localStorage persistence
 */
export function useWatchProgress({
  movieSlug,
  episodeSlug,
  onProgressRestore,
}: UseWatchProgressOptions): UseWatchProgressReturn {
  const [progress, setProgress] = useState<WatchProgress | null>(null);
  const [isRestored, setIsRestored] = useState(false);

  // Use refs to store latest values for debounced save
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const latestProgressRef = useRef<WatchProgressUpdate | null>(null);

  // Load initial progress on mount or when episode changes
  useEffect(() => {
    const savedProgress = getWatchProgress(movieSlug, episodeSlug);
    setProgress(savedProgress);
    // Auto-restore progress if it exists and should be restored
    if (savedProgress && shouldRestoreProgress(savedProgress) && onProgressRestore) {
      onProgressRestore(savedProgress.currentTime);
      setIsRestored(true);
    } else {
      setIsRestored(false);
    }
  }, [movieSlug, episodeSlug]);

  // Debounced save function
  const debouncedSave = useCallback(
    (update: WatchProgressUpdate) => {
      latestProgressRef.current = update;

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout
      saveTimeoutRef.current = setTimeout(() => {
        console.log("Saving progress for", movieSlug, episodeSlug, latestProgressRef.current);
        const latestUpdate = latestProgressRef.current;
        if (latestUpdate) {
          saveWatchProgress(movieSlug, episodeSlug, latestUpdate);
        }
      }, WATCH_PROGRESS_CONFIG.SAVE_INTERVAL);
    },
    [movieSlug, episodeSlug],
  );

  // Update progress with debouncing
  const updateProgress = useCallback(
    (update: WatchProgressUpdate) => {
      debouncedSave(update);
    },
    [debouncedSave],
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Save any pending progress immediately on unmount
      const latestUpdate = latestProgressRef.current;
      if (latestUpdate) {
        console.log("Saving progress on unmount for", movieSlug, episodeSlug, latestUpdate);
        saveWatchProgress(movieSlug, episodeSlug, latestUpdate);
      }
    };
  }, [movieSlug, episodeSlug]);

  return {
    progress,
    updateProgress,
    clearProgress,
    getProgressForEpisode,
    getAllMovieProgress,
    isRestored,
  };
}
