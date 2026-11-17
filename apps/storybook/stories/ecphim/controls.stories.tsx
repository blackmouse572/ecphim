import {
  MagnifyingGlassIcon,
  PlayIcon,
  PlusIcon,
} from "@phosphor-icons/react/ssr";
import { Badge } from "@repo/design-system/components/base/badge";
import { Button } from "@repo/design-system/components/base/button";
import { Input } from "@repo/design-system/components/base/input";
import { Kbd } from "@repo/design-system/components/base/kbd";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * The EcPhim look for controls: squircle corners everywhere, and
 * skeuomorphic depth only on things you press or type into.
 */
const meta = {
  title: "ecphim/Controls",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Buttons: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="xl">
          <PlayIcon data-icon="inline-start" weight="fill" />
          Xem ngay
        </Button>
        <Button size="xl" variant="secondary">
          <PlusIcon data-icon="inline-start" weight="bold" />
          Danh sách
        </Button>
        <Button size="xl" variant="outline">
          Chi tiết
        </Button>
        <Button size="xl" variant="ghost">
          Bỏ qua
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button>Mặc định</Button>
        <Button variant="secondary">Phụ</Button>
        <Button size="sm">Nhỏ</Button>
        <Button aria-label="Phát" size="icon-xl" variant="secondary">
          <PlayIcon weight="fill" />
        </Button>
        <Button disabled>Đã tắt</Button>
      </div>
    </div>
  ),
};

export const Fields: Story = {
  render: () => (
    <div className="grid w-80 gap-4">
      <div className="relative">
        <MagnifyingGlassIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
        <Input className="h-10 pr-12 pl-9" placeholder="Tìm phim, diễn viên…" />
        <Kbd className="-translate-y-1/2 absolute top-1/2 right-2.5">⌘K</Kbd>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge>Mới</Badge>
        <Badge variant="secondary">Phim bộ</Badge>
        <Badge variant="outline">FHD</Badge>
      </div>
    </div>
  ),
};
