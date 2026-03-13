"use client";

import { Play } from "@phosphor-icons/react";
import { Button } from "@repo/design-system/components/ui/button";

interface Episode {
  name: string;
  slug: string;
}

interface ServerData {
  server_name: string;
  server_data: Episode[];
}

interface ServerSelectorProps {
  servers: ServerData[];
  currentServerName: string;
  onServerSelect: (serverIndex: number) => void;
}

export function ServerSelector({
  servers,
  currentServerName,
  onServerSelect,
}: ServerSelectorProps) {
  return (
    <div>
      <h4 className="mb-4 font-700 text-title text-white">Server</h4>
      <div className="space-y-3">
        {servers.map((server, index) => (
          <Button
            key={server.server_name}
            intent={
              currentServerName === server.server_name ? "primary" : "secondary"
            }
            onClick={() =>
              currentServerName === server.server_name
                ? null
                : onServerSelect(index)
            }
            className={`w-full justify-start rounded-xl border-white/20 font-600 text-white transition-all hover:border-primary hover:bg-primary/10 hover:text-primary ${
              currentServerName === server.server_name
                ? "border-primary bg-primary text-white"
                : ""
            }
            `}
          >
            <Play className="mr-2 h-4 w-4" />
            {server.server_name}
            <span className="ml-auto text-xs opacity-70">
              {server.server_data.length} EP
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
