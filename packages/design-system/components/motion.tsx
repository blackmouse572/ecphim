"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import {
  fadeIn,
  pageTransition,
  staggerContainer,
  staggerItem,
} from "../lib/motion";
import { cn } from "../lib/utils";

type MotionPageProps = {
  readonly children: ReactNode;
  readonly className?: string;
};

export const MotionPage = ({ children, className }: MotionPageProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={pageTransition}
    className={cn("flex h-full flex-1 flex-col", className)}
  >
    {children}
  </motion.div>
);

type MotionListProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
};

export const MotionList = ({
  children,
  className,
  delay = 0,
}: MotionListProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={staggerContainer}
    className={className}
    custom={delay}
  >
    {children}
  </motion.div>
);

type MotionItemProps = {
  readonly children: ReactNode;
  readonly className?: string;
  whileInView?: boolean;
  delay?: number;
};

export const MotionItem = ({
  children,
  className,
  delay,
  whileInView,
  animate,
}: MotionItemProps) => (
  <motion.div
    variants={staggerItem}
    className={className}
    whileInView={whileInView ? "visible" : undefined}
    viewport={{ once: true }}
    transition={{
      delay,
    }}
  >
    {children}
  </motion.div>
);

export const MotionFadeIn = ({ children, className }: MotionItemProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeIn}
    className={className}
  >
    {children}
  </motion.div>
);

export const MotionBlurInOut = ({ children, className }: MotionItemProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={{
      hidden: {
        opacity: 0,
        filter: "blur(10px)",
      },
      visible: {
        opacity: 1,
        filter: "blur(0px)",
      },
      exit: {
        opacity: 0,
        filter: "blur(10px)",
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export { AnimatePresence } from "motion/react";
