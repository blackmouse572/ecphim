"use client";

import { PlayIcon } from "@phosphor-icons/react/dist/ssr";
import type { ButtonProps } from "@repo/design-system/components/ui/button";
import { Kbd } from "@repo/design-system/components/ui/kbd";
import { buttonStyles } from "@repo/design-system/components/variants/buttonVariants";
import { useHotkey } from "@tanstack/react-hotkeys";
import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import type { IMovie } from "../../types/response";

export function WatchNowButton(
  props: Omit<LinkProps, "href"> & {
    href?: string;
    movie: IMovie;
    withShortCut?: boolean;
    className?: string;
  } & Pick<ButtonProps, "size" | "intent">,
) {
  const {
    movie,
    size = "2xl",
    intent,
    className,
    withShortCut = true,
    ...rest
  } = props;
  const router = useRouter();

  useHotkey(
    "Enter",
    () => {
      router.push(`/movie/${movie.slug}/watch`);
    },
    {
      enabled: true,
      preventDefault: true,
    },
  );

  return (
    <Link
      href={`/movie/${movie.slug}/watch`}
      {...rest}
      className={buttonStyles({
        size,
        className,
        intent,
      })}
    >
      <PlayIcon weight="fill" />
      Xem ngay{" "}
      {withShortCut && (
        <Kbd className="bg-primary-subtle text-primary-fg">enter</Kbd>
      )}
    </Link>
  );
}
