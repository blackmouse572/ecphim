"use client";

import {
  Anchor,
  BookOpen,
  ChartPie,
  DotsThree,
  Folder,
  FrameCorners,
  GearSix,
  Lifebuoy,
  MapTrifold,
  PaperPlaneTilt,
  Robot,
  Share,
  SignIn,
  Terminal,
  Trash,
} from "@phosphor-icons/react";
import type { AuthProfile } from "@repo/auth/typed";
import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Button } from "@repo/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/design-system/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarDisclosure,
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
  SidebarFooter,
  SidebarInset,
  SidebarItem,
  SidebarMenuTrigger,
  SidebarSection,
} from "@repo/design-system/components/ui/sidebar";
import { NotificationsTrigger } from "@repo/notifications/components/trigger";
import Link from "next/link";
import type { ReactNode } from "react";
import { AuthUserMenu } from "./auth-user-menu";
import { Search } from "./search";

type GlobalSidebarProperties = {
  readonly children: ReactNode;
  readonly user?: AuthProfile | null;
};

const data = {
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: Terminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Robot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: GearSix,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Webhooks",
      url: "/webhooks",
      icon: Anchor,
    },
    {
      title: "Support",
      url: "#",
      icon: Lifebuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: PaperPlaneTilt,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: FrameCorners,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: ChartPie,
    },
    {
      name: "Travel",
      url: "#",
      icon: MapTrifold,
    },
  ],
};

export const GlobalSidebar = ({ children, user }: GlobalSidebarProperties) => {
  return (
    <>
      <Sidebar intent="inset">
        <Search />
        <SidebarContent>
          <SidebarSection label="Platform">
            {data.navMain.map((item) => (
              <SidebarDisclosure
                key={item.title}
                defaultExpanded={item.isActive}
              >
                <SidebarDisclosureTrigger>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarDisclosureTrigger>
                <SidebarDisclosurePanel>
                  {item.items?.map((subItem) => (
                    <SidebarItem key={subItem.title} href={subItem.url}>
                      {subItem.title}
                    </SidebarItem>
                  ))}
                </SidebarDisclosurePanel>
              </SidebarDisclosure>
            ))}
          </SidebarSection>

          <SidebarSection label="Projects">
            {data.projects.map((item) => (
              <SidebarItem key={item.name} href={item.url}>
                <item.icon />
                <span>{item.name}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuTrigger alwaysVisible>
                      <DotsThree />
                      <span className="sr-only">More</span>
                    </SidebarMenuTrigger>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48"
                    side="bottom"
                  >
                    <DropdownMenuItem>
                      <Folder className="text-muted-foreground" />
                      <span>View Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="text-muted-foreground" />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash className="text-muted-foreground" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarItem>
            ))}
            <SidebarItem>
              <DotsThree />
              <span>More</span>
            </SidebarItem>
          </SidebarSection>

          <SidebarSection className="mt-auto">
            {data.navSecondary.map((item) => (
              <SidebarItem key={item.title} href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </SidebarItem>
            ))}
          </SidebarSection>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex flex-col gap-2 p-2">
            <div className="flex items-center gap-2">
              <ModeToggle />
              {user ? (
                <NotificationsTrigger />
              ) : (
                <Link
                  className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
                  href="/sign-in"
                >
                  <SignIn className="h-4 w-4" />
                  <span>Sign in</span>
                </Link>
              )}
            </div>
            {user ? <AuthUserMenu user={user} /> : null}
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </>
  );
};
