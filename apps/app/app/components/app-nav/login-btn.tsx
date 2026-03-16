import { Button } from "@repo/design-system/components/ui/button";
import { Kbd } from "@repo/design-system/components/ui/kbd";
import { useHotkey } from "@tanstack/react-hotkeys";
import { usePathname, useRouter } from "next/navigation";

export function LoginBtn() {
  const router = useRouter();
  const location = usePathname();
  useHotkey("Mod+L", () => {
    if (location === "/sign-in") return;
    router.push("/sign-in");
  });
  return (
    <Button size="sm">
      Login
      <Kbd className="bg-primary text-fg">⌘L</Kbd>
    </Button>
  );
}
