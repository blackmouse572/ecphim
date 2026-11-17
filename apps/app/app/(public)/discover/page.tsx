import { MotionPage } from "@repo/design-system/components/motion";
import { Skeleton } from "@repo/design-system/components/ui/skeleton";
import type { Metadata } from "next";
import { Suspense } from "react";
import { CATEGORIES } from "@/app/components/app-nav/data";
import { fetchCountries } from "../../../lib/services";
import { type DiscoverParams, isAdvancedSearch } from "./advanced-params";
import { DiscoverFilters } from "./components/discover-filters";
import { MoviesGrid } from "./components/movies-grid";
import { MoviesSkeleton } from "./components/movies-skeleton";
import { PaginationWrapper } from "./components/pagination-wrapper";
import { SearchResults } from "./components/search-results";

type PageProps = {
  searchParams: Promise<DiscoverParams>;
};

export const metadata: Metadata = {
  title: "Khám phá phim",
  description:
    "Tìm và lọc phim theo tên, thể loại, quốc gia, năm, đạo diễn, diễn viên và tag.",
};

export const dynamic = "force-dynamic";

const GENRES = CATEGORIES.map(({ name, slug }) => ({ name, slug }));

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const { clt, ctg, sort_by, sort_order, page, cntry } = params;
  // A keyword, person, tag or year switches the grid to advanced search.
  const advanced = isAdvancedSearch(params);
  const pageNum = page ? Number.parseInt(page, 10) : 1;
  const countries = await fetchCountries()
    .then((res) => res.items)
    .catch(() => []);

  return (
    <MotionPage className="min-h-screen">
      <section className="container mx-auto max-w-7xl space-y-8 px-4 py-10 md:px-6 md:py-14">
        <h1 className="font-semibold text-3xl tracking-[-0.02em] md:text-4xl">
          Khám phá
        </h1>

        {/* Keyed on the URL so the fields follow back/forward and chip removal. */}
        <DiscoverFilters
          countries={countries}
          genres={GENRES}
          key={`filters:${JSON.stringify(params)}`}
        />

        {advanced ? (
          <Suspense
            fallback={<MoviesSkeleton />}
            key={`results:${JSON.stringify(params)}`}
          >
            <SearchResults params={params} />
          </Suspense>
        ) : (
          <>
            <Suspense
              fallback={<MoviesSkeleton />}
              key={`${clt}-${ctg}-${sort_by}-${sort_order}-${pageNum}-${cntry}`}
            >
              <MoviesGrid
                clt={clt}
                cntry={cntry}
                ctg={ctg}
                page={pageNum}
                sort_by={sort_by}
                sort_order={sort_order}
              />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-10 w-48" />}>
              <PaginationWrapper
                clt={clt}
                cntry={cntry}
                ctg={ctg}
                page={pageNum}
                sort_by={sort_by}
                sort_order={sort_order}
              />
            </Suspense>
          </>
        )}
      </section>
    </MotionPage>
  );
}
