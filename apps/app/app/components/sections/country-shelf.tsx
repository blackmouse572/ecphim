import {
  MediaRow,
  MediaRowItem,
} from "@repo/design-system/components/ecphim/media-row";
import {
  MediaTile,
  MediaTileTitle,
} from "@repo/design-system/components/ecphim/media-tile";
import Image from "next/image";
import Link from "next/link";
import { fetchCountries } from "@/lib/services";
import { resolveImageUrl } from "@/lib/services/image-url";
import { fetchMovieList } from "@/lib/services/movie";
import { SectionShell } from "./section-shell";

/** The countries people browse most, in the order they show. */
const FEATURED_COUNTRIES = [
  "han-quoc",
  "trung-quoc",
  "au-my",
  "nhat-ban",
  "thai-lan",
  "viet-nam",
];

const countFormat = new Intl.NumberFormat("vi-VN");

/**
 * "Xem theo quốc gia": one tile per country, with a real title count from the
 * API and a still from its newest title. A country the API doesn't know, or
 * one with no titles, is left out.
 */
export async function CountryShelf() {
  let countries: { name: string; slug: string }[] = [];
  try {
    countries = (await fetchCountries()).items;
  } catch {
    return null;
  }

  const featured = FEATURED_COUNTRIES.map((slug) =>
    countries.find((country) => country.slug === slug),
  ).filter((country) => country !== undefined);

  const tiles = (
    await Promise.all(
      featured.map(async (country) => {
        try {
          const list = await fetchMovieList({
            country: country.slug,
            limit: 1,
            sort_field: "modified.time",
          });
          const cover = list.items[0];
          const total = list.params.pagination.totalItems;
          if (!cover || total === 0) return null;
          return {
            ...country,
            total,
            image: resolveImageUrl(cover.poster_url || cover.thumb_url),
          };
        } catch {
          return null;
        }
      }),
    )
  ).filter((tile) => tile !== null);

  if (tiles.length === 0) {
    return null;
  }

  return (
    <SectionShell>
      <MediaRow title="Xem theo quốc gia">
        {tiles.map((tile) => (
          <MediaRowItem key={tile.slug} size="wide">
            <MediaTile
              artwork={
                <Image
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 288px, 256px"
                  src={tile.image}
                />
              }
              className="aspect-video min-h-0"
              render={<Link href={`/discover?cntry=${tile.slug}`} />}
            >
              <MediaTileTitle className="text-xl">{tile.name}</MediaTileTitle>
              <p className="font-mono text-white/70 text-xs tabular-nums">
                {countFormat.format(tile.total)} phim
              </p>
            </MediaTile>
          </MediaRowItem>
        ))}
      </MediaRow>
    </SectionShell>
  );
}
