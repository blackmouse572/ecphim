"use client";

import { ListIcon } from "@phosphor-icons/react/ssr";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design-system/components/base/accordion";
import { Button } from "@repo/design-system/components/base/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@repo/design-system/components/base/sheet";
import Link from "next/link";
import { useState } from "react";
import { CATEGORIES } from "./data";

const chip =
  "squircle flex min-h-10 items-center rounded-(--radius-squircle-sm) bg-foreground/5 px-3 text-sm text-foreground/85 outline-none transition-[background-color,transform] duration-100 ease-out hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97] motion-reduce:active:scale-100";

/**
 * The phone and tablet menu: a sheet from the right with the browse links up
 * top and the category and country lists folded underneath. Choosing a link
 * closes it.
 */
export function MobileNav(props: {
  navLinks: { label: string; href: string }[];
  countries?: Array<{ name: string; slug: string }>;
}) {
  const { navLinks, countries } = props;
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger
        render={
          <Button
            aria-label="Mở menu"
            className="lg:hidden"
            size="icon-lg"
            variant="ghost"
          />
        }
      >
        <ListIcon aria-hidden className="size-5" weight="bold" />
      </SheetTrigger>
      <SheetContent
        className="w-full gap-0 overflow-y-auto overscroll-contain p-0 data-[side=right]:w-full sm:data-[side=right]:max-w-sm"
        side="right"
      >
        <div className="sticky top-0 z-10 flex h-14 items-center bg-popover px-5">
          <SheetTitle className="font-semibold text-base tracking-[-0.01em]">
            Menu
          </SheetTitle>
        </div>

        <nav aria-label="Duyệt phim" className="grid gap-1 px-3 pb-2">
          {navLinks.map((link) => (
            <Link
              className="squircle flex min-h-11 items-center rounded-(--radius-squircle-sm) px-3 font-medium text-[0.9375rem] outline-none transition-[background-color,transform] duration-100 ease-out hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98] motion-reduce:active:scale-100"
              href={link.href}
              key={link.href}
              onClick={close}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Accordion className="px-5 pb-4">
          <AccordionItem
            className="border-foreground/8 border-t"
            value="category"
          >
            <AccordionTrigger className="py-4 text-[0.9375rem] hover:no-underline">
              Thể loại
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-2 gap-2 pb-4 [&_a]:no-underline">
              {CATEGORIES.map((category) => (
                <Link
                  className={chip}
                  href={`/discover?ctg=${category.slug}`}
                  key={category.slug}
                  onClick={close}
                >
                  {category.name}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
          {countries?.length ? (
            <AccordionItem
              className="border-foreground/8 border-t"
              value="country"
            >
              <AccordionTrigger className="py-4 text-[0.9375rem] hover:no-underline">
                Quốc gia
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-2 gap-2 pb-4 [&_a]:no-underline">
                {countries.map((country) => (
                  <Link
                    className={chip}
                    href={`/discover?cntry=${country.slug}`}
                    key={country.slug}
                    onClick={close}
                  >
                    {country.name}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          ) : null}
        </Accordion>

        <div className="mt-auto border-foreground/8 border-t p-5">
          <Button
            className="w-full"
            nativeButton={false}
            render={<Link href="/sign-in" onClick={close} />}
            size="xl"
          >
            Đăng nhập
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
