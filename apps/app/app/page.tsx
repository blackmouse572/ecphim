import { MotionPage } from "@repo/design-system/components/motion";
import { fetchHomeMovies, fetchMovieList } from "@/lib/services/movie";
import { PublicLayout } from "./components/public-layout";
import {
  ContinueWatching,
  CountryShelf,
  NewEpisodes,
  Spotlight,
  TrendingMovies,
} from "./components/sections";
import { RankedHero } from "./components/sections/ranked-hero";

/** A genre or country row is skipped, not fatal, when VSMov has no list for it. */
function safeList(params: Parameters<typeof fetchMovieList>[0]) {
  return fetchMovieList(params)
    .then((list) => list.items)
    .catch(() => []);
}

export const revalidate = 86400;

/**
 * The home page shows, rather than asks: a hero, then a short run of rows
 * that each answer one question ("what's new tonight?", "something Korean?").
 * Fewer, bigger rows with varied shapes, so it doesn't read as one long grid.
 */
export default async function HomePage() {
  const [movies, newEpisodes, cinema, action, vietnamese, horror] =
    await Promise.all([
      fetchHomeMovies(),
      safeList({ slug: "phim-bo", limit: 16, sort_field: "modified.time" }),
      safeList({
        slug: "phim-chieu-rap",
        limit: 20,
        sort_field: "modified.time",
      }),
      safeList({
        category: "hanh-dong",
        limit: 20,
        sort_field: "modified.time",
      }),
      safeList({ country: "viet-nam", limit: 20, sort_field: "modified.time" }),
      safeList({ category: "kinh-di", limit: 20, sort_field: "modified.time" }),
    ]);

  // The hero takes the first five; the spotlight pitches the next one that
  // has a synopsis (only the first ten home titles carry full details).
  const spotlight = movies.slice(5).find((movie) => movie.content);

  return (
    <PublicLayout>
      <MotionPage className="min-h-screen bg-linear-to-br from-black via-zinc-950 to-black pb-10">
        <RankedHero movies={movies} />
        <ContinueWatching />
        <NewEpisodes movies={newEpisodes} />
        <TrendingMovies
          movies={cinema}
          title="Phim chiếu rạp"
          viewAllUrl="/discover?clt=phim-chieu-rap"
        />
        <TrendingMovies
          movies={action}
          title="Hành động gay cấn"
          viewAllUrl="/discover?ctg=hanh-dong"
        />
        <CountryShelf />
        <Spotlight movie={spotlight} />
        <TrendingMovies
          movies={vietnamese}
          title="Phim Việt"
          viewAllUrl="/discover?cntry=viet-nam"
        />
        <TrendingMovies
          movies={horror}
          title="Kinh dị cho đêm nay"
          viewAllUrl="/discover?ctg=kinh-di"
        />
      </MotionPage>
    </PublicLayout>
  );
}
