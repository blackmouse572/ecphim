import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "../components/logo";

type AuthLayoutProps = {
  readonly children: ReactNode;
};

/** A quiet, centred column: the logo home, the form, nothing else. */
const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="relative isolate flex min-h-dvh flex-col items-center px-4 py-10 sm:justify-center">
    <div
      aria-hidden
      className="-z-10 pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_70%)]"
    />
    <div className="grid w-full max-w-sm gap-6">
      <Link
        aria-label="EcPhim, về trang chủ"
        className="justify-self-center rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        href="/"
      >
        <Logo />
      </Link>
      {children}
    </div>
  </div>
);

export default AuthLayout;
