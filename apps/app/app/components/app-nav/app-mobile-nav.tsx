import { ListIcon as MenuIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import * as React from "react";
import { Portal, PortalBackdrop } from "./portal";
export function MobileNav(props: {
  navLinks: {
    label: string;
    href: string;
  }[];
}) {
  const { navLinks } = props;
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
              "size-full p-4",
            )}
            data-slot={open ? "open" : "closed"}
          >
            <Button
              aria-controls="mobile-menu"
              aria-expanded={open}
              aria-label="Toggle menu"
              className="-top-10 absolute right-4 md:hidden"
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
            <div className="grid gap-y-2">
              {navLinks.map((link) => (
                <Button
                  className="justify-start"
                  key={link.label}
                  intent="plain"
                >
                  <a href={link.href}>{link.label}</a>
                </Button>
              ))}
            </div>
            <div className="mt-12 flex flex-col gap-2">
              <Button className="w-full" intent="outline">
                Đăng nhập
              </Button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
