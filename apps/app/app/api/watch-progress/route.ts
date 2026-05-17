import { currentUser } from "@repo/auth/server";
import { database } from "@repo/database";
import { NextResponse } from "next/server";
import {
  buildProgressRecord,
  shouldSaveProgress,
} from "@/lib/watch-progress";

type SaveWatchProgressPayload = {
  movieSlug: string;
  episodeSlug: string;
  currentTime: number;
  duration: number;
};

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ progress: null }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const movieSlug = searchParams.get("movieSlug");
  const episodeSlug = searchParams.get("episodeSlug");

  if (!movieSlug) {
    return NextResponse.json({ progress: [] });
  }

  if (episodeSlug) {
    const progress = await database.watchProgress.findUnique({
      where: {
        userId_movieSlug_episodeSlug: {
          userId: user.id,
          movieSlug,
          episodeSlug,
        },
      },
    });

    return NextResponse.json({
      progress: progress
        ? {
            movieSlug: progress.movieSlug,
            episodeSlug: progress.episodeSlug,
            currentTime: progress.currentTime,
            duration: progress.duration,
            watchedPercentage: progress.watchedPercentage,
            lastWatched: progress.lastWatched.toISOString(),
          }
        : null,
    });
  }

  const progress = await database.watchProgress.findMany({
    where: {
      userId: user.id,
      movieSlug,
    },
    orderBy: {
      lastWatched: "desc",
    },
  });

  return NextResponse.json({
    progress: progress.map((item) => ({
      movieSlug: item.movieSlug,
      episodeSlug: item.episodeSlug,
      currentTime: item.currentTime,
      duration: item.duration,
      watchedPercentage: item.watchedPercentage,
      lastWatched: item.lastWatched.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as SaveWatchProgressPayload;

  if (
    !payload.movieSlug ||
    !payload.episodeSlug ||
    typeof payload.currentTime !== "number" ||
    typeof payload.duration !== "number"
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!shouldSaveProgress(payload.currentTime, payload.duration)) {
    return NextResponse.json({ progress: null });
  }

  const progress = buildProgressRecord(
    payload.movieSlug,
    payload.episodeSlug,
    payload,
  );

  const saved = await database.watchProgress.upsert({
    where: {
      userId_movieSlug_episodeSlug: {
        userId: user.id,
        movieSlug: payload.movieSlug,
        episodeSlug: payload.episodeSlug,
      },
    },
    update: {
      currentTime: progress.currentTime,
      duration: progress.duration,
      watchedPercentage: progress.watchedPercentage,
      lastWatched: new Date(progress.lastWatched),
    },
    create: {
      userId: user.id,
      movieSlug: payload.movieSlug,
      episodeSlug: payload.episodeSlug,
      currentTime: progress.currentTime,
      duration: progress.duration,
      watchedPercentage: progress.watchedPercentage,
      lastWatched: new Date(progress.lastWatched),
    },
  });

  return NextResponse.json({
    progress: {
      movieSlug: saved.movieSlug,
      episodeSlug: saved.episodeSlug,
      currentTime: saved.currentTime,
      duration: saved.duration,
      watchedPercentage: saved.watchedPercentage,
      lastWatched: saved.lastWatched.toISOString(),
    },
  });
}

export async function DELETE(request: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const movieSlug = searchParams.get("movieSlug");
  const episodeSlug = searchParams.get("episodeSlug");

  if (!movieSlug || !episodeSlug) {
    return NextResponse.json(
      { error: "Both movieSlug and episodeSlug are required for deletion" },
      { status: 400 },
    );
  }

  await database.watchProgress.deleteMany({
    where: {
      userId: user.id,
      movieSlug,
      episodeSlug,
    },
  });

  return NextResponse.json({ success: true });
}
