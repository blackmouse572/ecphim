import { Kbd } from "@repo/design-system/components/ui/kbd";
import { buttonStyles } from "@repo/design-system/components/variants/buttonVariants";
import { useHotkey } from "@tanstack/react-hotkeys";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function LoginBtn() {
  const router = useRouter();
  const location = usePathname();
  useHotkey("Mod+S", () => {
    if (location === "/sign-in") return;
    router.push("/sign-in");
  });
  return (
    <Link
      className={buttonStyles({
        size: "sm",
        className: "hidden sm:inline-block",
      })}
      href="/sign-in"
    >
      Đăng Nhập
      <Kbd className="bg-primary text-fg">⌘S</Kbd>
    </Link>
  );
}
