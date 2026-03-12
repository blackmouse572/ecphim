"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import {
	pageTransition,
	staggerContainer,
	staggerItem,
	fadeIn,
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
		className={cn("flex flex-col flex-1 h-full", className)}
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
	delay?: number;
};

export const MotionItem = ({ children, className, delay }: MotionItemProps) => (
	<motion.div
		variants={staggerItem}
		className={className}
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
