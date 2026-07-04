"use client";

import { createClient, sendPasswordResetEmail } from "@repo/auth/client";
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
import { type FormEvent, useMemo, useState } from "react";
import { getAuthCallbackUrl } from "@/lib/auth/redirects";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [supabase] = useState(createClient);
  const redirectTo = useMemo(() => getAuthCallbackUrl("/reset-password"), []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const { error: resetError } = await sendPasswordResetEmail(
      supabase,
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
    <Card className="mx-auto w-full max-w-md bg-background shadow-primary/50 shadow-sm">
      <CardHeader>
        <CardTitle>Quên mật khẩu</CardTitle>
        <CardDescription>
          Nhập email để nhận liên kết đặt lại mật khẩu.
        </CardDescription>
      </CardHeader>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-destructive text-sm">
              {error}
            </div>
          )}
          {isSubmitted && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-primary text-sm">
              Đã gửi liên kết đặt lại mật khẩu tới {email}.
            </div>
          )}
          <Input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            required
            type="email"
            value={email}
          />
          <p className="text-muted-foreground text-sm">
            Quay lại{" "}
            <Link className="text-primary hover:underline" href="/sign-in">
              đăng nhập
            </Link>
            .
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" isPending={isPending} type="submit">
            Gửi liên kết đặt lại mật khẩu
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
