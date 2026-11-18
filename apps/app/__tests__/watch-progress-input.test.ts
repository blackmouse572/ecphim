import { describe, expect, test } from "vitest";
import {
  MAX_DURATION_SECONDS,
  MAX_SLUG_LENGTH,
  parseWatchProgressInput,
} from "@/lib/watch-progress-input";

const valid = {
  movieSlug: "phim-a",
  episodeSlug: "tap-1",
  currentTime: 120,
  duration: 2400,
};

describe("parseWatchProgressInput", () => {
  test("accepts in-range input", () => {
    expect(parseWatchProgressInput(valid)).toEqual(valid);
  });

  test("rejects non-objects", () => {
    expect(parseWatchProgressInput(null)).toBeNull();
    expect(parseWatchProgressInput("x")).toBeNull();
    expect(parseWatchProgressInput(42)).toBeNull();
  });

  test("rejects missing, empty or oversized slugs", () => {
    expect(parseWatchProgressInput({ ...valid, movieSlug: "" })).toBeNull();
    expect(parseWatchProgressInput({ ...valid, episodeSlug: 1 })).toBeNull();
    expect(
      parseWatchProgressInput({
        ...valid,
        movieSlug: "a".repeat(MAX_SLUG_LENGTH + 1),
      }),
    ).toBeNull();
  });

  test("rejects non-finite and out-of-range numbers", () => {
    for (const duration of [
      0,
      -1,
      Number.NaN,
      Number.POSITIVE_INFINITY,
      MAX_DURATION_SECONDS + 1,
      "60",
    ]) {
      expect(parseWatchProgressInput({ ...valid, duration })).toBeNull();
    }
    for (const currentTime of [-1, Number.NaN, valid.duration + 1, "10"]) {
      expect(parseWatchProgressInput({ ...valid, currentTime })).toBeNull();
    }
  });

  test("drops unknown fields", () => {
    expect(
      parseWatchProgressInput({ ...valid, userId: "someone-else" }),
    ).toEqual(valid);
  });
});
