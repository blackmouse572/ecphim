import { cn } from "@repo/design-system/lib/utils";
import type * as React from "react";
import { useId } from "react";

type MediaRowProps = Omit<React.ComponentProps<"section">, "title"> & {
  title?: React.ReactNode;
  /** Shown at the end of the header, usually a "Xem tất cả" link. */
  action?: React.ReactNode;
  /**
   * `row` scrolls sideways with snap points and soft fades at the edges, in
   * place of a border or arrows. `grid` wraps into columns (for browse pages).
   */
  layout?: "row" | "grid";
};

/**
 * A titled list of posters. It is plain HTML and CSS with no client
 * JavaScript, so every item is a crawlable link in the server HTML.
 */
function MediaRow({
  className,
  title,
  action,
  layout = "row",
  children,
  ...props
}: MediaRowProps) {
  const headingId = useId();
  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className={cn("grid min-w-0 gap-3.5", className)}
      data-slot="media-row"
      {...props}
    >
      {title || action ? (
        <div className="flex items-baseline justify-between gap-3">
          {title ? (
            <h2
              className="font-semibold text-lg tracking-[-0.015em] md:text-xl"
              id={headingId}
            >
              {title}
            </h2>
          ) : null}
          {action}
        </div>
      ) : null}
      <ul
        className={cn(
          // `relative` keeps absolutely placed children (like sr-only text)
          // inside the scroller. Without it they escape to the page and widen
          // it, so phones zoom the whole page out.
          "group/row relative",
          layout === "row"
            ? "-mx-4 md:-mx-6 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto overscroll-x-contain px-4 pb-1 [mask-image:linear-gradient(to_right,transparent,black_1rem,black_calc(100%-2.5rem),transparent)] [scrollbar-width:none] md:scroll-px-6 md:gap-4 md:px-6 [&::-webkit-scrollbar]:hidden"
            : "grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 md:gap-x-4 lg:grid-cols-6",
        )}
        data-layout={layout}
      >
        {children}
      </ul>
    </section>
  );
}

/**
 * One item in a MediaRow. In a `row`, `poster` items fit a 2:3 PosterCard and
 * `wide` items fit a 16:9 still or a tile.
 */
function MediaRowItem({
  className,
  size = "poster",
  ...props
}: React.ComponentProps<"li"> & { size?: "poster" | "wide" }) {
  return (
    <li
      className={cn(
        "min-w-0 list-none group-data-[layout=row]/row:shrink-0 group-data-[layout=row]/row:snap-start",
        size === "wide"
          ? "group-data-[layout=row]/row:w-64 sm:group-data-[layout=row]/row:w-72 lg:group-data-[layout=row]/row:w-80"
          : "group-data-[layout=row]/row:w-36 sm:group-data-[layout=row]/row:w-40 lg:group-data-[layout=row]/row:w-44",
        className,
      )}
      data-slot="media-row-item"
      {...props}
    />
  );
}

/** The look of the "Xem tất cả" link in a MediaRow header (put it on next/link). */
const mediaRowActionClassName =
  "rounded-md font-medium text-muted-foreground text-sm outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50";

export { MediaRow, MediaRowItem, mediaRowActionClassName };
