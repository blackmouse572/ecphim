"use client";
import {
  NavbarProvider,
  NavbarStart,
  Navbar,
  NavbarItem,
  NavbarSpacer,
  NavbarSection,
  NavbarGap
} from "@repo/design-system/components/ui/navbar";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@repo/design-system/components/ui/menu";

import {
  MagnifyingGlass,
  List,
  User,
  SignIn,
  CaretDown,
  FilmReel,
  Calendar,
  Globe,
  Star,
  Crown,
} from "@phosphor-icons/react";
import { Button } from "@repo/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/design-system/components/ui/dropdown-menu";
import { Input } from "@repo/design-system/components/ui/input";
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
}

const CATEGORIES = [
  { name: "Action", slug: "action" },
  { name: "Drama", slug: "drama" },
  { name: "Comedy", slug: "comedy" },
  { name: "Horror", slug: "horror" },
  { name: "Sci-Fi", slug: "sci-fi" },
  { name: "Romance", slug: "romance" },
  { name: "Thriller", slug: "thriller" },
  { name: "Adventure", slug: "adventure" },
];

const YEARS = [
  "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"
];

const COUNTRIES = [
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
  { name: "New Releases", icon: FilmReel, slug: "new" },
];

export function AppNavbar({ user }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <Navbar isSticky >
      <NavbarStart>
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-gradient-to-r from-gray-800 to-neutral-800 p-2 rounded-xl group-hover:scale-105 transition-transform">
            <FilmReel className="h-6 w-6 text-white" weight="bold" />
          </div>
          <span className="text-title font-900 text-white tracking-tight">
            Ec<span className="text-primary">Phim</span>
          </span>
        </Link>
      </NavbarStart>
      <NavbarGap />
      {/* Main Navigation */}
      <NavbarSection>
        <Menu>
          <NavbarItem>
            Categories
            <CaretDown className="col-start-2" />
          </NavbarItem>
          <MenuContent className="min-w-(--trigger-width) sm:min-w-56" items={CATEGORIES}>
            {(item) => (
              <MenuItem id={item.slug} textValue={item.slug} href={item.slug}>
                {item.name}
              </MenuItem>
            )}
          </MenuContent>
        </Menu>


        {/* Years */}
        <Menu>
          <NavbarItem>
            Years
            <CaretDown className="col-start-2" />
          </NavbarItem>
          <MenuContent className="min-w-(--trigger-width) sm:min-w-56" items={YEARS.map((year) => ({ name: year, slug: year }))}>
            {(item) => (
              <MenuItem id={item.slug} textValue={item.slug} href={item.slug}>
                {item.name}
              </MenuItem>
            )}
          </MenuContent>
        </Menu>
        {/* Countries */}
        <Menu>
          <NavbarItem>
            Countries
            <CaretDown className="col-start-2" />
          </NavbarItem>
          <MenuContent className="min-w-(--trigger-width) sm:min-w-56" items={COUNTRIES}>
            {(item) => (
              <MenuItem id={item.slug} textValue={item.slug} href={item.slug}>
                {item.name}
              </MenuItem>
            )}
          </MenuContent>
        </Menu>

        <Menu>
          <NavbarItem>
            Collections
            <CaretDown className="col-start-2" />
          </NavbarItem>
          <MenuContent className="min-w-(--trigger-width) sm:min-w-56" items={COLLECTIONS}>
            {(item) => (
              <MenuItem id={item.slug} textValue={item.slug} href={item.slug} className="flex items-center space-x-2">
                <item.icon className="h-4 w-4 text-yellow-400" />
                <span>{item.name}</span>
              </MenuItem>
            )}
          </MenuContent>
        </Menu>
      </NavbarSection>
      <NavbarSpacer />
      {/* Right Side */}
      <NavbarSection>
        {/* Search */}
        <div className="relative">
          {isSearchOpen ? (
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search movies..."
                className="w-64 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          ) : (
            <Button
              intent="plain"
              size="sq-md"
              onClick={() => setIsSearchOpen(true)}
              className="text-white/80 hover:text-white hover:bg-white/10 transition-all hover:scale-105"
            >
              <MagnifyingGlass className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* User Menu */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                intent="plain"
                size="sq-md"
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all hover:scale-105"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-black/90 border-white/20 backdrop-blur-xl" align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="text-white hover:text-blue-400">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/my-list" className="text-white hover:text-blue-400">
                  My List
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="text-white hover:text-blue-400">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem asChild>
                <Link href="/sign-out" className="text-white hover:text-red-400">
                  Sign Out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            intent="primary"
            size="sm"
          >
            <Link href="/sign-in">
              Sign In
            </Link>
          </Button>
        )}

        {/* Mobile Menu Button */}
        <Button
          intent="plain"
          size="sq-md"
          className="lg:hidden text-white/80 hover:text-white hover:bg-white/10"
        >
          <List className="h-5 w-5" />
        </Button>
      </NavbarSection>
    </Navbar>
  );
}
