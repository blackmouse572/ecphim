"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
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
  clt: z.string().optional().default(""),
  ctg: z.array(z.string()).optional().default([]),
  cntry: z.string().optional().default(""),
  sort_by: z.string().optional().default("modified.time"),
  sort_order: z.string().optional().default("desc"),
});

type FiltersFormData = z.infer<typeof filtersSchema>;

type FiltersFormProps = {
  countries: ICountry[];
};

// Collection Filter Field Component
function CollectionFilterField() {
  const { setValue } = useFormContext<FiltersFormData>();
  const clt = useWatch<FiltersFormData>({ name: "clt" });

  return (
    <div>
      <div className="relative mb-4">
        <Label>Bộ sưu tập</Label>
        {clt && (
          <Button
            type="button"
            intent="plain"
            size="xs"
            onClick={() => setValue("clt", "")}
            className="absolute top-0 right-0 text-muted-foreground hover:text-muted-foreground/80"
          >
            <XIcon weight="bold" /> Xóa
          </Button>
        )}
      </div>
      <TagGroup
        selectionMode="single"
        // @ts-expect-error - React Hook Form's useWatch can return undefined, but TagGroup expects a Set<string>
        selectedKeys={new Set(clt ? [clt] : [])}
        onSelectionChange={(key) => {
          if (key === "all") {
            setValue("clt", "");
          } else {
            const collection =
              key.size > 0 ? (key.values().next().value as string) : "";
            setValue("clt", collection);
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
function CategoryFilterField() {
  const { setValue } = useFormContext<FiltersFormData>();
  const ctg = useWatch<FiltersFormData>({ name: "ctg" });

  return (
    <div>
      <div className="relative mb-4">
        <Label>Thể loại</Label>
        {ctg && ctg.length > 0 && (
          <Button
            type="button"
            intent="plain"
            size="xs"
            onClick={() => setValue("ctg", [])}
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
            setValue(
              "ctg",
              CATEGORIES.map((c) => c.slug),
            );
          } else {
            setValue("ctg", Array.from(key) as string[]);
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
}

function CountryFilterField({ countries }: CountryFilterFieldProps) {
  const { setValue } = useFormContext<FiltersFormData>();
  const cntry = useWatch<FiltersFormData>({ name: "cntry" }) as string;

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
            onClick={() => setValue("cntry", "")}
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
            setValue("cntry", "");
          } else {
            const country =
              key.size > 0 ? (key.values().next().value as string) : "";
            setValue("cntry", country);
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
function SortFieldsComponent() {
  const { setValue, control } = useFormContext<FiltersFormData>();
  const sortBy = useWatch<FiltersFormData>({ name: "sort_by", control });
  const sortOrder = useWatch<FiltersFormData>({ name: "sort_order", control });

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col gap-2">
        <Label>Sắp xếp theo</Label>
        <Select
          selectedKey={sortBy as string}
          onSelectionChange={(key) => setValue("sort_by", key as string)}
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
          onSelectionChange={(key) => setValue("sort_order", key as string)}
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
function ActionButtonsComponent(props: { isPending?: boolean }) {
  const { reset } = useFormContext<FiltersFormData>();
  const clt = useWatch<FiltersFormData>({ name: "clt" });
  const ctg = useWatch<FiltersFormData>({ name: "ctg" });
  const cntry = useWatch<FiltersFormData>({ name: "cntry" });

  const hasActiveFilters = clt || (ctg && ctg.length > 0) || cntry;

  const handleClearAll = () => {
    reset({
      clt: "",
      ctg: [],
      cntry: "",
      sort_by: "modified.time",
      sort_order: "desc",
    });
  };

  return (
    <div className="flex justify-end gap-3">
      {hasActiveFilters && (
        <Button
          size="sm"
          type="button"
          intent="plain"
          isDisabled={props.isPending}
          onClick={handleClearAll}
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
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const methods = useForm<FiltersFormData>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      clt: searchParams.get("clt") || "",
      ctg: searchParams.get("ctg")?.split(",").filter(Boolean) || [],
      cntry: searchParams.get("cntry") || "",
      sort_by: searchParams.get("sort_by") || "modified.time",
      sort_order: searchParams.get("sort_order") || "desc",
    },
  });

  const onSubmit = (data: FiltersFormData) => {
    startTransition(() => {
      const params = new URLSearchParams();

      if (data.clt) params.set("clt", data.clt);
      if (data.ctg.length > 0) params.set("ctg", data.ctg.join(","));
      if (data.cntry) params.set("cntry", data.cntry);
      params.set("sort_by", data.sort_by);
      params.set("sort_order", data.sort_order);

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.push(newUrl, { scroll: true });
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <fieldset
          disabled={isPending}
          className="flex flex-wrap items-start justify-between gap-8 rounded-3xl border border-white/10 bg-white/2 p-6 backdrop-blur-sm"
        >
          <CollectionFilterField />
          <CategoryFilterField />
          <CountryFilterField countries={countries} />
          <div className="flex w-full items-end justify-between">
            <SortFieldsComponent />
            <ActionButtonsComponent isPending={isPending} />
          </div>
        </fieldset>
      </form>
    </FormProvider>
  );
}
