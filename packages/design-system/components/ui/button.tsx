"use client"

import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
} from "react-aria-components"
import { tv, type VariantProps } from "tailwind-variants"
import { cx } from "@repo/design-system/lib/primitive"
import { buttonStyles } from "../variants/buttonVariants"


export interface ButtonProps extends ButtonPrimitiveProps, VariantProps<typeof buttonStyles> {
  ref?: React.Ref<HTMLButtonElement>
}

export function Button({ className, intent, size, isCircle, ref, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      ref={ref}
      {...props}
      className={cx(
        buttonStyles({
          intent,
          size,
          isCircle,
        }),
        className,
      )}
    />
  )
}
