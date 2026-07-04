import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPassword } from "./reset-password";

const title = "Đặt lại mật khẩu";
const description = "Đặt mật khẩu mới cho tài khoản.";

export const metadata: Metadata = createMetadata({ title, description });

// ResetPassword reads useSearchParams(); a Suspense boundary is required
// above it or the static prerender bails out and the build fails.
const ResetPasswordPage = () => (
  <Suspense fallback={null}>
    <ResetPassword />
  </Suspense>
);

export default ResetPasswordPage;
