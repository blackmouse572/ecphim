import Link from "next/link";
import type * as React from "react";
import type { IMovie } from "@/types/response";

const linkClassName =
  "rounded-sm underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50";

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 py-2.5 first:pt-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-foreground/90">{children}</dd>
    </div>
  );
}

function joinLinks(items: { name: string; href: string }[]) {
  return items.map((item, index) => (
    <span key={item.href}>
      {index > 0 ? ", " : null}
      <Link className={linkClassName} href={item.href}>
        {item.name}
      </Link>
    </span>
  ));
}

/** Clean up VSMov's people lists, which use "" or "Đang cập nhật" for none. */
function people(list?: string[]) {
  return (list ?? [])
    .map((name) => name.trim())
    .filter((name) => name && !/^đang cập nhật$/i.test(name));
}

/**
 * The film's details as a definition list: status, episodes, runtime,
 * country, genres and people. Rows with no data are left out.
 */
export function MovieFacts({ movie }: { movie: IMovie }) {
  const directors = people(movie.director);
  const actors = people(movie.actor);
  const episodes =
    movie.episode_total && movie.episode_total !== "1"
      ? `${movie.episode_total} tập`
      : undefined;

  return (
    <section aria-labelledby="movie-facts" className="grid gap-4">
      <h2
        className="font-semibold text-lg tracking-[-0.015em]"
        id="movie-facts"
      >
        Thông tin
      </h2>
      <dl className="squircle surface grid divide-y divide-border rounded-(--radius-squircle-lg) bg-card p-5 text-sm">
        {movie.episode_current ? (
          <Fact label="Trạng thái">{movie.episode_current}</Fact>
        ) : null}
        {episodes ? <Fact label="Số tập">{episodes}</Fact> : null}
        {movie.time ? <Fact label="Thời lượng">{movie.time}</Fact> : null}
        {movie.year ? <Fact label="Năm">{movie.year}</Fact> : null}
        {movie.quality || movie.lang ? (
          <Fact label="Chất lượng">
            {[movie.quality, movie.lang].filter(Boolean).join(" · ")}
          </Fact>
        ) : null}
        {movie.country.length > 0 ? (
          <Fact label="Quốc gia">
            {joinLinks(
              movie.country.map((c) => ({
                name: c.name,
                href: `/discover?cntry=${c.slug}`,
              })),
            )}
          </Fact>
        ) : null}
        {movie.category.length > 0 ? (
          <Fact label="Thể loại">
            {joinLinks(
              movie.category.map((c) => ({
                name: c.name,
                href: `/discover?ctg=${c.slug}`,
              })),
            )}
          </Fact>
        ) : null}
        {directors.length > 0 ? (
          <Fact label="Đạo diễn">{directors.join(", ")}</Fact>
        ) : null}
        {actors.length > 0 ? (
          <Fact label="Diễn viên">
            {actors.slice(0, 8).join(", ")}
            {actors.length > 8 ? (
              <span className="text-muted-foreground">
                {" "}
                và {actors.length - 8} người khác
              </span>
            ) : null}
          </Fact>
        ) : null}
      </dl>
    </section>
  );
}
