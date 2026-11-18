"use client";

import {
  MediaRow,
  MediaRowItem,
} from "@repo/design-system/components/ecphim/media-row";
import { MediaMeta } from "@repo/design-system/components/ecphim/media-tile";
import { PosterCard } from "@repo/design-system/components/ecphim/poster-card";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  type ContinueWatchingItem,
  getContinueWatching,
} from "@/lib/continue-watching";
import { resolveImageUrl } from "@/lib/services/image-url";
import { SectionShell } from "./section-shell";

const watchUrl = (item: ContinueWatchingItem) => {
  const params = new URLSearchParams({ episode: item.episodeSlug });
  if (item.serverName) {
    params.set("server", item.serverName);
  }
  return `/movie/${item.movieSlug}/watch?${params.toString()}`;
};

/**
 * "Tiếp tục xem": the signed-in viewer's unfinished titles, newest first.
 * Loads after the page because the home page itself is cached for everyone.
 * Renders nothing for guests or an empty history.
 */
export function ContinueWatching() {
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    getContinueWatching()
      .then((result) => {
        if (!cancelled) {
          setItems(result.items);
        }
      })
      .catch(() => {
        // The row is optional; a failed load just leaves it out.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <ContinueWatchingRow items={items} />;
}

/** The row itself, for a list of items already loaded. */
export function ContinueWatchingRow({
  items,
}: {
  items: ContinueWatchingItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <SectionShell>
      <MediaRow title="Tiếp tục xem">
        {items.map((item) => {
          const percentage = Math.round(
            Math.min(Math.max(item.percentage, 0), 100),
          );
          return (
            <MediaRowItem key={item.movieSlug} size="wide">
              <PosterCard
                artwork={
                  <>
                    <Image
                      alt=""
                      height={180}
                      sizes="(min-width: 1024px) 320px, (min-width: 640px) 288px, 256px"
                      src={resolveImageUrl(item.image ?? undefined)}
                      width={320}
                    />
                    <span
                      aria-label={`Đã xem ${percentage}%`}
                      className="absolute inset-x-0 bottom-0 h-1 bg-white/20"
                      role="img"
                    >
                      <span
                        className="block h-full bg-primary"
                        style={{ width: `${percentage}%` }}
                      />
                    </span>
                  </>
                }
                badge={item.episodeName || undefined}
                meta={
                  <MediaMeta
                    className="text-muted-foreground"
                    items={[`Đã xem ${percentage}%`]}
                  />
                }
                render={<Link href={watchUrl(item)} />}
                shape="still"
                title={item.movieName}
              />
            </MediaRowItem>
          );
        })}
      </MediaRow>
    </SectionShell>
  );
}
