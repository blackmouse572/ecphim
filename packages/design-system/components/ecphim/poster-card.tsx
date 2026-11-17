import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@repo/design-system/lib/utils";
import type * as React from "react";

type PosterCardProps = useRender.ComponentProps<"a"> & {
  /** Usually `next/image`. It fills the frame set by `shape`. */
  artwork: React.ReactNode;
  /**
   * `poster` is a 2:3 portrait poster. `still` is a 16:9 frame from the
   * film, for rows about episodes rather than titles (e.g. "Tập mới").
   */
  shape?: "poster" | "still";
  title: React.ReactNode;
  /** A line under the title, usually `MediaMeta`. */
  meta?: React.ReactNode;
  /** One short label on the artwork, such as the quality ("FHD"). */
  badge?: React.ReactNode;
};

/**
 * A film or series poster with its title underneath. The poster is a flat
 * surface (no skeuomorphic depth). The card shrinks a little the moment it is
 * pressed, and the artwork eases in on hover. Both are off with reduced motion.
 *
 * It renders an `<a>` by default. Pass `render={<Link href=... />}` for
 * `next/link`. It has no client JavaScript, so it works in server components.
 */
function PosterCard({
  className,
  artwork,
  title,
  meta,
  badge,
  shape = "poster",
  render,
  ...props
}: PosterCardProps) {
  return useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">(
      {
        className: cn(
          "group/poster grid min-w-0 content-start gap-2.5 outline-none transition-transform duration-100 ease-out active:scale-[0.98] motion-reduce:active:scale-100",
          className,
        ),
        children: (
          <>
            <span
              className={cn(
                "squircle surface relative block overflow-hidden rounded-(--radius-squircle-md) bg-muted group-focus-visible/poster:ring-3 group-focus-visible/poster:ring-ring/60 [&_img]:size-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-400 [&_img]:ease-(--ease-out-strong) motion-safe:group-hover/poster:[&_img]:scale-[1.03]",
                shape === "still" ? "aspect-video" : "aspect-2/3",
              )}
            >
              {artwork}
              {badge ? (
                <span className="absolute top-2 left-2 rounded-[5px] bg-black/75 px-1.5 py-px font-bold font-mono text-[0.6875rem] text-white">
                  {badge}
                </span>
              ) : null}
            </span>
            <span className="grid min-w-0 gap-1 px-0.5">
              <span className="line-clamp-2 font-semibold text-sm leading-snug tracking-[-0.005em] transition-colors group-hover/poster:text-foreground/80">
                {title}
              </span>
              {meta}
            </span>
          </>
        ),
      },
      props,
    ),
    state: { slot: "poster-card", shape },
  });
}

export { PosterCard };
