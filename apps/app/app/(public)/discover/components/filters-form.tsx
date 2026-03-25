"use client";

import { XIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@repo/design-system/components/ui/button";
import { Label } from "@repo/design-system/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@repo/design-system/components/ui/select";
import {
  Tag,
  TagGroup,
  TagList,
} from "@repo/design-system/components/ui/tag-group";
import { useForm } from "@tanstack/react-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseAsString, useQueryStates } from "nuqs";
import { useTransition } from "react";
import { z } from "zod";
import { CATEGORIES } from "@/app/components/app-nav/data";
import type { ICountry } from "../../../../types/response";

const collectionLabels = [
  { id: "phim-moi", name: "Phim mới" },
  { id: "phim-le", name: "Phim lẻ" },
  { id: "phim-bo", name: "Phim bộ" },
  { id: "tv-shows", name: "TV Shows" },
  { id: "hoat-hinh", name: "Hoạt hình" },
  { id: "phim-vietsub", name: "Phim vietsub" },
  { id: "phim-thuyet-minh", name: "Phim thuyết minh" },
  { id: "phim-long-tien", name: "Phim lồng tiếng" },
  { id: "phim-bo-dang-chieu", name: "Phim bộ đang chiếu" },
  { id: "phim-bo-hoan-thanh", name: "Phim bộ hoàn thành" },
  { id: "phim-sap-chieu", name: "Phim sắp chiếu" },
  { id: "subteam", name: "Subteam" },
  { id: "phim-chieu-rap", name: "Phim chiếu rạp" },
];

const categoryCollections = CATEGORIES.map((c) => ({
  id: c.slug,
  name: c.name,
}));

const SORT_OPTIONS = [
  { id: "modified.time", name: "Cập nhật gần đây" },
  { id: "year", name: "Năm phát hành" },
  { id: "_id", name: "Mới nhất" },
] as const;

const SORT_ORDER_OPTIONS = [
  { id: "desc", name: "Giảm dần" },
  { id: "asc", name: "Tăng dần" },
] as const;

const filtersSchema = z.object({
  clt: z.string().optional(),
  ctg: z.array(z.string()).optional(),
  cntry: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
});

type FiltersFormData = z.infer<typeof filtersSchema>;

type FiltersFormProps = {
  countries: ICountry[];
};

// Collection Filter Field Component
function CollectionFilterField({
  clt,
  setClt,
}: {
  clt: string;
  setClt: (value: string) => void;
}) {
  return (
    <div>
      <div className="relative mb-4">
        <Label>Bộ sưu tập</Label>
        {clt && (
          <Button
            type="button"
            intent="plain"
            size="xs"
            onClick={() => setClt("")}
            className="absolute top-0 right-0 text-muted-foreground hover:text-muted-foreground/80"
          >
            <XIcon weight="bold" /> Xóa
          </Button>
        )}
      </div>
      <TagGroup
        selectionMode="single"
        selectedKeys={new Set(clt ? [clt] : [])}
        onSelectionChange={(key) => {
          if (key === "all") {
            setClt("");
          } else {
            const collection =
              key.size > 0 ? (key.values().next().value as string) : "";
            setClt(collection);
          }
        }}
      >
        <TagList items={collectionLabels}>
          {(collection) => <Tag>{collection.name}</Tag>}
        </TagList>
      </TagGroup>
    </div>
  );
}

// Category Filter Field Component
function CategoryFilterField({
  ctg,
  setCtg,
}: {
  ctg: string[];
  setCtg: (value: string[]) => void;
}) {
  return (
    <div>
      <div className="relative mb-4">
        <Label>Thể loại</Label>
        {ctg && ctg.length > 0 && (
          <Button
            type="button"
            intent="plain"
            size="xs"
            onClick={() => setCtg([])}
            className="absolute top-0 right-0 text-muted-foreground hover:text-muted-foreground/80"
          >
            <XIcon weight="bold" /> Xóa
          </Button>
        )}
      </div>
      <TagGroup
        selectionMode="multiple"
        selectedKeys={new Set(ctg || [])}
        onSelectionChange={(key) => {
          if (key === "all") {
            setCtg(CATEGORIES.map((c) => c.slug));
          } else {
            setCtg(Array.from(key) as string[]);
          }
        }}
      >
        <TagList items={categoryCollections}>
          {(collection) => (
            <Tag className="selected:inset-ring-info-subtle/70 selected:bg-info-subtle selected:text-info-subtle-fg">
              {collection.name}
            </Tag>
          )}
        </TagList>
      </TagGroup>
    </div>
  );
}

// Country Filter Field Component
interface CountryFilterFieldProps {
  countries: ICountry[];
  cntry: string;
  setCntry: (value: string) => void;
}

function CountryFilterField({
  countries,
  cntry,
  setCntry,
}: CountryFilterFieldProps) {
  const countriesSelections = countries.map((country) => ({
    id: country.slug,
    name: country.name,
  }));

  return (
    <div>
      <div className="relative mb-4">
        <Label>Quốc gia</Label>
        {cntry && (
          <Button
            type="button"
            intent="plain"
            size="xs"
            onClick={() => setCntry("")}
            className="absolute top-0 right-0 text-muted-foreground hover:text-muted-foreground/80"
          >
            <XIcon weight="bold" /> Xóa
          </Button>
        )}
      </div>
      <TagGroup
        selectionMode="single"
        selectedKeys={new Set(cntry ? [cntry] : [])}
        onSelectionChange={(key) => {
          if (key === "all") {
            setCntry("");
          } else {
            const country =
              key.size > 0 ? (key.values().next().value as string) : "";
            setCntry(country);
          }
        }}
      >
        <TagList items={countriesSelections}>
          {(country) => <Tag>{country.name}</Tag>}
        </TagList>
      </TagGroup>
    </div>
  );
}

// Sort Fields Component
function SortFieldsComponent({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: {
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col gap-2">
        <Label>Sắp xếp theo</Label>
        <Select
          selectedKey={sortBy as string}
          onSelectionChange={(key) => setSortBy(key as string)}
        >
          <SelectTrigger className="w-[180px]" />
          <SelectContent items={SORT_OPTIONS}>
            {(option) => <SelectItem>{option.name}</SelectItem>}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Thứ tự</Label>
        <Select
          selectedKey={sortOrder as string}
          onSelectionChange={(key) => setSortOrder(key as string)}
        >
          <SelectTrigger className="w-[150px]" />
          <SelectContent items={SORT_ORDER_OPTIONS}>
            {(option) => <SelectItem>{option.name}</SelectItem>}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Action Buttons Component
function ActionButtonsComponent(props: {
  isPending?: boolean;
  clt: string;
  ctg: string[];
  cntry: string;
  onClearAll: () => void;
}) {
  const hasActiveFilters =
    props.clt || (props.ctg && props.ctg.length > 0) || props.cntry;

  return (
    <div className="flex justify-end gap-3">
      {hasActiveFilters && (
        <Button
          size="sm"
          type="button"
          intent="plain"
          isDisabled={props.isPending}
          onClick={props.onClearAll}
          className="text-muted-foreground hover:text-muted-foreground/80"
        >
          <XIcon weight="bold" /> Xóa tất cả
        </Button>
      )}
      <Button
        intent="secondary"
        size="sm"
        type="submit"
        isPending={props.isPending}
      >
        Áp dụng
      </Button>
    </div>
  );
}

export function FiltersForm({ countries }: FiltersFormProps) {
  const searchParams = useSearchParams();
  const [defaultValues, __] = useQueryStates({
    clt: parseAsString,
    ctg: parseAsString,
    cntry: parseAsString,
    sort_by: parseAsString,
    sort_order: parseAsString,
  });
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      clt: defaultValues.clt || "",
      ctg: defaultValues.ctg ? defaultValues.ctg.split(",") : [],
      cntry: defaultValues.cntry || "",
      sort_by: defaultValues.sort_by || "modified.time",
      sort_order: defaultValues.sort_order || "desc",
    },
    onSubmit: async ({ value }) => {
      startTransition(() => {
        const params = new URLSearchParams();

        if (value.clt) params.set("clt", value.clt);
        if (value.ctg.length > 0) params.set("ctg", value.ctg.join(","));
        if (value.cntry) params.set("cntry", value.cntry);
        params.set("sort_by", value.sort_by);
        params.set("sort_order", value.sort_order);

        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

        router.push(newUrl, { scroll: true });
      });
    },
  });

  const handleClearAll = () => {
    form.setFieldValue("clt", "");
    form.setFieldValue("ctg", []);
    form.setFieldValue("cntry", "");
    form.setFieldValue("sort_by", "modified.time");
    form.setFieldValue("sort_order", "desc");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <fieldset
        disabled={isPending}
        className="flex flex-wrap items-start justify-between gap-8 rounded-3xl border border-white/10 bg-white/2 p-6 backdrop-blur-sm"
      >
        <CollectionFilterField
          clt={form.getFieldValue("clt")}
          setClt={(value) => form.setFieldValue("clt", value)}
        />
        <CategoryFilterField
          ctg={form.getFieldValue("ctg")}
          setCtg={(value) => form.setFieldValue("ctg", value)}
        />
        <CountryFilterField
          countries={countries}
          cntry={form.getFieldValue("cntry")}
          setCntry={(value) => form.setFieldValue("cntry", value)}
        />
        <div className="flex w-full items-end justify-between">
          <SortFieldsComponent
            sortBy={form.getFieldValue("sort_by")}
            setSortBy={(value) => form.setFieldValue("sort_by", value)}
            sortOrder={form.getFieldValue("sort_order")}
            setSortOrder={(value) => form.setFieldValue("sort_order", value)}
          />
          <ActionButtonsComponent
            isPending={isPending}
            clt={form.getFieldValue("clt")}
            ctg={form.getFieldValue("ctg")}
            cntry={form.getFieldValue("cntry")}
            onClearAll={handleClearAll}
          />
        </div>
      </fieldset>
    </form>
  );
}
