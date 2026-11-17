import {
  MotionFadeIn,
  MotionPage,
} from "@repo/design-system/components/motion";
import { Skeleton } from "@repo/design-system/components/ui/skeleton";
import { Suspense } from "react";
import { BGPattern } from "@/app/components/bg-pattern";
import { fetchCountries } from "../../../lib/services";
import { type DiscoverParams, isAdvancedSearch } from "./advanced-params";
import { FiltersForm } from "./components/filters-form";
import { MoviesGrid } from "./components/movies-grid";
import { MoviesSkeleton } from "./components/movies-skeleton";
import { PaginationWrapper } from "./components/pagination-wrapper";
import { SearchBar } from "./components/search-bar";
import { SearchResults } from "./components/search-results";

type PageProps = {
  searchParams: Promise<DiscoverParams>;
};

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const { clt, ctg, sort_by, sort_order, page, cntry } = params;
  // A keyword, person, tag or year switches the grid to advanced search.
  const advanced = isAdvancedSearch(params);
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
            <div className="squircle mb-6 rounded-(--radius-squircle-lg) bg-card/60 p-4 ring-1 ring-foreground/8 md:p-6">
              <SearchBar key={JSON.stringify(params)} />
            </div>
            <FiltersForm countries={countries} />
          </MotionFadeIn>

          {advanced ? (
            <Suspense
              fallback={<MoviesSkeleton />}
              key={JSON.stringify(params)}
            >
              <SearchResults params={params} />
            </Suspense>
          ) : (
            <>
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
            </>
          )}
        </div>
      </section>
    </MotionPage>
  );
}
