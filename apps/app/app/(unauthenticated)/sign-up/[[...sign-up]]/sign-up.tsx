"use client";

import {
  createClient,
  signInWithGoogle,
  signUpWithPassword,
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
import { type FormEvent, useMemo, useState } from "react";
import { getAuthCallbackUrl, getSafeNextPath } from "@/lib/auth/redirects";
import { GoogleLogoIcon } from "@phosphor-icons/react/dist/ssr";

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
  const [supabase] = useState(createClient);
  const nextPath = useMemo(
    () => getSafeNextPath(searchParams.get("next")),
    [searchParams],
  );
  const emailRedirectTo = useMemo(() => getAuthCallbackUrl(nextPath), [nextPath]);

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError(props.i18n?.passwordNotMatchError || "Mật khẩu xác nhận không khớp");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(
        props.i18n?.passwordMinLengthError ||
          "Mật khẩu phải có ít nhất 6 ký tự",
      );
      setLoading(false);
      return;
    }

    const { error: loginError } = await signUpWithPassword(supabase, {
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

    const { error: googleError } = await signInWithGoogle(supabase, {
      redirectTo: emailRedirectTo,
    });

    if (googleError) {
      setError(googleError.message);
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md bg-background shadow-primary/50 shadow-sm">
      <CardHeader>
        <CardTitle>{"Đăng ký"}</CardTitle>
        <CardDescription>
          Đã có tài khoản?{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Đăng nhập
          </Link>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSignUp} className="space-y-6">
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-destructive text-sm">
              {error}
            </div>
          )}
          <Button
            className="w-full"
            intent="outline"
            isPending={googleLoading}
            onClick={handleGoogleSignIn}
            type="button"
          >
            <GoogleLogoIcon weight="bold"/>
            Tiếp tục với Google
          </Button>
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <div className="h-px flex-1 bg-border" />
            <span>hoặc</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Input
            onChange={(e) => setName(e.target.value)}
            placeholder={props.i18n?.namePlaceholder || "Họ và tên"}
            required
            type="text"
            value={name}
          />
          <Input
            onChange={(e) => setEmail(e.target.value)}
            placeholder={props.i18n?.emailPlaceholder || "Email"}
            required
            type="email"
            value={email}
          />
          <Input
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={props.i18n?.passwordPlaceholder || "Mật khẩu"}
            required
            type="password"
            value={password}
          />
          <Input
            minLength={6}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={
              props.i18n?.confirmPasswordPlaceholder || "Xác nhận mật khẩu"
            }
            required
            type="password"
            value={confirmPassword}
          />
        </CardContent>
        <CardFooter>
          <Button isPending={loading} type="submit" className={"w-full"}>
            {props.i18n?.signUpButton || "Đăng ký"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
