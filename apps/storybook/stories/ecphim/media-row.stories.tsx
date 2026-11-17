import { PlayIcon } from "@phosphor-icons/react/ssr";
import { Button } from "@repo/design-system/components/base/button";
import {
  MediaRow,
  MediaRowItem,
  mediaRowActionClassName,
} from "@repo/design-system/components/ecphim/media-row";
import {
  MediaMeta,
  MediaTile,
  MediaTileDescription,
  MediaTileTitle,
} from "@repo/design-system/components/ecphim/media-tile";
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

const SERIES = [
  ["Trò Chơi Con Mực (Phần 2)", "Tập 7", "Hàn Quốc"],
  ["Thanh Gươm Diệt Quỷ", "Tập 12", "Nhật Bản"],
  ["Hoa Thiên Cốt", "Tập 34", "Trung Quốc"],
  ["Gia Đình Là Số 1", "Tập 88", "Việt Nam"],
  ["The Last of Us", "Tập 3", "Âu Mỹ"],
  ["Chúa Tể Của Những Chiếc Nhẫn", "Tập 5", "Âu Mỹ"],
].map(([name, ep, country], i) => ({
  name,
  ep,
  country,
  hue: (i * 61 + 20) % 360,
}));

function Stills() {
  return SERIES.map((show) => (
    <MediaRowItem key={show.name} size="wide">
      <PosterCard
        artwork={<Art hue={show.hue} />}
        badge={show.ep}
        href="#"
        meta={
          <MediaMeta
            className="text-muted-foreground"
            items={[show.country, "Vietsub"]}
            year={2024}
          />
        }
        shape="still"
        title={show.name}
      />
    </MediaRowItem>
  ));
}

/** Wide 16:9 stills for "Tập mới hôm nay": the episode is the news. */
export const StillsRow: Story = {
  render: () => (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6">
      <MediaRow title="Tập mới hôm nay">
        <Stills />
      </MediaRow>
    </div>
  ),
};

const COUNTRIES = [
  ["Hàn Quốc", 1240],
  ["Trung Quốc", 2315],
  ["Âu Mỹ", 3870],
  ["Nhật Bản", 960],
  ["Thái Lan", 412],
  ["Việt Nam", 538],
] as const;

/**
 * The home page below the hero, as the app lays it out: varied shapes
 * (stills, posters, tiles, one spotlight) so it doesn't read as one long grid.
 */
export const HomeShelves: Story = {
  render: () => (
    <div className="pb-10">
      <div className="container mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-7">
        <MediaRow
          action={
            <a className={mediaRowActionClassName} href="#">
              Xem tất cả
            </a>
          }
          title="Tập mới hôm nay"
        >
          <Stills />
        </MediaRow>
      </div>
      <div className="container mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-7">
        <MediaRow
          action={
            <a className={mediaRowActionClassName} href="#">
              Xem tất cả
            </a>
          }
          title="Phim chiếu rạp"
        >
          <Posters />
        </MediaRow>
      </div>
      <div className="container mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-7">
        <MediaRow title="Xem theo quốc gia">
          {COUNTRIES.map(([name, total], i) => (
            <MediaRowItem key={name} size="wide">
              <MediaTile
                artwork={<Art hue={(i * 53 + 200) % 360} />}
                className="aspect-video min-h-0"
                href="#"
              >
                <MediaTileTitle className="text-xl">{name}</MediaTileTitle>
                <p className="font-mono text-white/70 text-xs tabular-nums">
                  {new Intl.NumberFormat("vi-VN").format(total)} phim
                </p>
              </MediaTile>
            </MediaRowItem>
          ))}
        </MediaRow>
      </div>
      <div className="container mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-7">
        <section aria-label="Gợi ý cho bạn">
          <MediaTile
            artwork={<Art hue={25} />}
            className="min-h-[22rem] md:min-h-[26rem]"
            href="#"
            size="lead"
          >
            <p className="font-semibold text-primary text-xs uppercase tracking-[0.12em]">
              Gợi ý cho bạn
            </p>
            <MediaTileTitle as="h2">Lật Mặt 7: Một Điều Ước</MediaTileTitle>
            <MediaMeta
              items={["Full", "Việt Nam"]}
              quality="FHD"
              rating={7.4}
              year={2024}
            />
            <MediaTileDescription className="max-w-[46ch]">
              Bà Hai sống một mình ở quê sau khi năm người con lần lượt rời đi.
              Một tai nạn bất ngờ buộc cả nhà phải quay về và đối diện nhau.
            </MediaTileDescription>
            <div className="mt-2">
              <Button nativeButton={false} render={<span />} size="lg">
                <PlayIcon data-icon="inline-start" weight="fill" />
                Xem ngay
              </Button>
            </div>
          </MediaTile>
        </section>
      </div>
    </div>
  ),
};
