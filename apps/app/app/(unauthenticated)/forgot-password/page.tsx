import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { ForgotPassword } from "./forgot-password";

const title = "Quên mật khẩu";
const description = "Yêu cầu email đặt lại mật khẩu.";

export const metadata: Metadata = createMetadata({ title, description });

const ForgotPasswordPage = () => <ForgotPassword />;

export default ForgotPasswordPage;
