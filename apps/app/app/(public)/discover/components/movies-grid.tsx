import { EmptyIcon } from "@phosphor-icons/react/ssr";
import { MotionItem, MotionList } from "@repo/design-system/components/motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Container } from "@repo/design-system/components/ui/container";
import { buttonStyles } from "@repo/design-system/components/variants/buttonVariants";
import Link from "next/link";
import { fetchMovieList } from "../../../../lib/services/movie";
import { MovieCard } from "../../../components/sections";

type Props = {
  clt?: string;
  ctg?: string;
  sort_by?: string;
  sort_order?: string;
  page?: number;
  cntry?: string;
};

export async function MoviesGrid({
  clt,
  ctg,
  sort_by,
  sort_order,
  page,
  cntry,
}: Props) {
  const { items, APP_DOMAIN_CDN_IMAGE } = await fetchMovieList({
    slug: clt || ("phim-moi" as any),
    category: ctg,
    sort_field: sort_by as any,
    sort_type: sort_order as any,
    country: cntry,
    limit: 6 * 4,
    page: page || 1,
  });

  const emptyState = () => (
    <Container className="flex h-[40vh] w-full items-center justify-center">
      <Card className="rounded-2xl shadow-accent shadow-sm">
        <CardHeader className="text-center">
          <CardTitle>
            <EmptyIcon
              weight="duotone"
              size={128}
              className="mx-auto mb-4 text-muted-foreground"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <h1>Không tìm thấy phim nào phù hợp với tiêu chí của bạn.</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Vui lòng thử lại với các tiêu chí khác hoặc kiểm tra lại kết nối
            mạng của bạn.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href="/discover"
            className={buttonStyles({ intent: "primary" })}
          >
            Khám phá phim khác
          </Link>
        </CardFooter>
      </Card>
    </Container>
  );

  if (items.length === 0) {
    return emptyState();
  }

  return (
    <MotionList className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
      {items.map((movie, index) => (
        <MotionItem key={movie._id} delay={index * 0.02}>
          <MovieCard movie={movie} cdnUrl={APP_DOMAIN_CDN_IMAGE} />
        </MotionItem>
      ))}
    </MotionList>
  );
}
