import {
  MediaRow,
  MediaRowItem,
} from "@repo/design-system/components/ecphim/media-row";
import { PosterCard } from "@repo/design-system/components/ecphim/poster-card";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(cleanup);

const posters = ["Mai", "Dune", "Lật Mặt 7"];

test("a titled row is a labelled section of poster links", () => {
  render(
    <MediaRow action={<a href="/discover">Xem tất cả</a>} title="Phim mới">
      {posters.map((name, i) => (
        <MediaRowItem key={name}>
          <PosterCard
            artwork={<img alt="" src="/p.webp" />}
            badge="FHD"
            href={`/movie/${i}`}
            title={name}
          />
        </MediaRowItem>
      ))}
    </MediaRow>,
  );
  const row = screen.getByRole("region", { name: "Phim mới" });
  const items = within(row).getAllByRole("listitem");
  expect(items).toHaveLength(3);
  expect(within(items[0]).getByRole("link").textContent).toContain("Mai");
  expect(within(items[0]).getByRole("link").getAttribute("href")).toBe(
    "/movie/0",
  );
  expect(within(row).getByRole("link", { name: "Xem tất cả" })).toBeTruthy();
});

test("the grid layout needs no heading", () => {
  render(
    <MediaRow layout="grid">
      <MediaRowItem>
        <PosterCard artwork={null} href="/movie/a" title="A" />
      </MediaRowItem>
    </MediaRow>,
  );
  expect(screen.queryByRole("heading")).toBeNull();
  expect(screen.getByRole("list").dataset.layout).toBe("grid");
});
