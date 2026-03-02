import {
  TrendUp,
  Crown,
  Sparkle,
  FilmReel,
} from "@phosphor-icons/react/ssr";
import {
  MotionPage,
} from "@repo/design-system/components/motion";
import { PublicLayout } from "./components/public-layout";
import { MovieDetail } from "@/types/movie";
import {
  HeroSection,
  CategoriesNavigation,
  TrendingMovies,
} from "./components/sections";

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
      <MotionPage className="min-h-screen bg-linear-to-br from-black via-zinc-950 to-black">
        <HeroSection movie={FEATURED_MOVIE} />
        <CategoriesNavigation categories={CATEGORIES} />
        <TrendingMovies movies={TRENDING_MOVIES} />
      </MotionPage>
    </PublicLayout>
  );
}
