import Link from "next/link";
import {
	MotionFadeIn,
	MotionList,
	MotionItem,
} from "@repo/design-system/components/motion";
import { MovieCard } from "./movie-card";

interface Movie {
	id: number;
	slug: string;
	name: string;
	poster: string;
	rating: string;
	year: number;
	category: string;
}

interface TrendingMoviesProps {
	movies: Movie[];
	title?: string;
	viewAllUrl?: string;
}

export function TrendingMovies({
	movies,
	title = "Trending Now",
	viewAllUrl = "/browse",
}: TrendingMoviesProps) {
	return (
		<section className="py-24">
			<div className="container mx-auto max-w-7xl px-6">
				<MotionFadeIn>
					<div className="flex items-center justify-between mb-12">
						<h2 className="text-headline font-900 text-white">{title}</h2>
						<Link
							href={viewAllUrl}
							className="text-body font-400 text-white/60 hover:text-white transition-colors border-b border-white/20 hover:border-white/60 pb-1"
						>
							View All
						</Link>
					</div>
				</MotionFadeIn>

				<MotionList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
					{movies.map((movie, index) => (
						<MotionItem key={movie.id} delay={index * 0.05}>
							<MovieCard movie={movie} />
						</MotionItem>
					))}
				</MotionList>
			</div>
		</section>
	);
}
