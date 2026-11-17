import {
  MediaRow,
  MediaRowItem,
  mediaRowActionClassName,
} from "@repo/design-system/components/ecphim/media-row";
import { MediaMeta } from "@repo/design-system/components/ecphim/media-tile";
import { PosterCard } from "@repo/design-system/components/ecphim/poster-card";
import Image from "next/image";
import Link from "next/link";
import { resolveImageUrl } from "@/lib/services/image-url";
import type { IMovie } from "@/types/response";
import { SectionShell } from "./section-shell";

interface NewEpisodesProps {
  movies: IMovie[];
  title?: string;
  viewAllUrl?: string;
}

/**
 * Series that just got a new episode, as wide stills from the show rather
 * than posters. The episode is the news, so it sits on the artwork.
 */
export function NewEpisodes({
  movies,
  title = "Tập mới hôm nay",
  viewAllUrl = "/discover?clt=phim-bo&sort_by=modified.time&sort_order=desc",
}: NewEpisodesProps) {
  const items = movies.filter((movie) => movie.poster_url || movie.thumb_url);
  if (items.length === 0) {
    return null;
  }

  return (
    <SectionShell>
      <MediaRow
        action={
          <Link className={mediaRowActionClassName} href={viewAllUrl}>
            Xem tất cả
          </Link>
        }
        title={title}
      >
        {items.map((movie) => (
          <MediaRowItem key={movie._id} size="wide">
            <PosterCard
              artwork={
                <Image
                  alt=""
                  height={180}
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 288px, 256px"
                  src={resolveImageUrl(movie.poster_url || movie.thumb_url)}
                  width={320}
                />
              }
              badge={movie.episode_current || undefined}
              meta={
                <MediaMeta
                  className="text-muted-foreground"
                  items={[movie.country?.[0]?.name, movie.lang].filter(
                    (item): item is string => Boolean(item),
                  )}
                  year={movie.year || undefined}
                />
              }
              render={<Link href={`/movie/${movie.slug}`} />}
              shape="still"
              title={movie.name}
            />
          </MediaRowItem>
        ))}
      </MediaRow>
    </SectionShell>
  );
}
