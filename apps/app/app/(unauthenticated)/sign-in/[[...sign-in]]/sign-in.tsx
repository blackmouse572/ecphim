"use client";

import {
  createClient,
  signInWithGoogle,
  signInWithPassword,
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

export type SignInProps = {
  i18n?: {
    login?: string;
    emailPlaceholder?: string;
    passwordPlaceholder?: string;
  };
};

const defaultErrorMessages: Record<string, string> = {
  invalid_or_expired_link: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
  unable_to_complete_authentication: "Không thể hoàn tất đăng nhập. Vui lòng thử lại.",
};

export const SignIn = (props: SignInProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supabase] = useState(createClient);
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
  const errorMessage = error ?? (urlError ? defaultErrorMessages[urlError] ?? urlError : null);

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const { error: loginError } = await signInWithPassword(supabase, {
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

    const { error: googleError } = await signInWithGoogle(supabase, {
      redirectTo: googleRedirectTo,
    });

    if (googleError) {
      setError(googleError.message);
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md bg-background shadow-primary/50 shadow-sm">
      <CardHeader>
        <CardTitle>{props.i18n?.login || "Đăng nhập"}</CardTitle>
        <CardDescription>
          Chưa có tài khoản?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Đăng ký
          </Link>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSignIn} className="space-y-4">
        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-destructive text-sm">
              {errorMessage}
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
            onChange={(e) => setEmail(e.target.value)}
            placeholder={props.i18n?.emailPlaceholder || "Email"}
            required
            type="email"
            value={email}
          />
          <Input
            onChange={(e) => setPassword(e.target.value)}
            placeholder={props.i18n?.passwordPlaceholder || "Mật khẩu"}
            required
            type="password"
            value={password}
          />
          <div className="text-end text-muted-foreground text-sm">
            <Link
              href="/forgot-password"
              className="text-primary hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </CardContent>
        <CardFooter>
          <Button isPending={loading} type="submit" className="w-full">
            {props.i18n?.login || "Đăng nhập"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
