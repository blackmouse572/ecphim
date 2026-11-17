import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { StarIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@repo/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

/**
 * A flat artwork tile for films and series. Pass the artwork (usually
 * `next/image` with `fill`) through `artwork`, and the text through children.
 * It renders an `<a>` by default. Use `render` to swap in `next/link`.
 *
 * It is a server component with no client JavaScript, so tiles in the hero
 * stay crawlable and fast.
 */
const mediaTileVariants = cva(
  "group/tile relative isolate flex flex-col justify-end overflow-hidden rounded-(--radius-squircle-lg) bg-card text-foreground surface squircle outline-none focus-visible:ring-3 focus-visible:ring-ring/60",
  {
    variants: {
      size: {
        default: "min-h-48 p-4 gap-1.5",
        lead: "min-h-[26rem] p-6 gap-3 md:p-7",
      },
    },
    defaultVariants: { size: "default" },
  },
);

type MediaTileProps = useRender.ComponentProps<"a"> &
  VariantProps<typeof mediaTileVariants> & {
    artwork?: React.ReactNode;
    rank?: number;
  };

function MediaTile({
  className,
  size,
  artwork,
  rank,
  children,
  render,
  ...props
}: MediaTileProps) {
  return useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">(
      {
        className: cn(mediaTileVariants({ size }), className),
        children: (
          <>
            <div
              aria-hidden
              className="-z-10 absolute inset-0 transition-transform duration-400 ease-(--ease-out-strong) motion-safe:group-hover/tile:scale-[1.03] [&_img]:size-full [&_img]:object-cover"
            >
              {artwork}
            </div>
            <div
              aria-hidden
              className="-z-10 absolute inset-0 bg-linear-to-t from-black/90 via-black/25 to-transparent"
            />
            {rank !== undefined && <MediaTileRank>{rank}</MediaTileRank>}
            {children}
          </>
        ),
      },
      props,
    ),
    state: { slot: "media-tile", size },
  });
}

function MediaTileRank({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "squircle absolute top-3.5 left-4 rounded-lg bg-black/45 reduce-transparency:bg-black px-2 py-0.5 font-bold font-mono text-white text-xs backdrop-blur-sm reduce-transparency:backdrop-blur-none",
        className,
      )}
      data-slot="media-tile-rank"
      {...props}
    >
      #{children}
    </span>
  );
}

function MediaTileTitle({
  className,
  as: Tag = "h3",
  ...props
}: React.ComponentProps<"h3"> & { as?: "h1" | "h2" | "h3" }) {
  return (
    <Tag
      className={cn(
        "text-balance font-bold text-base leading-tight tracking-[-0.01em] group-data-[size=lead]/tile:font-bold group-data-[size=lead]/tile:text-[clamp(1.75rem,3.6vw,2.75rem)] group-data-[size=lead]/tile:leading-[1.05] group-data-[size=lead]/tile:tracking-[-0.025em]",
        className,
      )}
      data-slot="media-tile-title"
      {...props}
    />
  );
}

function MediaTileDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "line-clamp-3 max-w-[52ch] text-pretty text-sm text-white/80",
        className,
      )}
      data-slot="media-tile-description"
      {...props}
    />
  );
}

type MediaMetaProps = React.ComponentProps<"div"> & {
  rating?: number;
  year?: number;
  quality?: string;
  items?: string[];
};

/** Rating, year, extra facts (runtime, episodes, country) and a quality tag. */
function MediaMeta({
  className,
  rating,
  year,
  quality,
  items = [],
  ...props
}: MediaMetaProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-white/70 text-xs",
        className,
      )}
      data-slot="media-meta"
      {...props}
    >
      {rating !== undefined && (
        <span className="inline-flex items-center gap-1 font-bold font-mono text-amber-300 tabular-nums">
          <StarIcon aria-hidden className="size-3.5" weight="fill" />
          <span className="sr-only">IMDb </span>
          {rating.toFixed(1)}
        </span>
      )}
      {year !== undefined && (
        <span className="font-mono tabular-nums">{year}</span>
      )}
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
      {quality ? (
        <span className="rounded-[5px] bg-white px-1.5 py-px font-bold font-mono text-[0.6875rem] text-black">
          {quality}
        </span>
      ) : null}
    </div>
  );
}

export {
  MediaMeta,
  MediaTile,
  MediaTileDescription,
  MediaTileRank,
  MediaTileTitle,
  mediaTileVariants,
};
