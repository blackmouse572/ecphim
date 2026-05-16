"use client";

import { authClient } from "@repo/auth/client";
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
import { useState } from "react";

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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError(props.i18n?.passwordNotMatchError || "Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(
        props.i18n?.passwordMinLengthError ||
          "Password must be at least 6 characters",
      );
      setLoading(false);
      return;
    }

    const { error: signUpError } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (signUpError) {
      setError(signUpError.message ?? "Unable to sign up");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <Card className="mx-auto w-full max-w-md bg-background shadow-primary/50 shadow-sm">
      <CardHeader>
        <CardTitle>{"Đăng kí"}</CardTitle>
        <CardDescription>
          Đã có tài khoản?{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Đăng nhập
          </Link>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSignUp}>
        <CardContent className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}
          <Input
            onChange={(e) => setName(e.target.value)}
            placeholder={props.i18n?.namePlaceholder || "Name"}
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
            placeholder={props.i18n?.passwordPlaceholder || "Password"}
            required
            type="password"
            value={password}
          />
          <Input
            minLength={6}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={
              props.i18n?.confirmPasswordPlaceholder || "Confirm Password"
            }
            required
            type="password"
            value={confirmPassword}
          />
        </CardContent>
        <CardFooter className="grid gap-2">
          <Button isPending={loading} type="submit" className={"w-full"}>
            {props.i18n?.signUpButton || "Đăng ký"}
          </Button>
          <Button type="button" intent="outline" className="w-full" onClick={handleGoogleSignIn}>
            Tiếp tục với Google
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
