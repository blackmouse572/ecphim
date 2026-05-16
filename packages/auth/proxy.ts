import "server-only";

import { type NextRequest, NextResponse } from "next/server";
import { serverAuth } from "./server";

export const authMiddleware = async (request: NextRequest) => {
  const session = await serverAuth.api.getSession({
    headers: request.headers,
  });

  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
};
