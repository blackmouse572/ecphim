// Validation for watch progress written to the database, shared by the
// server action and the /watch-progress beacon route.

export const MAX_SLUG_LENGTH = 200;
// 24 hours. Nothing on the site runs longer; anything above is bad input.
export const MAX_DURATION_SECONDS = 86_400;

export type WatchProgressInput = {
  movieSlug: string;
  episodeSlug: string;
  currentTime: number;
  duration: number;
};

const isSlug = (value: unknown): value is string =>
  typeof value === "string" &&
  value.length > 0 &&
  value.length <= MAX_SLUG_LENGTH;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

/** Returns the input when every field is in range, otherwise null. */
export const parseWatchProgressInput = (
  value: unknown,
): WatchProgressInput | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const { movieSlug, episodeSlug, currentTime, duration } = value as Record<
    string,
    unknown
  >;

  if (!(isSlug(movieSlug) && isSlug(episodeSlug))) {
    return null;
  }

  if (!(isFiniteNumber(duration) && isFiniteNumber(currentTime))) {
    return null;
  }

  if (duration <= 0 || duration > MAX_DURATION_SECONDS) {
    return null;
  }

  if (currentTime < 0 || currentTime > duration) {
    return null;
  }

  return { movieSlug, episodeSlug, currentTime, duration };
};
