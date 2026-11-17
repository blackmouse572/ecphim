import { fetchMovieList } from "@/lib/services/movie";
import type { IMovie } from "@/types/response";
import { TrendingMovies } from "./trending-movies";

type RelatedMoviesProps = {
  movie: IMovie;
  title?: string;
  limit?: number;
};

/**
 * "Phim liên quan": titles that share the most with this one. VSMov has no
 * recommendations and its list items carry no genres, so we fetch the newest
 * titles in the film's first two genres and its country, and rank each title
 * by how many of those lists it appears in. With nothing to go on, it falls
 * back to the newest titles so the row is never empty.
 */
export async function RelatedMovies({
  movie,
  title = "Phim liên quan",
  limit = 15,
}: RelatedMoviesProps) {
  const lists = [
    ...movie.category.slice(0, 2).map((c) => ({ category: c.slug })),
    ...movie.country.slice(0, 1).map((c) => ({ country: c.slug })),
  ];

  const results = await Promise.all(
    lists.map((filter) =>
      fetchMovieList({ ...filter, limit: 24, sort_field: "modified.time" })
        .then((list) => list.items)
        .catch(() => [] as IMovie[]),
    ),
  );

  // Score = lists a title shows up in; ties keep the newest-first order.
  const scored = new Map<
    string,
    { movie: IMovie; score: number; order: number }
  >();
  let order = 0;
  for (const items of results) {
    for (const item of items) {
      if (item.slug === movie.slug) continue;
      const entry = scored.get(item.slug);
      if (entry) entry.score += 1;
      else scored.set(item.slug, { movie: item, score: 1, order: order++ });
    }
  }

  let related = [...scored.values()]
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((entry) => entry.movie)
    .slice(0, limit);

  if (related.length < 6) {
    const latest = await fetchMovieList({ slug: "phim-moi", limit: 20 })
      .then((list) => list.items)
      .catch(() => [] as IMovie[]);
    const seen = new Set([movie.slug, ...related.map((m) => m.slug)]);
    related = [...related, ...latest.filter((m) => !seen.has(m.slug))].slice(
      0,
      limit,
    );
  }

  const genre = movie.category[0];
  return (
    <TrendingMovies
      movies={related}
      title={title}
      viewAllUrl={genre ? `/discover?ctg=${genre.slug}` : "/discover"}
    />
  );
}
