import { CalendarBlank, Clock, MonitorPlay } from "@phosphor-icons/react/ssr";
import { MotionItem, MotionPage } from "@repo/design-system/components/motion";
import { createMetadata } from "@repo/seo/metadata";
import { getMovieDetail, getMovieImages } from "@/lib/services/movie";
import { CACHE_DURATION } from "../../../../lib/constants";
import { EpisodeGrid } from "../../../(public-nolayout)/movie/[slug]/watch/components";
import PureHtmlRender from "../../../components/pure-html-render";
import { CinematicHeroSection } from "./components/cinematic-hero-section";

type Props = {
  params: Promise<{ slug: string }>;
};

// ISR: Revalidate every 24 hours (86400 seconds)
// First request after interval serves stale content instantly
// Background revalidation fetches fresh content
export const revalidate = 86400;

/**
 * Pre-generate popular movies at build time for instant static HTML
 * Other movies are generated on-demand via ISR
 */
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    // Fetch trending/popular movies for pre-generation
    // Adjust the limit based on your build time constraints
    const response = await fetch(
      `${baseUrl}/api/danh-sach/phim-moi?page=1&limit=50`,
      {
        next: { revalidate: CACHE_DURATION.WEEKLY },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch popular movies: ${response.status}`);
    }

    const data = (await response.json()) as {
      data: { items: { slug: string }[] };
    };
    return data.data.items.map((movie) => ({
      slug: movie.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    // Return empty array - on-demand ISR will handle other routes
    return [];
  }
}

export const generateMetadata = async ({ params }: Props) => {
  const { slug } = await params;
  const movie = await getMovieDetail(slug);

  return createMetadata({
    title: `${movie.name} Chất Lượng Cao - Xem Phim Online Miễn Phí`,
    description: `${movie.content}`,
  });
};
export default async function MovieDetailPage({ params }: Props) {
  const { slug } = await params;
  const movie = await getMovieDetail(slug);
  const imageData = await getMovieImages(slug).catch(() => undefined);

  return (
    <MotionPage className="min-h-screen bg-black">
      <CinematicHeroSection imageData={imageData} movie={movie} />
      {/* Content Sections */}
      <section className="bg-gradient-to-b from-transparent to-zinc-950/50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[2fr_1fr]">
            {/* Main Content */}
            <div className="space-y-16">
              {/* Synopsis */}
              <MotionItem>
                <h3 className="mb-8 font-900 text-headline text-white tracking-tight">
                  Nội dung phim
                </h3>

                <PureHtmlRender
                  html={movie.content}
                  className="font-200 text-body-lg text-white/80 leading-relaxed"
                />
              </MotionItem>

              {/* Episodes */}
              <MotionItem>
                <EpisodeGrid movie={movie} />
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
                          Chất lượng
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
                          Xuất bản
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
                          Thời lượng
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
                      Đạo diễn
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
                      Dàn Cast
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
