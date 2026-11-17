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
 * Check if progress should be saved (duration long enough, meaningful progress).
 * Finished episodes are saved too, so they can be shown as watched.
 */
export function shouldSaveProgress(currentTime: number, duration: number): boolean {
  return (
    Number.isFinite(currentTime) &&
    Number.isFinite(duration) &&
    duration >= WATCH_PROGRESS_CONFIG.MIN_DURATION &&
    currentTime > 0
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
 * Keep only the most recently watched entries so the stored JSON (which is
 * parsed and rewritten on every save) stays small.
 */
function pruneProgress(progress: WatchProgressStorage): WatchProgressStorage {
  const keys = Object.keys(progress);
  if (keys.length <= WATCH_PROGRESS_CONFIG.MAX_ENTRIES) return progress;
  const kept = keys
    .sort(
      (a, b) =>
        Date.parse(progress[b].lastWatched) - Date.parse(progress[a].lastWatched),
    )
    .slice(0, WATCH_PROGRESS_CONFIG.MAX_ENTRIES);
  const result: WatchProgressStorage = {};
  for (const key of kept) result[key] = progress[key];
  return result;
}

/**
 * Save all watch progress to localStorage
 */
export function saveAllWatchProgress(progress: WatchProgressStorage): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(
      WATCH_PROGRESS_CONFIG.STORAGE_KEY,
      JSON.stringify(pruneProgress(progress)),
    );
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
  
  const currentTime = Math.min(update.currentTime, update.duration);
  const progress: WatchProgress = {
    movieSlug,
    episodeSlug,
    currentTime,
    duration: update.duration,
    lastWatched: update.lastWatched ?? new Date().toISOString(),
    watchedPercentage: calculateWatchPercentage(currentTime, update.duration),
  };

  allProgress[key] = progress;
  saveAllWatchProgress(allProgress);
}

/**
 * Record that an episode was opened without knowing the playback position.
 * Used for iframe (embed) players, whose time can't be read cross-origin, so
 * "continue watching" still reopens the right episode. Keeps any known
 * position from an earlier HLS session.
 */
export function markEpisodeVisited(movieSlug: string, episodeSlug: string): void {
  if (!(movieSlug && episodeSlug)) return;
  const allProgress = getAllWatchProgress();
  const key = getProgressKey(movieSlug, episodeSlug);
  const existing = allProgress[key];
  allProgress[key] = existing
    ? { ...existing, lastWatched: new Date().toISOString() }
    : {
        movieSlug,
        episodeSlug,
        currentTime: 0,
        duration: 0,
        lastWatched: new Date().toISOString(),
        watchedPercentage: 0,
      };
  saveAllWatchProgress(allProgress);
}

/**
 * The episode to resume for a movie: the most recently watched one that is
 * not finished (embed visits count, they have no known position).
 */
export function getResumeEpisode(movieSlug: string): WatchProgress | null {
  const candidates = getMovieWatchProgress(movieSlug).filter(
    (p) => p.duration === 0 || !isVideoWatched(p.currentTime, p.duration),
  );
  candidates.sort(
    (a, b) => Date.parse(b.lastWatched) - Date.parse(a.lastWatched),
  );
  return candidates[0] ?? null;
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