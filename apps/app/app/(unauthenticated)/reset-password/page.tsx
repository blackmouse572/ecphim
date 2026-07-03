import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { ResetPassword } from "./reset-password";

const title = "Đặt lại mật khẩu";
const description = "Đặt mật khẩu mới cho tài khoản.";

export const metadata: Metadata = createMetadata({ title, description });

const ResetPasswordPage = () => <ResetPassword />;

export default ResetPasswordPage;
