import { MotionPage } from "@repo/design-system/components/motion";
import { fetchCategories, fetchHomeMovies } from "@/lib/services/movie";
import type { MovieDetail } from "@/types/movie";
import { PublicLayout } from "./components/public-layout";
import {
	CategoriesNavigation,
	HeroSection,
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
	tmdb: {
		type: "tv",
		id: "110631",
		season: 1,
		vote_average: 0,
		vote_count: 0,
	},
	imdb: {
		id: null,
		vote_average: 8.7,
	},
	modified: {
		time: "2024-06-01T12:00:00Z",
	},
	poster_url:
		"https://phimimg.com/upload/vod/20250325-1/6db202d6161c123d96b0180c2da9b1e5.jpg",
	thumb_url:
		"https://phimimg.com/upload/vod/20250325-1/6985255433cba78af7f28fe63c5126c9.jpg",
	content:
		"Một trường cấp ba trở thành điểm bùng phát virus thây ma. Các học sinh mắc kẹt phải nỗ lực thoát ra – hoặc biến thành một trong những người nhiễm bệnh hung tợn.",
	type: "series",
	status: "completed",
	is_copyright: false,
	sub_docquyen: false,
	chieurap: false,
	trailer_url: "",
	time: "? phút/tập",
	episode_current: "Hoàn tất (8/8)",
	episode_total: "8 Tập",
	quality: "HD",
	lang: "Vietsub",
	notify: "",
	showtimes: "",
	view: 0,
	actor: [
		"ภัทรศยา เครือสุวรรณศิริ",
		"สุทัตตา อุดมศิลป์",
		"ยุกต์ ส่งไพศาล",
		"เทวินทร์ สุร เชิดเกียรติ",
	],
	director: [""],
	category: [
		{
			id: "620f3d2b91fa4af90ab697fe",
			name: "Chính kịch",
			slug: "chinh-kich",
		},
	],
	country: [
		{
			id: "620a2318e0fc277084dfd77a",
			name: "Thái Lan",
			slug: "thai-lan",
		},
	],
};


export default async function HomePage() {
	const [movies, categories] = await Promise.all([
		fetchHomeMovies(),
		fetchCategories(),
	]);

	return (
		<PublicLayout>
			<MotionPage className="min-h-screen bg-linear-to-br from-black via-zinc-950 to-black">
				<HeroSection movie={FEATURED_MOVIE} />
				<CategoriesNavigation categories={categories} />
				<TrendingMovies movies={movies} />
			</MotionPage>
		</PublicLayout>
	);
}
