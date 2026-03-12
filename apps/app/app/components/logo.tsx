import { FilmReel } from "@phosphor-icons/react/ssr";
import { cn } from "@repo/design-system/lib/utils";
import type React from "react";

export function Logo({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <div className="flex-shrink-0 rounded-xl bg-gradient-to-r from-gray-800 to-neutral-800 p-2 transition-transform hover:scale-105">
        <FilmReel className="h-5 w-5 text-white" weight="bold" />
      </div>
      <span className="hidden font-900 text-lg text-white tracking-tight sm:inline">
        Ec<span className="text-primary">Phim</span>
      </span>
    </div>
  );
}
