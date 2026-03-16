/**
 * Watch Progress Types
 */

export interface WatchProgress {
  movieSlug: string;
  episodeSlug: string;
  currentTime: number; // in seconds
  duration: number; // in seconds  
  lastWatched: string; // ISO timestamp
  watchedPercentage: number; // 0-100
}

export interface WatchProgressStorage {
  [key: string]: WatchProgress; // key format: "movieSlug:episodeSlug"
}

export interface WatchProgressUpdate {
  currentTime: number;
  duration: number;
}

/**
 * Configuration for watch progress behavior
 */
export const WATCH_PROGRESS_CONFIG = {
  // Save progress every 5 seconds when playing
  SAVE_INTERVAL: 5000,
  // Consider video "watched" when 90% complete
  WATCHED_THRESHOLD: 0.9,
  // Don't save progress for videos shorter than 30 seconds
  MIN_DURATION: 30,
  // Skip first 10 seconds (don't restore to opening credits)
  MIN_RESTORE_TIME: 10,
  // LocalStorage key prefix
  STORAGE_KEY: 'ecphim_watch_progress',
} as const;