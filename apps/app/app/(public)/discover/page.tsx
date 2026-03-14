"use client";

import {
  GridFour,
  List,
  MagnifyingGlass,
  Play,
  Star,
} from "@phosphor-icons/react/ssr";
import {
  MotionFadeIn,
  MotionItem,
  MotionList,
  MotionPage,
} from "@repo/design-system/components/motion";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { cn } from "@repo/design-system/lib/utils";
import Image from "next/image";
import Link from "next/link";

// Mock data
const FEATURED_CATEGORIES = [
  { name: "Action", count: 1250, gradient: "from-red-500 to-orange-500" },
  { name: "Drama", count: 980, gradient: "from-blue-500 to-purple-500" },
  { name: "Comedy", count: 750, gradient: "from-green-500 to-teal-500" },
  { name: "Horror", count: 420, gradient: "from-purple-500 to-pink-500" },
  { name: "Sci-Fi", count: 380, gradient: "from-cyan-500 to-blue-500" },
  { name: "Romance", count: 650, gradient: "from-pink-500 to-rose-500" },
];

const TRENDING_SEARCHES = [
  "All of Us Are Dead",
  "Squid Game",
  "Kingdom",
  "Extraordinary Attorney Woo",
  "Business Proposal",
  "My Name",
  "D.P.",
  "Hometown Cha-Cha-Cha",
];

const MOVIES_GRID = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  slug: `movie-${i + 1}`,
  name: `Movie Title ${i + 1}`,
  origin_name: `Original Title ${i + 1}`,
  poster:
    "https://phimimg.com/upload/vod/20250325-1/6db202d6161c123d96b0180c2da9b1e5.jpg",
  rating: (7.5 + Math.random() * 1.5).toFixed(1),
  year: 2023 - Math.floor(Math.random() * 3),
  category: ["Action", "Drama", "Comedy", "Horror"][
    Math.floor(Math.random() * 4)
  ],
  episodes: Math.floor(Math.random() * 20) + 1,
  quality: ["HD", "FHD", "4K"][Math.floor(Math.random() * 3)],
}));

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Movies", value: "movie" },
  { label: "Series", value: "series" },
  { label: "New Releases", value: "new" },
  { label: "Popular", value: "popular" },
];

const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Rating", value: "rating" },
  { label: "Name", value: "name" },
  { label: "Year", value: "year" },
];

