import {
  extractBackdropUrl,
  extractPosterUrl,
  fetchMovieImages,
} from "@/lib/services/movie";
import type { IMovie } from "@/types/response";
import { type RankedFilm, RankedHeroView } from "./ranked-hero-view";

/** Plain text from ophim's HTML synopsis (for the description and for SEO). */
function toPlainText(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Home hero ("Ranked", chosen in the redesign prototypes): a lead tile plus a
 * Top 5 list. It renders on the server, so every pick is a crawlable link in
 * the HTML. A small client view only swaps the lead tile on hover or focus.
 */
export async function RankedHero({ movies }: { movies: IMovie[] }) {
  const films = await Promise.all(
    movies.slice(0, 5).map(async (movie): Promise<RankedFilm> => {
      let backdrop = extractBackdropUrl();
      let poster = extractPosterUrl();
      try {
        const images = await fetchMovieImages(movie.slug);
        backdrop = extractBackdropUrl(images);
        poster = extractPosterUrl(images, "w185");
      } catch (error) {
        console.error(`Failed to fetch images for ${movie.slug}:`, error);
      }
      return {
        slug: movie.slug,
        name: movie.name,
        originName: movie.origin_name,
        year: movie.year,
        rating: movie.imdb?.vote_average || undefined,
        quality: movie.quality || undefined,
        episode: movie.episode_current,
        facts: [movie.time, movie.country?.[0]?.name].filter(
          (fact): fact is string => Boolean(fact),
        ),
        categories: movie.category.slice(0, 3).map(({ name, slug }) => ({
          name,
          slug,
        })),
        synopsis: toPlainText(movie.content ?? ""),
        backdrop,
        poster,
      };
    }),
  );

  if (films.length === 0) {
    return null;
  }

  return <RankedHeroView films={films} />;
}
