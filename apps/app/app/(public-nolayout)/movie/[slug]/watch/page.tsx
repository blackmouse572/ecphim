import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { buttonStyles } from "@repo/design-system/components/variants/buttonVariants";
import { createMetadata } from "@repo/seo/metadata";
import Link from "next/link";
import {
  extractBackdropUrl,
  fetchMovieDetail,
  fetchMovieImages,
} from "../../../../../lib/services/movie";
import { MovieWatchClientPage } from "./page-client";

type Props = {
  params: Promise<{ slug: string }>;
};
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const movie = await fetchMovieDetail(slug);
  return createMetadata({
    title: movie.name,
    description: movie.content,
  });
}

export default async function MovieWatchPage({ params }: Props) {
  const { slug } = await params;
  const movie = await fetchMovieDetail(slug);
  const imageData = await fetchMovieImages(slug);
  const backdrop = extractBackdropUrl(imageData, "original");

  return (
    <div className="relative">
      <Link
        className={buttonStyles({
          intent: "secondary",
          size: "sm",
          className: "absolute top-4 left-4 z-10",
        })}
        href={`/movie/${slug}`}
      >
        <ArrowLeftIcon />
        Back
      </Link>
      <MovieWatchClientPage
        params={{ slug }}
        movie={{ ...movie, thumb_url: backdrop }}
        episodes={movie.episodes}
      />
    </div>
  );
}
