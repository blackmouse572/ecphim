import {
  ArrowRight,
  Calendar,
  Clock,
  Crown,
  Fire,
  Play,
  Sparkle,
  Star,
  TrendUp,
} from "@phosphor-icons/react/ssr";
import {
  MotionFadeIn,
  MotionItem,
  MotionList,
  MotionPage,
} from "@repo/design-system/components/motion";
import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import Image from "next/image";
import Link from "next/link";

// Mock data based on different categories
const CATEGORY_DATA = {
  trending: {
    title: "Trending Now",
    subtitle: "What everyone's watching this week",
    icon: TrendUp,
    gradient: "from-orange-500 to-red-500",
  },
  premium: {
    title: "Premium Collection",
    subtitle: "Exclusive high-quality content",
    icon: Crown,
    gradient: "from-yellow-500 to-orange-500",
  },
  new: {
    title: "New Releases",
    subtitle: "Latest additions to our catalog",
    icon: Sparkle,
    gradient: "from-blue-500 to-cyan-500",
  },
  classics: {
    title: "Timeless Classics",
    subtitle: "Legendary films that defined cinema",
    icon: Fire,
    gradient: "from-purple-500 to-pink-500",
  },
};

const MOVIES = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  slug: `movie-${i + 1}`,
  name: `Epic Movie Title ${i + 1}`,
  origin_name: `Original Title ${i + 1}`,
  poster:
    "https://phimimg.com/upload/vod/20250325-1/6db202d6161c123d96b0180c2da9b1e5.jpg",
  rating: (8.0 + Math.random() * 1.5).toFixed(1),
  year: 2024 - Math.floor(Math.random() * 5),
  category: ["Action", "Drama", "Thriller", "Comedy"][
    Math.floor(Math.random() * 4)
  ],
  episodes: Math.floor(Math.random() * 24) + 1,
  duration: `${Math.floor(Math.random() * 60) + 90} min`,
  description:
    "An epic tale of adventure, betrayal, and redemption that will keep you on the edge of your seat from beginning to end.",
}));

const FILTER_TAGS = [
  "All",
  "Action",
  "Drama",
  "Comedy",
  "Horror",
  "Sci-Fi",
  "Romance",
  "Thriller",
];

