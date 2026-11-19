"use client";

import { GoogleLogoIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import { Button } from "@repo/design-system/components/base/button";
import { Input } from "@repo/design-system/components/base/input";
import { Label } from "@repo/design-system/components/base/label";
import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
import type * as React from "react";
import { useId } from "react";

/**
 * Shared pieces for the sign-in, sign-up and password pages, so they all
 * read as one flow: a flat card, labelled fields, one primary action.
 */

export function AuthCard({
  title,
  description,
  children,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "squircle surface grid w-full gap-6 rounded-(--radius-squircle-lg) bg-card p-6 sm:p-8",
        className,
      )}
    >
      <header className="grid gap-1.5 text-center">
        <h1 className="text-balance font-bold text-2xl tracking-[-0.02em]">
          {title}
        </h1>
        {description ? (
          <p className="text-pretty text-muted-foreground text-sm">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

export function AuthAlert({
  tone = "error",
  children,
}: {
  tone?: "error" | "success" | "info";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "squircle rounded-(--radius-squircle-sm) px-3.5 py-2.5 text-sm ring-1",
        tone === "error" &&
          "bg-destructive/15 text-foreground ring-destructive/40",
        tone === "success" && "bg-primary/10 text-foreground ring-primary/30",
        tone === "info" && "bg-muted text-muted-foreground ring-border",
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}

export function AuthField({
  label,
  className,
  ...props
}: React.ComponentProps<"input"> & { label: string }) {
  const id = useId();
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input className="h-10" id={id} {...props} />
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="flex items-center gap-3 text-muted-foreground text-xs">
      <span className="h-px flex-1 bg-border" />
      hoặc
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

/** A full-width button that shows a spinner and blocks repeat clicks. */
export function AuthSubmit({
  pending,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { pending?: boolean }) {
  return (
    <Button
      aria-busy={pending || undefined}
      className="w-full"
      disabled={pending}
      size="xl"
      type="submit"
      {...props}
    >
      {pending ? (
        <SpinnerGapIcon
          aria-hidden
          className="motion-safe:animate-spin"
          data-icon="inline-start"
        />
      ) : null}
      {children}
    </Button>
  );
}

export function GoogleButton({
  pending,
  onClick,
}: {
  pending: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      aria-busy={pending || undefined}
      className="w-full"
      disabled={pending}
      onClick={onClick}
      size="xl"
      type="button"
      variant="secondary"
    >
      {pending ? (
        <SpinnerGapIcon
          aria-hidden
          className="motion-safe:animate-spin"
          data-icon="inline-start"
        />
      ) : (
        <GoogleLogoIcon data-icon="inline-start" weight="bold" />
      )}
      Tiếp tục với Google
    </Button>
  );
}

export const authLinkClassName =
  "rounded-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50";

export function AuthLink(props: React.ComponentProps<typeof Link>) {
  return <Link className={authLinkClassName} {...props} />;
}
