"use client";

import { getProgressKey } from "@/lib/watch-progress";
import {
  type CloudWatchProgressResult,
  getCloudWatchProgress,
  saveWatchProgressToCloud,
} from "@/lib/watch-progress-cloud";
import type { WatchProgressUpdate } from "@/types/watch-progress";
import { WATCH_PROGRESS_CONFIG } from "@/types/watch-progress";

/**
 * Client-side cloud sync for watch progress.
 *
 * localStorage is the source of truth and is written every few seconds. The
 * cloud copy is only a backup for signed-in users, so it is synced far less
 * often and never with more than one request in flight:
 *
 * - Updates are coalesced per episode; only the latest position is sent.
 * - Periodic syncs happen at most once per CLOUD_SYNC_INTERVAL.
 * - Pause, episode end, episode change and tab hide force a sync.
 * - On page unload the pending position goes out via `navigator.sendBeacon`,
 *   which (unlike a server action) survives the page being torn down.
 * - Once the server says the visitor is a guest, all cloud calls stop for the
 *   rest of the page session.
 */

type Pending = {
  movieSlug: string;
  episodeSlug: string;
  update: WatchProgressUpdate;
};

/** Beacon endpoint (POST JSON {movieSlug, episodeSlug, currentTime, duration}). */
const BEACON_URL = "/watch-progress";

// null = unknown yet, true/false once the server has told us.
let signedIn: boolean | null = null;
let inFlight = false;
let lastSyncAt = 0;
const pending = new Map<string, Pending>();
// Last position sent per episode, to skip no-op writes.
const lastSent = new Map<string, number>();

function rememberAuth(result: CloudWatchProgressResult | null | undefined) {
  if (result && typeof result.signedIn === "boolean") {
    signedIn = result.signedIn;
    if (!signedIn) {
      pending.clear();
    }
  }
}

function isMeaningfulChange(key: string, update: WatchProgressUpdate) {
  const previous = lastSent.get(key);
  return (
    previous === undefined ||
    Math.abs(previous - update.currentTime) >=
      WATCH_PROGRESS_CONFIG.CLOUD_MIN_DELTA
  );
}

async function drain() {
  if (inFlight || signedIn === false) {
    return;
  }
  inFlight = true;
  try {
    while (pending.size > 0 && (signedIn as boolean | null) !== false) {
      const [key, item] = pending.entries().next().value as [string, Pending];
      pending.delete(key);
      if (!isMeaningfulChange(key, item.update)) {
        continue;
      }
      try {
        const result = await saveWatchProgressToCloud(
          item.movieSlug,
          item.episodeSlug,
          item.update,
        );
        rememberAuth(result);
        lastSent.set(key, item.update.currentTime);
      } catch {
        // Network/server error: keep the newest position for the next attempt
        // unless a newer one has already been queued.
        if (!pending.has(key)) {
          pending.set(key, item);
        }
        break;
      }
    }
  } finally {
    lastSyncAt = Date.now();
    inFlight = false;
  }
}

/**
 * Queue the latest position of an episode for cloud sync. Sends right away
 * when `force` is set or the sync interval has elapsed; otherwise it rides
 * along with the next sync.
 */
export function queueCloudSync(
  movieSlug: string,
  episodeSlug: string,
  update: WatchProgressUpdate,
  { force = false }: { force?: boolean } = {},
) {
  if (signedIn === false || !(movieSlug && episodeSlug)) {
    return;
  }
  if (!(update.duration > 0 && update.currentTime > 0)) {
    return;
  }
  const key = getProgressKey(movieSlug, episodeSlug);
  pending.set(key, { movieSlug, episodeSlug, update });

  if (
    force ||
    Date.now() - lastSyncAt >= WATCH_PROGRESS_CONFIG.CLOUD_SYNC_INTERVAL
  ) {
    void drain();
  }
}

/** Send whatever is pending now (e.g. on pause). */
export function flushCloudSync() {
  if (pending.size > 0) {
    void drain();
  }
}

/**
 * Flush everything pending while the page is going away. Uses sendBeacon so
 * the request is delivered after unload; falls back to a normal sync if the
 * browser refuses the beacon.
 */
export function flushCloudSyncOnExit() {
  if (signedIn === false || pending.size === 0) {
    return;
  }
  const canBeacon =
    typeof navigator !== "undefined" &&
    typeof navigator.sendBeacon === "function";

  for (const [key, item] of pending) {
    if (!isMeaningfulChange(key, item.update)) {
      pending.delete(key);
      continue;
    }
    const body = JSON.stringify({
      movieSlug: item.movieSlug,
      episodeSlug: item.episodeSlug,
      currentTime: Math.min(item.update.currentTime, item.update.duration),
      duration: item.update.duration,
    });
    if (canBeacon && navigator.sendBeacon(BEACON_URL, body)) {
      pending.delete(key);
      lastSent.set(key, item.update.currentTime);
    }
  }
  // Anything the beacon could not take goes through the server action.
  void drain();
}

/** Read the cloud copy of an episode; also learns whether the user is signed in. */
export async function fetchCloudProgress(
  movieSlug: string,
  episodeSlug: string,
) {
  if (signedIn === false) {
    return null;
  }
  const result = await getCloudWatchProgress(movieSlug, episodeSlug);
  rememberAuth(result);
  if (result?.progress) {
    lastSent.set(
      getProgressKey(movieSlug, episodeSlug),
      result.progress.currentTime,
    );
  }
  return result ?? null;
}
