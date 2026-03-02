import { Icon } from "@phosphor-icons/react";
import { MotionList, MotionItem } from "@repo/design-system/components/motion";
import Link from "next/link";

interface Category {
    name: string;
    icon: Icon;
    slug: string;
}

interface CategoriesNavigationProps {
    categories: Category[];
}

export function CategoriesNavigation({ categories }: CategoriesNavigationProps) {
    return (
        <section className="py-16 border-y border-white/5">
            <div className="container mx-auto max-w-7xl px-6">
                <MotionList className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((category, index) => (
                        <MotionItem key={category.slug} delay={index * 0.1}>
                            <Link
                                href={`/browse/${category.slug}`}
                                className="group flex flex-col items-center p-8 rounded-2xl bg-white/2 border border-white/10 hover:border-white/30 hover:bg-white/2 transition-all duration-500 hover:scale-105"
                            >
                                <category.icon className="h-12 w-12 text-white/60 group-hover:text-white transition-colors mb-4" />
                                <span className="text-body font-400 text-white/80 group-hover:text-white transition-colors">
                                    {category.name}
                                </span>
                            </Link>
                        </MotionItem>
                    ))}
                </MotionList>
            </div>
        </section>
    );
}
