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
import { useRouter, useSearchParams } from "next/navigation";
import {
  type FormEvent,
  type ReactNode,
  useId,
  useState,
  useTransition,
} from "react";
import {
  ADVANCED_KEYS,
  type AdvancedKey,
  type DiscoverParams,
  discoverHref,
} from "../advanced-params";

type FormState = Record<AdvancedKey, string>;

const FIRST_YEAR = 1970;

/**
 * The search part of Discover: a title keyword up front, with director,
 * actor, tag and year underneath. It keeps the genre, country, collection
 * and sort picked in the filters below.
 */
export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<FormState>(() => {
    const initial = {} as FormState;
    for (const key of ADVANCED_KEYS) initial[key] = searchParams.get(key) ?? "";
    return initial;
  });

  const set = (key: AdvancedKey) => (value: string) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const thisYear = new Date().getFullYear();
  const yearOptions = [
    { value: "", label: "Mọi năm" },
    ...Array.from({ length: thisYear - FIRST_YEAR + 1 }, (_, i) => {
      const year = String(thisYear - i);
      return { value: year, label: year };
    }),
  ];

  const navigate = (next: FormState) => {
    const params: DiscoverParams = Object.fromEntries(searchParams.entries());
    for (const key of ADVANCED_KEYS) params[key] = next[key].trim();
    params.page = undefined;
    startTransition(() => router.push(discoverHref(params)));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    navigate(state);
  };

  const hasValues = ADVANCED_KEYS.some((key) => state[key].trim() !== "");
  const onClear = () => {
    const empty = { q: "", director: "", actor: "", tag: "", year: "" };
    setState(empty);
    navigate(empty);
  };

  return (
    <form
      aria-label="Tìm phim"
      className="grid gap-5"
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          placeholder="Ví dụ: siêu anh hùng"
          value={state.tag}
        />
        <YearField
          onChange={set("year")}
          options={yearOptions}
          value={state.year}
        />
      </div>

      {hasValues ? (
        <div className="-mt-1 flex justify-end">
          <Button onClick={onClear} size="sm" type="button" variant="ghost">
            <XIcon aria-hidden weight="bold" />
            Xoá tìm kiếm
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

function YearField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = useId();
  return (
    <div className="grid content-start gap-2">
      <Label id={id}>Năm phát hành</Label>
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
