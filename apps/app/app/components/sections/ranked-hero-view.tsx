"use client";

import { PlayIcon } from "@phosphor-icons/react/ssr";
import { Button } from "@repo/design-system/components/base/button";
import {
  MediaMeta,
  MediaTile,
  MediaTileDescription,
  MediaTileTitle,
} from "@repo/design-system/components/ecphim/media-tile";
import {
  RankItem,
  RankList,
} from "@repo/design-system/components/ecphim/rank-list";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type RankedFilm = {
  slug: string;
  name: string;
  originName: string;
  year: number;
  rating?: number;
  quality?: string;
  episode: string;
  facts: string[];
  categories: { name: string; slug: string }[];
  synopsis: string;
  backdrop: string;
  poster: string;
};

export function RankedHeroView({ films }: { films: RankedFilm[] }) {
  const [active, setActive] = useState(0);
  const film = films[active];

  return (
    <section
      aria-labelledby="ranked-hero-heading"
      className="container mx-auto max-w-7xl px-4 pt-6 pb-2 md:px-6 md:pt-8"
    >
      <div className="mb-3.5 flex items-baseline justify-between gap-3">
        <h2
          className="font-semibold text-muted-foreground text-xs uppercase tracking-[0.08em]"
          id="ranked-hero-heading"
        >
          Nổi bật tuần này
        </h2>
      </div>

      <div className="grid gap-3.5 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
        <MediaTile
          artwork={
            <Image
              alt=""
              className="motion-safe:fade-in motion-safe:animate-in motion-safe:duration-300"
              fill
              key={film.slug}
              priority={active === 0}
              sizes="(min-width: 1024px) 62vw, 100vw"
              src={film.backdrop}
            />
          }
          render={<Link href={`/movie/${film.slug}`} />}
          size="lead"
        >
          <div className="flex flex-wrap gap-2">
            {film.categories.map((category) => (
              <span
                className="squircle rounded-lg bg-white/10 reduce-transparency:bg-neutral-800 px-2.5 py-0.5 font-medium text-white text-xs ring-1 ring-white/15 backdrop-blur-sm reduce-transparency:backdrop-blur-none"
                key={category.slug}
              >
                {category.name}
              </span>
            ))}
          </div>
          <MediaTileTitle as="h1">{film.name}</MediaTileTitle>
          <p className="-mt-2 text-sm text-white/60">
            {film.originName} ({film.year})
          </p>
          <MediaMeta
            items={film.facts}
            quality={film.quality}
            rating={film.rating}
            year={film.year}
          />
          {film.synopsis ? (
            <MediaTileDescription>{film.synopsis}</MediaTileDescription>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-2.5">
            <Button nativeButton={false} render={<span />} size="xl">
              <PlayIcon data-icon="inline-start" weight="fill" />
              Xem ngay
            </Button>
          </div>
        </MediaTile>

        <RankList title="Top 5 hôm nay">
          {films.map((item, index) => (
            <RankItem
              active={index === active}
              key={item.slug}
              meta={
                <MediaMeta
                  className="text-muted-foreground"
                  items={[item.episode]}
                  rating={item.rating}
                  year={item.year}
                />
              }
              onFocus={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              rank={index + 1}
              render={<Link href={`/movie/${item.slug}`} />}
              thumbnail={
                <Image alt="" height={72} src={item.poster} width={48} />
              }
              title={item.name}
            />
          ))}
        </RankList>
      </div>
    </section>
  );
}
