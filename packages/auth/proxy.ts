/** biome-ignore-all lint/style/noNonNullAssertion: not null env */
/** biome-ignore-all lint/complexity/noForEach:  cookie interable */
/** biome-ignore-all lint/suspicious/useIterableCallbackReturn: cookie interable */
import "server-only";

import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
export const authMiddleware = async (request: NextRequest) => {
	let supabaseResponse = NextResponse.next({
		request,
	});
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value),
					);
					supabaseResponse = NextResponse.next({
						request,
					});
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options),
					);
				},
			},
		},
	);
	// Refreshing the auth token
	const {
		data: { user },
	} = await supabase.auth.getUser();
	// Redirect to sign-in if accessing protected route without authentication
	if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
		const url = request.nextUrl.clone();
		url.pathname = "/sign-in";
		return NextResponse.redirect(url);
	}
	return supabaseResponse;
};
