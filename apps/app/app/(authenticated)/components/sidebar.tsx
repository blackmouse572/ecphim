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
  SignOut,
  Terminal,
  Trash,
} from "@phosphor-icons/react";
import { authClient } from "@repo/auth/client";
import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Avatar } from "@repo/design-system/components/ui/avatar";
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
  useSidebar,
} from "@repo/design-system/components/ui/sidebar";
import { NotificationsTrigger } from "@repo/notifications/components/trigger";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Search } from "./search";

type User = {
  id: string;
  name?: string | null;
  email?: string;
  image?: string | null;
} | null;

type GlobalSidebarProperties = {
  readonly children: ReactNode;
  readonly user?: User;
};

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
  const sidebar = useSidebar();
  const router = useRouter();
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setLogoutError(null);
    const { error } = await authClient.signOut();
    if (error) {
      setLogoutError(error.message ?? "Unable to logout");
      return;
    }
    router.push("/sign-in");
    router.refresh();
  };

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
          <div className="flex items-center gap-2 p-2">
            <div className="flex shrink-0 items-center gap-px">
              <ModeToggle />
              {user ? (
                <>
                  <Button className="shrink-0" size="sq-sm" intent="plain">
                    <div className="h-4 w-4">
                      <NotificationsTrigger />
                    </div>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="h-8 w-auto gap-2 px-2"
                        size="sm"
                        intent="plain"
                      >
                        <Avatar
                          alt={user.name ?? user.email ?? "User"}
                          className="h-6 w-6"
                          initials={(user.name ?? user.email ?? "U")
                            .slice(0, 2)
                            .toUpperCase()}
                          src={user.image ?? undefined}
                        />
                        <span className="max-w-28 truncate text-xs">
                          {user.name ?? user.email}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5">
                        <p className="truncate font-medium text-sm">
                          {user.name ?? "User"}
                        </p>
                        <p className="truncate text-muted-foreground text-xs">
                          {user.email}
                        </p>
                        {logoutError && (
                          <p className="mt-1 truncate text-destructive text-xs">
                            {logoutError}
                          </p>
                        )}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <SignOut className="text-muted-foreground" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  className="shrink-0"
                  size="sq-sm"
                  intent="plain"
                  aria-label="Sign in"
                >
                  <Link href="/sign-in">
                    <SignIn className="h-4 w-4" />
                    <span className="sr-only">Sign in</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </>
  );
};
