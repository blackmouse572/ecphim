"use client";

import { createClient, resetPassword } from "@repo/auth/client";
import { MIN_PASSWORD_LENGTH } from "@repo/auth/config";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import {
  AuthAlert,
  AuthCard,
  AuthField,
  AuthLink,
  AuthSubmit,
} from "../components/auth-ui";

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
    <AuthCard
      description="Chọn mật khẩu mới để khôi phục tài khoản."
      title="Đặt lại mật khẩu"
    >
      {errorMessage ? <AuthAlert>{errorMessage}</AuthAlert> : null}
      {isSuccess ? (
        <AuthAlert tone="success">
          Mật khẩu đã được cập nhật. Đang chuyển đến trang đăng nhập...
        </AuthAlert>
      ) : null}
      {!isReady && !isSuccess ? (
        <AuthAlert tone="info">
          Hãy mở liên kết đặt lại mật khẩu trong email, hoặc yêu cầu liên kết
          mới tại{" "}
          <AuthLink href="/forgot-password">trang quên mật khẩu</AuthLink>.
        </AuthAlert>
      ) : null}
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <AuthField
          autoComplete="new-password"
          label="Mật khẩu mới"
          minLength={MIN_PASSWORD_LENGTH}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={`Ít nhất ${MIN_PASSWORD_LENGTH} ký tự`}
          required
          type="password"
          value={password}
        />
        <AuthField
          autoComplete="new-password"
          label="Xác nhận mật khẩu mới"
          minLength={MIN_PASSWORD_LENGTH}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Nhập lại mật khẩu mới"
          required
          type="password"
          value={confirmPassword}
        />
        <AuthSubmit pending={isPending}>Cập nhật mật khẩu</AuthSubmit>
      </form>
    </AuthCard>
  );
};
