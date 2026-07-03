"use client";

import { SignOut, UserCircle } from "@phosphor-icons/react";
import { createClient, signOut } from "@repo/auth/client";
import type { AuthProfile } from "@repo/auth/typed";
import { Avatar } from "@repo/design-system/components/ui/avatar";
import { Button } from "@repo/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/design-system/components/ui/dropdown-menu";
import { getUserInitials } from "@repo/auth/typed";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { avatarOptions } from "@/lib/auth/avatar-options";

type AuthUserMenuProps = {
  user: AuthProfile;
};

export const AuthUserMenu = ({ user }: AuthUserMenuProps) => {
  const [supabase] = useState(createClient);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const avatarOption = useMemo(
    () => avatarOptions.find((avatar) => avatar.id === user.avatar),
    [user.avatar],
  );

  const handleSignOut = async () => {
    setIsPending(true);

    const { error } = await signOut(supabase);

    if (error) {
      setIsPending(false);
      toast.error(error.message);
      return;
    }

    router.replace("/sign-in");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-auto w-full justify-start gap-3 px-2 py-2"
          intent="plain"
          isPending={isPending}
        >
          <Avatar
            alt={user.name}
            initials={avatarOption?.initials ?? getUserInitials(user.name)}
            size="md"
            src={avatarOption?.imagePath ?? null}
          />
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate font-medium text-sm">{user.name}</span>
            <span className="block truncate text-muted-foreground text-xs">
              {user.email}
            </span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/account">
            <UserCircle />
            <span>Cài đặt tài khoản</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void handleSignOut()}>
          <SignOut />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
