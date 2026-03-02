import { Play, Star } from "@phosphor-icons/react/dist/ssr";
import { MotionItem, MotionList } from "@repo/design-system/components/motion";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export type HeroSectionProps = {
  featuredMovie: {
    name: string;
    origin_name: string;
    year: number;
    content: string;
    category: string[];
    vote_average: number;
    thumb_url: string;
    slug: string;
  };
};
export function HeroSection({ featuredMovie}: HeroSectionProps) {
    return       <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background with parallax effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        <Image
          alt={featuredMovie.name}
          className="h-full w-full object-cover scale-105 animate-slow-zoom"
          height={1080}
          priority
          src={featuredMovie.thumb_url}
          width={1920}
        />
      </div>

      <div className="container relative z-20 mx-auto max-w-7xl px-6">
        <MotionList delay={0.3} className="max-w-2xl space-y-8">
          <MotionItem>
            <div className="flex items-center gap-4 mb-6">
              {featuredMovie.category.map((cat) => (
                <Badge>
                  {cat}
                </Badge>
              ))}
              <div className="flex items-center gap-2 text-yellow-400">
                <Star weight="fill" className="h-4 w-4" />
                <span className="font-mono font-700 text-sm">{featuredMovie.vote_average}</span>
              </div>
            </div>
          </MotionItem>

          <MotionItem>
                <h1 className="text-4xl font-bold leading-[1.05] text-white mb-4 tracking-tight">
              {featuredMovie.name}
            </h1>
            <h2 className="text-title text-white/70 mb-6">
              {featuredMovie.origin_name} ({featuredMovie.year})
            </h2>
          </MotionItem>

          <MotionItem>
            <p className="text-sm font-200 text-white/80 leading-relaxed mb-8 max-w-xl">
              {featuredMovie.content}
            </p>
          </MotionItem>

          <MotionItem>
            <div className="flex gap-4">
              <Button
                size="lg"
                className="transition-all hover:scale-105"
              >
                  <Play weight="fill" />
                <Link href={`/movie/${featuredMovie.slug}`}>
                  Watch Now
                </Link>
              </Button>
              <Button
                intent="outline"
                size="lg"
                className="transition-all hover:scale-105"
              >
                <Link href="/discover">
                  Discover More
                </Link>
              </Button>
            </div>
          </MotionItem>
        </MotionList>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/40 to-transparent animate-pulse" />
      </div>
    </section>

}
