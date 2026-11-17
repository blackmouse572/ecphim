"use client";

import { MIN_PASSWORD_LENGTH } from "@repo/auth/config";
import { createClient, resetPassword } from "@repo/auth/client";
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
import { type FormEvent, useState } from "react";

const invalidLinkMessage =
  "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.";

// better-auth redirects here with ?token=... or ?error=INVALID_TOKEN.
const errorMessages: Record<string, string> = {
  INVALID_TOKEN: invalidLinkMessage,
  invalid_or_expired_link: invalidLinkMessage,
};

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [authClient] = useState(createClient);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const isReady = Boolean(token);

  const urlError = searchParams.get("error");
  const errorMessage =
    error ?? (urlError ? (errorMessages[urlError] ?? urlError) : null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("Hãy mở liên kết đặt lại mật khẩu từ email của bạn.");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsPending(true);

    const { error: updateError } = await resetPassword(authClient, {
      token,
      newPassword: password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsPending(false);
      return;
    }

    setIsSuccess(true);
    setIsPending(false);

    // Resetting revokes every session, so the user signs in with the new
    // password.
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
              Hãy mở liên kết đặt lại mật khẩu trong email, hoặc yêu cầu liên
              kết mới tại{" "}
              <Link
                className="text-primary hover:underline"
                href="/forgot-password"
              >
                trang quên mật khẩu
              </Link>
              .
            </div>
          )}
          <Input
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mật khẩu mới"
            required
            type="password"
            value={password}
          />
          <Input
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
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
