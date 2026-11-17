import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@repo/design-system/components/base/button";
import { createMetadata } from "@repo/seo/metadata";
import Link from "next/link";
import {
  extractBackdropUrl,
  fetchMovieDetail,
  fetchMovieImages,
} from "../../../../../lib/services/movie";
import { toPlainText } from "../../../../components/sections/ranked-hero";
import { RelatedMovies } from "../../../../components/sections/related-movies";
import { MovieWatchClientPage } from "./page-client";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const movie = await fetchMovieDetail(slug);
  const synopsis = toPlainText(movie.content ?? "");
  return createMetadata({
    title: `Xem ${movie.name}`,
    description:
      synopsis.length > 158
        ? `${synopsis.slice(0, synopsis.lastIndexOf(" ", 158))}…`
        : synopsis || `Xem ${movie.name} online miễn phí.`,
  });
}

export default async function MovieWatchPage({ params }: Props) {
  const { slug } = await params;
  const movie = await fetchMovieDetail(slug);
  const imageData = await fetchMovieImages(slug).catch(() => undefined);
  const backdrop = extractBackdropUrl(imageData, "original");

  return (
    <div className="min-h-screen pb-8">
      <header className="sticky top-0 z-20 flex h-14 items-center gap-2 bg-black/80 reduce-transparency:bg-black px-2 backdrop-blur-md reduce-transparency:backdrop-blur-none md:px-4">
        <Button
          aria-label="Quay lại trang phim"
          nativeButton={false}
          render={<Link href={`/movie/${slug}`} />}
          size="icon-lg"
          variant="ghost"
        >
          <ArrowLeftIcon />
        </Button>
        <Link
          className="min-w-0 truncate rounded-sm font-medium text-sm text-white/85 outline-none hover:text-white focus-visible:ring-3 focus-visible:ring-ring/50"
          href={`/movie/${slug}`}
        >
          {movie.name}
        </Link>
      </header>
      <MovieWatchClientPage
        episodes={movie.episodes}
        movie={{ ...movie, thumb_url: backdrop }}
        params={{ slug }}
      >
        <RelatedMovies movie={movie} title="Có thể bạn cũng thích" />
      </MovieWatchClientPage>
    </div>
  );
}
