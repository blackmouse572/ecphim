"use client";

import {
  CaretDownIcon,
  CircleNotchIcon,
  FilmSlateIcon,
  MagnifyingGlassIcon,
  SlidersHorizontalIcon,
  TagIcon,
  UserIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@repo/design-system/components/base/button";
import { Input } from "@repo/design-system/components/base/input";
import { Label } from "@repo/design-system/components/base/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/base/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@repo/design-system/components/base/toggle-group";
import { cn } from "@repo/design-system/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import {
  type FormEvent,
  type ReactNode,
  useId,
  useState,
  useTransition,
} from "react";
import type { ICountry } from "@/types/response";
import { type DiscoverParams, discoverHref } from "../advanced-params";

type Option = { value: string; label: string };

/** Collections VSMov serves (the others fall back to a genre of the same slug). */
/** Base UI toggle values can't be empty, so "all collections" has a name. */
const ALL = "all";
const COLLECTIONS: Option[] = [
  { value: ALL, label: "Tất cả" },
  { value: "phim-le", label: "Phim lẻ" },
  { value: "phim-bo", label: "Phim bộ" },
  { value: "hoat-hinh", label: "Hoạt hình" },
  { value: "tv-shows", label: "TV Show" },
  { value: "phim-chieu-rap", label: "Chiếu rạp" },
  { value: "subteam", label: "Subteam" },
];

/** Sort field and order in one menu, as "field:order". */
const SORTS: Option[] = [
  { value: "modified.time:desc", label: "Mới cập nhật" },
  { value: "_id:desc", label: "Mới thêm" },
  { value: "year:desc", label: "Năm mới nhất" },
  { value: "year:asc", label: "Năm cũ nhất" },
];
const DEFAULT_SORT = SORTS[0].value;

const FIRST_YEAR = 1970;

type TextKey = "q" | "director" | "actor" | "tag";
const TEXT_KEYS: TextKey[] = ["q", "director", "actor", "tag"];
const PEOPLE_KEYS: TextKey[] = ["director", "actor", "tag"];

type Props = {
  genres: { name: string; slug: string }[];
  countries: ICountry[];
};

/**
 * Search and filters for Discover in one place.
 *
 * - The title keyword comes first, as the common path.
 * - Menus and the collection switch apply at once. Text fields apply on
 *   Enter or "Tìm kiếm", so typing doesn't reload the grid on every key.
 * - Director, actor and tag sit one level deeper, under "Thêm bộ lọc".
 * - Every active filter shows as a chip that removes it in one tap.
 */
