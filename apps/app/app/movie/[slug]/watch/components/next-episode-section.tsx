"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Play } from "@phosphor-icons/react";

interface NextEpisodeSectionProps {
    nextEpisode: { name: string; slug: string } | null;
    onPlayNext: (episode: { name: string; slug: string }) => void;
}

export function NextEpisodeSection({
    nextEpisode,
    onPlayNext,
}: NextEpisodeSectionProps) {
    return (
        <div className="bg-linear-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
            <h4 className="text-title font-700 text-white mb-3">Next Episode</h4>
            {nextEpisode ? (
                <Button
                    intent="primary"
                    onClick={() => onPlayNext(nextEpisode)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-600 rounded-xl"
                >
                    <Play className="mr-2 h-4 w-4" />
                    Play {nextEpisode.name}
                </Button>
            ) : (
                <p className="text-body font-400 text-white/60 text-center">
                    🎉 You've finished this series!
                </p>
            )}
        </div>
    );
}
