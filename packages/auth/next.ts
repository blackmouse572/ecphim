import { toNextJsHandler } from "better-auth/next-js";
import { serverAuth } from "./server";

export const authHandlers = toNextJsHandler(serverAuth);
