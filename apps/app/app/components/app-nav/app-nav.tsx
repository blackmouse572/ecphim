"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@repo/design-system/components/base/navigation-menu";
import { useScroll } from "@repo/design-system/hooks/use-scroll";
import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
import { GlobalSearch } from "../global-search";
import { Logo } from "../logo";
import { MobileNav } from "./app-mobile-nav";
import { CATEGORIES } from "./data";
import { LoginBtn } from "./login-btn";

export const navLinks = [
  { label: "Khám phá", href: "/discover" },
  { label: "Phim lẻ", href: "/discover?clt=phim-le" },
  { label: "Phim bộ", href: "/discover?clt=phim-bo" },
  { label: "TV Show", href: "/discover?clt=tv-shows" },
  { label: "Anime", href: "/discover?clt=hoat-hinh" },
];

const plainLink = cn(
  navigationMenuTriggerStyle(),
  "bg-transparent text-muted-foreground hover:bg-foreground/5 hover:text-foreground focus:bg-foreground/5",
);
const menuLink =
  "rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground";

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

/**
 * The site header. It keeps one shape and height at every scroll position. Once
 * the page scrolls, a translucent material and a hairline fade in behind it
 * (solid when the reader asks for reduced transparency).
 */
export function Header(props: HeaderProps) {
  const scrolled = useScroll(8);
  return (
    <header
      className="sticky top-0 z-50 border-transparent border-b transition-[background-color,border-color] duration-200 ease-out data-[scrolled=true]:border-foreground/8 data-[scrolled=true]:bg-background/72 reduce-transparency:data-[scrolled=true]:bg-background data-[scrolled=true]:backdrop-blur-xl reduce-transparency:data-[scrolled=true]:backdrop-blur-none data-[scrolled=true]:backdrop-saturate-150"
      data-scrolled={scrolled}
    >
      <div className="container mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 md:px-6 lg:gap-6">
        <Link
          aria-label="EcPhim, trang chủ"
          className="shrink-0 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          href="/"
        >
          <Logo />
        </Link>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-0.5">
            <NavigationMenuItem>
              <NavigationMenuTrigger className={plainLink}>
                Thể loại
              </NavigationMenuTrigger>
              <NavigationMenuContent className="grid w-[34rem] grid-cols-4 gap-0.5 p-2">
                {CATEGORIES.map((category) => (
                  <NavigationMenuLink
                    className={menuLink}
                    key={category.slug}
                    render={<Link href={`/discover?ctg=${category.slug}`} />}
                  >
                    {category.name}
                  </NavigationMenuLink>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
            {props.countries?.length ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger className={plainLink}>
                  Quốc gia
                </NavigationMenuTrigger>
                <NavigationMenuContent className="grid max-h-[60vh] w-[34rem] grid-cols-4 gap-0.5 overflow-y-auto overscroll-contain p-2">
                  {props.countries.map((country) => (
                    <NavigationMenuLink
                      className={menuLink}
                      key={country.slug}
                      render={<Link href={`/discover?cntry=${country.slug}`} />}
                    >
                      {country.name}
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : null}
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  className={plainLink}
                  render={<Link href={link.href} />}
                >
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-2">
          <GlobalSearch />
          <LoginBtn />
          <MobileNav countries={props.countries} navLinks={navLinks} />
        </div>
      </div>
    </header>
  );
}
