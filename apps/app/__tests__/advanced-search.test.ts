import { describe, expect, it } from "vitest";
import {
  foldText,
  hasDetailFilters,
  matchesDetailFilters,
  splitTags,
} from "@/lib/services/advanced-search-match";
import type { IMovie } from "@/types/response";
import {
  parseSearchParams,
  searchHref,
} from "../app/(public)/tim-kiem/search-params";

const movie = {
  name: "Màu Xanh Cuối Cùng",
  slug: "mau-xanh-cuoi-cung",
  year: 2025,
  director: ["Gabriel Mascaro"],
  actor: ["Denise Weinberg", "Rodrigo Santoro", "Miriam Socarrás"],
  keywords: ["phim khoa học viễn tưởng", "phim HD"],
  category: [{ _id: "15", name: "Chính Kịch", slug: "chinh-kich" }],
  country: [{ _id: "30", name: "Brazil", slug: "brazil" }],
} as unknown as IMovie;

describe("foldText", () => {
  it("drops case, diacritics and extra spaces", () => {
    expect(foldText("  Khoa  Học Viễn Tưởng ")).toBe("khoa hoc vien tuong");
    expect(foldText("Đạo Diễn")).toBe("dao dien");
  });
});

describe("matchesDetailFilters", () => {
  it("matches partial director and actor names without diacritics", () => {
    expect(matchesDetailFilters(movie, { director: "mascaro" })).toBe(true);
    expect(matchesDetailFilters(movie, { actor: "miriam socarras" })).toBe(
      true,
    );
    expect(matchesDetailFilters(movie, { actor: "Tom Cruise" })).toBe(false);
  });

  it("needs every tag, and counts genres as tags", () => {
    expect(
      matchesDetailFilters(movie, { tag: "khoa hoc vien tuong, chính kịch" }),
    ).toBe(true);
    expect(matchesDetailFilters(movie, { tag: "khoa học, kinh dị" })).toBe(
      false,
    );
  });

  it("checks country and year only when asked", () => {
    expect(matchesDetailFilters(movie, { cntry: "my" })).toBe(true);
    expect(
      matchesDetailFilters(movie, { cntry: "my" }, { country: true }),
    ).toBe(false);
    expect(
      matchesDetailFilters(movie, { cntry: "brazil" }, { country: true }),
    ).toBe(true);
    expect(matchesDetailFilters(movie, { year: 2020 }, { year: true })).toBe(
      false,
    );
  });
});

describe("filter helpers", () => {
  it("knows which filters need movie details", () => {
    expect(hasDetailFilters({ q: "avengers", ctg: "hanh-dong" })).toBe(false);
    expect(hasDetailFilters({ tag: " , " })).toBe(false);
    expect(hasDetailFilters({ actor: "Santoro" })).toBe(true);
    expect(splitTags("a, b ,,c")).toEqual(["a", "b", "c"]);
  });

  it("round-trips the URL", () => {
    const href = searchHref({ q: "avengers", actor: "Robert", year: 2019 }, 2);
    expect(href).toBe("/tim-kiem?q=avengers&actor=Robert&year=2019&page=2");
    const params = Object.fromEntries(
      new URLSearchParams(href.split("?")[1]).entries(),
    );
    expect(parseSearchParams(params)).toEqual({
      filters: {
        q: "avengers",
        actor: "Robert",
        year: 2019,
        ctg: undefined,
        cntry: undefined,
        director: undefined,
        tag: undefined,
      },
      page: 2,
    });
  });
});
