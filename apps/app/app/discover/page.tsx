import {
  MagnifyingGlass,
  Funnel,
  SortAscending,
  GridFour,
  List,
  Star,
  Calendar,
  Play,
  Crown,
  Fire,
} from "@phosphor-icons/react/ssr";
import { Button } from "@repo/design-system/components/ui/button";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Input } from "@repo/design-system/components/ui/input";
import {
  MotionFadeIn,
  MotionItem,
  MotionList,
  MotionPage,
} from "@repo/design-system/components/motion";
import { cn } from "@repo/design-system/lib/utils";
import Image from "next/image";
import Link from "next/link";
"use client";

import { useState } from "react";

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
  "All of Us Are Dead", "Squid Game", "Kingdom", "Extraordinary Attorney Woo",
  "Business Proposal", "My Name", "D.P.", "Hometown Cha-Cha-Cha"
];

const MOVIES_GRID = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  slug: `movie-${i + 1}`,
  name: `Movie Title ${i + 1}`,
  origin_name: `Original Title ${i + 1}`,
  poster: "https://phimimg.com/upload/vod/20250325-1/6db202d6161c123d96b0180c2da9b1e5.jpg",
  rating: (7.5 + Math.random() * 1.5).toFixed(1),
  year: 2023 - Math.floor(Math.random() * 3),
  category: ["Action", "Drama", "Comedy", "Horror"][Math.floor(Math.random() * 4)],
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
      <section className="pt-32 pb-16">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <MotionList className="space-y-8">
            <MotionItem>
              <h1 className="text-display-xl font-100 text-white mb-6 tracking-tighter">
                Discover Your Next
                <span className="block text-gradient bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Favorite Film
                </span>
              </h1>
              <p className="text-body-xl font-200 text-white/70 max-w-2xl mx-auto">
                Explore thousands of movies and series across all genres, languages, and decades
              </p>
            </MotionItem>

            {/* Search Bar */}
            <MotionItem delay={0.2}>
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-4 flex items-center">
                  <MagnifyingGlass className="h-6 w-6 text-white/40" />
                </div>
                <Input
                  placeholder="Search for movies, series, actors..."
                  className="w-full pl-12 pr-4 py-6 text-lg bg-white/5 border-white/20 rounded-2xl backdrop-blur-sm text-white placeholder:text-white/40 focus:border-blue-400 focus:bg-white/10 transition-all"
                />
                <Button
                  className="absolute inset-y-2 right-2 px-8 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-600 transition-colors"
                >
                  Search
                </Button>
              </div>
            </MotionItem>

            {/* Trending Searches */}
            <MotionItem delay={0.3}>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="text-sm font-mono text-white/50 uppercase tracking-wider">
                  Trending:
                </span>
                {TRENDING_SEARCHES.slice(0, 4).map((search) => (
                  <button
                    key={search}
                    className="text-sm font-400 text-white/70 hover:text-blue-400 transition-colors border-b border-white/20 hover:border-blue-400 pb-0.5"
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
      <section className="py-16 border-y border-white/5">
        <div className="container mx-auto max-w-7xl px-6">
          <MotionFadeIn>
            <h2 className="text-headline-xl font-900 text-white mb-12 text-center">
              Browse by Genre
            </h2>
          </MotionFadeIn>

          <MotionList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {FEATURED_CATEGORIES.map((category, index) => (
              <MotionItem key={category.name} delay={index * 0.05}>
                <Link
                  href={`/browse/genre/${category.name.toLowerCase()}`}
                  className="group block relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br hover:scale-105 transition-all duration-500"
                >
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-80 group-hover:opacity-100 transition-opacity",
                    category.gradient
                  )} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                  <div className="absolute inset-0 flex flex-col justify-between p-6">
                    <div className="text-right">
                      <div className="text-xs font-mono text-white/80">
                        {category.count.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-title-lg font-900 text-white mb-1">
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
            <div className="flex flex-wrap items-center justify-between gap-6 mb-12 p-6 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-sm">
              <div className="flex flex-wrap gap-4">
                {FILTER_OPTIONS.map((filter) => (
                  <Badge
                        key={filter.value}
                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl font-400 transition-all"
                  >
                    {filter.label}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <select className="bg-white/5 border border-white/20 text-white rounded-xl px-4 py-2 font-400 backdrop-blur-sm focus:border-blue-400 transition-colors">
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-zinc-900">
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <Button intent="secondary" size='sq-md' >
                    <GridFour className="h-5 w-5" />
                  </Button>
                  <Button intent="secondary" size='sq-md' >
                    <List className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </MotionFadeIn>

          {/* Movies Grid */}
          <MotionList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {MOVIES_GRID.map((movie, index) => (
              <MotionItem key={movie.id} delay={index * 0.02}>
                <Link href={`/movie/${movie.slug}`} className="group block">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 hover:border-white/30 transition-all duration-700 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50">
                    <Image
                      alt={movie.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      height={450}
                      src={movie.poster}
                      width={300}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors">
                        <Play weight="fill" className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                      <span className="text-xs font-mono font-700 bg-black/60 text-white px-2 py-1 rounded-md backdrop-blur-sm">
                        {movie.quality}
                      </span>
                      <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm">
                        <Star weight="fill" className="h-3 w-3 text-yellow-400" />
                        <span className="text-xs font-mono font-700 text-white">{movie.rating}</span>
                      </div>
                    </div>

                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-sm font-600 text-white mb-1 line-clamp-2">
                        {movie.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-white/70">
                        <span className="font-mono">{movie.year}</span>
                        <span className="w-1 h-1 bg-white/40 rounded-full" />
                        <span className="font-mono">{movie.episodes} EP</span>
                      </div>
                    </div>
                  </div>

                  {/* Title below image */}
                  <div className="pt-4 space-y-1">
                    <h3 className="text-body font-500 text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                      {movie.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-white/50">
                      <span className="font-mono">{movie.year}</span>
                      <span className="w-1 h-1 bg-white/30 rounded-full" />
                      <span className="font-mono uppercase tracking-wider">{movie.category}</span>
                    </div>
                  </div>
                </Link>
              </MotionItem>
            ))}
          </MotionList>

          {/* Load More */}
          <MotionFadeIn delay={0.8}>
            <div className="text-center mt-16">
              <Button
                size="lg"
                intent="outline"
                className="border-white/20 text-white hover:bg-white/10 font-400 px-12 py-4 rounded-2xl backdrop-blur-sm hover:scale-105 transition-all"
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
