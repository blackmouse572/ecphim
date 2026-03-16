import Link from "next/link";
import type { ReactNode } from "react";
import { BGPattern } from "../components/bg-pattern";
import { Logo } from "../components/logo";

type AuthLayoutProps = {
  readonly children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="container relative mx-auto flex h-dvh flex-col items-center justify-center lg:max-w-none lg:px-0">
    <div className="z-10 mx-auto flex w-full max-w-[400px] flex-col items-center justify-center space-y-6">
      <Link href="/" className="flex items-center space-x-2">
        <Logo />
      </Link>
      {children}
    </div>
    <BGPattern variant="diagonal-stripes" size={60} mask="fade-edges" />
  </div>
);

export default AuthLayout;
