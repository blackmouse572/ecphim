"use client";
import {
  Bomb,
  Books,
  Clock,
  Compass,
  Crown,
  FilmStrip,
  Flask,
  Gavel,
  Ghost,
  Heart,
  House,
  Lightbulb,
  Lightning,
  MagnifyingGlass,
  MusicNote,
  SmileyXEyes,
  Sparkle,
  Trophy,
} from "@phosphor-icons/react/ssr";
import { Button } from "@repo/design-system/components/ui/button";
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
import { Logo } from "../logo";
import { MobileNav } from "./app-mobile-nav";

export const navLinks = [
  {
    label: "Khám phá",
    href: "/discover",
  },
  {
    label: "Phim lẻ",
    href: "/discover/phim-le",
  },
  {
    label: "Phim bộ",
    href: "/discover/phim-bo",
  },
  {
    label: "TV Show",
    href: "/discover/tv-show",
  },
  {
    label: "Anime",
    href: "/discover/anime",
  },
];

export const categories = [
  {
    name: "Hành Động",
    slug: "hanh-dong",
    icon: Lightning,
  },
  {
    name: "Tình Cảm",
    slug: "tinh-cam",
    icon: Heart,
  },
  {
    name: "Hài Hước",
    slug: "hai-huoc",
    icon: SmileyXEyes,
  },
  {
    name: "Cổ Trang",
    slug: "co-trang",
    icon: Clock,
  },
  {
    name: "Tâm Lý",
    slug: "tam-ly",
    icon: Lightbulb,
  },
  {
    name: "Hình Sự",
    slug: "hinh-su",
    icon: Gavel,
  },
  {
    name: "Chiến Tranh",
    slug: "chien-tranh",
    icon: Bomb,
  },
  {
    name: "Thể Thao",
    slug: "the-thao",
    icon: Trophy,
  },
  {
    name: "Võ Thuật",
    slug: "vo-thuat",
    icon: Lightning,
  },
  {
    name: "Viễn Tưởng",
    slug: "vien-tuong",
    icon: Sparkle,
  },
  {
    name: "Phiêu Lưu",
    slug: "phieu-luu",
    icon: Compass,
  },
  {
    name: "Khoa Học",
    slug: "khoa-hoc",
    icon: Flask,
  },
  {
    name: "Kinh Dị",
    slug: "kinh-di",
    icon: Ghost,
  },
  {
    name: "Âm Nhạc",
    slug: "am-nhac",
    icon: MusicNote,
  },
  {
    name: "Thần Thoại",
    slug: "than-thoai",
    icon: Crown,
  },
  {
    name: "Tài Liệu",
    slug: "tai-lieu",
    icon: FilmStrip,
  },
  {
    name: "Gia Đình",
    slug: "gia-dinh",
    icon: House,
  },
  {
    name: "Chính kịch",
    slug: "chinh-kich",
    icon: FilmStrip,
  },
  {
    name: "Bí ẩn",
    slug: "bi-an",
    icon: MagnifyingGlass,
  },
  {
    name: "Học Đường",
    slug: "hoc-duong",
    icon: Books,
  },
  {
    name: "Kinh Điển",
    slug: "kinh-dien",
    icon: Books,
  },
  {
    name: "Short Drama",
    slug: "short-drama",
    icon: FilmStrip,
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
          "border-fg/15 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-3xl md:shadow-md":
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
                "text-muted-foreground hover:bg-transparent hover:text-foreground",
            })}
          >
            <NavigationMenuTrigger>Thể loại</NavigationMenuTrigger>
            <NavigationMenuContent
              className={cn(
                "!mt-0 !bg-transparent grid w-full grid-cols-5 gap-4 py-4",
              )}
            >
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <NavigationMenuLink
                    href={`/categories/${category.slug}`}
                    key={category.slug}
                    className="flex flex-col items-center gap-2 rounded-md p-2 hover:bg-primary-subtle"
                    style={
                      {
                        // width:
                        // "calc((var(--radix-navigation-menu-viewport-width) - 4rem - 1rem) / 5",
                      }
                    }
                  >
                    <IconComponent weight="fill" className="h-4 w-4" />
                    <span className="text-center text-xs">{category.name}</span>
                  </NavigationMenuLink>
                );
              })}
            </NavigationMenuContent>
          </NavigationMenuItem>
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
      <Button size="sm">Login</Button>
    </header>
  );
}
