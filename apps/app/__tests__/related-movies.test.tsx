import { expect, test, vi } from "vitest";

const lists: Record<string, string[]> = {
  "category:co-trang": ["a", "b", "self", "c"],
  "category:lang-man": ["c", "d", "b"],
  "country:trung-quoc": ["e", "c"],
  "slug:phim-moi": ["new1", "a", "new2", "new3", "new4", "new5"],
};

vi.mock("@/lib/services/movie", () => ({
  fetchMovieList: vi.fn(async (params: Record<string, string>) => {
    const key = params.category
      ? `category:${params.category}`
      : params.country
        ? `country:${params.country}`
        : `slug:${params.slug}`;
    return { items: (lists[key] ?? []).map((slug) => ({ slug, _id: slug })) };
  }),
}));

const { RelatedMovies } = await import(
  "../app/components/sections/related-movies"
);

const movie = (category: string[], country: string[]) =>
  ({
    slug: "self",
    category: category.map((slug) => ({ slug, name: slug })),
    country: country.map((slug) => ({ slug, name: slug })),
  }) as never;

test("ranks titles by how many of the film's lists they share, without the film itself", async () => {
  const element = await RelatedMovies({
    movie: movie(["co-trang", "lang-man"], ["trung-quoc"]),
  });
  const slugs = element.props.movies.map((m: { slug: string }) => m.slug);
  // c is in all three lists, b in two; the rest keep newest-first order.
  expect(slugs.slice(0, 2)).toEqual(["c", "b"]);
  expect(slugs).not.toContain("self");
  expect(new Set(slugs).size).toBe(slugs.length);
  expect(element.props.viewAllUrl).toBe("/discover?ctg=co-trang");
});

test("tops up with the newest titles when there is too little to go on", async () => {
  const element = await RelatedMovies({ movie: movie([], ["trung-quoc"]) });
  const slugs = element.props.movies.map((m: { slug: string }) => m.slug);
  expect(slugs.slice(0, 2)).toEqual(["e", "c"]);
  expect(slugs).toContain("new1");
  expect(slugs.length).toBeGreaterThanOrEqual(6);
});
