import { fetchMovieImages } from "@/lib/services";
import { extractBackdropUrl } from "@/lib/services/movie";
import type { IMovie } from "@/types/response";
import { HeroSection } from "./hero-section";

interface HeroCarouselWrapperProps {
  movies: IMovie[];
  cdnUrl?: string;
}

export async function HeroCarouselWrapper({
  movies,
  cdnUrl,
}: HeroCarouselWrapperProps) {
  // Fetch images for all movies in parallel
  const movieImagesPromises = movies.map(async (movie) => {
    try {
      const thumbnail = await fetchMovieImages(movie.slug);
      const url = extractBackdropUrl(thumbnail);
      const placeholder = extractBackdropUrl(thumbnail, "w1280");
      return {
        slug: movie.slug,
        url,
        placeholder,
        lowResUrl: `${cdnUrl || ""}/uploads/movies/${movie.poster_url}`,
      };
    } catch (error) {
      console.error(`Failed to fetch images for ${movie.slug}:`, error);
      // Fallback to default image if fetch fails
      return {
        slug: movie.slug,
        url: extractBackdropUrl(),
        placeholder: extractBackdropUrl(),
      };
    }
  });

  const movieImagesArray = await Promise.all(movieImagesPromises);
  const movieImages = movieImagesArray.reduce(
    (acc, item) => {
      acc[item.slug] = {
        url: item.url,
        placeholder: item.placeholder,
      };
      return acc;
    },
    {} as Record<string, { url: string; placeholder: string }>,
  );

  return <HeroSection movies={movies} movieImages={movieImages} />;
}
