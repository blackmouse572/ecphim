"use client";

import { createClient } from "@repo/auth/client";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type SignInProps = {
  i18n?: {
    login?: string;
    emailPlaceholder?: string;
    passwordPlaceholder?: string;
  };
};
export const SignInProps = (props: SignInProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supabase, setSupabase] = useState<ReturnType<
    typeof createClient
  > | null>(null);
  const router = useRouter();

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (loginError) {
      setError(loginError.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
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
          {error && <div className="text-red-500">{error}</div>}
          <Input
            onChange={(e) => setEmail(e.target.value)}
            placeholder={props.i18n?.emailPlaceholder || "Email"}
            required
            type="email"
            value={email}
          />
          <Input
            onChange={(e) => setPassword(e.target.value)}
            placeholder={props.i18n?.passwordPlaceholder || "Password"}
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
      </form>
      <CardFooter>
        <Button isPending={loading} type="submit" className="w-full">
          {props.i18n?.login || "Đăng nhập"}
        </Button>
      </CardFooter>
    </Card>
  );
};
