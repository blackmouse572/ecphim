"use server";

import { currentUser } from "@repo/auth/server";
import { database } from "@repo/database";
import { getMovieDetail } from "@/lib/services/movie";
import { WATCH_PROGRESS_CONFIG } from "@/types/watch-progress";

// "Tiếp tục xem" on the home page. The home page is statically cached, so the
// row loads on the client through this action, and guests get nothing.

export type ContinueWatchingItem = {
  movieSlug: string;
  movieName: string;
  episodeSlug: string;
  episodeName: string | null;
  serverName: string | null;
  image: string | null;
  /** 0 to 100. */
  percentage: number;
  updatedAt: string;
};

export type ContinueWatchingResult = {
  signedIn: boolean;
  items: ContinueWatchingItem[];
};

const MAX_ITEMS = 12;
// Enough rows to still fill the list after dropping finished episodes and
// repeat movies.
const SCAN_ROWS = 60;

export async function getContinueWatching(): Promise<ContinueWatchingResult> {
  const user = await currentUser();
  if (!user) {
    return { signedIn: false, items: [] };
  }

  const rows = await database.watchProgress.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: SCAN_ROWS,
  });

  // The latest unfinished episode of each movie, newest first.
  const latest = new Map<string, (typeof rows)[number]>();
  for (const row of rows) {
    if (latest.has(row.movieSlug)) {
      continue;
    }
    if (row.percentage >= WATCH_PROGRESS_CONFIG.WATCHED_THRESHOLD * 100) {
      continue;
    }
    latest.set(row.movieSlug, row);
    if (latest.size >= MAX_ITEMS) {
      break;
    }
  }

  const items = await Promise.all(
    Array.from(latest.values()).map(
      async (row): Promise<ContinueWatchingItem | null> => {
        try {
          const movie = await getMovieDetail(row.movieSlug);
          const server = movie.episodes?.find((s) =>
            s.server_data.some((ep) => ep.slug === row.episodeSlug),
          );
          const episode = server?.server_data.find(
            (ep) => ep.slug === row.episodeSlug,
          );
          return {
            movieSlug: row.movieSlug,
            movieName: movie.name,
            episodeSlug: row.episodeSlug,
            episodeName: episode?.name ?? null,
            serverName: server?.server_name ?? null,
            image: movie.poster_url || movie.thumb_url || null,
            percentage: row.percentage,
            updatedAt: row.updatedAt.toISOString(),
          };
        } catch {
          // Movie gone from the API: leave it out of the row.
          return null;
        }
      },
    ),
  );

  return {
    signedIn: true,
    items: items.filter((item): item is ContinueWatchingItem => item !== null),
  };
}
