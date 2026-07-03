import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { SignIn } from "./sign-in";

const title = "Đăng nhập";
const description = "Đăng nhập tài khoản của bạn.";

export const metadata: Metadata = createMetadata({ title, description });

const SignInPage = () => <SignIn />;

export default SignInPage;
