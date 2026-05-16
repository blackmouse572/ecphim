import { serverAuth } from "@repo/auth/server";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(serverAuth);
