import type { serverAuth } from "./server";

export type SessionUser = typeof serverAuth.$Infer.Session.user;
