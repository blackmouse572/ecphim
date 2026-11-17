import { Skeleton } from "@repo/design-system/components/base/skeleton";
import type { Metadata } from "next";
import { Suspense } from "react";
import { CATEGORIES } from "@/app/components/app-nav/data";
import { fetchCountries } from "@/lib/services";
import { AdvancedSearchForm } from "./components/advanced-search-form";
import { SearchResults } from "./components/search-results";
import {
  hasAnyFilter,
  parseSearchParams,
  type SearchPageParams,
} from "./search-params";

type PageProps = {
  searchParams: Promise<SearchPageParams>;
};

export const metadata: Metadata = {
  title: "Tìm kiếm nâng cao",
  description:
    "Tìm phim theo tên, đạo diễn, diễn viên, tag, thể loại, quốc gia và năm.",
};

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: PageProps) {
  const { filters, page } = parseSearchParams(await searchParams);
  const countries = await fetchCountries()
    .then((res) => res.items)
    .catch(() => []);
  const genres = CATEGORIES.map(({ name, slug }) => ({ name, slug }));

  return (
    <main className="container mx-auto max-w-7xl space-y-10 px-4 py-10 md:px-6 md:py-14">
      <header className="space-y-2">
        <h1 className="font-semibold text-3xl tracking-[-0.02em] md:text-4xl">
          Tìm kiếm nâng cao
        </h1>
        <p className="max-w-prose text-muted-foreground text-sm md:text-base">
          Tìm theo tên phim, đạo diễn, diễn viên hoặc tag. Thêm thể loại hay từ
          khoá để có kết quả nhanh và đầy đủ hơn.
        </p>
      </header>

      <AdvancedSearchForm
        countries={countries}
        filters={filters}
        genres={genres}
      />

      {hasAnyFilter(filters) ? (
        <Suspense
          fallback={<ResultsSkeleton />}
          key={JSON.stringify({ filters, page })}
        >
          <SearchResults filters={filters} page={page} />
        </Suspense>
      ) : null}
    </main>
  );
}

function ResultsSkeleton() {
  return (
    <div aria-busy="true" className="grid gap-4">
      <Skeleton className="h-5 w-64" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 md:gap-x-4 lg:grid-cols-6">
        {Array.from({ length: 12 }, (_, i) => (
          <Skeleton
            className="aspect-2/3 rounded-(--radius-squircle-md)"
            key={i}
          />
        ))}
      </div>
    </div>
  );
}
