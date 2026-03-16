import type { 
  WatchProgress, 
  WatchProgressStorage, 
  WatchProgressUpdate 
} from "@/types/watch-progress";
import { WATCH_PROGRESS_CONFIG } from "@/types/watch-progress";

/**
 * Utility functions for watch progress management
 */

/**
 * Generate storage key for a movie/episode combination
 */
export function getProgressKey(movieSlug: string, episodeSlug: string): string {
  return `${movieSlug}:${episodeSlug}`;
}

/**
 * Calculate watch percentage
 */
export function calculateWatchPercentage(currentTime: number, duration: number): number {
  if (duration <= 0) return 0;
  return Math.min(Math.max((currentTime / duration) * 100, 0), 100);
}

/**
 * Check if video should be considered "watched"
 */
export function isVideoWatched(currentTime: number, duration: number): boolean {
  const percentage = calculateWatchPercentage(currentTime, duration);
  return percentage >= WATCH_PROGRESS_CONFIG.WATCHED_THRESHOLD * 100;
}

/**
 * Check if progress should be saved (duration long enough, meaningful progress)
 */
export function shouldSaveProgress(currentTime: number, duration: number): boolean {
  return (
    duration >= WATCH_PROGRESS_CONFIG.MIN_DURATION &&
    currentTime > 0 &&
    currentTime < duration &&
    !isVideoWatched(currentTime, duration)
  );
}

/**
 * Check if progress should be restored (not too close to beginning)
 */
export function shouldRestoreProgress(progress: WatchProgress): boolean {
  return (
    progress.currentTime >= WATCH_PROGRESS_CONFIG.MIN_RESTORE_TIME &&
    !isVideoWatched(progress.currentTime, progress.duration)
  );
}

/**
 * Get all watch progress from localStorage
 */
export function getAllWatchProgress(): WatchProgressStorage {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(WATCH_PROGRESS_CONFIG.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Failed to load watch progress:', error);
    return {};
  }
}

/**
 * Save all watch progress to localStorage
 */
export function saveAllWatchProgress(progress: WatchProgressStorage): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(WATCH_PROGRESS_CONFIG.STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save watch progress:', error);
  }
}

/**
 * Get watch progress for specific movie/episode
 */
export function getWatchProgress(movieSlug: string, episodeSlug: string): WatchProgress | null {
  const allProgress = getAllWatchProgress();
  const key = getProgressKey(movieSlug, episodeSlug);
  return allProgress[key] || null;
}

/**
 * Save watch progress for specific movie/episode
 */
export function saveWatchProgress(
  movieSlug: string, 
  episodeSlug: string, 
  update: WatchProgressUpdate
): void {
  if (!shouldSaveProgress(update.currentTime, update.duration)) {
    return;
  }

  const allProgress = getAllWatchProgress();
  const key = getProgressKey(movieSlug, episodeSlug);
  
  const progress: WatchProgress = {
    movieSlug,
    episodeSlug,
    currentTime: update.currentTime,
    duration: update.duration,
    lastWatched: new Date().toISOString(),
    watchedPercentage: calculateWatchPercentage(update.currentTime, update.duration),
  };

  allProgress[key] = progress;
  saveAllWatchProgress(allProgress);
}

/**
 * Remove watch progress for specific movie/episode
 */
export function removeWatchProgress(movieSlug: string, episodeSlug: string): void {
  const allProgress = getAllWatchProgress();
  const key = getProgressKey(movieSlug, episodeSlug);
  
  if (allProgress[key]) {
    delete allProgress[key];
    saveAllWatchProgress(allProgress);
  }
}

/**
 * Clear all watch progress
 */
export function clearAllWatchProgress(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(WATCH_PROGRESS_CONFIG.STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear watch progress:', error);
  }
}

/**
 * Get watch progress for all episodes of a movie
 */
export function getMovieWatchProgress(movieSlug: string): WatchProgress[] {
  const allProgress = getAllWatchProgress();
  return Object.values(allProgress).filter(progress => progress.movieSlug === movieSlug);
}