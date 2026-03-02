import { Star, Play } from "@phosphor-icons/react/ssr";
import { Button } from "@repo/design-system/components/ui/button";
import { MotionList, MotionItem } from "@repo/design-system/components/motion";
import { Badge } from "@repo/design-system/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { MovieDetail } from "@/types/movie";

interface HeroSectionProps {
    movie: MovieDetail;
}

export function HeroSection({ movie }: HeroSectionProps) {
    return (
        <section className="relative h-screen flex items-center overflow-hidden pt-16">
            {/* Background with parallax effect */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-black/30 z-10" />
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent z-10" />
                <Image
                    alt={movie.name}
                    className="h-full w-full object-cover scale-105 animate-slow-zoom"
                    height={1080}
                    priority
                    src={movie.thumb_url}
                    width={1920}
                />
            </div>

            <div className="container relative z-20 mx-auto max-w-7xl px-6">
                <MotionList delay={0.3} className="max-w-2xl space-y-8">
                    <MotionItem>
                        <div className="flex items-center gap-4 mb-6">
                            {movie.category.map((cat) => (
                                <Link key={cat.slug} href={`/category/${cat.slug}`}>
                                    <Badge
                                        key={cat.slug}
                                        isCircle
                                        intent="info"
                                        className="backdrop-blur-md hover:bg-sky-500/30"
                                    >
                                        {cat.name}
                                    </Badge>
                                </Link>
                            ))}
                            <div className="flex items-center gap-2 text-yellow-400">
                                <Star weight="fill" className="h-4 w-4" />
                                <span className="font-mono font-700 text-sm">
                                    {movie.imdb.vote_average}
                                </span>
                            </div>
                        </div>
                    </MotionItem>

                    <MotionItem>
                        <h1 className="text-display font-100 leading-[0.85] text-white mb-4 tracking-tight">
                            {movie.name}
                        </h1>
                        <h2 className="text-title font-200 text-white/70 mb-6">
                            {movie.origin_name} ({movie.year})
                        </h2>
                    </MotionItem>

                    <MotionItem>
                        <p className="text-body-lg font-200 text-white/80 leading-relaxed mb-8 max-w-xl">
                            {movie.content}
                        </p>
                    </MotionItem>

                    <MotionItem>
                        <div className="flex gap-4">
                            <Button
                                size="2xl"
                            >
                                <Play weight="fill" />
                                <Link href={`/movie/${movie.slug}`}>
                                    Watch Now
                                </Link>
                            </Button>
                            <Button
                                intent="secondary"
                                size="2xl"
                            >
                                <Link href="/discover">Discover More</Link>
                            </Button>
                        </div>
                    </MotionItem>
                </MotionList>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <div className="w-px h-16 bg-linear-to-b from-transparent via-white/40 to-transparent animate-pulse" />
            </div>
        </section>
    );
}
