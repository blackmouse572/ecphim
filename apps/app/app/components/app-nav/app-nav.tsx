"use client";
import { Button } from "@repo/design-system/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@repo/design-system/components/ui/navigation-menu";
import { buttonStyles } from "@repo/design-system/components/variants/buttonVariants";
import { useScroll } from "@repo/design-system/hooks/use-scroll";
import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
import { Logo } from "../logo";
import { MobileNav } from "./app-mobile-nav";

export const navLinks = [
  {
    label: "Features",
    href: "#1",
  },
  {
    label: "Pricing",
    href: "#2",
  },
  {
    label: "About",
    href: "#3",
  },
];

export function Header() {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 mx-auto w-full max-w-lvw border-transparent border-b md:rounded-lg md:border md:transition-all md:ease-out",
        {
          "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-3xl md:shadow-md":
            scrolled,
        },
      )}
    >
      <NavigationMenu
        className={cn(
          "flex h-24 w-full items-center justify-between px-2.5 md:h-14 md:transition-all md:ease-out",
          {
            "md:px-2": scrolled,
          },
        )}
      >
        <NavigationMenuList className="w-[100px] gap-1">
          <Link
            className="rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50"
            href="/"
          >
            <Logo />
          </Link>
        </NavigationMenuList>
        <NavigationMenuList className="hidden items-center gap-4 md:flex">
          {navLinks.map((link) => (
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
          ))}
        </NavigationMenuList>
        <NavigationMenuList className="hidden w-[100px] items-center gap-2 md:flex">
          <Button size="sm">Login</Button>
        </NavigationMenuList>
        <MobileNav navLinks={navLinks} />
      </NavigationMenu>
    </header>
  );
}
