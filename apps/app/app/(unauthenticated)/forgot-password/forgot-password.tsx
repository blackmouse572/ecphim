"use client";

import { createClient, sendPasswordResetEmail } from "@repo/auth/client";
import { type FormEvent, useMemo, useState } from "react";
import { getAuthCallbackUrl } from "@/lib/auth/redirects";
import {
  AuthAlert,
  AuthCard,
  AuthField,
  AuthLink,
  AuthSubmit,
} from "../components/auth-ui";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [authClient] = useState(createClient);
  const redirectTo = useMemo(() => getAuthCallbackUrl("/reset-password"), []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const { error: resetError } = await sendPasswordResetEmail(
      authClient,
      email,
      redirectTo,
    );

    if (resetError) {
      setError(resetError.message);
      setIsPending(false);
      return;
    }

    setIsSubmitted(true);
    setIsPending(false);
  };

  return (
    <AuthCard
      description="Nhập email của bạn, chúng tôi sẽ gửi liên kết để đặt lại mật khẩu."
      title="Quên mật khẩu"
    >
      {error ? <AuthAlert>{error}</AuthAlert> : null}
      {isSubmitted ? (
        <AuthAlert tone="success">
          Đã gửi liên kết đặt lại mật khẩu tới {email}. Hãy kiểm tra hộp thư (và
          mục thư rác).
        </AuthAlert>
      ) : null}
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <AuthField
          autoComplete="email"
          label="Email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="ban@email.com"
          required
          type="email"
          value={email}
        />
        <AuthSubmit pending={isPending}>
          Gửi liên kết đặt lại mật khẩu
        </AuthSubmit>
      </form>
      <p className="text-center text-muted-foreground text-sm">
        Nhớ ra rồi? <AuthLink href="/sign-in">Quay lại đăng nhập</AuthLink>
      </p>
    </AuthCard>
  );
};
