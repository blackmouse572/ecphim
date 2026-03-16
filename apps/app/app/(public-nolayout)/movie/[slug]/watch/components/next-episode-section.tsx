"use client";

import { Play } from "@phosphor-icons/react";
import { Button } from "@repo/design-system/components/ui/button";
import { Kbd } from "@repo/design-system/components/ui/kbd";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useRouter } from "next/navigation";
import type { IEpisode } from "../../../../../../types/response";

interface NextEpisodeSectionProps {
  nextEpisode: IEpisode | null;
  onPlayNext: (episode: IEpisode) => void;
  previousEpisode?: IEpisode | null;
  onPlayPrevious?: (episode: IEpisode) => void;
}

export function NextEpisodeSection({
  nextEpisode,
  onPlayNext,
  previousEpisode,
  onPlayPrevious,
}: NextEpisodeSectionProps) {
  const router = useRouter();
  useHotkey("N", () => {
    if (nextEpisode) {
      onPlayNext(nextEpisode);
    }
  });
  useHotkey("B", () => {
    if (previousEpisode && onPlayPrevious) {
      onPlayPrevious(previousEpisode);
    }
  });
  return (
    <div className="rounded-2xl border border-blue-500/20 bg-linear-to-br from-blue-500/10 to-cyan-500/10 p-6">
      <h4 className="mb-3 font-700 text-title text-white">Tập tiếp theo</h4>
      {nextEpisode ? (
        <Button
          intent="primary"
          onClick={() => onPlayNext(nextEpisode)}
          className="w-full rounded-xl bg-blue-500 font-600 text-white hover:bg-blue-600"
        >
          <Play className="mr-2 h-4 w-4" />
          Xem tập {nextEpisode.name}
        </Button>
      ) : (
        <p className="text-center font-400 text-body text-white/60">
          🎉 Cày phim xong rồi, không còn tập nào nữa đâu! Hãy chờ đợi mùa tiếp
          theo nhé!
        </p>
      )}
      <p className="mt-4 text-center font-400 text-body text-white/60 text-xs">
        Sử dụng phím tắt <Kbd className="opacity-75">N</Kbd> để xem tập tiếp
        theo và <Kbd className="opacity-75">B</Kbd> để xem tập trước đó (nếu
        có).
      </p>
    </div>
  );
}
