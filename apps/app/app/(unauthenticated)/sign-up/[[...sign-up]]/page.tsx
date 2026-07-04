import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";
import { SignUp } from "./sign-up";

const title = "Đăng ký";
const description = "Tạo tài khoản mới để bắt đầu.";

export const metadata: Metadata = createMetadata({ title, description });

// SignUp reads useSearchParams() — needs a Suspense boundary for prerender.
const SignUpPage = () => (
  <Suspense fallback={null}>
    <SignUp />
  </Suspense>
);

export default SignUpPage;
