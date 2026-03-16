"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@repo/design-system/components/ui/button";
import {
  CommandMenu,
  CommandMenuFooter,
  CommandMenuItem,
  CommandMenuList,
  CommandMenuSearch,
} from "@repo/design-system/components/ui/command-menu";
import { Kbd } from "@repo/design-system/components/ui/kbd";
import { useHotkey } from "@tanstack/react-hotkeys";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import type { IMovie } from "../../types/response";
import { searchMovies } from "../actions/search-movies";

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearching, startTransition] = useTransition();
  const cdnUrlRef = useRef("");
  const [results, setResults] = useState<(IMovie & { id: string })[]>([]);

  useHotkey("Mod+K", () => setIsOpen((open) => !open));

  const performSearchMovies = async (query: string) => {
    try {
      const response = await searchMovies(query);
      cdnUrlRef.current = response?.APP_DOMAIN_CDN_IMAGE || "";
      setResults(
        response?.items.map((item) => ({
          ...item,
          id: item._id,
          name: item.name,
        })),
      );
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    }
  };

  const handleSearch = async (value: string) => {
    setSearch(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    startTransition(async () => {
      await performSearchMovies(value);
    });
  };

  return (
    <>
      <Button
        intent="secondary"
        onClick={() => setIsOpen(true)}
        className={"w-[12rem] justify-between text-sm"}
      >
        <div className="flex items-center gap-2">
          <MagnifyingGlassIcon />
          Tìm kiếm...
        </div>
        <Kbd>⌘K</Kbd>
      </Button>
      <CommandMenu
        isPending={isSearching}
        onInputChange={handleSearch}
        inputValue={search}
        isOpen={isOpen}
        size="2xl"
        onOpenChange={setIsOpen}
        className="shadow-accent shadow-sm lg:row-start-2"
      >
        <CommandMenuSearch placeholder="Tìm kiếm phim..." />
        <CommandMenuList items={results}>
          {(movie) => (
            <CommandMenuItem
              textValue={movie.name}
              key={movie._id}
              className="space-x-3"
            >
              <Image
                src={`${cdnUrlRef.current}/uploads/movies/${movie.thumb_url}`}
                className="rounded-md"
                width={56}
                height={80}
                alt={movie.name}
              />

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-col gap-0.5">
                  <span className="truncate font-semibold text-sm">
                    {movie.name}
                  </span>
                  {movie.origin_name && (
                    <span className="truncate text-muted-foreground text-xs">
                      {movie.origin_name}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-muted-foreground text-xs">
                  {movie.year && (
                    <span className="font-medium text-xs">{movie.year}</span>
                  )}
                  {movie.quality && movie.year && (
                    <span className="text-border">•</span>
                  )}
                  {movie.quality && (
                    <span className="font-medium text-xs">{movie.quality}</span>
                  )}
                </div>

                {movie.episode_current && (
                  <div className="font-medium text-muted-foreground text-xs">
                    <span className="text-foreground">
                      {movie.episode_current}
                    </span>
                    {movie.episode_total && movie.episode_total !== "0" && (
                      <span> / {movie.episode_total}</span>
                    )}
                  </div>
                )}
              </div>
            </CommandMenuItem>
          )}
        </CommandMenuList>
        <CommandMenuFooter>
          <div className="flex items-center gap-2 px-1.5 text-muted-foreground text-xs">
            Sử dụng <Kbd>Enter</Kbd> để xem chi tiết phim. <Kbd>↑</Kbd> và{" "}
            <Kbd>↓</Kbd>
            để di chuyển qua các kết quả.
          </div>
        </CommandMenuFooter>
      </CommandMenu>
    </>
  );
}
