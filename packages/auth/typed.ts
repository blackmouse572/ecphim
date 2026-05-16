import type { serverAuth } from "./server";

export type AuthUser = typeof serverAuth.$Infer.Session.user;
