import { describe, expect, it } from "vitest";
import {
  foldText,
  hasDetailFilters,
  matchesDetailFilters,
  splitTags,
} from "@/lib/services/advanced-search-match";
import type { IMovie } from "@/types/response";
import {
  discoverHref,
  isAdvancedSearch,
  toAdvancedFilters,
} from "../app/(public)/discover/advanced-params";

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

  it("switches Discover to advanced search only for search params", () => {
    expect(isAdvancedSearch({ clt: "phim-le", ctg: "hai", cntry: "my" })).toBe(
      false,
    );
    expect(isAdvancedSearch({ q: " " })).toBe(false);
    expect(isAdvancedSearch({ actor: "Robert", ctg: "hai" })).toBe(true);
  });

  it("maps Discover params to search filters", () => {
    expect(
      toAdvancedFilters({
        q: " avengers ",
        ctg: "hanh-dong,hai",
        year: "2019",
      }),
    ).toEqual({
      q: "avengers",
      ctg: "hanh-dong",
      cntry: undefined,
      year: 2019,
      director: undefined,
      actor: undefined,
      tag: undefined,
    });
  });

  it("builds Discover URLs without empty values or page 1", () => {
    expect(
      discoverHref({ q: "avengers", actor: "", ctg: "hai", page: "1" }),
    ).toBe("/discover?q=avengers&ctg=hai");
    expect(discoverHref({ director: "Nolan", page: "2" })).toBe(
      "/discover?director=Nolan&page=2",
    );
    expect(discoverHref({})).toBe("/discover");
  });
});
