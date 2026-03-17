import { ListIcon as MenuIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  DisclosureTrigger,
} from "@repo/design-system/components/ui/disclosure-group";
import { buttonStyles } from "@repo/design-system/components/variants/buttonVariants";
import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
import * as React from "react";
import { CATEGORIES } from "./data";
import { Portal, PortalBackdrop } from "./portal";
export function MobileNav(props: {
  navLinks: {
    label: string;
    href: string;
  }[];
  years?: Array<{ name: string; slug: string }>;
  countries?: Array<{ name: string; slug: string }>;
}) {
  const { navLinks, countries, years } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="md:hidden"
        onClick={() => setOpen(!open)}
        size="sq-md"
        intent="outline"
      >
        {open ? (
          <XIcon className="size-4.5" />
        ) : (
          <MenuIcon className="size-4.5" />
        )}
      </Button>
      {/** biome-ignore lint/nursery/noLeakedRender: <explanation> */}
      {open && (
        <Portal className="top-14" id="mobile-menu">
          <PortalBackdrop />
          <div
            className={cn(
              "data-[slot=open]:zoom-in-97 relative ease-out data-[slot=open]:animate-in data-[slot=open]:blur-in",
              "flex size-full flex-col overflow-y-auto p-4",
            )}
            data-slot={open ? "open" : "closed"}
          >
            <div className="flex-1">
              <DisclosureGroup className="grid gap-y-2">
                <Disclosure id="discover">
                  <DisclosureTrigger>Xem gì hôm nay</DisclosureTrigger>
                  <DisclosurePanel>
                    {navLinks.map((link) => (
                      <Button
                        className="w-full justify-start"
                        key={link.label}
                        intent="plain"
                      >
                        <Link href={link.href}>{link.label}</Link>
                      </Button>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <Disclosure id="category">
                  <DisclosureTrigger>Thể loại</DisclosureTrigger>
                  <DisclosurePanel className="gap-2 space-x-2">
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map((link) => {
                        const IconComponent = link.icon;
                        return (
                          <Link
                            key={link.slug}
                            href={`/discover?ctg=${link.slug}`}
                            className={buttonStyles({
                              intent: "outline",
                              className: "bg-muted",
                            })}
                          >
                            <IconComponent weight="duotone" />
                            {link.name}
                          </Link>
                        );
                      })}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
                <Disclosure id="country">
                  <DisclosureTrigger>Quốc gia</DisclosureTrigger>
                  <DisclosurePanel className="gap-2 space-x-2">
                    <div className="grid grid-cols-2 gap-2">
                      {countries?.map((link) => {
                        return (
                          <Link
                            key={link.slug}
                            href={`/discover?cntry=${link.slug}`}
                            className={buttonStyles({
                              intent: "outline",
                              className: "bg-muted",
                            })}
                          >
                            {link.name}
                          </Link>
                        );
                      })}
                    </div>
                  </DisclosurePanel>
                </Disclosure>{" "}
                <Disclosure id="years">
                  <DisclosureTrigger>Năm</DisclosureTrigger>
                  <DisclosurePanel className="gap-2 space-x-2">
                    <div className="grid grid-cols-4 gap-2">
                      {years?.map((link) => {
                        return (
                          <Link
                            key={link.slug}
                            href={`/discover?cntry=${link.slug}`}
                            className={buttonStyles({
                              intent: "outline",
                              className: "bg-muted",
                            })}
                          >
                            {link.name}
                          </Link>
                        );
                      })}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              </DisclosureGroup>
            </div>
            <div className="mt-12 flex flex-col gap-2">
              <Button className="w-full">Đăng nhập</Button>
              <Button
                aria-controls="mobile-menu"
                aria-expanded={open}
                aria-label="Toggle menu"
                className="bg-muted"
                onClick={() => setOpen(!open)}
                intent="outline"
              >
                {open ? (
                  <XIcon className="size-4.5" />
                ) : (
                  <MenuIcon className="size-4.5" />
                )}
                Đóng
              </Button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
