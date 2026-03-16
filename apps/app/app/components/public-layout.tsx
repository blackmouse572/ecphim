import { NavbarProvider } from "@repo/design-system/components/ui/navbar";
import type { ReactNode } from "react";
import { fetchCountries } from "../../lib/services";
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

export async function PublicLayout({ children, user }: PublicLayoutProps) {
  const countries = await fetchCountries();
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarProvider>
        <Header user={user} countries={countries.items} />
        <main className="flex-1">{children}</main>
      </NavbarProvider>
      <Footer />
    </div>
  );
}
