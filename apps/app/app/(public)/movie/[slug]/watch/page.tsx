import { MOCK_MOVIE } from "../data";
import { MovieWatchClientPage } from "./page-client";

interface Episode {
	name: string;
	slug: string;
	filename: string;
	link_embed: string;
	link_m3u8: string;
}

interface ServerData {
	server_name: string;
	server_data: Episode[];
}

type Props = {
	params: Promise<{ slug: string }>;
};
export async function generateMetadata({ params }: Props) {
	const { slug } = await params;

	return MOCK_MOVIE.movie.name + "-" + MOCK_MOVIE.episodes
}

export default async function MovieWatchPage(
	{ params }: Props
) {
	const { slug } = await params;

	return <MovieWatchClientPage params={{ slug }} movie={MOCK_MOVIE.movie} episodes={MOCK_MOVIE.episodes} />;
}
