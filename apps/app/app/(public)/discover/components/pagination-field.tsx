"use client";

import {
  CaretLeftIcon,
  CaretLineLeftIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  Pagination,
  PaginationFirst,
  PaginationLabel,
  PaginationLast,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
  PaginationSection,
} from "@repo/design-system/components/ui/pagination";
import { buttonStyles } from "@repo/design-system/components/variants/buttonVariants";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  pagination: {
    totalItems: number;
    totalItemsPerPage: number;
    currentPage: number;
    pageRanges: number;
  };
};

export function PaginationField(props: Props) {
  const { pagination } = props;
  const { totalItems, totalItemsPerPage, currentPage } = pagination;
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const totalPages = Math.ceil(totalItems / totalItemsPerPage);

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const firstPageUrl = createPageUrl(1);
  const lastPageUrl = createPageUrl(totalPages);
  const prevPageUrl = currentPage > 1 ? createPageUrl(currentPage - 1) : "#";
  const nextPageUrl =
    currentPage < totalPages ? createPageUrl(currentPage + 1) : "#";

  return (
    <Pagination>
      <PaginationList>
        <PaginationFirst
          render={() => (
            <Link
              href={firstPageUrl}
              className={buttonStyles({ intent: "outline", size: "sq-sm" })}
            >
              <CaretLineLeftIcon />
            </Link>
          )}
        />
        <PaginationPrevious
          render={() => (
            <Link
              href={prevPageUrl}
              className={buttonStyles({ intent: "outline", size: "sq-sm" })}
            >
              <CaretLeftIcon />
            </Link>
          )}
        />
        <PaginationSection className="rounded-(--section-radius) border px-3 *:min-w-4">
          <PaginationLabel>{currentPage}</PaginationLabel>
          <PaginationLabel className="text-muted-fg">/</PaginationLabel>
          <PaginationLabel>{totalPages}</PaginationLabel>
        </PaginationSection>
        <PaginationNext
          render={() => (
            <Link
              href={nextPageUrl}
              className={buttonStyles({ intent: "outline", size: "sq-sm" })}
            >
              <CaretLeftIcon className="rotate-180" />
            </Link>
          )}
        />
        <PaginationLast
          render={() => (
            <Link
              href={lastPageUrl}
              className={buttonStyles({ intent: "outline", size: "sq-sm" })}
            >
              <CaretLineLeftIcon className="rotate-180" />
            </Link>
          )}
        />
      </PaginationList>
    </Pagination>
  );
}
