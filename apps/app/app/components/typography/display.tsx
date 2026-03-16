import { cn } from "@repo/design-system/lib/utils";

export function Display({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "font-100 text-display text-white leading-tight tracking-tight",
        className,
      )}
      {...props}
    />
  );
}
