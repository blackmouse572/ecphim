import { AppNavbar } from "./app-navbar";
import { fetchNavbarData } from "@/app/actions/fetch-navbar-data";

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface NavbarProps {
  user?: User | null;
}

export async function Navbar({ user }: NavbarProps) {
  const navbarData = await fetchNavbarData();

  return (
    <AppNavbar
      user={user}
      categories={navbarData.categories}
      years={navbarData.years}
      countries={navbarData.countries}
    />
  );
}
