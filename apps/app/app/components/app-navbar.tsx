"use client";

import {
  Crown,
  FilmReel,
  List,
  MagnifyingGlass,
  Star,
  UserIcon,
} from "@phosphor-icons/react";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  DisclosureTrigger,
} from "@repo/design-system/components/ui/disclosure-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/design-system/components/ui/dropdown-menu";
import { Input } from "@repo/design-system/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@repo/design-system/components/ui/navigation-menu";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/design-system/components/ui/sheet";
import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
import { useState } from "react";

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface NavbarProps {
  user?: User | null;
  categories?: Array<{ name: string; slug: string }>;
  years?: Array<{ name: string; slug: string }>;
  countries?: Array<{ name: string; slug: string }>;
}

// Fallback data in case API fetch fails
const DEFAULT_CATEGORIES = [
  { name: "Action", slug: "action" },
  { name: "Drama", slug: "drama" },
  { name: "Comedy", slug: "comedy" },
  { name: "Horror", slug: "horror" },
  { name: "Sci-Fi", slug: "sci-fi" },
  { name: "Romance", slug: "romance" },
  { name: "Thriller", slug: "thriller" },
  { name: "Adventure", slug: "adventure" },
];

const DEFAULT_YEARS = [
  { name: "2024", slug: "2024" },
  { name: "2023", slug: "2023" },
  { name: "2022", slug: "2022" },
  { name: "2021", slug: "2021" },
  { name: "2020", slug: "2020" },
  { name: "2019", slug: "2019" },
  { name: "2018", slug: "2018" },
  { name: "2017", slug: "2017" },
];

const DEFAULT_COUNTRIES = [
  { name: "Hàn Quốc", slug: "han-quoc" },
  { name: "Nhật Bản", slug: "nhat-ban" },
  { name: "Trung Quốc", slug: "trung-quoc" },
  { name: "Thái Lan", slug: "thai-lan" },
  { name: "Âu Mỹ", slug: "au-my" },
  { name: "Ấn Độ", slug: "an-do" },
];

const COLLECTIONS = [
  { name: "Trending", icon: Star, slug: "trending" },
  { name: "Premium", icon: Crown, slug: "premium" },
];

