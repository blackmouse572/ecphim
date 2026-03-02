"use client";

interface Episode {
    name: string;
}

interface CurrentEpisodeInfoProps {
    movieName: string;
    episodeName: string;
    serverName: string;
    description: string;
}

export function CurrentEpisodeInfo({
    movieName,
    episodeName,
    serverName,
    description,
}: CurrentEpisodeInfoProps) {
    return (
        <div className="mb-8">
            <h1 className="text-headline font-900 text-white mb-2 tracking-tight">
                {movieName}
            </h1>
            <h2 className="text-title font-600 text-white/80 mb-1">
                {episodeName} • {serverName}
            </h2>
            <p className="text-body font-400 text-white/60">{description}</p>
        </div>
    );
}
