import {
  MediaRow,
  MediaRowItem,
  mediaRowActionClassName,
} from "@repo/design-system/components/ecphim/media-row";
import { MediaMeta } from "@repo/design-system/components/ecphim/media-tile";
import { PosterCard } from "@repo/design-system/components/ecphim/poster-card";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * Home rows and browse grids. Posters are flat; the card shrinks slightly on
 * press. Rows scroll sideways with soft edge fades in place of arrows.
 * Artwork here is generated gradients. In the app it is `next/image`.
 */
const meta = {
  title: "ecphim/Media row",
  parameters: { layout: "fullscreen", themes: { themeOverride: "dark" } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const NAMES = [
  "Mai",
  "Dune: Hành Tinh Cát – Phần Hai",
  "Lật Mặt 7: Một Điều Ước",
  "Nhà Bà Nữ",
  "Trò Chơi Con Mực (Phần 2)",
  "Đào, Phở và Piano",
  "Gặp Lại Chị Bầu",
  "Kẻ Ăn Hồn",
  "Con Nhót Mót Chồng",
  "Thanh Gươm Diệt Quỷ",
];

const FILMS = NAMES.map((name, i) => ({
  name,
  hue: (i * 47) % 360,
  year: 2023 + (i % 2),
  rating: 6 + ((i * 7) % 30) / 10,
  ep: i % 3 === 0 ? "Hoàn tất (16/16)" : "Full",
  quality: i % 4 === 0 ? "4K" : "FHD",
}));

function Art({ hue }: { hue: number }) {
  return (
    <span
      className="block size-full"
      style={{
        background: `radial-gradient(90% 60% at 60% 30%, oklch(0.7 0.14 ${hue}) 0%, transparent 60%), linear-gradient(170deg, oklch(0.3 0.06 ${hue}), oklch(0.1 0.01 285))`,
      }}
    />
  );
}

function Posters() {
  return FILMS.map((film) => (
    <MediaRowItem key={film.name}>
      <PosterCard
        artwork={<Art hue={film.hue} />}
        badge={film.quality}
        href="#"
        meta={
          <MediaMeta
            className="text-muted-foreground"
            items={[film.ep]}
            rating={film.rating}
            year={film.year}
          />
        }
        title={film.name}
      />
    </MediaRowItem>
  ));
}

export const Row: Story = {
  render: () => (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6">
      <MediaRow
        action={
          <a className={mediaRowActionClassName} href="#">
            Xem tất cả
          </a>
        }
        title="Phim mới"
      >
        <Posters />
      </MediaRow>
    </div>
  ),
};

export const Grid: Story = {
  render: () => (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6">
      <MediaRow layout="grid">
        <Posters />
      </MediaRow>
    </div>
  ),
};
