"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <Card className="mx-auto w-full max-w-md bg-background shadow-primary/50 shadow-sm">
      <CardHeader>
        <CardTitle>Kiểm tra hộp thư</CardTitle>
        <CardDescription>
          Đã gửi liên kết xác nhận{email ? ` tới ${email}` : ""}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-muted-foreground text-sm">
        <p>
          Mở email từ Supabase và xác nhận tài khoản để hoàn tất đăng ký.
        </p>
        <p>
          Sau khi xác nhận, hệ thống sẽ tự động đưa bạn quay lại ứng dụng.
        </p>
      </CardContent>
      <CardFooter className="gap-3">
        <Link
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground"
          href="/sign-in"
        >
          Đến trang đăng nhập
        </Link>
        <Link
          className="inline-flex flex-1 items-center justify-center rounded-lg border px-4 py-2 font-medium"
          href="/"
        >
          Về trang chủ
        </Link>
      </CardFooter>
    </Card>
  );
};

export default VerifyEmailPage;
