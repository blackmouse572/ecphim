import { fetchMovieList } from "../../../../lib/services/movie";
import { PaginationField } from "./pagination-field";

type Props = {
  clt?: string;
  ctg?: string;
  sort_by?: string;
  sort_order?: string;
  page?: number;
  cntry?: string;
};

export async function PaginationWrapper({
  clt,
  ctg,
  sort_by,
  sort_order,
  page,
  cntry,
}: Props) {
  const { params } = await fetchMovieList({
    slug: clt || ("phim-moi" as any),
    category: ctg,
    sort_field: sort_by as any,
    sort_type: sort_order as any,
    country: cntry,
    limit: 6 * 4,
    page: page || 1,
  });
  if (params.pagination.totalItems === 0) return null;
  return <PaginationField pagination={params.pagination} />;
}
