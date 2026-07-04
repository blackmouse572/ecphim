import { createClient } from "@repo/auth/server";
import { NextResponse } from "next/server";
import { getSafeNextPath } from "@/lib/auth/redirects";

const getErrorPath = (nextPath: string) =>
  nextPath === "/reset-password"
    ? "/reset-password?error=invalid_or_expired_link"
    : "/sign-in?error=unable_to_complete_authentication";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}${getErrorPath(next)}`);
}
