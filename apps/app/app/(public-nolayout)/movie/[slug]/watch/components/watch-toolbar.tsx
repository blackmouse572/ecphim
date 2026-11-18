"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Button } from "@repo/design-system/components/base/button";
import { Kbd } from "@repo/design-system/components/base/kbd";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@repo/design-system/components/base/toggle-group";
import { useHotkey } from "@tanstack/react-hotkeys";
import type { IEpisode, IStreamServer } from "@/types/response";

type WatchToolbarProps = {
  title: string;
  episode: IEpisode;
  /** Hide episode navigation for single films. */
  isSeries: boolean;
  previousEpisode: IEpisode | null;
  nextEpisode: IEpisode | null;
  onSelectEpisode: (episode: IEpisode) => void;
  servers: IStreamServer[];
  currentServerName: string;
  onSelectServer: (server: IStreamServer) => void;
};

/** "01" reads as "Tập 01"; names like "Full" or "Tập 5" stay as they are. */
export function episodeLabel(name: string) {
  return /^\d+$/.test(name) ? `Tập ${name}` : name;
}

/**
 * The strip under the player: what's playing, previous and next episode
 * (also on the B and N keys), and the server picker when there is a choice.
 */
export function WatchToolbar({
  title,
  episode,
  isSeries,
  previousEpisode,
  nextEpisode,
  onSelectEpisode,
  servers,
  currentServerName,
  onSelectServer,
}: WatchToolbarProps) {
  useHotkey("N", () => {
    if (nextEpisode) onSelectEpisode(nextEpisode);
  });
  useHotkey("B", () => {
    if (previousEpisode) onSelectEpisode(previousEpisode);
  });

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="grid min-w-0 gap-0.5">
          <h1 className="text-balance font-bold text-xl tracking-[-0.02em] md:text-2xl">
            {title}
          </h1>
          {isSeries ? (
            <p className="text-muted-foreground text-sm">
              Đang xem {episodeLabel(episode.name).toLowerCase()}
            </p>
          ) : null}
        </div>

        {isSeries ? (
          <div className="flex gap-2">
            <Button
              disabled={!previousEpisode}
              onClick={() =>
                previousEpisode && onSelectEpisode(previousEpisode)
              }
              size="lg"
              title="Tập trước (B)"
              variant="secondary"
            >
              <CaretLeftIcon data-icon="inline-start" />
              Tập trước
            </Button>
            <Button
              disabled={!nextEpisode}
              onClick={() => nextEpisode && onSelectEpisode(nextEpisode)}
              size="lg"
              title="Tập tiếp (N)"
            >
              Tập tiếp
              <CaretRightIcon data-icon="inline-end" />
            </Button>
          </div>
        ) : null}
      </div>

      {servers.length > 1 ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-muted-foreground text-sm">Nguồn phát</span>
          <ToggleGroup
            aria-label="Nguồn phát"
            onValueChange={(value) => {
              const server = servers.find((s) => s.server_name === value[0]);
              if (server) onSelectServer(server);
            }}
            size="sm"
            value={[currentServerName]}
            variant="outline"
          >
            {servers.map((server) => (
              <ToggleGroupItem
                className="aria-pressed:border-primary/60 aria-pressed:bg-primary/15 aria-pressed:text-foreground data-pressed:border-primary/60 data-pressed:bg-primary/15"
                key={server.server_name}
                value={server.server_name}
              >
                {server.server_name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      ) : null}

      {isSeries && !nextEpisode ? (
        <p className="text-muted-foreground text-sm">
          Đây là tập mới nhất. Quay lại sau để xem tập tiếp theo nhé.
        </p>
      ) : null}

      <p className="hidden text-muted-foreground text-xs md:block">
        Phím tắt:{" "}
        {isSeries ? (
          <>
            <Kbd>B</Kbd> tập trước · <Kbd>N</Kbd> tập tiếp ·{" "}
          </>
        ) : null}
        <Kbd>Esc</Kbd> quay lại trang phim
      </p>
    </div>
  );
}
