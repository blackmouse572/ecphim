import {
  JsonLd,
  type Movie,
  type TVSeries,
  type WithContext,
} from "@repo/seo/json-ld";
import { createMetadata } from "@repo/seo/metadata";
import { resolveImageUrl } from "@/lib/services/image-url";
import {
  extractBackdropUrl,
  extractPosterUrl,
  fetchMovieList,
  getMovieDetail,
  getMovieImages,
} from "@/lib/services/movie";
import { EpisodeGrid } from "../../../(public-nolayout)/movie/[slug]/watch/components";
import { toPlainText } from "../../../components/sections/ranked-hero";
import { RelatedMovies } from "../../../components/sections/related-movies";
import { MovieFacts } from "./components/movie-facts";
import { MovieHero } from "./components/movie-hero";

type Props = {
  params: Promise<{ slug: string }>;
};

// ISR: rebuilt at most once a day; the first request after that serves the
// stale page while a fresh one renders in the background.
export const revalidate = 86400;

/** Pre-render the newest titles at build time; the rest render on demand. */
export async function generateStaticParams() {
  try {
    const { items } = await fetchMovieList({ slug: "phim-moi", limit: 50 });
    return items.map((movie) => ({ slug: movie.slug }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

/** A search-result length description, cut at a word. */
function summary(text: string, max = 158) {
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(" ", max))}…`;
}

export const generateMetadata = async ({ params }: Props) => {
  const { slug } = await params;
  const movie = await getMovieDetail(slug);
  const synopsis = toPlainText(movie.content ?? "");
  const year = movie.year ? ` (${movie.year})` : "";

  return createMetadata({
    title: `${movie.name}${year} - Xem phim ${movie.quality || "HD"} Vietsub`,
    description: summary(
      synopsis || `Xem ${movie.name} (${movie.origin_name}) online miễn phí.`,
    ),
    image: resolveImageUrl(movie.poster_url || movie.thumb_url, undefined, ""),
  });
};

export default async function MovieDetailPage({ params }: Props) {
  const { slug } = await params;
  const movie = await getMovieDetail(slug);
  const imageData = await getMovieImages(slug).catch(() => undefined);
  const synopsis = toPlainText(movie.content ?? "");

  const backdrop = imageData
    ? extractBackdropUrl(imageData)
    : resolveImageUrl(movie.poster_url, undefined, extractBackdropUrl());
  const poster = imageData
    ? extractPosterUrl(imageData, "w342")
    : resolveImageUrl(movie.thumb_url);

  const hasEpisodes = movie.episodes?.some((s) => s.server_data.length > 0);
  const isSeries = movie.type === "series" || movie.tmdb?.type === "tv";
  const rating = movie.imdb?.vote_average || movie.tmdb?.vote_average || 0;
  const jsonLd: WithContext<Movie | TVSeries> = {
    "@context": "https://schema.org",
    "@type": isSeries ? "TVSeries" : "Movie",
    name: movie.name,
    alternateName: movie.origin_name || undefined,
    description: synopsis || undefined,
    image: poster,
    dateCreated: movie.year ? String(movie.year) : undefined,
    genre: movie.category.map((c) => c.name),
    countryOfOrigin: movie.country.map((c) => ({
      "@type": "Country" as const,
      name: c.name,
    })),
    director: movie.director
      ?.filter((name) => name.trim())
      .map((name) => ({ "@type": "Person" as const, name })),
    actor: movie.actor
      ?.filter((name) => name.trim())
      .slice(0, 10)
      .map((name) => ({ "@type": "Person" as const, name })),
    ...(rating > 0 && movie.tmdb?.vote_count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating" as const,
            ratingValue: rating,
            ratingCount: movie.tmdb.vote_count,
            bestRating: 10,
          },
        }
      : {}),
  };

  return (
    <div className="min-h-screen pb-12">
      <JsonLd code={jsonLd} />
      <MovieHero
        backdrop={backdrop}
        movie={movie}
        poster={poster}
        synopsis={synopsis}
      />

      <div className="container mx-auto grid max-w-7xl gap-10 px-4 py-6 md:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
        <div className="grid min-w-0 content-start gap-10">
          {hasEpisodes ? (
            <section aria-labelledby="episodes" className="grid gap-4">
              <h2
                className="font-semibold text-lg tracking-[-0.015em]"
                id="episodes"
              >
                Danh sách tập
              </h2>
              <EpisodeGrid movie={movie} />
            </section>
          ) : null}

          {/* The hero shows three lines; repeat it in full only if it's longer. */}
          {synopsis.length > 220 ? (
            <section aria-labelledby="synopsis" className="grid gap-3">
              <h2
                className="font-semibold text-lg tracking-[-0.015em]"
                id="synopsis"
              >
                Nội dung phim
              </h2>
              <p className="max-w-[68ch] text-pretty text-foreground/80 leading-relaxed">
                {synopsis}
              </p>
            </section>
          ) : null}
        </div>

        <MovieFacts movie={movie} />
      </div>

      <RelatedMovies movie={movie} />
    </div>
  );
}
