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
  /** ISO timestamp to store instead of "now" (used when mirroring the cloud copy). */
  lastWatched?: string;
}

/**
 * Configuration for watch progress behavior
 */
export const WATCH_PROGRESS_CONFIG = {
  // Save progress to localStorage at most every 5 seconds while playing
  SAVE_INTERVAL: 5000,
  // Sync to the cloud (signed-in users) at most every 30 seconds while playing;
  // pause, episode end and tab hide sync immediately.
  CLOUD_SYNC_INTERVAL: 30000,
  // Skip cloud writes when the position moved less than this many seconds
  CLOUD_MIN_DELTA: 2,
  // Keep at most this many entries in localStorage (oldest are dropped)
  MAX_ENTRIES: 300,
  // Consider video "watched" when 90% complete
  WATCHED_THRESHOLD: 0.9,
  // Don't save progress for videos shorter than 30 seconds
  MIN_DURATION: 30,
  // Skip first 10 seconds (don't restore to opening credits)
  MIN_RESTORE_TIME: 10,
  // LocalStorage key prefix
  STORAGE_KEY: 'ecphim_watch_progress',
} as const;