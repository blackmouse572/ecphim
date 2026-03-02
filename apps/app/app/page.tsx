import {
  Play,
  Star,
  TrendUp,
  Crown,
  FilmReel,
  Sparkle,
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
import { PublicLayout } from "./components/public-layout";
import { Badge } from "@repo/design-system/components/ui/badge";
import { MovieDetail, MovieResponse } from "@/types/movie";

// Mock data - in real app this would come from API
const FEATURED_MOVIE: MovieDetail = {
  slug: "ngoi-truong-xac-song",
  name: "Ngôi Trường Xác Sống",
  origin_name: "All of Us Are Dead",
  year: 2022,
  _id: "641c8b9e1c4ae5f1a2b3c4d5",
  created: {
    time: "2024-06-01T12:00:00Z",
  },
  "tmdb": {
    "type": "tv",
    "id": "110631",
    "season": 1,
    "vote_average": 0,
    "vote_count": 0
  },
  imdb: {
    id: null,
    vote_average: 8.7,
  },
  modified: {
    time: "2024-06-01T12:00:00Z",
  },
  poster_url: "https://phimimg.com/upload/vod/20250325-1/6db202d6161c123d96b0180c2da9b1e5.jpg",
  thumb_url: "https://phimimg.com/upload/vod/20250325-1/6985255433cba78af7f28fe63c5126c9.jpg",
  content: "Một trường cấp ba trở thành điểm bùng phát virus thây ma. Các học sinh mắc kẹt phải nỗ lực thoát ra – hoặc biến thành một trong những người nhiễm bệnh hung tợn.",
  "type": "series",
  "status": "completed",
  "is_copyright": false,
  "sub_docquyen": false,
  "chieurap": false,
  "trailer_url": "",
  "time": "? phút/tập",
  "episode_current": "Hoàn tất (8/8)",
  "episode_total": "8 Tập",
  "quality": "HD",
  "lang": "Vietsub",
  "notify": "",
  "showtimes": "",
  "view": 0,
  "actor": [
    "ภัทรศยา เครือสุวรรณศิริ",
    "สุทัตตา อุดมศิลป์",
    "ยุกต์ ส่งไพศาล",
    "เทวินทร์ สุร เชิดเกียรติ"
  ],
  "director": [
    ""
  ],
  "category": [
    {
      "id": "620f3d2b91fa4af90ab697fe",
      "name": "Chính kịch",
      "slug": "chinh-kich"
    }
  ],
  "country": [
    {
      "id": "620a2318e0fc277084dfd77a",
      "name": "Thái Lan",
      "slug": "thai-lan"
    }
  ],
};

const TRENDING_MOVIES = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  slug: `movie-${i + 1}`,
  name: `Movie Title ${i + 1}`,
  poster: "https://phimimg.com/upload/vod/20250325-1/6db202d6161c123d96b0180c2da9b1e5.jpg",
  rating: (7.5 + Math.random() * 1.5).toFixed(1),
  year: 2023 - Math.floor(Math.random() * 3),
  category: ["Action", "Drama"][Math.floor(Math.random() * 2)],
}));

const CATEGORIES = [
  { name: "Trending", icon: TrendUp, slug: "trending" },
  { name: "Premium", icon: Crown, slug: "premium" },
  { name: "New Releases", icon: Sparkle, slug: "new" },
  { name: "Classics", icon: FilmReel, slug: "classics" },
];

