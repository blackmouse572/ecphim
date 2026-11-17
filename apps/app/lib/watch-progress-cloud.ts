"use server";

import { currentUser } from "@repo/auth/server";
import { database } from "@repo/database";
import type { WatchProgressUpdate } from "@/types/watch-progress";

// Cloud-synced watch progress via server actions. We deliberately avoid an
// /api route because apps/app rewrites /api/* to the VSMov proxy. Every action
// reports `signedIn: false` for guests so the client can stop calling them for
// the rest of the page session instead of paying an auth round-trip each time.

export type CloudWatchProgress = {
  currentTime: number;
  duration: number;
  updatedAt: string;
};

export type CloudWatchProgressResult = {
  signedIn: boolean;
  progress: CloudWatchProgress | null;
};

const GUEST: CloudWatchProgressResult = { signedIn: false, progress: null };

const computePercentage = (currentTime: number, duration: number) =>
  duration > 0 ? Math.min(Math.max((currentTime / duration) * 100, 0), 100) : 0;

export async function saveWatchProgressToCloud(
  movieSlug: string,
  episodeSlug: string,
  update: WatchProgressUpdate,
): Promise<CloudWatchProgressResult> {
  const user = await currentUser();
  if (!user) {
    return GUEST;
  }
  if (
    !(movieSlug && episodeSlug) ||
    !Number.isFinite(update.currentTime) ||
    !Number.isFinite(update.duration) ||
    !(update.duration > 0) ||
    update.currentTime <= 0
  ) {
    return { signedIn: true, progress: null };
  }

  const currentTime = Math.min(update.currentTime, update.duration);
  const percentage = computePercentage(currentTime, update.duration);

  const record = await database.watchProgress.upsert({
    where: {
      userId_movieSlug_episodeSlug: {
        userId: user.id,
        movieSlug,
        episodeSlug,
      },
    },
    create: {
      userId: user.id,
      movieSlug,
      episodeSlug,
      currentTime,
      duration: update.duration,
      percentage,
    },
    update: {
      currentTime,
      duration: update.duration,
      percentage,
    },
  });

  return { signedIn: true, progress: toCloud(record) };
}

export async function getCloudWatchProgress(
  movieSlug: string,
  episodeSlug: string,
): Promise<CloudWatchProgressResult> {
  const user = await currentUser();
  if (!user) {
    return GUEST;
  }
  if (!(movieSlug && episodeSlug)) {
    return { signedIn: true, progress: null };
  }

  const record = await database.watchProgress.findUnique({
    where: {
      userId_movieSlug_episodeSlug: {
        userId: user.id,
        movieSlug,
        episodeSlug,
      },
    },
  });

  return { signedIn: true, progress: record ? toCloud(record) : null };
}

function toCloud(record: {
  currentTime: number;
  duration: number;
  updatedAt: Date;
}): CloudWatchProgress {
  return {
    currentTime: record.currentTime,
    duration: record.duration,
    updatedAt: record.updatedAt.toISOString(),
  };
}
