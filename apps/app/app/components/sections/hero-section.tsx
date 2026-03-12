import { Play, Star } from "@phosphor-icons/react/ssr";
import { MotionItem, MotionList } from "@repo/design-system/components/motion";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import type { MovieDetail } from "@/types/movie";
import { Display } from "../typography/display";

interface HeroSectionProps {
	movie: MovieDetail;
}

export function HeroSection({ movie }: HeroSectionProps) {
	return (
		<section className="relative flex h-screen items-center overflow-hidden pt-16">
			{/* Background with parallax effect */}
			<div className="absolute inset-0 z-0">
				<div className="absolute inset-0 z-10 bg-linear-to-r from-black via-black/70 to-black/30" />
				<div className="absolute inset-0 z-10 bg-linear-to-t from-black via-transparent to-transparent" />
				<Image
					alt={movie.name}
					className="h-full w-full scale-105 animate-slow-zoom object-cover"
					height={1080}
					priority
					src={movie.thumb_url}
					width={1920}
				/>
			</div>

			<div className="container relative z-20 mx-auto max-w-7xl px-6">
				<MotionList delay={0.3} className="max-w-2xl space-y-8">
					<MotionItem>
						<div className="mb-6 flex items-center gap-4">
							{movie.category.map((cat) => (
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
									{movie.imdb.vote_average}&nbsp; IMDB
								</span>
							</div>
						</div>
					</MotionItem>

					<MotionItem className="mb-2 space-y-4">
						<Display className="text-display">{movie.name}</Display>
						<h2 className="font-200 text-title text-white/70">
							{movie.origin_name} ({movie.year})
						</h2>
					</MotionItem>

					<MotionItem>
						<p className="mb-8 max-w-xl font-200 text-body-lg text-white/80 leading-relaxed">
							{movie.content}
						</p>
					</MotionItem>

					<MotionItem>
						<div className="flex gap-4">
							<Button size="2xl">
								<Play weight="fill" />
								<Link href={`/movie/${movie.slug}`}>Watch Now</Link>
							</Button>
							<Button intent="secondary" size="2xl">
								<Link href="/discover">Discover More</Link>
							</Button>
						</div>
					</MotionItem>
				</MotionList>
			</div>

			{/* Scroll indicator */}
			<div className="-translate-x-1/2 absolute bottom-8 left-1/2 z-20 transform">
				<div className="h-16 w-px animate-pulse bg-linear-to-b from-transparent via-white/40 to-transparent" />
			</div>
		</section>
	);
}