export function AppNavbar({ user, categories, years, countries }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Use provided data or fallback to defaults
  const displayCategories = categories || DEFAULT_CATEGORIES;
  const displayYears = years || DEFAULT_YEARS;
  const displayCountries = countries || DEFAULT_COUNTRIES;

  const navigationItems = [
    {
      title: "Categories",
      items: displayCategories,
      columns: 4,
    },
    {
      title: "Countries",
      items: displayCountries,
      columns: 8,
    },
    {
      title: "Collections",
      items: COLLECTIONS,
      columns: 2,
    },
  ];

  return (
    <NavigationMenu
      viewport={true}
      className="fixed top-0 z-10 w-full max-w-none bg-background/20 px-4 backdrop-blur-2xl"
    >
      <NavigationMenuList>
        <NavigationMenuLink className="hover:bg-transparent" asChild>
          <Link href="/" className="flex shrink-0 items-center space-x-2">
            <div className="rounded-xl bg-gradient-to-r from-gray-800 to-neutral-800 p-2 transition-transform hover:scale-105">
              <FilmReel className="h-5 w-5 text-white" weight="bold" />
            </div>
            <span className="hidden font-900 text-lg text-white tracking-tight sm:inline">
              Ec<span className="text-primary">Phim</span>
            </span>
          </Link>
        </NavigationMenuLink>
      </NavigationMenuList>

      {/* Desktop Navigation */}
      <div className="hidden flex-1 lg:block">
        <NavigationMenuList className="gap-1">
          {/* Group items with dropdown content */}
          {navigationItems.map((group) => (
            <NavigationMenuItem key={group.title}>
              <NavigationMenuTrigger className="text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10">
                {group.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent
                className="!mt-0 grid py-4 md:w-screen"
                style={{
                  gridTemplateColumns: `repeat(${group.columns}, minmax(120px, 1fr))`,
                }}
              >
                {group.items.map((item: any) => (
                  <NavigationMenuLink
                    key={item.slug}
                    href={`/${group.title.toLowerCase()}/${item.slug}`}
                    className={cn(
                      "text-white/80 hover:bg-white/10 hover:text-white",
                      "focus:bg-white/10 focus:outline-none",
                    )}
                  >
                    {item.icon && (
                      <item.icon className="h-4 w-4 text-primary" />
                    )}
                    <span>{item.name}</span>
                  </NavigationMenuLink>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
          {/* Single items: Movies and TV Shows */}
          <NavigationMenuItem>
            <NavigationMenuLink
              className="text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/movies">Movies</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/tv-shows">TV Shows</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </div>
      <div className="block flex-1 lg:hidden" />
      {/* Right side actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          {isSearchOpen ? (
            <div className="-translate-y-1/2 absolute top-1/2 right-0">
              <Input
                placeholder="Search movies..."
                className="w-48 border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-primary"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          ) : (
            <Button
              intent="plain"
              size="sq-md"
              onClick={() => setIsSearchOpen(true)}
              className="text-white/80 hover:bg-white/10 hover:text-white"
            >
              <MagnifyingGlass className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* User Menu / Sign In */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                intent="plain"
                size="sq-md"
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                <UserIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-48 border-white/20 bg-black/95"
              align="end"
            >
              <DropdownMenuItem asChild>
                <Link
                  href="/profile"
                  className="cursor-pointer text-white hover:text-primary"
                >
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/my-list"
                  className="cursor-pointer text-white hover:text-primary"
                >
                  My List
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className="cursor-pointer text-white hover:text-primary"
                >
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild>
                <Link
                  href="/sign-out"
                  className="cursor-pointer text-white hover:text-red-400"
                >
                  Sign Out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button intent="primary" size="sm" className="hidden sm:inline-flex">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        )}

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger
              size="sq-md"
              aria-label="Open mobile menu"
              intent="secondary"
            >
              <List className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[300px] border-r-white/10 bg-black/95 sm:max-w-xs"
            >
              <SheetHeader className="w-full border-white/10 border-b pb-4 text-left">
                <SheetTitle className="flex items-center space-x-2">
                  <div className="rounded-xl bg-gradient-to-r from-gray-800 to-neutral-800 p-2">
                    <FilmReel className="h-4 w-4 text-white" weight="bold" />
                  </div>
                  <span className="font-900 text-base text-white tracking-tight">
                    Ec<span className="text-primary">Phim</span>
                  </span>
                </SheetTitle>
              </SheetHeader>
              <SheetBody className="h-full px-0 py-4">
                <ScrollArea className="h-full">
                  <div className="flex flex-col gap-4 px-6 pb-[20px]">
                    <div className="flex flex-col space-y-3">
                      <Link
                        href="/movies"
                        className="py-2 font-medium text-base text-white transition-colors hover:text-primary"
                      >
                        Movies
                      </Link>
                      <Link
                        href="/tv-shows"
                        className="py-2 font-medium text-base text-white transition-colors hover:text-primary"
                      >
                        TV Shows
                      </Link>
                    </div>

                    <DisclosureGroup className="gap-0 border-white/10 border-t pt-2">
                      {navigationItems.map((group) => (
                        <Disclosure
                          key={group.title}
                          className="group/disclosure-navbar inset-ring-0 rounded-none bg-transparent p-0 duration-0 hover:bg-transparent"
                        >
                          <DisclosureTrigger className="flex w-full items-center justify-between rounded-none px-0 py-3 font-medium text-white transition-colors hover:text-primary data-[expanded=true]:text-white">
                            {group.title}
                          </DisclosureTrigger>
                          <DisclosurePanel className="px-0">
                            <div
                              className="grid gap-2 border-red py-2 outline-none"
                              style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
                            >
                              {group.items.map((item: any) => (
                                <Link
                                  key={item.slug}
                                  href={`/${group.title.toLowerCase()}/${item.slug}`}
                                  className="flex items-center gap-2 py-1.5 text-sm text-white/80 outline-none transition-colors hover:text-white"
                                >
                                  {item.icon && (
                                    <item.icon className="h-3 w-3 text-primary" />
                                  )}
                                  <span className="truncate">{item.name}</span>
                                </Link>
                              ))}
                            </div>
                          </DisclosurePanel>
                        </Disclosure>
                      ))}
                    </DisclosureGroup>
                  </div>
                </ScrollArea>
              </SheetBody>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </NavigationMenu>
  );
}