export default function DiscoverPage() {
  return (
    <MotionPage className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black">
      {/* Hero Search Section */}
      <section className="pt-48 pb-16">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <MotionList className="space-y-8">
            <MotionItem>
              <h1 className="mb-6 font-100 text-display text-white tracking-tighter">
                Discover Your Next
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-gradient text-transparent">
                  Favorite Film
                </span>
              </h1>
              <p className="mx-auto max-w-2xl font-200 text-body-lg text-white/70">
                Explore thousands of movies and series across all genres,
                languages, and decades
              </p>
            </MotionItem>

            {/* Search Bar */}
            <MotionItem delay={0.2}>
              <div className="relative mx-auto max-w-2xl">
                <div className="absolute inset-y-0 left-4 flex items-center">
                  <MagnifyingGlass className="h-6 w-6 text-white/40" />
                </div>
                <Input
                  placeholder="Search for movies, series, actors..."
                  className="w-full rounded-2xl border-white/20 bg-white/5 py-6 pr-4 pl-12 text-lg text-white backdrop-blur-sm transition-all placeholder:text-white/40 focus:border-blue-400 focus:bg-white/10"
                />
                <Button className="absolute inset-y-2 right-2 rounded-xl bg-blue-500 px-8 font-600 text-white transition-colors hover:bg-blue-600">
                  Search
                </Button>
              </div>
            </MotionItem>

            {/* Trending Searches */}
            <MotionItem delay={0.3}>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="font-mono text-sm text-white/50 uppercase tracking-wider">
                  Trending:
                </span>
                {TRENDING_SEARCHES.slice(0, 4).map((search) => (
                  <button
                    key={search}
                    className="border-white/20 border-b pb-0.5 font-400 text-sm text-white/70 transition-colors hover:border-blue-400 hover:text-blue-400"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </MotionItem>
          </MotionList>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="border-white/5 border-y py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <MotionFadeIn>
            <h2 className="mb-12 text-center font-900 text-headline text-white">
              Browse by Genre
            </h2>
          </MotionFadeIn>

          <MotionList className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {FEATURED_CATEGORIES.map((category, index) => (
              <MotionItem key={category.name} delay={index * 0.05}>
                <Link
                  href={`/browse/genre/${category.name.toLowerCase()}`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br transition-all duration-500 hover:scale-105"
                >
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-80 transition-opacity group-hover:opacity-100",
                      category.gradient,
                    )}
                  />
                  <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />

                  <div className="absolute inset-0 flex flex-col justify-between p-6">
                    <div className="text-right">
                      <div className="font-mono text-white/80 text-xs">
                        {category.count.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-1 font-900 text-title text-white">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </MotionItem>
            ))}
          </MotionList>
        </div>
      </section>

      {/* Filters & Grid */}
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-6">
          {/* Filter Controls */}
          <MotionFadeIn>
            <div className="mb-12 flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
              <div className="flex flex-wrap gap-4">
                {FILTER_OPTIONS.map((filter) => (
                  <Badge
                    key={filter.value}
                    className="rounded-xl font-400 text-white/70 transition-all hover:bg-white/10 hover:text-white"
                  >
                    {filter.label}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <select className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 font-400 text-white backdrop-blur-sm transition-colors focus:border-blue-400">
                  {SORT_OPTIONS.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-zinc-900"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <Button intent="secondary" size="sq-md">
                    <GridFour className="h-5 w-5" />
                  </Button>
                  <Button intent="secondary" size="sq-md">
                    <List className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </MotionFadeIn>

          {/* Movies Grid */}
          <MotionList className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
            {MOVIES_GRID.map((movie, index) => (
              <MotionItem key={movie.id} delay={index * 0.02}>
                <Link href={`/movie/${movie.slug}`} className="group block">
                  <div className="hover:-translate-y-2 relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 transition-all duration-700 hover:scale-105 hover:border-white/30 hover:shadow-2xl hover:shadow-black/50">
                    <Image
                      alt={movie.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      height={450}
                      src={movie.poster}
                      width={300}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm transition-colors hover:bg-white/30">
                        <Play weight="fill" className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    {/* Top badges */}
                    <div className="absolute top-3 right-3 left-3 flex items-start justify-between">
                      <span className="rounded-md bg-black/60 px-2 py-1 font-700 font-mono text-white text-xs backdrop-blur-sm">
                        {movie.quality}
                      </span>
                      <div className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 backdrop-blur-sm">
                        <Star
                          weight="fill"
                          className="h-3 w-3 text-yellow-400"
                        />
                        <span className="font-700 font-mono text-white text-xs">
                          {movie.rating}
                        </span>
                      </div>
                    </div>

                    {/* Bottom info */}
                    <div className="absolute right-0 bottom-0 left-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <h3 className="mb-1 line-clamp-2 font-600 text-sm text-white">
                        {movie.name}
                      </h3>
                      <div className="flex items-center gap-2 text-white/70 text-xs">
                        <span className="font-mono">{movie.year}</span>
                        <span className="h-1 w-1 rounded-full bg-white/40" />
                        <span className="font-mono">{movie.episodes} EP</span>
                      </div>
                    </div>
                  </div>

                  {/* Title below image */}
                  <div className="space-y-1 pt-4">
                    <h3 className="line-clamp-2 font-500 text-body text-white leading-tight transition-colors group-hover:text-blue-400">
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
          <MotionFadeIn delay={0.8}>
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
