import {
  ArrowLeftIcon,
  ArrowRightIcon,
  InfoIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react/dist/ssr";
import { buttonVariants } from "@repo/design-system/components/base/button";
import {
  MediaRow,
  MediaRowItem,
} from "@repo/design-system/components/ecphim/media-row";
import Link from "next/link";
import { MovieCard } from "@/app/components/sections";
import {
  type AdvancedSearchFilters,
  advancedSearch,
} from "@/lib/services/advanced-search";
import { searchHref } from "../search-params";

type Props = {
  filters: AdvancedSearchFilters;
  page: number;
};

const numberFormat = new Intl.NumberFormat("vi-VN");

export async function SearchResults({ filters, page }: Props) {
  let result: Awaited<ReturnType<typeof advancedSearch>>;
  try {
    result = await advancedSearch(filters, page);
  } catch (error) {
    console.error("Advanced search failed:", error);
    return (
      <Notice
        title="Không tải được kết quả"
        body="Nguồn phim đang bận hoặc tạm thời không phản hồi. Bạn thử lại sau ít phút nhé."
      />
    );
  }

  const { items, mode, totalPages, sourceTotal, scannedUpTo, scansLatest } =
    result;
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const summary =
    mode === "direct"
      ? `${numberFormat.format(sourceTotal)} phim`
      : `${numberFormat.format(items.length)} phim khớp trong ${numberFormat.format(scannedUpTo)} / ${numberFormat.format(sourceTotal)} phim đã kiểm tra`;

  return (
    <section aria-live="polite" className="grid gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-semibold text-lg tracking-[-0.015em] md:text-xl">
          Kết quả
        </h2>
        <p className="text-muted-foreground text-sm tabular-nums">{summary}</p>
      </div>

      {mode === "scan" ? (
        <p className="flex items-start gap-2 text-muted-foreground text-sm">
          <InfoIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
          <span>
            {scansLatest
              ? "Không có tên phim hay thể loại nên đang lọc trong các phim mới cập nhật. "
              : ""}
            Đạo diễn, diễn viên và tag được lọc từng trang.
            {hasNext ? " Bấm “Trang sau” để kiểm tra thêm." : ""}
          </span>
        </p>
      ) : null}

      {items.length > 0 ? (
        <MediaRow layout="grid">
          {items.map((movie) => (
            <MediaRowItem key={movie._id}>
              <MovieCard movie={movie} />
            </MediaRowItem>
          ))}
        </MediaRow>
      ) : (
        <Notice
          title={
            mode === "scan" && hasNext
              ? "Chưa thấy phim khớp ở trang này"
              : "Không tìm thấy phim phù hợp"
          }
          body={
            mode === "scan" && hasNext
              ? "Thử trang sau, hoặc thêm tên phim hay thể loại để thu hẹp tìm kiếm."
              : "Thử bỏ bớt bộ lọc, hoặc kiểm tra lại chính tả tên người và tag."
          }
        />
      )}

      {hasPrev || hasNext ? (
        <nav
          aria-label="Phân trang kết quả"
          className="flex items-center justify-between gap-3"
        >
          {hasPrev ? (
            <Link
              className={buttonVariants({ variant: "secondary", size: "lg" })}
              href={searchHref(filters, page - 1)}
              scroll={false}
            >
              <ArrowLeftIcon aria-hidden />
              Trang trước
            </Link>
          ) : (
            <span />
          )}
          <span className="text-muted-foreground text-sm tabular-nums">
            {page} / {totalPages}
          </span>
          {hasNext ? (
            <Link
              className={buttonVariants({ variant: "secondary", size: "lg" })}
              href={searchHref(filters, page + 1)}
              scroll={false}
            >
              Trang sau
              <ArrowRightIcon aria-hidden />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </section>
  );
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="squircle grid justify-items-center gap-2 rounded-(--radius-squircle-lg) bg-card/40 px-6 py-14 text-center ring-1 ring-foreground/8">
      <MagnifyingGlassIcon
        aria-hidden
        className="mb-1 size-10 text-muted-foreground"
        weight="duotone"
      />
      <p className="font-semibold">{title}</p>
      <p className="max-w-sm text-muted-foreground text-sm">{body}</p>
    </div>
  );
}
