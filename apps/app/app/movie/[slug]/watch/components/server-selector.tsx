"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Play } from "@phosphor-icons/react";

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
            <h4 className="text-title font-700 text-white mb-4">Server</h4>
            <div className="space-y-3">
                {servers.map((server, index) => (
                    <Button
                        key={server.server_name}
                        intent={
                            currentServerName === server.server_name ? "primary" : "outline"
                        }
                        onClick={() => onServerSelect(index)}
                        className={`
              w-full border-white/20 text-white hover:border-blue-400 hover:bg-blue-400/10 hover:text-blue-400 transition-all rounded-xl font-600 justify-start
              ${currentServerName === server.server_name
                                ? "bg-blue-500 border-blue-500 text-white"
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
