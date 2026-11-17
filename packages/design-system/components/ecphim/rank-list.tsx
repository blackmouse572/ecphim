import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@repo/design-system/lib/utils";
import type * as React from "react";
import { useId } from "react";

/**
 * The "Top 5 hôm nay" panel beside the Ranked hero. It is a flat surface, so it
 * has no skeuomorphic depth (that is kept for pressable controls).
 */
function RankList({
  className,
  title,
  children,
  ...props
}: React.ComponentProps<"nav"> & { title: React.ReactNode }) {
  const headingId = useId();
  return (
    <nav
      aria-labelledby={headingId}
      className={cn(
        "squircle surface grid min-w-0 content-start gap-1 rounded-(--radius-squircle-lg) bg-card p-2.5",
        className,
      )}
      data-slot="rank-list"
      {...props}
    >
      <h2
        className="px-2.5 pt-2 pb-1.5 font-semibold text-muted-foreground text-xs uppercase tracking-[0.08em]"
        id={headingId}
      >
        {title}
      </h2>
      <ol className="grid gap-1">{children}</ol>
    </nav>
  );
}

type RankItemProps = useRender.ComponentProps<"a"> & {
  rank: number;
  thumbnail?: React.ReactNode;
  title: React.ReactNode;
  meta?: React.ReactNode;
  active?: boolean;
};

/**
 * One row in a RankList. It renders an `<a>` by default. Pass `render` for
 * `next/link`, or for a `<button>` when the row only swaps the lead tile.
 */
function RankItem({
  className,
  rank,
  thumbnail,
  title,
  meta,
  active = false,
  render,
  ...props
}: RankItemProps) {
  const row = useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">(
      {
        "aria-current": active ? "true" : undefined,
        className: cn(
          "squircle group/rank grid w-full grid-cols-[2.125rem_3rem_minmax(0,1fr)] items-center gap-3 rounded-(--radius-squircle-md) px-2.5 py-2 text-left outline-none transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98] aria-[current=true]:bg-foreground/7 aria-[current=true]:ring-1 aria-[current=true]:ring-foreground/8",
          className,
        ),
        children: (
          <>
            <span className="text-center font-bold font-mono text-2xl text-muted-foreground/70 tabular-nums leading-none group-aria-[current=true]/rank:text-foreground">
              {rank}
            </span>
            <span className="squircle surface relative block aspect-2/3 w-12 overflow-hidden rounded-[10px] bg-muted [&_img]:size-full [&_img]:object-cover">
              {thumbnail}
            </span>
            <span className="grid min-w-0 gap-0.5">
              <span className="truncate font-semibold text-sm">{title}</span>
              {meta}
            </span>
          </>
        ),
      },
      props,
    ),
    state: { slot: "rank-item", active },
  });
  return <li className="list-none">{row}</li>;
}

export { RankItem, RankList };
