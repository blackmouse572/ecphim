"use client";

import {
  CircleNotchIcon,
  FilmSlateIcon,
  MagnifyingGlassIcon,
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
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  type ReactNode,
  useId,
  useState,
  useTransition,
} from "react";
import type { AdvancedSearchFilters } from "@/lib/services/advanced-search-match";
import type { ICountry } from "@/types/response";
import { searchHref } from "../search-params";

type Option = { value: string; label: string };

type Props = {
  filters: AdvancedSearchFilters;
  genres: { name: string; slug: string }[];
  countries: ICountry[];
};

const FIRST_YEAR = 1970;

type TextKey = "q" | "director" | "actor" | "tag";
type SelectKey = "ctg" | "cntry" | "year";
type FormState = Record<TextKey | SelectKey, string>;

function toState(filters: AdvancedSearchFilters): FormState {
  return {
    q: filters.q ?? "",
    director: filters.director ?? "",
    actor: filters.actor ?? "",
    tag: filters.tag ?? "",
    ctg: filters.ctg ?? "",
    cntry: filters.cntry ?? "",
    year: filters.year ? String(filters.year) : "",
  };
}

function toFilters(state: FormState): AdvancedSearchFilters {
  const year = Number.parseInt(state.year, 10);
  return {
    q: state.q.trim() || undefined,
    director: state.director.trim() || undefined,
    actor: state.actor.trim() || undefined,
    tag: state.tag.trim() || undefined,
    ctg: state.ctg || undefined,
    cntry: state.cntry || undefined,
    year: Number.isFinite(year) ? year : undefined,
  };
}

export function AdvancedSearchForm({ filters, genres, countries }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<FormState>(() => toState(filters));

  const set = (key: keyof FormState) => (value: string) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const genreOptions: Option[] = [
    { value: "", label: "Tất cả thể loại" },
    ...genres.map((g) => ({ value: g.slug, label: g.name })),
  ];
  const countryOptions: Option[] = [
    { value: "", label: "Tất cả quốc gia" },
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

  const hasValues = Object.values(state).some((v) => v.trim() !== "");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    startTransition(() => router.push(searchHref(toFilters(state))));
  };

  const onReset = () => {
    setState(toState({}));
    startTransition(() => router.push("/tim-kiem"));
  };

  return (
    <form
      aria-label="Tìm kiếm nâng cao"
      className="squircle grid gap-6 rounded-(--radius-squircle-lg) bg-card/60 p-4 ring-1 ring-foreground/8 md:p-6"
      onSubmit={onSubmit}
      role="search"
    >
      {/* The common path first: a title keyword and the search button. */}
      <div className="flex flex-col gap-3 sm:flex-row">
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
            name="q"
            onChange={(e) => set("q")(e.target.value)}
            placeholder="Tên phim, ví dụ: Avengers"
            type="search"
            value={state.q}
          />
        </div>
        <Button
          className="sm:min-w-36"
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
          Tìm kiếm
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TextField
          icon={<FilmSlateIcon aria-hidden />}
          label="Đạo diễn"
          onChange={set("director")}
          placeholder="Ví dụ: Christopher Nolan"
          value={state.director}
        />
        <TextField
          icon={<UserIcon aria-hidden />}
          label="Diễn viên"
          onChange={set("actor")}
          placeholder="Ví dụ: Rodrigo Santoro"
          value={state.actor}
        />
        <TextField
          hint="Nhiều tag thì ngăn cách bằng dấu phẩy."
          icon={<TagIcon aria-hidden />}
          label="Tag"
          onChange={set("tag")}
          placeholder="Ví dụ: khoa học viễn tưởng, siêu anh hùng"
          value={state.tag}
        />
        <SelectField
          label="Thể loại"
          onChange={set("ctg")}
          options={genreOptions}
          value={state.ctg}
        />
        <SelectField
          label="Quốc gia"
          onChange={set("cntry")}
          options={countryOptions}
          value={state.cntry}
        />
        <SelectField
          label="Năm phát hành"
          onChange={set("year")}
          options={yearOptions}
          value={state.year}
        />
      </div>

      {hasValues ? (
        <div className="flex justify-end">
          <Button onClick={onReset} size="sm" type="button" variant="ghost">
            <XIcon aria-hidden weight="bold" />
            Xoá bộ lọc
          </Button>
        </div>
      ) : null}
    </form>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  icon,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: ReactNode;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="grid content-start gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 text-muted-foreground [&_svg]:size-4">
          {icon}
        </span>
        <Input
          aria-describedby={hint ? `${id}-hint` : undefined}
          autoComplete="off"
          className="h-10 rounded-(--radius-squircle-sm) pl-9"
          id={id}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          value={value}
        />
      </div>
      {hint ? (
        <p className="text-muted-foreground text-xs" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
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
  return (
    <div className="grid content-start gap-2">
      <Label id={id}>{label}</Label>
      <Select
        items={options}
        onValueChange={(next) => onChange((next as string | null) ?? "")}
        value={value}
      >
        <SelectTrigger
          aria-labelledby={id}
          className="h-10 w-full rounded-(--radius-squircle-sm) data-[size=default]:h-10"
        >
          <SelectValue />
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
