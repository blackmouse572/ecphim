import { Skeleton } from "@repo/design-system/components/ui/skeleton";

export function MoviesSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: 24 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[2/3] w-full rounded-xl" />
      ))}
    </div>
  );
}
