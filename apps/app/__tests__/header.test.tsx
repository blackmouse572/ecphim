import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/",
}));
vi.mock("@tanstack/react-hotkeys", () => ({ useHotkey: vi.fn() }));
vi.mock("../app/actions/search-movies", () => ({ searchMovies: vi.fn() }));

const { Header, navLinks } = await import("../app/components/app-nav/app-nav");

afterEach(cleanup);

test("the header links home and to every browse section", () => {
  render(<Header countries={[{ name: "Việt Nam", slug: "viet-nam" }]} />);
  const banner = screen.getByRole("banner");
  expect(
    within(banner).getByRole("link", { name: "EcPhim, trang chủ" }),
  ).toBeTruthy();
  for (const link of navLinks) {
    expect(
      within(banner)
        .getAllByRole("link", { name: link.label })
        .some((a) => a.getAttribute("href") === link.href),
    ).toBe(true);
  }
});

test("the material appears only after the page scrolls", () => {
  render(<Header />);
  const banner = screen.getByRole("banner");
  expect(banner.dataset.scrolled).toBe("false");
  Object.defineProperty(window, "scrollY", { value: 40, configurable: true });
  fireEvent.scroll(window);
  expect(banner.dataset.scrolled).toBe("true");
});

test("search has a name on phones, where it is only an icon", () => {
  render(<Header />);
  expect(screen.getByRole("button", { name: "Tìm kiếm phim" })).toBeTruthy();
});

test("the phone menu opens a sheet of links that closes on choice", async () => {
  render(<Header countries={[{ name: "Việt Nam", slug: "viet-nam" }]} />);
  fireEvent.click(screen.getByRole("button", { name: "Mở menu" }));
  const sheet = await screen.findByRole("dialog");
  const browse = within(sheet).getByRole("navigation", { name: "Duyệt phim" });
  const phimLe = within(browse).getByRole("link", { name: "Phim lẻ" });
  expect(phimLe.getAttribute("href")).toBe("/discover?clt=phim-le");
  fireEvent.click(phimLe);
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
});
