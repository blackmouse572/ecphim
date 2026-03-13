import {
  ArrowLeft,
  CalendarBlank,
  Clock,
  MonitorPlay,
  Play,
  Plus,
  ShareNetwork,
  Star,
} from "@phosphor-icons/react/ssr";
import {
  MotionItem,
  MotionList,
  MotionPage,
} from "@repo/design-system/components/motion";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { createMetadata } from "@repo/seo/metadata";
import Image from "next/image";
import Link from "next/link";
import { Display } from "@/app/components/typography/display";
import {
  extractBackdropUrl,
  extractPosterUrl,
  fetchMovieDetail,
  fetchMovieImages,
} from "@/lib/services/movie";

type Props = {
  params: Promise<{ slug: string }>;
};
export const generateMetadata = async ({ params }: Props) => {
  const { slug } = await params;
  const movie = await fetchMovieDetail(slug);

  return createMetadata({
    title: `${movie.name} Chất Lượng Cao - Xem Phim Online Miễn Phí`,
    description: `${movie.content}`,
  });
};
export default async function MovieDetailPage({ params }: Props) {
  const { slug } = await params;
  const movie = await fetchMovieDetail(slug);
  const imageData = await fetchMovieImages(slug);
  const backdrop = extractBackdropUrl(imageData);
  const poster = extractPosterUrl(imageData);
  const episodes = movie.episodes;

  return (
    <MotionPage className="min-h-screen bg-black">
      {/* Cinematic Hero Section */}
      <section className="relative flex h-screen items-start overflow-hidden pt-16">
        {/* Background with dramatic gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <Image
            alt={movie.name}
            className="h-full w-full scale-105 object-cover"
            height={1080}
            priority
            src={backdrop}
            width={1920}
          />
        </div>

        {/* Back Navigation */}
        <div className="absolute top-4 left-8 z-30">
          <Button
            intent="outline"
            className="border-white/20 bg-black/50 text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-black/70"
          >
            <ArrowLeft />
            <Link href="/">Back</Link>
          </Button>
        </div>

        {/* Main Content */}
        <div className="container relative z-30 mx-auto max-w-7xl px-6 pt-16 pb-16">
          <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-[400px_1fr]">
            {/* Poster */}
            <MotionItem className="order-2 lg:order-1">
              <Link href={`/movie/${slug}/watch?episode=tap-01&server=0`}>
                <div className="group relative mx-auto aspect-[2/3] max-w-[400px] overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl transition-all duration-700 hover:scale-105 hover:border-white/40 lg:mx-0">
                  <Image
                    alt={movie.name}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    height={600}
                    priority
                    src={poster}
                    width={400}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <div className="rounded-full bg-white/20 p-6 backdrop-blur-md transition-colors hover:bg-white/30">
                      <Play weight="fill" className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </MotionItem>

            {/* Movie Info */}
            <MotionList
              delay={0.2}
              className="order-1 space-y-6 pb-4 lg:order-2"
            >
              {/* Categories & Rating */}
              <MotionItem>
                <div className="mb-6 flex flex-wrap items-center gap-4">
                  {movie.category.map((cat) => (
                    <Link key={cat._id} href={`/category/${cat.slug}`}>
                      <Badge
                        isCircle
                        intent="info"
                        className="backdrop-blur-md hover:bg-sky-500/30"
                      >
                        #{cat.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </MotionItem>

              {/* Title */}
              <MotionItem>
                <Display className="text-display">{movie.name}</Display>
                <h2 className="mb-2 font-200 text-title text-white/70">
                  {movie.origin_name}
                </h2>
                <div className="flex items-center gap-4 font-mono text-body text-white/50">
                  {movie.year} • {movie.episode_current} • {movie.quality} •{" "}
                  <span className="flex w-fit items-center">
                    <Star weight="fill" className="h-4 w-4 text-yellow-400" />
                    {movie.tmdb.vote_average.toFixed(1)}
                  </span>
                </div>
              </MotionItem>

              {/* Actions */}
              <MotionItem>
                <div className="flex flex-wrap gap-4">
                  <Link href={`/movie/${slug}/watch?episode=tap-01&server=0`}>
                    <Button size="2xl" intent="primary">
                      <Play weight="fill" />
                      Watch Now
                    </Button>
                  </Link>
                  <Button intent="plain" size="2xl">
                    <Plus className="mr-2 h-5 w-5" />
                    My List
                  </Button>
                  <Button intent="plain" size="2xl">
                    <ShareNetwork className="h-6 w-6" />
                  </Button>
                </div>
              </MotionItem>
            </MotionList>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="bg-gradient-to-b from-transparent to-zinc-950/50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[2fr_1fr]">
            {/* Main Content */}
            <div className="space-y-16">
              {/* Synopsis */}
              <MotionItem>
                <h3 className="mb-8 font-900 text-headline text-white tracking-tight">
                  Synopsis
                </h3>
                <p className="font-200 text-body-lg text-white/80 leading-relaxed">
                  {movie.content}
                </p>
              </MotionItem>

              {/* Episodes */}
              <MotionItem>
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="font-900 text-headline text-white tracking-tight">
                    Episodes
                  </h3>
                  <div className="font-mono text-body text-white/50">
                    {movie.episode_current}
                  </div>
                </div>

                <div className="space-y-8">
                  {episodes.map((server, serverIndex) => (
                    <MotionItem
                      key={server.server_name}
                      delay={serverIndex * 0.1}
                    >
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-3 font-600 text-title text-white/90">
                          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />
                          {server.server_name}
                        </h4>

                        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                          {server.server_data.map((ep, epIndex) => (
                            <Link
                              key={ep.slug}
                              href={`/movie/${slug}/watch?episode=${ep.slug}&server=${serverIndex}`}
                            >
                              <Button
                                intent="outline"
                                className="aspect-square w-full rounded-xl border-white/20 font-700 font-mono text-sm text-white transition-all hover:scale-110 hover:border-blue-400 hover:bg-blue-400/10 hover:text-blue-400"
                                style={{
                                  animationDelay: `${epIndex * 20}ms`,
                                }}
                              >
                                {ep.name.replace("Tập ", "")}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </MotionItem>
                  ))}
                </div>
              </MotionItem>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-12">
              {/* Movie Details */}
              <MotionItem delay={0.3}>
                <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
                  <div className="space-y-6 text-sm">
                    <div className="flex items-start gap-4">
                      <MonitorPlay className="mt-0.5 h-5 w-5 shrink-0 text-white/50" />
                      <div>
                        <div className="mb-1 font-mono text-white/50 uppercase tracking-wider">
                          Quality
                        </div>
                        <div className="font-400 text-white">
                          {movie.quality} • {movie.lang}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <CalendarBlank className="mt-0.5 h-5 w-5 shrink-0 text-white/50" />
                      <div>
                        <div className="mb-1 font-mono text-white/50 uppercase tracking-wider">
                          Released
                        </div>
                        <div className="font-400 text-white">
                          {new Date(movie.created.time).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-white/50" />
                      <div>
                        <div className="mb-1 font-mono text-white/50 uppercase tracking-wider">
                          Duration
                        </div>
                        <div className="font-400 text-white">{movie.time}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </MotionItem>

              {/* Cast & Crew */}
              <MotionItem delay={0.4}>
                <div className="space-y-8">
                  {/* Director */}
                  <div>
                    <h4 className="mb-4 font-900 font-mono text-overline text-white/50 uppercase tracking-[0.3em]">
                      Director
                    </h4>
                    <div className="space-y-2">
                      {movie.director.map((director) => (
                        <div
                          key={director}
                          className="cursor-pointer font-400 text-body text-white transition-colors hover:text-blue-400"
                        >
                          {director}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cast */}
                  <div>
                    <h4 className="mb-4 font-900 font-mono text-overline text-white/50 uppercase tracking-[0.3em]">
                      Cast
                    </h4>
                    <div className="space-y-2">
                      {movie.actor.slice(0, 6).map((actor) => (
                        <div
                          key={actor}
                          className="cursor-pointer font-400 text-body text-white/80 transition-colors hover:text-blue-400"
                        >
                          {actor}
                        </div>
                      ))}
                      {movie.actor.length > 6 && (
                        <div className="font-400 text-body text-white/50">
                          +{movie.actor.length - 6} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </MotionItem>

              {/* Stats */}
              <MotionItem delay={0.5}>
                <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-8 backdrop-blur-sm">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="font-900 text-title text-white">
                        {movie.view}
                      </div>
                      <div className="font-mono text-white/50 text-xs uppercase tracking-wider">
                        Views
                      </div>
                    </div>
                    <div>
                      <div className="font-900 text-title text-white">
                        {movie.tmdb.vote_count.toLocaleString()}
                      </div>
                      <div className="font-mono text-white/50 text-xs uppercase tracking-wider">
                        Votes
                      </div>
                    </div>
                    <div>
                      <div className="font-900 text-title text-yellow-400">
                        {movie.tmdb.vote_average}
                      </div>
                      <div className="font-mono text-white/50 text-xs uppercase tracking-wider">
                        Rating
                      </div>
                    </div>
                  </div>
                </div>
              </MotionItem>
            </div>
          </div>
        </div>
      </section>
    </MotionPage>
  );
}
