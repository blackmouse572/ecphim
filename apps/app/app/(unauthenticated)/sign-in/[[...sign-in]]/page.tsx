import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";
import { SignIn } from "./sign-in";

const title = "Đăng nhập";
const description = "Đăng nhập tài khoản của bạn.";

export const metadata: Metadata = createMetadata({ title, description });

// SignIn reads useSearchParams() — needs a Suspense boundary for prerender.
const SignInPage = () => (
  <Suspense fallback={null}>
    <SignIn />
  </Suspense>
);

export default SignInPage;
