import {
	MotionFadeIn,
	MotionItem,
	MotionList,
} from "@repo/design-system/components/motion";
import Link from "next/link";
import type { IMovie } from "@/types/response";
import { MovieCard } from "./movie-card";

interface TrendingMoviesProps {
	movies: IMovie[];
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
					<div className="mb-12 flex items-center justify-between">
						<h2 className="font-900 text-headline text-white">{title}</h2>
						<Link
							href={viewAllUrl}
							className="border-white/20 border-b pb-1 font-400 text-body text-white/60 transition-colors hover:border-white/60 hover:text-white"
						>
							View All
						</Link>
					</div>
				</MotionFadeIn>

				<MotionList className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-4">
					{movies.map((movie, index) => (
						<MotionItem key={movie._id} delay={index * 0.05}>
							<MovieCard movie={movie} />
						</MotionItem>
					))}
				</MotionList>
			</div>
		</section>
	);
}
