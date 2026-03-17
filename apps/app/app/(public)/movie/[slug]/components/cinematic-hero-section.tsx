import { Star } from "@phosphor-icons/react/ssr";
import { MotionItem, MotionList } from "@repo/design-system/components/motion";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Note } from "@repo/design-system/components/ui/note";
import { cn } from "@repo/design-system/lib/utils";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { Display } from "@/app/components/typography/display";
import { extractPosterUrl } from "@/lib/services";
import { extractBackdropUrl } from "@/lib/services/movie";
import type { IMovie } from "@/types/response";
import { WatchNowButton } from "../../../../components/watch-now-button";

export function CinematicHeroSection({
  className,
  movie,
  imageData,
  ...props
}: React.ComponentProps<"section"> & {
  imageData?: any;
  movie: IMovie;
}) {
  const backdropPlaceholder = extractBackdropUrl(imageData, "w1280");
  const backdrop = extractBackdropUrl(imageData, "original");
  const poster = extractPosterUrl(imageData, "original");
  const posterPlaceholder = extractPosterUrl(imageData, "w154");

  return (
    <section
      className={cn(
        "relative flex items-start overflow-hidden py-4 xl:py-16",
        className,
      )}
      {...props}
    >
      {/* Background with dramatic gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <Image
          alt={movie.name}
          className="h-full w-full scale-105 object-cover"
          height={1080}
          priority
          src={backdrop}
          width={1920}
          quality={75}
          placeholder={"blur"}
          blurDataURL={backdropPlaceholder}
        />
      </div>

      {/* Main Content */}
      <div className="container relative z-30 mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-[400px_1fr]">
          {/* Poster */}
          <MotionItem className="order-2 lg:order-1">
            <Link href={`/movie/${movie.slug}/watch?episode=tap-01&server=0`}>
              <div className="group relative mx-auto aspect-[2/3] max-w-[400px] overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl transition-all duration-700 hover:scale-105 hover:border-white/40 lg:mx-0">
                <Image
                  alt={movie.name}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  height={500}
                  priority
                  src={poster}
                  width={300}
                  quality={75}
                  placeholder="blur"
                  blurDataURL={posterPlaceholder}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <div className="rounded-full bg-white/20 p-6 backdrop-blur-md transition-colors hover:bg-white/30">
                    {/*<Play weight="fill" className="h-12 w-12 text-white" />*/}
                  </div>
                </div>
              </div>
            </Link>
          </MotionItem>

          {/* Movie Info */}
          <MotionList delay={0.2} className="order-1 space-y-6 pb-4 lg:order-2">
            {/* Categories & Rating */}
            <MotionItem>
              <div className="mb-6 flex flex-wrap items-center gap-4">
                {movie.category.map((cat) => (
                  <Link key={cat._id + cat.slug} href={`/category/${cat.slug}`}>
                    <Badge
                      isCircle
                      intent="info"
                      className="backdrop-blur-md hover:bg-sky-500/30"
                    >
                      #{cat.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </MotionItem>

            {/* Title */}
            <MotionItem>
              <Display className="text-display-sm">{movie.name}</Display>
              <h2 className="mb-2 font-200 text-title text-white/70">
                {movie.origin_name}
              </h2>
              <div className="flex items-center gap-4 font-mono text-body text-white/50">
                {movie.year} • {movie.episode_current} • {movie.quality} •{" "}
                <span className="flex w-fit items-center">
                  <Star weight="fill" className="h-4 w-4 text-yellow-400" />
                  {movie.tmdb.vote_average.toFixed(1)}
                </span>
              </div>
            </MotionItem>

            {/* Actions */}
            <MotionItem>
              {movie.episode_current === "Trailer" ? (
                <Note intent="info">
                  <div className="flex size-full items-center gap-2">
                    <p>
                      Phim đang trong giai đoạn trailer, vui lòng quay lại sau
                      để xem nhé!
                    </p>
                  </div>
                </Note>
              ) : (
                <div className="flex w-full flex-wrap gap-4 sm:w-fit">
                  <WatchNowButton className="w-full" movie={movie} />
                </div>
              )}
            </MotionItem>
          </MotionList>
        </div>
      </div>
    </section>
  );
}
