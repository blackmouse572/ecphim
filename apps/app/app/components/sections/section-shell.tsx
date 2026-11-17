import { cn } from "@repo/design-system/lib/utils";
import type * as React from "react";

/** The page width and vertical rhythm shared by every home page section. */
export function SectionShell({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "container mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-7",
        className,
      )}
      {...props}
    />
  );
}
