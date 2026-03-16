"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@repo/design-system/components/ui/navigation-menu";
import { buttonStyles } from "@repo/design-system/components/variants/buttonVariants";
import { useScroll } from "@repo/design-system/hooks/use-scroll";
import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
import { GlobalSearch } from "../global-search";
import { Logo } from "../logo";
import { MobileNav } from "./app-mobile-nav";
import { CATEGORIES } from "./data";
import { LoginBtn } from "./login-btn";

export const navLinks = [
  {
    label: "Khám phá",
    href: "/discover",
  },
  {
    label: "Phim lẻ",
    href: "/discover?clt=phim-le",
  },
  {
    label: "Phim bộ",
    href: "/discover?clt=phim-bo",
  },
  {
    label: "TV Show",
    href: "/discover?clt=tv-shows",
  },
  {
    label: "Anime",
    href: "/discover?clt=hoat-hinh",
  },
];

interface User {
  id: string;
  email?: string;
  name?: string;
}
type HeaderProps = {
  user?: User | null;
  years?: Array<{ name: string; slug: string }>;
  countries?: Array<{ name: string; slug: string }>;
};
export function Header(props: HeaderProps) {
  const scrolled = useScroll(10);
  return (
    <header
      className={cn(
        "sticky top-0 z-50 mx-auto flex w-full max-w-lvw items-center justify-between border-transparent border-b px-2.5 md:rounded-lg md:border md:transition-all md:ease-out",
        {
          "border-fg/15 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-5xl md:shadow-md":
            scrolled,
        },
      )}
    >
      <Link href="/">
        <Logo />
      </Link>
      <NavigationMenu
        viewport={false}
        className={cn(
          "flex h-24 w-full items-center justify-between md:h-14 md:transition-all md:ease-out",
          {
            "md:px-2": scrolled,
          },
        )}
        data-viewport={true}
      >
        <NavigationMenuList className="hidden items-center md:flex">
          <NavigationMenuItem
            className={buttonStyles({
              intent: "plain",
              className:
                "px-0 text-muted-foreground hover:bg-transparent hover:text-foreground",
            })}
          >
            <NavigationMenuTrigger>Thể loại</NavigationMenuTrigger>
            <NavigationMenuContent
              className={cn(
                "!mt-0 !bg-transparent grid w-full grid-cols-5 gap-4 py-4",
              )}
            >
              {CATEGORIES.map((category) => {
                const IconComponent = category.icon;
                return (
                  <NavigationMenuLink
                    href={`/discover?ctg=${category.name}`}
                    key={category.slug}
                    className="flex flex-col items-center gap-2 rounded-md p-2 hover:bg-primary-subtle"
                  >
                    <IconComponent weight="fill" className="h-4 w-4" />
                    <span className="text-center text-xs">{category.name}</span>
                  </NavigationMenuLink>
                );
              })}
            </NavigationMenuContent>
          </NavigationMenuItem>
          {props.countries && (
            <NavigationMenuItem
              className={buttonStyles({
                intent: "plain",
                className:
                  "px-0 text-muted-foreground hover:bg-transparent hover:text-foreground",
              })}
            >
              <NavigationMenuTrigger>Quốc gia</NavigationMenuTrigger>
              <NavigationMenuContent
                className={cn(
                  "!mt-0 !bg-transparent grid w-full grid-cols-5 gap-4 py-4",
                )}
              >
                {props.countries.map((country) => (
                  <NavigationMenuLink
                    href={`/discover?cntry=${country.slug}`}
                    key={country.slug}
                    className="flex flex-col items-center gap-2 rounded-md p-2 hover:bg-primary-subtle"
                  >
                    <span className="text-center text-xs">{country.name}</span>
                  </NavigationMenuLink>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
          {scrolled ? (
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={buttonStyles({
                  intent: "plain",
                  className:
                    "text-muted-foreground hover:bg-transparent hover:text-foreground",
                })}
              >
                Khám phá
              </NavigationMenuTrigger>
              <NavigationMenuContent className="!mt-0 !bg-transparent grid grid-cols-3 gap-4 py-4">
                {navLinks.map((link) => (
                  <NavigationMenuLink
                    href={link.href}
                    key={link.href}
                    className="rounded-md px-3 py-2 hover:bg-primary-subtle"
                  >
                    {link.label}
                  </NavigationMenuLink>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            navLinks.map((link) => (
              <NavigationMenuItem
                asChild
                key={link.href}
                className={buttonStyles({
                  intent: "plain",
                  className:
                    "text-muted-foreground hover:bg-transparent hover:text-foreground",
                })}
              >
                <Link href={link.href}>{link.label}</Link>
              </NavigationMenuItem>
            ))
          )}
          <NavigationMenuViewport className="min-w-3xl" />
        </NavigationMenuList>
        <MobileNav navLinks={navLinks} />
      </NavigationMenu>
      <div className="flex items-center gap-2">
        <GlobalSearch />
        <LoginBtn />
      </div>
    </header>
  );
}
