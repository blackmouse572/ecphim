import { MotionPage } from "@repo/design-system/components/motion";
import { fetchHomeMovies, fetchMovieList } from "@/lib/services/movie";
import { PublicLayout } from "./components/public-layout";
import { TrendingMovies } from "./components/sections";
import { HeroCarouselWrapper } from "./components/sections/hero-carousel-wrapper";

export const revalidate = 86400;
export default async function HomePage() {
  const [movies, latestMovies, updatedMovies, cinemaMovies] = await Promise.all(
    [
      fetchHomeMovies(),
      fetchMovieList({ slug: "phim-moi", limit: 20 }),
      fetchMovieList({
        slug: "phim-moi",
        limit: 20,
        sort_field: "modified.time",
      }),
      fetchMovieList({
        slug: "phim-chieu-rap",
        limit: 20,
        sort_field: "modified.time",
      }),
    ],
  );

  return (
    <PublicLayout>
      <MotionPage className="min-h-screen bg-linear-to-br from-black via-zinc-950 to-black">
        <HeroCarouselWrapper movies={movies.slice(0, 5)} />
        <TrendingMovies
          movies={latestMovies.items}
          viewAllUrl="/discover?clt=phim-moi"
        />
        <TrendingMovies
          title="Mới cập nhật"
          movies={updatedMovies.items}
          viewAllUrl="/discover?sort_by=modified.time&sort_order=desc"
        />
        <TrendingMovies
          title="Phim chiếu rạp"
          movies={cinemaMovies.items}
          viewAllUrl="/discover?clt=phim-chieu-rap"
        />
      </MotionPage>
    </PublicLayout>
  );
}
