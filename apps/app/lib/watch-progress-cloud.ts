"use server";

import { currentUser } from "@repo/auth/server";
import { database } from "@repo/database";
import type { WatchProgressUpdate } from "@/types/watch-progress";

// Cloud-synced watch progress via server actions. We deliberately avoid an
// /api route because apps/app rewrites /api/* to the ophim proxy. Every action
// no-ops (returns null) for unauthenticated users, so the client hook can call
// them unconditionally and let the server decide.

const computePercentage = (currentTime: number, duration: number) =>
  duration > 0 ? Math.min(Math.max((currentTime / duration) * 100, 0), 100) : 0;

export async function saveWatchProgressToCloud(
  movieSlug: string,
  episodeSlug: string,
  update: WatchProgressUpdate,
) {
  if (!(movieSlug && episodeSlug)) {
    return null;
  }
  if (!(update.duration > 0) || update.currentTime <= 0) {
    return null;
  }

  const user = await currentUser();
  if (!user) {
    return null;
  }

  const percentage = computePercentage(update.currentTime, update.duration);

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
      currentTime: update.currentTime,
      duration: update.duration,
      percentage,
    },
    update: {
      currentTime: update.currentTime,
      duration: update.duration,
      percentage,
    },
  });

  return {
    currentTime: record.currentTime,
    duration: record.duration,
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function getCloudWatchProgress(
  movieSlug: string,
  episodeSlug: string,
) {
  if (!(movieSlug && episodeSlug)) {
    return null;
  }

  const user = await currentUser();
  if (!user) {
    return null;
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

  if (!record) {
    return null;
  }

  return {
    currentTime: record.currentTime,
    duration: record.duration,
    updatedAt: record.updatedAt.toISOString(),
  };
}
