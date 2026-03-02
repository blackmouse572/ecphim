import { Star, Play } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";

interface MovieCard {
    id: number;
    slug: string;
    name: string;
    poster: string;
    rating: string;
    year: number;
    category: string;
}

interface MovieCardProps {
    movie: MovieCard;
}

export function MovieCard({ movie }: MovieCardProps) {
    return (
        <Link href={`/movie/${movie.slug}`} className="group block">
            <div className="relative aspect-2/3 overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 hover:border-white/30 transition-all duration-700 hover:scale-105 hover:-translate-y-2">
                <Image
                    alt={movie.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    height={450}
                    src={movie.poster}
                    width={300}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
    );
}
