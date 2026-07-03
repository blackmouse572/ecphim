import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { SignUp } from "./sign-up";

const title = "Đăng ký";
const description = "Tạo tài khoản mới để bắt đầu.";

export const metadata: Metadata = createMetadata({ title, description });

const SignUpPage = () => <SignUp />;

export default SignUpPage;
