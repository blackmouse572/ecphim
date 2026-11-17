import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import {
  type RankedFilm,
  RankedHeroView,
} from "../app/components/sections/ranked-hero-view";

const film = (i: number): RankedFilm => ({
  slug: `phim-${i}`,
  name: `Phim số ${i}`,
  originName: `Movie ${i}`,
  year: 2024,
  rating: 7 + i / 10,
  quality: "FHD",
  episode: "Full",
  facts: ["120 phút", "Việt Nam"],
  categories: [{ name: "Hành động", slug: "hanh-dong" }],
  synopsis: `Nội dung phim ${i}`,
  backdrop: "/images/placeholder-thumbnail.webp",
  poster: "/images/placeholder-poster.webp",
});

const films = [1, 2, 3, 4, 5].map(film);

afterEach(cleanup);

test("every Top 5 pick is a crawlable link to its movie page", () => {
  render(<RankedHeroView films={films} />);
  const list = screen.getByRole("navigation", { name: /top 5/i });
  const links = within(list).getAllByRole("link");
  expect(links.map((a) => a.getAttribute("href"))).toEqual(
    films.map((f) => `/movie/${f.slug}`),
  );
});

test("hovering or focusing a row swaps the lead tile", () => {
  render(<RankedHeroView films={films} />);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
    "Phim số 1",
  );

  const rows = within(
    screen.getByRole("navigation", { name: /top 5/i }),
  ).getAllByRole("link");
  fireEvent.mouseEnter(rows[2]);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
    "Phim số 3",
  );
  expect(rows[2].getAttribute("aria-current")).toBe("true");

  fireEvent.focus(rows[4]);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
    "Phim số 5",
  );
});
