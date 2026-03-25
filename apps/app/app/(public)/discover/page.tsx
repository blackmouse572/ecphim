import {
  MotionFadeIn,
  MotionPage,
} from "@repo/design-system/components/motion";
import { Skeleton } from "@repo/design-system/components/ui/skeleton";
import { Suspense } from "react";
import { BGPattern } from "@/app/components/bg-pattern";
import { fetchCountries } from "../../../lib/services";
import { FiltersForm } from "./components/filters-form";
import { MoviesGrid } from "./components/movies-grid";
import { MoviesSkeleton } from "./components/movies-skeleton";
import { PaginationWrapper } from "./components/pagination-wrapper";

type PageProps = {
  searchParams: Promise<{
    clt?: string;
    ctg?: string;
    sort_by?: string;
    sort_order?: string;
    page?: string;
    cntry?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: PageProps) {
  const { clt, ctg, sort_by, sort_order, page, cntry } = await searchParams;
  const pageNum = page ? parseInt(page) : 1;
  const { items: countries } = await fetchCountries();
  return (
    <MotionPage className="min-h-screen bg-gradient-to-br from-bg via-zinc-950">
      {/* Filters & Grid */}
      <section className="py-16">
        <div className="container mx-auto max-w-7xl space-y-8 px-6">
          {/* Filter Controls */}
          <MotionFadeIn className="relative">
            <BGPattern
              variant="vertical-lines"
              mask="fade-edges"
              fill={"#8986ff"}
            />
            <FiltersForm countries={countries} />
          </MotionFadeIn>

          {/* Movies Grid - with streaming */}
          <Suspense
            key={`${clt}-${ctg}-${sort_by}-${sort_order}-${pageNum}-${cntry}`}
            fallback={<MoviesSkeleton />}
          >
            <MoviesGrid
              clt={clt}
              ctg={ctg}
              sort_by={sort_by}
              sort_order={sort_order}
              page={pageNum}
              cntry={cntry}
            />
          </Suspense>

          {/* Pagination */}
          <MotionFadeIn delay={0.8}>
            <Suspense fallback={<Skeleton className="h-10 w-48" />}>
              <PaginationWrapper
                clt={clt}
                ctg={ctg}
                sort_by={sort_by}
                sort_order={sort_order}
                page={pageNum}
                cntry={cntry}
              />
            </Suspense>
          </MotionFadeIn>
        </div>
      </section>
    </MotionPage>
  );
}
