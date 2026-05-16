import type {
  WatchProgress,
  WatchProgressStorage,
  WatchProgressUpdate,
} from "@/types/watch-progress";
import { WATCH_PROGRESS_CONFIG } from "@/types/watch-progress";

export function getProgressKey(movieSlug: string, episodeSlug: string): string {
  return `${movieSlug}:${episodeSlug}`;
}

export function calculateWatchPercentage(
  currentTime: number,
  duration: number,
): number {
  if (duration <= 0) return 0;
  return Math.min(Math.max((currentTime / duration) * 100, 0), 100);
}

export function isVideoWatched(currentTime: number, duration: number): boolean {
  const percentage = calculateWatchPercentage(currentTime, duration);
  return percentage >= WATCH_PROGRESS_CONFIG.WATCHED_THRESHOLD * 100;
}

export function shouldSaveProgress(currentTime: number, duration: number): boolean {
  return (
    duration >= WATCH_PROGRESS_CONFIG.MIN_DURATION &&
    currentTime > 0 &&
    currentTime < duration &&
    !isVideoWatched(currentTime, duration)
  );
}

export function shouldRestoreProgress(progress: WatchProgress): boolean {
  return (
    progress.currentTime >= WATCH_PROGRESS_CONFIG.MIN_RESTORE_TIME &&
    !isVideoWatched(progress.currentTime, progress.duration)
  );
}

export function getAllWatchProgress(): WatchProgressStorage {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(WATCH_PROGRESS_CONFIG.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn("Failed to load watch progress:", error);
    return {};
  }
}

export function saveAllWatchProgress(progress: WatchProgressStorage): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(WATCH_PROGRESS_CONFIG.STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save watch progress:", error);
  }
}

export function getWatchProgress(
  movieSlug: string,
  episodeSlug: string,
): WatchProgress | null {
  const allProgress = getAllWatchProgress();
  const key = getProgressKey(movieSlug, episodeSlug);
  return allProgress[key] || null;
}

export function buildProgressRecord(
  movieSlug: string,
  episodeSlug: string,
  update: WatchProgressUpdate,
): WatchProgress {
  return {
    movieSlug,
    episodeSlug,
    currentTime: update.currentTime,
    duration: update.duration,
    lastWatched: new Date().toISOString(),
    watchedPercentage: calculateWatchPercentage(update.currentTime, update.duration),
  };
}

export function saveWatchProgress(
  movieSlug: string,
  episodeSlug: string,
  update: WatchProgressUpdate,
): void {
  if (!shouldSaveProgress(update.currentTime, update.duration)) {
    return;
  }

  const allProgress = getAllWatchProgress();
  const key = getProgressKey(movieSlug, episodeSlug);

  allProgress[key] = buildProgressRecord(movieSlug, episodeSlug, update);
  saveAllWatchProgress(allProgress);
}

export function removeWatchProgress(movieSlug: string, episodeSlug: string): void {
  const allProgress = getAllWatchProgress();
  const key = getProgressKey(movieSlug, episodeSlug);

  if (allProgress[key]) {
    delete allProgress[key];
    saveAllWatchProgress(allProgress);
  }
}

export function clearAllWatchProgress(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(WATCH_PROGRESS_CONFIG.STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear watch progress:", error);
  }
}

export function getMovieWatchProgress(movieSlug: string): WatchProgress[] {
  const allProgress = getAllWatchProgress();
  return Object.values(allProgress).filter((progress) => progress.movieSlug === movieSlug);
}

export async function getServerWatchProgress(
  movieSlug: string,
  episodeSlug: string,
): Promise<WatchProgress | null> {
  const params = new URLSearchParams({ movieSlug, episodeSlug });
  const response = await fetch(`/api/watch-progress?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { progress: WatchProgress | null };
  return payload.progress;
}

export async function getServerMovieWatchProgress(
  movieSlug: string,
): Promise<WatchProgress[]> {
  const params = new URLSearchParams({ movieSlug });
  const response = await fetch(`/api/watch-progress?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as { progress: WatchProgress[] };
  return payload.progress;
}

export async function saveServerWatchProgress(
  movieSlug: string,
  episodeSlug: string,
  update: WatchProgressUpdate,
): Promise<WatchProgress | null> {
  const response = await fetch("/api/watch-progress", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movieSlug,
      episodeSlug,
      ...update,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { progress: WatchProgress };
  return payload.progress;
}

export async function removeServerWatchProgress(
  movieSlug: string,
  episodeSlug: string,
): Promise<void> {
  const params = new URLSearchParams({ movieSlug, episodeSlug });
  await fetch(`/api/watch-progress?${params.toString()}`, {
    method: "DELETE",
    credentials: "include",
  });
}
