import { NavbarProvider } from "@repo/design-system/components/ui/navbar";
import type { ReactNode } from "react";
import { Header } from "./app-nav";
import { Footer } from "./footer";

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface PublicLayoutProps {
  children: ReactNode;
  user?: User | null;
}

export function PublicLayout({ children, user }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarProvider>
        <Header />
        <main className="flex-1">{children}</main>
      </NavbarProvider>
      <Footer />
    </div>
  );
}
