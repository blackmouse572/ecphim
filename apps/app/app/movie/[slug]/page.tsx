import {
  Clock,
  Play,
  Plus,
  ShareNetwork,
  Star,
  MonitorPlay,
  CalendarBlank,
  Heart,
  BookmarkSimple,
  ChatCircle,
  Eye,
  ArrowLeft,
} from "@phosphor-icons/react/ssr";
import { Button } from "@repo/design-system/components/ui/button";
import {
  MotionFadeIn,
  MotionItem,
  MotionList,
  MotionPage,
} from "@repo/design-system/components/motion";
import { cn } from "@repo/design-system/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { MOCK_MOVIE } from "./data";
import { PublicLayout } from "@/app/components/public-layout";
import { Badge } from "@repo/design-system/components/ui/badge";

export default async function MovieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { movie, episodes } = MOCK_MOVIE;

  return (
    <PublicLayout>
      <MotionPage className="min-h-screen bg-black">
        {/* Cinematic Hero Section */}
        <section className="relative h-screen flex items-end overflow-hidden pt-16">
          {/* Background with dramatic gradient */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20" />
            <Image
              alt={movie.name}
              className="h-full w-full object-cover scale-105"
              height={1080}
              priority
              src={movie.thumb_url}
              width={1920}
            />
          </div>

          {/* Back Navigation */}
          <div className="absolute top-4 left-8 z-30">
            <Button
              intent="outline"
              className="bg-black/50 border-white/20 text-white backdrop-blur-sm hover:bg-black/70 hover:scale-105 transition-all"
            >
              <ArrowLeft />
              <Link href="/">
                Back
              </Link>
            </Button>
          </div>

          {/* Main Content */}
          <div className="container relative z-30 mx-auto max-w-7xl px-6 pt-16 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 items-end">
              {/* Poster */}
              <MotionItem className="order-2 lg:order-1">
                <Link href={`/movie/${slug}/watch?episode=tap-01&server=0`}>
                  <div className="group relative aspect-[2/3] max-w-[400px] mx-auto lg:mx-0 overflow-hidden rounded-3xl shadow-2xl border-2 border-white/20 hover:border-white/40 transition-all duration-700 hover:scale-105">
                    <Image
                      alt={movie.name}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      height={600}
                      priority
                      src={movie.poster_url}
                      width={400}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/20 backdrop-blur-md rounded-full p-6 hover:bg-white/30 transition-colors">
                        <Play weight="fill" className="h-12 w-12 text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              </MotionItem>

              {/* Movie Info */}
              <MotionList delay={0.2} className="order-1 lg:order-2 space-y-6">
                {/* Categories & Rating */}
                <MotionItem>
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    {movie.category.map((cat) => (
                      <Link key={cat.id} href={`/category/${cat.slug}`}>
                        <Badge
                          key={cat.id}
                          isCircle
                          intent='info'
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
                  <h1 className="text-display font-100  text-white mb-4 tracking-tighter">
                    {movie.name}
                  </h1>
                  <h2 className="text-title font-200 text-white/70 mb-2">
                    {movie.origin_name}
                  </h2>
                  <div className="text-body font-mono text-white/50">
                    {movie.year} • {movie.episode_current} • {movie.quality}  • <span className='flex w-fit items-center '>
                      <Star weight="fill" className="h-4 w-4 text-yellow-400" />
                      {movie.tmdb.vote_average.toFixed(1)}
                    </span>
                  </div>
                </MotionItem>

                {/* Actions */}
                <MotionItem>
                  <div className="flex flex-wrap gap-4">
                    <Link href={`/movie/${slug}/watch?episode=tap-01&server=0`}>
                      <Button
                        size="2xl"
                        intent="primary"
                      >
                        <Play weight="fill" />
                        Watch Now
                      </Button>
                    </Link>
                    <Button
                      intent="plain"
                      size="2xl"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      My List
                    </Button>
                    <Button
                      intent="plain"
                      size="2xl"
                    >
                      <ShareNetwork className="h-6 w-6" />
                    </Button>
                  </div>
                </MotionItem>
              </MotionList>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-24 bg-gradient-to-b from-transparent to-zinc-950/50">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16">
              {/* Main Content */}
              <div className="space-y-16">
                {/* Synopsis */}
                <MotionItem>
                  <h3 className="text-headline font-900 text-white mb-8 tracking-tight">
                    Synopsis
                  </h3>
                  <p className="text-body-lg font-200 text-white/80 leading-relaxed">
                    {movie.content}
                  </p>
                </MotionItem>

                {/* Episodes */}
                <MotionItem>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-headline font-900 text-white tracking-tight">
                      Episodes
                    </h3>
                    <div className="text-body font-mono text-white/50">
                      {movie.episode_current}
                    </div>
                  </div>

                  <div className="space-y-8">
                    {episodes.map((server, serverIndex) => (
                      <MotionItem key={server.server_name} delay={serverIndex * 0.1}>
                        <div className="space-y-4">
                          <h4 className="text-title font-600 text-white/90 flex items-center gap-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full" />
                            {server.server_name}
                          </h4>

                          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                            {server.server_data.map((ep, epIndex) => (
                              <Link key={ep.slug} href={`/movie/${slug}/watch?episode=${ep.slug}&server=${serverIndex}`}>
                                <Button
                                  intent="outline"
                                  className="aspect-square border-white/20 text-white hover:border-blue-400 hover:bg-blue-400/10 hover:text-blue-400 transition-all hover:scale-110 rounded-xl font-mono font-700 text-sm w-full"
                                  style={{ animationDelay: `${epIndex * 20}ms` }}
                                >
                                  {ep.name.replace('Tập ', '')}
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
                  <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                    <h4 className="text-title font-900 text-white mb-6">Details</h4>

                    <div className="space-y-6 text-sm">
                      <div className="flex items-start gap-4">
                        <MonitorPlay className="h-5 w-5 text-white/50 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-white/50 font-mono uppercase tracking-wider mb-1">Quality</div>
                          <div className="text-white font-400">{movie.quality} • {movie.lang}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <CalendarBlank className="h-5 w-5 text-white/50 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-white/50 font-mono uppercase tracking-wider mb-1">Released</div>
                          <div className="text-white font-400">{new Date(movie.created.time).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Clock className="h-5 w-5 text-white/50 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-white/50 font-mono uppercase tracking-wider mb-1">Duration</div>
                          <div className="text-white font-400">{movie.time}</div>
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
                      <h4 className="text-overline font-mono font-900 uppercase tracking-[0.3em] text-white/50 mb-4">Director</h4>
                      <div className="space-y-2">
                        {movie.director.map((director) => (
                          <div key={director} className="text-body font-400 text-white hover:text-blue-400 transition-colors cursor-pointer">
                            {director}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cast */}
                    <div>
                      <h4 className="text-overline font-mono font-900 uppercase tracking-[0.3em] text-white/50 mb-4">Cast</h4>
                      <div className="space-y-2">
                        {movie.actor.slice(0, 6).map((actor) => (
                          <div key={actor} className="text-body font-400 text-white/80 hover:text-blue-400 transition-colors cursor-pointer">
                            {actor}
                          </div>
                        ))}
                        {movie.actor.length > 6 && (
                          <div className="text-body font-400 text-white/50">
                            +{movie.actor.length - 6} more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </MotionItem>

                {/* Stats */}
                <MotionItem delay={0.5}>
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-3xl p-8 backdrop-blur-sm">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-title font-900 text-white">{movie.view}</div>
                        <div className="text-xs font-mono uppercase tracking-wider text-white/50">Views</div>
                      </div>
                      <div>
                        <div className="text-title font-900 text-white">{movie.tmdb.vote_count.toLocaleString()}</div>
                        <div className="text-xs font-mono uppercase tracking-wider text-white/50">Votes</div>
                      </div>
                      <div>
                        <div className="text-title font-900 text-yellow-400">{movie.tmdb.vote_average}</div>
                        <div className="text-xs font-mono uppercase tracking-wider text-white/50">Rating</div>
                      </div>
                    </div>
                  </div>
                </MotionItem>
              </div>
            </div>
          </div>
        </section>
      </MotionPage>
    </PublicLayout>
  );
}
