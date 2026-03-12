import { Play, Star } from "@phosphor-icons/react/dist/ssr";
import { MotionItem, MotionList } from "@repo/design-system/components/motion";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Title } from "./typography/title";

export type HeroSectionProps = {
	featuredMovie: {
		name: string;
		origin_name: string;
		year: number;
		content: string;
		category: string[];
		vote_average: number;
		thumb_url: string;
		slug: string;
	};
};
export function HeroSection({ featuredMovie }: HeroSectionProps) {
	return (
		<section className="relative flex h-screen items-center overflow-hidden">
			{/* Background with parallax effect */}
			<div className="absolute inset-0 z-0">
				<div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/70 to-black/30" />
				<div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-transparent" />
				<Image
					alt={featuredMovie.name}
					className="h-full w-full scale-105 animate-slow-zoom object-cover"
					height={1080}
					priority
					src={featuredMovie.thumb_url}
					width={1920}
				/>
			</div>

			<div className="container relative z-20 mx-auto max-w-7xl px-6">
				<MotionList delay={0.3} className="max-w-2xl space-y-8">
					<MotionItem>
						<div className="mb-6 flex items-center gap-4">
							{featuredMovie.category.map((cat) => (
								<Badge key={cat}>{cat}</Badge>
							))}
							<div className="flex items-center gap-2 text-yellow-400">
								<Star weight="fill" className="h-4 w-4" />
								<span className="font-700 font-mono text-sm">
									{featuredMovie.vote_average}
								</span>
							</div>
						</div>
					</MotionItem>

					<MotionItem>
						<Title className="mb-4 font-bold text-4xl text-white">
							{featuredMovie.name}
						</Title>
						<h2 className="mb-6 text-title text-white/70">
							{featuredMovie.origin_name} ({featuredMovie.year})
						</h2>
					</MotionItem>

					<MotionItem>
						<p className="mb-8 max-w-xl font-200 text-sm text-white/80 leading-relaxed">
							{featuredMovie.content}
						</p>
					</MotionItem>

					<MotionItem>
						<div className="flex gap-4">
							<Link href={`/movie/${featuredMovie.slug}`}>
								<Button size="lg">
									<Play weight="fill" />
									Xem Ngay
								</Button>
							</Link>
							<Link href="/discover">
								<Button intent="outline" size="lg">
									Khám Phá
								</Button>
							</Link>
						</div>
					</MotionItem>
				</MotionList>
			</div>

			{/* Scroll indicator */}
			<div className="-translate-x-1/2 absolute bottom-8 left-1/2 z-20 transform">
				<div className="h-16 w-px animate-pulse bg-gradient-to-b from-transparent via-white/40 to-transparent" />
			</div>
		</section>
	);
}
