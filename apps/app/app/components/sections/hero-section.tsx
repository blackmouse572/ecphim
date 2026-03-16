"use client";

import { Play, Star } from "@phosphor-icons/react/ssr";
import {
  AnimatePresence,
  MotionBlurInOut,
  MotionItem,
  MotionList,
} from "@repo/design-system/components/motion";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { IMovie } from "@/types/response";
import PureHtmlRender from "../pure-html-render";
import { Display } from "../typography/display";

interface HeroSectionProps {
  movies: IMovie[];
  movieImages: Record<string, { url: string; placeholder: string }>;
}

export function HeroSection({ movies, movieImages }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentMovie = movies[currentIndex];
  const currentImage = movieImages[currentMovie.slug];

  // Autoplay logic
  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
        setIsTransitioning(false);
      }, 300);
    }, 10000);

    return () => clearInterval(timer);
  }, [isAutoPlay, movies.length]);

  const handleIndicatorClick = useCallback((index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
    setIsAutoPlay(false);
    // Resume autoplay after 5 seconds of inactivity
    const timer = setTimeout(() => setIsAutoPlay(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative flex h-[calc(100vh-4rem)] items-center overflow-hidden">
      {/* Background with smooth fade transition */}
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 z-10 bg-linear-to-r from-black via-black/70 to-black/30 transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        />
        <div
          className={`absolute inset-0 z-10 bg-linear-to-t from-black via-transparent to-transparent transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        />
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        >
          <Image
            alt={currentMovie.name}
            className="h-full w-full scale-105 animate-slow-zoom object-cover"
            height={1080}
            priority
            src={currentImage.url}
            placeholder="blur"
            blurDataURL={currentImage.placeholder}
            width={1920}
          />
        </div>
      </div>

      <div className="container relative z-20 mx-auto max-w-7xl px-6">
        <MotionList delay={0.3} className="max-w-2xl space-y-8">
          <MotionItem>
            <div className="mb-6 flex items-center gap-4">
              {currentMovie.category.map((cat) => (
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
                <span className="font-700 font-mono text-sm">
                  {currentMovie.imdb.vote_average}&nbsp; IMDB
                </span>
              </div>
            </div>
          </MotionItem>
          <AnimatePresence mode="wait">
            <MotionBlurInOut key={currentMovie._id}>
              <Display className="mb-2 text-display-sm">
                {currentMovie.name}
              </Display>
              <h2 className="text-body text-title text-white/70">
                {currentMovie.origin_name} ({currentMovie.year})
              </h2>
            </MotionBlurInOut>
          </AnimatePresence>

          <MotionItem>
            <PureHtmlRender html={currentMovie.content} />
          </MotionItem>

          <MotionItem>
            <div className="flex gap-4">
              <Button size="2xl">
                <Play weight="fill" />
                <Link href={`/movie/${currentMovie.slug}`}> Xem ngay</Link>
              </Button>
              <Button intent="secondary" size="2xl">
                <Link href="/discover">Khám phá thêm</Link>
              </Button>
            </div>
          </MotionItem>
        </MotionList>
      </div>

      {/* Scroll indicator */}
      <div className="-translate-x-1/2 absolute bottom-20 left-1/2 z-20 transform">
        <div className="h-16 w-px animate-pulse bg-linear-to-b from-transparent via-white/40 to-transparent" />
      </div>

      {/* Carousel Indicators - Bottom Right */}
      <div className="absolute right-8 bottom-8 z-20 flex gap-3">
        {movies.map((movie, index) => (
          <button
            type="button"
            key={movie.slug}
            onClick={() => handleIndicatorClick(index)}
            className={`group relative flex-shrink-0 transition-all duration-300 ${
              currentIndex === index ? "ring-2 ring-primary ring-offset-2" : ""
            } overflow-hidden rounded-lg`}
            aria-label={`Go to ${movie.name}`}
          >
            {/* Thumbnail Image */}
            <Image
              alt={movie.name}
              src={movieImages[movie.slug].url}
              placeholder="blur"
              blurDataURL={movieImages[movie.slug].placeholder}
              width={80}
              height={45}
              className={`h-12 w-20 object-cover transition-all duration-300 ${
                currentIndex === index
                  ? "brightness-110"
                  : "brightness-75 hover:brightness-90"
              }`}
            />

            {/* Selection Ring */}
            {currentIndex === index && (
              <div className="absolute inset-0 rounded-lg ring-2 ring-yellow-400 ring-opacity-100" />
            )}

            {/* Play indicator on hover */}
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Play weight="fill" className="h-4 w-4 text-white" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
