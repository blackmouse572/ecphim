import { PlayIcon } from "@phosphor-icons/react/ssr";
import { Button } from "@repo/design-system/components/base/button";
import {
  MediaMeta,
  MediaTile,
  MediaTileDescription,
  MediaTileTitle,
} from "@repo/design-system/components/ecphim/media-tile";
import Image from "next/image";
import Link from "next/link";
import { extractBackdropUrl, fetchMovieImages } from "@/lib/services/movie";
import type { IMovie } from "@/types/response";
import { toPlainText } from "./ranked-hero";
import { SectionShell } from "./section-shell";

/**
 * One title, shown big, halfway down the page. It breaks the run of rows and
 * gives a film outside the hero's Top 5 a real pitch: artwork, synopsis, CTA.
 */
export async function Spotlight({
  movie,
  eyebrow = "Gợi ý cho bạn",
}: {
  movie?: IMovie;
  eyebrow?: string;
}) {
  if (!movie) {
    return null;
  }

  let backdrop = extractBackdropUrl();
  try {
    backdrop = extractBackdropUrl(await fetchMovieImages(movie.slug));
  } catch (error) {
    console.error(`Failed to fetch images for ${movie.slug}:`, error);
  }
  const synopsis = toPlainText(movie.content ?? "");

  return (
    <SectionShell>
      <section aria-label={eyebrow}>
        <MediaTile
          artwork={
            <Image
              alt=""
              fill
              sizes="(min-width: 1280px) 1232px, 100vw"
              src={backdrop}
            />
          }
          className="min-h-[22rem] md:min-h-[26rem]"
          render={<Link href={`/movie/${movie.slug}`} />}
          size="lead"
        >
          <p className="font-semibold text-primary text-xs uppercase tracking-[0.12em]">
            {eyebrow}
          </p>
          <MediaTileTitle as="h2">{movie.name}</MediaTileTitle>
          <MediaMeta
            items={[movie.episode_current, movie.country?.[0]?.name].filter(
              (item): item is string => Boolean(item),
            )}
            quality={movie.quality || undefined}
            rating={movie.imdb?.vote_average || undefined}
            year={movie.year || undefined}
          />
          {synopsis ? (
            <MediaTileDescription className="max-w-[46ch]">
              {synopsis}
            </MediaTileDescription>
          ) : null}
          <div className="mt-2">
            <Button nativeButton={false} render={<span />} size="lg">
              <PlayIcon data-icon="inline-start" weight="fill" />
              Xem ngay
            </Button>
          </div>
        </MediaTile>
      </section>
    </SectionShell>
  );
}
