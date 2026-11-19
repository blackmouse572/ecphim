"use client";

import {
  createClient,
  signInWithGoogle,
  signInWithPassword,
} from "@repo/auth/client";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";
import {
  AUTH_ERROR_PATH,
  getAuthCallbackUrl,
  getSafeNextPath,
} from "@/lib/auth/redirects";
import {
  AuthAlert,
  AuthCard,
  AuthDivider,
  AuthField,
  AuthLink,
  AuthSubmit,
  GoogleButton,
} from "../../components/auth-ui";

export type SignInProps = {
  i18n?: {
    login?: string;
    emailPlaceholder?: string;
    passwordPlaceholder?: string;
  };
};

const defaultErrorMessages: Record<string, string> = {
  invalid_or_expired_link:
    "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
  unable_to_complete_authentication:
    "Không thể hoàn tất đăng nhập. Vui lòng thử lại.",
};

export const SignIn = (props: SignInProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authClient] = useState(createClient);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = useMemo(
    () => getSafeNextPath(searchParams.get("next")),
    [searchParams],
  );
  const googleRedirectTo = useMemo(
    () => getAuthCallbackUrl(nextPath),
    [nextPath],
  );
  const urlError = searchParams.get("error");
  const errorMessage =
    error ?? (urlError ? (defaultErrorMessages[urlError] ?? urlError) : null);

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const { error: loginError } = await signInWithPassword(authClient, {
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    router.replace(nextPath);
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);

    const { error: googleError } = await signInWithGoogle(authClient, {
      redirectTo: googleRedirectTo,
      errorRedirectTo: AUTH_ERROR_PATH,
    });

    if (googleError) {
      setError(googleError.message);
      setGoogleLoading(false);
    }
  };

  return (
    <AuthCard
      description={
        <>
          Chưa có tài khoản? <AuthLink href="/sign-up">Đăng ký</AuthLink>
        </>
      }
      title={props.i18n?.login || "Đăng nhập"}
    >
      {errorMessage ? <AuthAlert>{errorMessage}</AuthAlert> : null}
      <GoogleButton onClick={handleGoogleSignIn} pending={googleLoading} />
      <AuthDivider />
      <form className="grid gap-4" onSubmit={handleSignIn}>
        <AuthField
          autoComplete="email"
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder={props.i18n?.emailPlaceholder || "ban@email.com"}
          required
          type="email"
          value={email}
        />
        <div className="grid gap-1.5">
          <AuthField
            autoComplete="current-password"
            label="Mật khẩu"
            onChange={(e) => setPassword(e.target.value)}
            placeholder={props.i18n?.passwordPlaceholder || "Mật khẩu"}
            required
            type="password"
            value={password}
          />
          <div className="text-end text-sm">
            <AuthLink href="/forgot-password">Quên mật khẩu?</AuthLink>
          </div>
        </div>
        <AuthSubmit pending={loading}>
          {props.i18n?.login || "Đăng nhập"}
        </AuthSubmit>
      </form>
    </AuthCard>
  );
};
