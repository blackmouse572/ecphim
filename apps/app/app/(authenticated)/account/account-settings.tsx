"use client";

import {
  createClient,
  updatePassword,
  updateProfile,
} from "@repo/auth/client";
import type { AuthProfile } from "@repo/auth/typed";
import { Avatar } from "@repo/design-system/components/ui/avatar";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Input } from "@repo/design-system/components/ui/input";
import { cn } from "@repo/design-system/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";
import { avatarOptions } from "@/lib/auth/avatar-options";

type AccountSettingsProps = {
  initialProfile: AuthProfile;
};

export const AccountSettings = ({ initialProfile }: AccountSettingsProps) => {
  const [supabase] = useState(createClient);
  const router = useRouter();
  const [name, setName] = useState(initialProfile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(initialProfile.avatar ?? "");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const avatarPreview = useMemo(
    () => avatarOptions.find((avatar) => avatar.id === selectedAvatar),
    [selectedAvatar],
  );

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileError(null);

    const trimmedName = name.trim();

    if (!trimmedName) {
      setProfileError("Vui lòng nhập họ và tên.");
      return;
    }

    setIsSavingProfile(true);

    const { error } = await updateProfile(supabase, {
      name: trimmedName,
      avatar: selectedAvatar || null,
    });

    if (error) {
      setProfileError(error.message);
      setIsSavingProfile(false);
      return;
    }

    toast.success("Đã cập nhật thông tin.");
    setIsSavingProfile(false);
    router.refresh();
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSecurityError(null);

    if (password.length < 6) {
      setSecurityError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setSecurityError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsSavingPassword(true);

    const { error } = await updatePassword(supabase, password);

    if (error) {
      setSecurityError(error.message);
      setIsSavingPassword(false);
      return;
    }

    setPassword("");
    setConfirmPassword("");
    toast.success("Đã cập nhật mật khẩu.");
    setIsSavingPassword(false);
    router.refresh();
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>
            Cập nhật cách tài khoản hiển thị trong ứng dụng.
          </CardDescription>
        </CardHeader>
        <form className="space-y-6" onSubmit={handleProfileSubmit}>
          <CardContent className="space-y-6">
            {profileError && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-destructive text-sm">
                {profileError}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
              <Avatar
                alt={name}
                initials={avatarPreview?.initials ?? initialProfile.name.slice(0, 2)}
                size="4xl"
                src={avatarPreview?.imagePath ?? null}
              />
              <div className="space-y-2">
                <p className="font-medium text-sm">Thông tin tài khoản</p>
                <Input
                  autoComplete="name"
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Họ và tên"
                  required
                  type="text"
                  value={name}
                />
                <Input disabled type="email" value={initialProfile.email ?? ""} />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-sm">Avatar mặc định</p>
                <p className="text-muted-foreground text-sm">
                  Đây là danh sách placeholder để bạn thay thế bằng avatar thật sau này.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {avatarOptions.map((avatar) => (
                  <button
                    type="button"
                    key={avatar.id}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border px-3 py-4 transition-colors",
                      selectedAvatar === avatar.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40",
                    )}
                    onClick={() => setSelectedAvatar(avatar.id)}
                  >
                    <Avatar
                      alt={avatar.label}
                      initials={avatar.initials}
                      size="xl"
                      src={avatar.imagePath}
                    />
                    <span className="text-center text-sm">{avatar.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full sm:w-auto" isPending={isSavingProfile} type="submit">
              Lưu thông tin
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mật khẩu</CardTitle>
          <CardDescription>
            Đổi mật khẩu cho phiên đăng nhập hiện tại.
          </CardDescription>
        </CardHeader>
        <form className="space-y-6" onSubmit={handlePasswordSubmit}>
          <CardContent className="space-y-4">
            {securityError && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-destructive text-sm">
                {securityError}
              </div>
            )}
            <Input
              autoComplete="new-password"
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mật khẩu mới"
              required
              type="password"
              value={password}
            />
            <Input
              autoComplete="new-password"
              minLength={6}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Xác nhận mật khẩu mới"
              required
              type="password"
              value={confirmPassword}
            />
          </CardContent>
          <CardFooter>
            <Button className="w-full" isPending={isSavingPassword} type="submit">
              Cập nhật mật khẩu
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