export default async function BrowsePage({
  params,
}: {
  params: Promise<{ category?: string }>;
}) {
  const { category } = await params;
  const categoryInfo =
    CATEGORY_DATA[category as keyof typeof CATEGORY_DATA] ||
    CATEGORY_DATA.trending;
  const CategoryIcon = categoryInfo.icon;

  return (
    <MotionPage className="min-h-screen bg-black">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-48 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-black" />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-20",
            categoryInfo.gradient,
          )}
        />

        <div className="container relative mx-auto max-w-7xl px-6">
          <MotionList className="max-w-3xl space-y-8">
            <MotionItem>
              <div className="mb-6 flex items-center gap-4">
                <div
                  className={cn(
                    "rounded-2xl bg-gradient-to-br p-4",
                    categoryInfo.gradient,
                  )}
                >
                  <CategoryIcon className="h-8 w-8 text-white" weight="bold" />
                </div>
                <div>
                  <h1 className="font-100 text-display text-white leading-tight tracking-tighter">
                    {categoryInfo.title}
                  </h1>
                  <p className="font-200 text-body-lg text-white/70">
                    {categoryInfo.subtitle}
                  </p>
                </div>
              </div>
            </MotionItem>

            <MotionItem delay={0.2}>
              <div className="flex flex-wrap gap-3">
                {FILTER_TAGS.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    className={cn(
                      "rounded-full px-4 py-2 font-400 text-sm transition-all hover:scale-105",
                      tag === "All"
                        ? "bg-white text-black"
                        : "border border-white/20 bg-white/10 text-white hover:bg-white/20",
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </MotionItem>
          </MotionList>
        </div>
      </section>

      {/* Featured Movie */}
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <MotionFadeIn>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-black via-zinc-900 to-black">
              <div className="grid grid-cols-1 gap-0 lg:grid-cols-[400px_1fr]">
                {/* Featured Poster */}
                <div className="relative aspect-[2/3] lg:aspect-auto">
                  <Image
                    alt={MOVIES[0].name}
                    className="h-full w-full object-cover"
                    height={600}
                    src={MOVIES[0].poster}
                    width={400}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50 lg:from-transparent lg:to-black" />
                </div>

                {/* Featured Info */}
                <div className="flex flex-col justify-center space-y-6 p-8 lg:p-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="rounded-full border border-blue-400/40 bg-blue-400/20 px-3 py-1.5 font-900 font-mono text-blue-400 text-xs uppercase tracking-[0.3em]">
                        Featured
                      </span>
                      <div className="flex items-center gap-2">
                        <Star
                          weight="fill"
                          className="h-4 w-4 text-yellow-500"
                        />
                        <span className="font-700 font-mono text-yellow-500">
                          {MOVIES[0].rating}
                        </span>
                      </div>
                    </div>

                    <h2 className="font-900 text-headline text-white leading-tight tracking-tight">
                      {MOVIES[0].name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-mono">{MOVIES[0].year}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-mono">{MOVIES[0].duration}</span>
                      </div>
                      <span className="font-mono uppercase tracking-wider">
                        {MOVIES[0].category}
                      </span>
                    </div>

                    <p className="max-w-lg font-200 text-body-lg text-white/80 leading-relaxed">
                      {MOVIES[0].description}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      size="lg"
                      className="transition-all hover:scale-105"
                    >
                      <Link href={`/movie/${MOVIES[0].slug}`}>
                        <Play weight="fill" className="mr-3 h-6 w-6" />
                        Xem ngay
                      </Link>
                    </Button>
                    <Button
                      intent="outline"
                      size="lg"
                      className="transition-all hover:scale-105"
                    >
                      <Link href={`/movie/${MOVIES[0].slug}`}>
                        More Details
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </MotionFadeIn>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <MotionList className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
            {MOVIES.slice(1).map((movie, index) => (
              <MotionItem key={movie.id} delay={index * 0.03}>
                <Link href={`/movie/${movie.slug}`} className="group block">
                  <div className="hover:-translate-y-2 relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 transition-all duration-700 hover:scale-105 hover:border-white/30 hover:shadow-2xl hover:shadow-black/50">
                    <Image
                      alt={movie.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      height={450}
                      src={movie.poster}
                      width={300}
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm transition-colors hover:bg-white/30">
                        <Play weight="fill" className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    {/* Rating badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-sm">
                      <Star weight="fill" className="h-3 w-3 text-yellow-400" />
                      <span className="font-700 font-mono text-white text-xs">
                        {movie.rating}
                      </span>
                    </div>

                    {/* Info overlay */}
                    <div className="absolute right-0 bottom-0 left-0 translate-y-full transform p-4 transition-transform duration-300 group-hover:translate-y-0">
                      <h3 className="mb-2 line-clamp-2 font-600 text-body text-white">
                        {movie.name}
                      </h3>
                      <div className="mb-2 flex items-center gap-2 text-white/70 text-xs">
                        <span className="font-mono">{movie.year}</span>
                        <span className="h-1 w-1 rounded-full bg-white/40" />
                        <span className="font-mono uppercase tracking-wider">
                          {movie.category}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-white/60 text-xs leading-relaxed">
                        {movie.description}
                      </p>
                    </div>
                  </div>

                  {/* Static title */}
                  <div className="space-y-2 pt-4">
                    <h3 className="line-clamp-2 font-500 text-body text-white transition-colors group-hover:text-blue-400">
                      {movie.name}
                    </h3>
                    <div className="flex items-center gap-3 text-white/50 text-xs">
                      <span className="font-mono">{movie.year}</span>
                      <span className="h-1 w-1 rounded-full bg-white/30" />
                      <span className="font-mono uppercase tracking-wider">
                        {movie.category}
                      </span>
                    </div>
                  </div>
                </Link>
              </MotionItem>
            ))}
          </MotionList>

          {/* Load More */}
          <MotionFadeIn delay={1.0}>
            <div className="mt-16 text-center">
              <Button
                size="lg"
                intent="outline"
                className="rounded-2xl border-white/20 px-12 py-4 font-400 text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/10"
              >
                Load More Films
              </Button>
            </div>
          </MotionFadeIn>
        </div>
      </section>
    </MotionPage>
  );
}
