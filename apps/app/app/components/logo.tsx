import { FilmReelIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@repo/design-system/lib/utils";
import type React from "react";

export function Logo({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} {...props}>
      <FilmReelIcon aria-hidden className="size-6 text-primary" weight="fill" />
      <span className="font-bold text-[1.0625rem] tracking-[-0.02em]">
        Ec<span className="text-primary">Phim</span>
      </span>
    </div>
  );
}
