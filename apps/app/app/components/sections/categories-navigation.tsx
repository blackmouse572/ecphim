import { MotionItem, MotionList } from "@repo/design-system/components/motion";
import Link from "next/link";
import type { ICategory } from "@/types/response";

interface CategoriesNavigationProps {
  categories: ICategory[];
}

export function CategoriesNavigation({
  categories,
}: CategoriesNavigationProps) {
  return (
    <section className="border-white/5 border-y py-16">
      <div className="container mx-auto max-w-7xl px-6">
        <MotionList className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((category, index) => (
            <MotionItem key={category.slug} delay={index * 0.1}>
              <Link
                href={`/browse/${category.slug}`}
                className="group flex flex-col items-center rounded-2xl border border-white/10 bg-white/2 p-8 transition-all duration-500 hover:scale-105 hover:border-white/30 hover:bg-white/2"
              >
                <span className="font-400 text-body text-white/80 transition-colors group-hover:text-white">
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
