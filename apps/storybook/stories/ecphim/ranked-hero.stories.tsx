"use client";

import { PlayIcon, PlusIcon } from "@phosphor-icons/react/ssr";
import { Badge } from "@repo/design-system/components/base/badge";
import { Button } from "@repo/design-system/components/base/button";
import {
  MediaMeta,
  MediaTile,
  MediaTileDescription,
  MediaTileTitle,
} from "@repo/design-system/components/ecphim/media-tile";
import {
  RankItem,
  RankList,
} from "@repo/design-system/components/ecphim/rank-list";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

/**
 * The home hero Jaden picked in phase 2 ("Ranked"): a lead tile plus a pickable
 * Top 5 list. All five films are links in the HTML, with no carousel.
 * Artwork here is generated gradients. In the app it is `next/image`.
 */
const meta = {
  title: "ecphim/Ranked hero",
  parameters: { layout: "fullscreen", themes: { themeOverride: "dark" } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const FILMS = [
  {
    slug: "lat-mat-7",
    name: "Lật Mặt 7: Một Điều Ước",
    year: 2024,
    imdb: 7.6,
    quality: "FHD",
    facts: ["138 phút", "Việt Nam"],
    ep: "Full",
    cats: ["Tâm lý", "Gia đình"],
    hue: 60,
    syn: "Bà Hai một mình nuôi năm người con khôn lớn. Khi bà gặp tai nạn, những đứa con giờ đã có cuộc sống riêng phải quyết định ai sẽ chăm sóc mẹ.",
  },
  {
    slug: "dune-2",
    name: "Dune: Hành Tinh Cát – Phần Hai",
    year: 2024,
    imdb: 8.5,
    quality: "4K",
    facts: ["166 phút", "Mỹ"],
    ep: "Full",
    cats: ["Viễn tưởng", "Phiêu lưu"],
    hue: 75,
    syn: "Paul Atreides hợp sức cùng Chani và người Fremen trên con đường trả thù những kẻ đã huỷ diệt gia tộc mình.",
  },
  {
    slug: "squid-game-2",
    name: "Trò Chơi Con Mực (Phần 2)",
    year: 2024,
    imdb: 7.7,
    quality: "FHD",
    facts: ["7 tập", "Hàn Quốc"],
    ep: "Hoàn tất (7/7)",
    cats: ["Hành động", "Chính kịch"],
    hue: 0,
    syn: "Ba năm sau khi chiến thắng, Gi-hun quay lại trò chơi với một mục tiêu duy nhất: lật đổ những kẻ đứng sau nó từ bên trong.",
  },
  {
    slug: "mai",
    name: "Mai",
    year: 2024,
    imdb: 6.9,
    quality: "FHD",
    facts: ["131 phút", "Việt Nam"],
    ep: "Full",
    cats: ["Tình cảm", "Tâm lý"],
    hue: 15,
    syn: "Mai, một nhân viên massage ngoài ba mươi, gặp Dương, chàng nhạc công trẻ đầy bốc đồng.",
  },
  {
    slug: "nha-ba-nu",
    name: "Nhà Bà Nữ",
    year: 2023,
    imdb: 6.6,
    quality: "HD",
    facts: ["102 phút", "Việt Nam"],
    ep: "Full",
    cats: ["Gia đình", "Hài"],
    hue: 140,
    syn: "Gia đình ba thế hệ cùng sống trên một quán bánh canh cua. Bà Nữ cứng rắn kiểm soát mọi thứ.",
  },
];

const Artwork = ({ hue }: { hue: number }) => (
  <div
    className="size-full"
    style={{
      background: `radial-gradient(120% 90% at 70% 30%, oklch(0.72 0.14 ${hue}) 0%, transparent 55%), radial-gradient(90% 80% at 15% 85%, oklch(0.45 0.12 ${hue - 30}) 0%, transparent 60%), linear-gradient(160deg, oklch(0.22 0.04 ${hue}), oklch(0.08 0.01 285))`,
    }}
  />
);

function RankedHero() {
  const [active, setActive] = useState(0);
  const film = FILMS[active];
  return (
    <section
      aria-labelledby="hero-heading"
      className="dark mx-auto max-w-7xl bg-background px-6 py-8 text-foreground"
    >
      <div className="mb-3.5 flex items-baseline justify-between">
        <h2
          className="font-semibold text-muted-foreground text-xs uppercase tracking-[0.08em]"
          id="hero-heading"
        >
          Nổi bật tuần này
        </h2>
        <span className="font-mono text-muted-foreground text-xs">
          Cập nhật 17/11
        </span>
      </div>
      <div className="grid gap-3.5 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
        <MediaTile
          artwork={<Artwork hue={film.hue} />}
          href={`#${film.slug}`}
          rank={active + 1}
          size="lead"
        >
          <div className="flex flex-wrap gap-2">
            {film.cats.map((c) => (
              <Badge
                key={c}
                variant="outline"
                className="border-white/15 bg-white/10 text-white backdrop-blur-sm"
              >
                {c}
              </Badge>
            ))}
          </div>
          <MediaTileTitle as="h1">{film.name}</MediaTileTitle>
          <MediaMeta
            items={film.facts}
            quality={film.quality}
            rating={film.imdb}
            year={film.year}
          />
          <MediaTileDescription>{film.syn}</MediaTileDescription>
          <div className="mt-2 flex flex-wrap gap-2.5">
            <Button render={<span />} nativeButton={false} size="xl">
              <PlayIcon data-icon="inline-start" weight="fill" />
              Xem ngay
            </Button>
            <Button
              render={<span />}
              nativeButton={false}
              size="xl"
              variant="overlay"
            >
              <PlusIcon data-icon="inline-start" weight="bold" />
              Danh sách
            </Button>
          </div>
        </MediaTile>
        <RankList title="Top 5 hôm nay">
          {FILMS.map((f, i) => (
            <RankItem
              active={i === active}
              key={f.slug}
              meta={
                <MediaMeta
                  className="text-muted-foreground"
                  items={[f.ep]}
                  rating={f.imdb}
                  year={f.year}
                />
              }
              onClick={(e) => {
                e.preventDefault();
                setActive(i);
              }}
              href={`#${f.slug}`}
              rank={i + 1}
              thumbnail={<Artwork hue={f.hue} />}
              title={f.name}
            />
          ))}
        </RankList>
      </div>
    </section>
  );
}

export const Ranked: Story = { render: () => <RankedHero /> };
