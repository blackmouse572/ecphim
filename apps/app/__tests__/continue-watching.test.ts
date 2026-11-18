import { beforeEach, describe, expect, test, vi } from "vitest";

const currentUser = vi.fn();
const findMany = vi.fn();
const getMovieDetail = vi.fn();

vi.mock("@repo/auth/server", () => ({ currentUser }));
vi.mock("@repo/database", () => ({
  database: { watchProgress: { findMany } },
}));
vi.mock("@/lib/services/movie", () => ({ getMovieDetail }));

const { getContinueWatching } = await import("@/lib/continue-watching");

const row = (movieSlug: string, episodeSlug: string, percentage: number) => ({
  movieSlug,
  episodeSlug,
  percentage,
  updatedAt: new Date("2026-11-17T10:00:00Z"),
});

const movie = (slug: string) => ({
  name: `Phim ${slug}`,
  poster_url: `https://img.example/${slug}.jpg`,
  episodes: [
    {
      server_name: "Vietsub",
      server_data: [
        { slug: "tap-1", name: "Tập 1" },
        { slug: "tap-2", name: "Tập 2" },
      ],
    },
  ],
});

describe("getContinueWatching", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMovieDetail.mockImplementation(async (slug: string) => movie(slug));
  });

  test("returns nothing for guests without touching the database", async () => {
    currentUser.mockResolvedValue(null);
    expect(await getContinueWatching()).toEqual({ signedIn: false, items: [] });
    expect(findMany).not.toHaveBeenCalled();
  });

  test("keeps the newest unfinished episode per movie", async () => {
    currentUser.mockResolvedValue({ id: "u1" });
    findMany.mockResolvedValue([
      row("a", "tap-2", 40),
      row("a", "tap-1", 50),
      row("b", "tap-1", 95),
      row("c", "tap-1", 10),
    ]);

    const result = await getContinueWatching();

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "u1" } }),
    );
    expect(result.items.map((i) => [i.movieSlug, i.episodeSlug])).toEqual([
      ["a", "tap-2"],
      ["c", "tap-1"],
    ]);
    expect(result.items[0]).toMatchObject({
      movieName: "Phim a",
      episodeName: "Tập 2",
      serverName: "Vietsub",
      percentage: 40,
    });
  });

  test("drops movies the API can no longer find", async () => {
    currentUser.mockResolvedValue({ id: "u1" });
    findMany.mockResolvedValue([
      row("gone", "tap-1", 20),
      row("c", "tap-1", 10),
    ]);
    getMovieDetail.mockImplementation(async (slug: string) => {
      if (slug === "gone") throw new Error("404");
      return movie(slug);
    });

    const result = await getContinueWatching();
    expect(result.items.map((i) => i.movieSlug)).toEqual(["c"]);
  });
});
