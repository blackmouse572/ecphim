"use client";

import {
  createClient,
  signInWithGoogle,
  signUpWithPassword,
} from "@repo/auth/client";
import { MIN_PASSWORD_LENGTH } from "@repo/auth/config";
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

type SignUpProps = {
  i18n?: {
    namePlaceholder?: string;
    emailPlaceholder?: string;
    passwordPlaceholder?: string;
    confirmPasswordPlaceholder?: string;
    signUpButton?: string;
    signingUpButton?: string;
    passwordNotMatchError?: string;
    passwordMinLengthError?: string;
  };
};
export const SignUp = (props: SignUpProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authClient] = useState(createClient);
  const nextPath = useMemo(
    () => getSafeNextPath(searchParams.get("next")),
    [searchParams],
  );
  const emailRedirectTo = useMemo(
    () => getAuthCallbackUrl(nextPath),
    [nextPath],
  );

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError(
        props.i18n?.passwordNotMatchError || "Mật khẩu xác nhận không khớp",
      );
      setLoading(false);
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(
        props.i18n?.passwordMinLengthError ||
          `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự`,
      );
      setLoading(false);
      return;
    }

    const { error: loginError } = await signUpWithPassword(authClient, {
      email,
      name,
      password,
      emailRedirectTo,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);

    const { error: googleError } = await signInWithGoogle(authClient, {
      redirectTo: emailRedirectTo,
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
          Đã có tài khoản? <AuthLink href="/sign-in">Đăng nhập</AuthLink>
        </>
      }
      title="Tạo tài khoản"
    >
      {error ? <AuthAlert>{error}</AuthAlert> : null}
      <GoogleButton onClick={handleGoogleSignIn} pending={googleLoading} />
      <AuthDivider />
      <form className="grid gap-4" onSubmit={handleSignUp}>
        <AuthField
          autoComplete="name"
          label="Họ và tên"
          onChange={(e) => setName(e.target.value)}
          placeholder={props.i18n?.namePlaceholder || "Nguyễn Văn A"}
          required
          type="text"
          value={name}
        />
        <AuthField
          autoComplete="email"
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder={props.i18n?.emailPlaceholder || "ban@email.com"}
          required
          type="email"
          value={email}
        />
        <AuthField
          autoComplete="new-password"
          label="Mật khẩu"
          minLength={MIN_PASSWORD_LENGTH}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={
            props.i18n?.passwordPlaceholder ||
            `Ít nhất ${MIN_PASSWORD_LENGTH} ký tự`
          }
          required
          type="password"
          value={password}
        />
        <AuthField
          autoComplete="new-password"
          label="Xác nhận mật khẩu"
          minLength={MIN_PASSWORD_LENGTH}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={
            props.i18n?.confirmPasswordPlaceholder || "Nhập lại mật khẩu"
          }
          required
          type="password"
          value={confirmPassword}
        />
        <AuthSubmit pending={loading}>
          {props.i18n?.signUpButton || "Đăng ký"}
        </AuthSubmit>
      </form>
    </AuthCard>
  );
};