export function DiscoverFilters({ genres, countries }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const current: DiscoverParams = Object.fromEntries(searchParams.entries());
  const [text, setText] = useState<Record<TextKey, string>>(() => {
    const initial = {} as Record<TextKey, string>;
    for (const key of TEXT_KEYS) initial[key] = current[key] ?? "";
    return initial;
  });
  const [moreOpen, setMoreOpen] = useState(() =>
    PEOPLE_KEYS.some((key) => current[key]),
  );

  const navigate = (patch: DiscoverParams) => {
    const next: DiscoverParams = { ...current, ...patch, page: undefined };
    startTransition(() => router.push(discoverHref(next), { scroll: false }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const patch: DiscoverParams = {};
    for (const key of TEXT_KEYS) patch[key] = text[key].trim();
    navigate(patch);
  };

  const genre = current.ctg?.split(",")[0] ?? "";
  const sort = current.sort_by
    ? `${current.sort_by}:${current.sort_order || "desc"}`
    : DEFAULT_SORT;
  const textSearch = TEXT_KEYS.some((key) => current[key]?.trim());

  const genreOptions: Option[] = [
    { value: "", label: "Mọi thể loại" },
    ...genres.map((g) => ({ value: g.slug, label: g.name })),
  ];
  const countryOptions: Option[] = [
    { value: "", label: "Mọi quốc gia" },
    ...countries.map((c) => ({ value: c.slug, label: c.name })),
  ];
  const thisYear = new Date().getFullYear();
  const yearOptions: Option[] = [
    { value: "", label: "Mọi năm" },
    ...Array.from({ length: thisYear - FIRST_YEAR + 1 }, (_, i) => {
      const year = String(thisYear - i);
      return { value: year, label: year };
    }),
  ];

  const labelOf = (options: Option[], value?: string) =>
    options.find((o) => o.value === value)?.label ?? value ?? "";

  // One chip per active filter. Removing a text chip also clears its field.
  const chips: { key: string; label: string; clear: DiscoverParams }[] = [];
  if (current.q)
    chips.push({ key: "q", label: `“${current.q}”`, clear: { q: "" } });
  if (current.clt)
    chips.push({
      key: "clt",
      label: labelOf(COLLECTIONS, current.clt),
      clear: { clt: "" },
    });
  if (genre)
    chips.push({
      key: "ctg",
      label: labelOf(genreOptions, genre),
      clear: { ctg: "" },
    });
  if (current.cntry)
    chips.push({
      key: "cntry",
      label: labelOf(countryOptions, current.cntry),
      clear: { cntry: "" },
    });
  if (current.year)
    chips.push({
      key: "year",
      label: `Năm ${current.year}`,
      clear: { year: "" },
    });
  if (current.director)
    chips.push({
      key: "director",
      label: `Đạo diễn: ${current.director}`,
      clear: { director: "" },
    });
  if (current.actor)
    chips.push({
      key: "actor",
      label: `Diễn viên: ${current.actor}`,
      clear: { actor: "" },
    });
  if (current.tag)
    chips.push({
      key: "tag",
      label: `Tag: ${current.tag}`,
      clear: { tag: "" },
    });

  const clearChip = (chip: (typeof chips)[number]) => {
    if (chip.key in text) setText((prev) => ({ ...prev, [chip.key]: "" }));
    navigate(chip.clear);
  };
  const clearAll = () => {
    setText({ q: "", director: "", actor: "", tag: "" });
    startTransition(() => router.push("/discover", { scroll: false }));
  };

  const peopleCount = PEOPLE_KEYS.filter((key) => current[key]).length;

  return (
    <form
      aria-busy={isPending}
      aria-label="Tìm và lọc phim"
      className="squircle grid gap-5 rounded-(--radius-squircle-lg) bg-card/60 p-4 ring-1 ring-foreground/8 md:p-6"
      onSubmit={onSubmit}
      role="search"
    >
      {/* 1. Keyword: the common path. */}
      <div className="flex gap-2 sm:gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon
            aria-hidden
            className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-4 size-5 text-muted-foreground"
          />
          <Input
            aria-label="Tên phim"
            autoComplete="off"
            className="h-12 rounded-(--radius-squircle-md) pl-11 text-base md:text-base"
            enterKeyHint="search"
            onChange={(e) => setText((p) => ({ ...p, q: e.target.value }))}
            placeholder="Tìm tên phim"
            type="search"
            value={text.q}
          />
        </div>
        <Button
          aria-label="Tìm kiếm"
          className="max-sm:w-12 max-sm:px-0 sm:min-w-32"
          disabled={isPending}
          size="xl"
          type="submit"
        >
          {isPending ? (
            <CircleNotchIcon
              aria-hidden
              className="animate-spin motion-reduce:animate-none"
            />
          ) : (
            <MagnifyingGlassIcon aria-hidden weight="bold" />
          )}
          <span className="max-sm:sr-only">Tìm kiếm</span>
        </Button>
      </div>

      {/* 2. Collection switch. Title and people search look across all of them. */}
      <div className="-mx-4 md:-mx-6 overflow-x-auto px-4 [scrollbar-width:none] md:px-6 [&::-webkit-scrollbar]:hidden">
        <ToggleGroup
          aria-label="Loại phim"
          className={cn(
            "squircle w-max gap-0.5 rounded-(--radius-squircle-sm) bg-foreground/5 p-1 transition-opacity",
            textSearch && "opacity-60",
          )}
          onValueChange={(value) => {
            const next = (value[0] as string | undefined) ?? ALL;
            navigate({ clt: next === ALL ? "" : next });
          }}
          size="sm"
          spacing={0}
          value={[current.clt || ALL]}
        >
          {COLLECTIONS.map((c) => (
            <ToggleGroupItem
              className="h-8 rounded-[0.6rem] px-3 text-muted-foreground aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm"
              key={c.value}
              value={c.value}
            >
              {c.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* 3. Menus apply at once. */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
        <MenuField
          label="Thể loại"
          onChange={(v) => navigate({ ctg: v })}
          options={genreOptions}
          value={genre}
        />
        <MenuField
          label="Quốc gia"
          onChange={(v) => navigate({ cntry: v })}
          options={countryOptions}
          value={current.cntry ?? ""}
        />
        <MenuField
          label="Năm"
          onChange={(v) => navigate({ year: v })}
          options={yearOptions}
          value={current.year ?? ""}
        />
        <MenuField
          label="Sắp xếp"
          onChange={(v) => {
            const [sort_by, sort_order] = v.split(":");
            navigate(
              v === DEFAULT_SORT
                ? { sort_by: "", sort_order: "" }
                : { sort_by, sort_order },
            );
          }}
          options={SORTS}
          value={sort}
        />
        <Button
          aria-controls="discover-more-filters"
          aria-expanded={moreOpen}
          className="col-span-2 h-10 justify-center self-end rounded-(--radius-squircle-sm) lg:col-span-1"
          onClick={() => setMoreOpen((open) => !open)}
          type="button"
          variant="secondary"
        >
          <SlidersHorizontalIcon aria-hidden />
          Thêm bộ lọc
          {peopleCount > 0 ? (
            <span className="rounded-full bg-primary px-1.5 font-semibold text-[0.6875rem] text-primary-foreground tabular-nums">
              {peopleCount}
            </span>
          ) : null}
          <CaretDownIcon
            aria-hidden
            className={cn(
              "transition-transform duration-200 motion-reduce:transition-none",
              moreOpen && "rotate-180",
            )}
          />
        </Button>
      </div>

      {/* 4. People and tags, one level deeper. */}
      {moreOpen ? (
        <div className="grid gap-3 sm:grid-cols-3" id="discover-more-filters">
          <TextField
            icon={<FilmSlateIcon aria-hidden />}
            label="Đạo diễn"
            onChange={(v) => setText((p) => ({ ...p, director: v }))}
            placeholder="Christopher Nolan"
            value={text.director}
          />
          <TextField
            icon={<UserIcon aria-hidden />}
            label="Diễn viên"
            onChange={(v) => setText((p) => ({ ...p, actor: v }))}
            placeholder="Rodrigo Santoro"
            value={text.actor}
          />
          <TextField
            icon={<TagIcon aria-hidden />}
            label="Tag"
            onChange={(v) => setText((p) => ({ ...p, tag: v }))}
            placeholder="siêu anh hùng, du hành"
            value={text.tag}
          />
          <p className="text-muted-foreground text-xs sm:col-span-3">
            Bấm Enter hoặc Tìm kiếm để áp dụng. Không cần gõ dấu, gõ một phần
            tên cũng được.
          </p>
        </div>
      ) : null}

      {/* 5. What is applied now, each removable. */}
      {chips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 border-foreground/8 border-t pt-4">
          {chips.map((chip) => (
            <button
              aria-label={`Bỏ lọc ${chip.label}`}
              className="squircle inline-flex h-7 max-w-full items-center gap-1 rounded-full bg-primary/15 pr-1.5 pl-3 font-medium text-primary text-xs ring-1 ring-primary/25 transition-colors hover:bg-primary/25 active:scale-[0.97] motion-reduce:active:scale-100"
              key={chip.key}
              onClick={() => clearChip(chip)}
              type="button"
            >
              <span className="truncate">{chip.label}</span>
              <XIcon aria-hidden className="size-3.5 shrink-0" weight="bold" />
            </button>
          ))}
          <Button
            className="ml-auto text-muted-foreground"
            onClick={clearAll}
            size="sm"
            type="button"
            variant="ghost"
          >
            Xoá tất cả
          </Button>
        </div>
      ) : null}
    </form>
  );
}

function MenuField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}) {
  const id = useId();
  const active = value !== "" && value !== DEFAULT_SORT;
  return (
    <div className="grid min-w-0 gap-1.5">
      <Label className="text-muted-foreground text-xs" id={id}>
        {label}
      </Label>
      <Select
        items={options}
        onValueChange={(next) => onChange((next as string | null) ?? "")}
        value={value}
      >
        <SelectTrigger
          aria-labelledby={id}
          className={cn(
            "h-10 w-full min-w-0 rounded-(--radius-squircle-sm) data-[size=default]:h-10",
            active && "border-primary/40 text-foreground",
          )}
        >
          <SelectValue className="truncate" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {options.map((option) => (
            <SelectItem key={option.value || "all"} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: ReactNode;
}) {
  const id = useId();
  return (
    <div className="grid min-w-0 gap-1.5">
      <Label className="text-muted-foreground text-xs" htmlFor={id}>
        {label}
      </Label>
      <div className="relative">
        <span className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 text-muted-foreground [&_svg]:size-4">
          {icon}
        </span>
        <Input
          autoComplete="off"
          className="h-10 rounded-(--radius-squircle-sm) pl-9"
          enterKeyHint="search"
          id={id}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          value={value}
        />
      </div>
    </div>
  );
}
