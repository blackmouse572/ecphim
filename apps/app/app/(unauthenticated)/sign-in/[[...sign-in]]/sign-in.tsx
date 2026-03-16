"use client";

import { createClient } from "@repo/auth/client";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <form onSubmit={handleSignIn}>
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
      <Button isPending={loading} type="submit">
        {props.i18n?.login || "Sign in"}
      </Button>
    </form>
  );
};
