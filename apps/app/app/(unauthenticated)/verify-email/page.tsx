"use client";

import { EnvelopeSimpleIcon } from "@phosphor-icons/react";
import { Button } from "@repo/design-system/components/base/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthCard } from "../components/auth-ui";

const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <AuthCard
      description={
        <>
          Đã gửi liên kết xác nhận
          {email ? (
            <>
              {" "}
              tới <span className="font-medium text-foreground">{email}</span>
            </>
          ) : null}
          .
        </>
      }
      title="Kiểm tra hộp thư"
    >
      <div
        aria-hidden
        className="squircle -mt-2 mx-auto grid size-14 place-items-center rounded-(--radius-squircle-md) bg-primary/12 text-primary ring-1 ring-primary/25"
      >
        <EnvelopeSimpleIcon className="size-7" />
      </div>
      <div className="grid gap-2 text-center text-muted-foreground text-sm">
        <p>
          Mở email từ EcPhim và nhấn liên kết xác nhận để hoàn tất đăng ký. Liên
          kết có hiệu lực trong 1 giờ.
        </p>
        <p>Sau khi xác nhận, hệ thống sẽ tự động đưa bạn quay lại ứng dụng.</p>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        <Button
          className="w-full"
          nativeButton={false}
          render={<Link href="/sign-in" />}
          size="xl"
        >
          Đến trang đăng nhập
        </Button>
        <Button
          className="w-full"
          nativeButton={false}
          render={<Link href="/" />}
          size="xl"
          variant="secondary"
        >
          Về trang chủ
        </Button>
      </div>
    </AuthCard>
  );
};

// useSearchParams() requires a Suspense boundary above it for prerender.
const VerifyEmailPage = () => (
  <Suspense fallback={null}>
    <VerifyEmailContent />
  </Suspense>
);

export default VerifyEmailPage;
