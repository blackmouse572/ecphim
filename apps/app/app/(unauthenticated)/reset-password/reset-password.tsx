"use client";

import {
  createClient,
  getCurrentUser,
  signOut,
  updatePassword,
} from "@repo/auth/client";
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
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

const errorMessages: Record<string, string> = {
  invalid_or_expired_link: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
};

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [supabase] = useState(createClient);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const user = await getCurrentUser(supabase);

      if (!isMounted) {
        return;
      }

      setIsReady(Boolean(user));
    };

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const urlError = searchParams.get("error");
  const errorMessage = error ?? (urlError ? errorMessages[urlError] ?? urlError : null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!isReady) {
      setError("Hãy mở liên kết đặt lại mật khẩu từ email của bạn.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsPending(true);

    const { error: updateError } = await updatePassword(supabase, password);

    if (updateError) {
      setError(updateError.message);
      setIsPending(false);
      return;
    }

    setIsSuccess(true);
    setIsPending(false);

    // End the recovery session so the user re-authenticates with the new
    // password. Without this they'd stay logged in and /sign-in (guest-only)
    // would bounce them straight to /account.
    await signOut(supabase);
    router.replace("/sign-in");
    router.refresh();
  };

  return (
    <Card className="mx-auto w-full max-w-md bg-background shadow-primary/50 shadow-sm">
      <CardHeader>
        <CardTitle>Đặt lại mật khẩu</CardTitle>
        <CardDescription>
          Chọn mật khẩu mới để khôi phục tài khoản.
        </CardDescription>
      </CardHeader>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-destructive text-sm">
              {errorMessage}
            </div>
          )}
          {isSuccess && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-primary text-sm">
              Mật khẩu đã được cập nhật. Đang chuyển đến trang đăng nhập...
            </div>
          )}
          {!isReady && !isSuccess && (
            <div className="rounded-lg border px-3 py-2 text-muted-foreground text-sm">
              Hãy mở liên kết đặt lại mật khẩu trong email, hoặc yêu cầu liên kết mới tại{" "}
              <Link className="text-primary hover:underline" href="/forgot-password">
                trang quên mật khẩu
              </Link>
              .
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
          <Button className="w-full" isPending={isPending} type="submit">
            Cập nhật mật khẩu
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
