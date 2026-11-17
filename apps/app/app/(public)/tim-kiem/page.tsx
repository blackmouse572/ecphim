import { redirect } from "next/navigation";
import { type DiscoverParams, discoverHref } from "../discover/advanced-params";

type PageProps = {
  searchParams: Promise<DiscoverParams>;
};

/** Advanced search lives on Discover now. Keep old /tim-kiem links working. */
export default async function TimKiemPage({ searchParams }: PageProps) {
  redirect(discoverHref(await searchParams));
}
