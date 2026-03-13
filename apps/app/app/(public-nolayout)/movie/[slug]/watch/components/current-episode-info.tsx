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
      <h1 className="mb-2 font-900 text-headline text-white tracking-tight">
        {movieName}
      </h1>
      <h2 className="mb-1 font-600 text-title text-white/80">
        {episodeName} • {serverName}
      </h2>
      <p className="font-400 text-body text-white/60">{description}</p>
    </div>
  );
}
