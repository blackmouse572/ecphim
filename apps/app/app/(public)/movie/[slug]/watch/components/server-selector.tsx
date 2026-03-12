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
							currentServerName === server.server_name ? "primary" : "secondary"
						}
						onClick={() => onServerSelect(index)}
						className={`
              w-full border-white/20 text-white hover:border-primary hover:bg-primary/10 hover:text-primary transition-all rounded-xl font-600 justify-start
              ${
								currentServerName === server.server_name
									? "bg-primary border-primary text-white"
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
