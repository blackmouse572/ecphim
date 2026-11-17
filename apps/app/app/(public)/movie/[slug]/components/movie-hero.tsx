import { PlayIcon, YoutubeLogoIcon } from "@phosphor-icons/react/ssr";
import { Button } from "@repo/design-system/components/base/button";
import { MediaMeta } from "@repo/design-system/components/ecphim/media-tile";
import Image from "next/image";
import Link from "next/link";
import type { IMovie } from "@/types/response";

type MovieHeroProps = {
  movie: IMovie;
  backdrop: string;
  poster: string;
  /** The synopsis as plain text. */
  synopsis: string;
};

/**
 * The top of a film's page: its backdrop fading into the page, the poster,
 * the facts people decide on (rating, year, runtime, episodes), and one
 * clear action. Server-rendered, so the title and synopsis are in the HTML.
 */
export function MovieHero({
  movie,
  backdrop,
  poster,
  synopsis,
}: MovieHeroProps) {
  const rating = movie.imdb?.vote_average || movie.tmdb?.vote_average || 0;
  const isTrailer = movie.episode_current === "Trailer";
  const firstServer = movie.episodes?.find((s) => s.server_data.length > 0);
  const firstEpisode = firstServer?.server_data[0];
  const watchHref = firstEpisode
    ? `/movie/${movie.slug}/watch?episode=${firstEpisode.slug}&server=${encodeURIComponent(firstServer.server_name)}`
    : `/movie/${movie.slug}/watch`;

  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="-z-10 absolute inset-0 h-[34rem] md:h-[40rem]"
      >
        <Image
          alt=""
          className="size-full object-cover object-top opacity-60"
          fill
          priority
          sizes="100vw"
          src={backdrop}
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/10" />
        <div className="absolute inset-0 hidden bg-linear-to-r from-background/90 via-background/30 to-transparent md:block" />
      </div>

      <div className="container mx-auto grid max-w-7xl gap-6 px-4 pt-28 pb-8 md:grid-cols-[13rem_minmax(0,1fr)] md:items-end md:gap-8 md:px-6 md:pt-48 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="squircle surface relative mx-auto aspect-2/3 w-36 overflow-hidden rounded-(--radius-squircle-lg) bg-muted md:mx-0 md:w-full">
          <Image
            alt={`Poster ${movie.name}`}
            className="size-full object-cover"
            fill
            priority
            sizes="(min-width: 1024px) 240px, (min-width: 768px) 208px, 144px"
            src={poster}
          />
        </div>

        <div className="grid min-w-0 gap-4 text-center md:text-left">
          {movie.category.length > 0 ? (
            <ul className="flex flex-wrap justify-center gap-2 md:justify-start">
              {movie.category.slice(0, 4).map((category) => (
                <li key={category.slug}>
                  <Link
                    className="squircle inline-flex rounded-(--radius-squircle-sm) bg-white/10 reduce-transparency:bg-neutral-800 px-2.5 py-0.5 font-medium text-white text-xs ring-1 ring-white/15 backdrop-blur-sm reduce-transparency:backdrop-blur-none transition-colors hover:bg-white/20"
                    href={`/discover?ctg=${category.slug}`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="grid gap-1.5">
            <h1 className="text-balance font-bold text-[clamp(1.875rem,4.5vw,3.25rem)] leading-[1.05] tracking-[-0.025em]">
              {movie.name}
            </h1>
            {movie.origin_name && movie.origin_name !== movie.name ? (
              <p className="text-muted-foreground text-sm md:text-base">
                {movie.origin_name}
              </p>
            ) : null}
          </div>

          <MediaMeta
            className="justify-center text-foreground/75 text-sm md:justify-start"
            items={[movie.time, movie.episode_current, movie.lang].filter(
              (item): item is string => Boolean(item),
            )}
            quality={movie.quality || undefined}
            rating={rating > 0 ? rating : undefined}
            year={movie.year || undefined}
          />

          {synopsis ? (
            <p className="mx-auto line-clamp-3 max-w-[60ch] text-pretty text-foreground/80 text-sm leading-relaxed md:mx-0 md:text-base">
              {synopsis}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-center gap-2.5 pt-1 md:justify-start">
            {isTrailer ? (
              <p className="squircle rounded-(--radius-squircle-md) bg-muted px-4 py-2.5 text-muted-foreground text-sm">
                Phim chưa phát hành. Hãy quay lại sau nhé!
              </p>
            ) : (
              <Button
                nativeButton={false}
                render={<Link href={watchHref} />}
                size="lg"
              >
                <PlayIcon data-icon="inline-start" weight="fill" />
                {firstEpisode &&
                movie.episodes.some((s) => s.server_data.length > 1)
                  ? `Xem ${firstEpisode.name.match(/^\d+$/) ? `tập ${firstEpisode.name}` : firstEpisode.name}`
                  : "Xem ngay"}
              </Button>
            )}
            {movie.trailer_url ? (
              <Button
                nativeButton={false}
                render={
                  // biome-ignore lint/a11y/useAnchorContent: Button renders its children (icon + "Trailer") inside the anchor.
                  <a href={movie.trailer_url} rel="noopener" target="_blank" />
                }
                size="lg"
                variant="secondary"
              >
                <YoutubeLogoIcon data-icon="inline-start" />
                Trailer
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
