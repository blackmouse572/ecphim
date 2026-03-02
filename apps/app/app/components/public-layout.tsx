import { ReactNode } from "react";
import { AppNavbar } from "./navbar";
import { Footer } from "./footer";
import { NavbarProvider } from "@repo/design-system/components/ui/navbar";

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

    <div className="min-h-screen flex flex-col">
      <NavbarProvider>
        <AppNavbar user={user} />
        <main className="flex-1">
          {children}
        </main>
      </NavbarProvider>
      <Footer />
    </div>
  );
}