export default function HomePage() {
  return (
    <PublicLayout>
      <MotionPage className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center overflow-hidden pt-16">
          {/* Background with parallax effect */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
            <Image
              alt={FEATURED_MOVIE.name}
              className="h-full w-full object-cover scale-105 animate-slow-zoom"
              height={1080}
              priority
              src={FEATURED_MOVIE.thumb_url}
              width={1920}
            />
          </div>

          <div className="container relative z-20 mx-auto max-w-7xl px-6">
            <MotionList delay={0.3} className="max-w-2xl space-y-8">
              <MotionItem>
                <div className="flex items-center gap-4 mb-6">
                  {FEATURED_MOVIE.category.map((cat) => (
                    <Link key={cat.slug} href={`/category/${cat.slug}`}>
                      <Badge
                        key={cat.slug}
                        isCircle
                        intent='info'
                        className="backdrop-blur-md hover:bg-sky-500/30"
                      >
                        {cat.name}
                      </Badge>
                    </Link>
                  ))}
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Star weight="fill" className="h-4 w-4" />
                    <span className="font-mono font-700 text-sm">{FEATURED_MOVIE.imdb.vote_average}</span>
                  </div>
                </div>
              </MotionItem>

              <MotionItem>
                <h1 className="text-display font-100 leading-[0.85] text-white mb-4 tracking-tight">
                  {FEATURED_MOVIE.name}
                </h1>
                <h2 className="text-title font-200 text-white/70 mb-6">
                  {FEATURED_MOVIE.origin_name} ({FEATURED_MOVIE.year})
                </h2>
              </MotionItem>

              <MotionItem>
                <p className="text-body-lg font-200 text-white/80 leading-relaxed mb-8 max-w-xl">
                  {FEATURED_MOVIE.content}
                </p>
              </MotionItem>

              <MotionItem>
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 font-700 text-lg px-8 py-4 rounded-xl shadow-2xl shadow-white/20 transition-all hover:scale-105"
                  >
                    <Link href={`/movie/${FEATURED_MOVIE.slug}`}>
                      <Play weight="fill" className="mr-3 h-6 w-6" />
                      Watch Now
                    </Link>
                  </Button>
                  <Button
                    intent="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10 font-400 text-lg px-8 py-4 rounded-xl backdrop-blur-sm transition-all hover:scale-105"
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
        {/* Categories Navigation */}
        <section className="py-16 border-y border-white/5">
          <div className="container mx-auto max-w-7xl px-6">
            <MotionList className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES.map((category, index) => (
                <MotionItem key={category.slug} delay={index * 0.1}>
                  <Link
                    href={`/browse/${category.slug}`}
                    className="group flex flex-col items-center p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/30 hover:bg-white/[0.05] transition-all duration-500 hover:scale-105"
                  >
                    <category.icon className="h-12 w-12 text-white/60 group-hover:text-white transition-colors mb-4" />
                    <span className="text-body font-400 text-white/80 group-hover:text-white transition-colors">
                      {category.name}
                    </span>
                  </Link>
                </MotionItem>
              ))}
            </MotionList>
          </div>
        </section>

        {/* Trending Movies Grid */}
        <section className="py-24">
          <div className="container mx-auto max-w-7xl px-6">
            <MotionFadeIn>
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-headline font-900 text-white">
                  Trending Now
                </h2>
                <Link
                  href="/browse"
                  className="text-body font-400 text-white/60 hover:text-white transition-colors border-b border-white/20 hover:border-white/60 pb-1"
                >
                  View All
                </Link>
              </div>
            </MotionFadeIn>

            <MotionList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {TRENDING_MOVIES.map((movie, index) => (
                <MotionItem key={movie.id} delay={index * 0.05}>
                  <Link href={`/movie/${movie.slug}`} className="group block">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 hover:border-white/30 transition-all duration-700 hover:scale-105 hover:-translate-y-2">
                      <Image
                        alt={movie.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        height={450}
                        src={movie.poster}
                        width={300}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                          <Play weight="fill" className="h-8 w-8 text-white" />
                        </div>
                      </div>

                      {/* Rating badge */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Star weight="fill" className="h-3 w-3 text-yellow-400" />
                        <span className="text-xs font-mono font-700 text-white">{movie.rating}</span>
                      </div>
                    </div>

                    <div className="pt-4 space-y-2">
                      <h3 className="text-body font-600 text-white group-hover:text-white/80 transition-colors line-clamp-2">
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
          </div>
        </section>
      </MotionPage>
    </PublicLayout>
  );
}
