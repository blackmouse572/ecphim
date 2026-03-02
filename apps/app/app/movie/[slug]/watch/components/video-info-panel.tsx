"use client";

interface VideoInfoPanelProps {
    quality: string;
    language: string;
    duration: string;
    status: string;
}

export function VideoInfoPanel({
    quality,
    language,
    duration,
    status,
}: VideoInfoPanelProps) {
    return (
        <div className="bg-white/2 border border-white/10 rounded-2xl p-6">
            <h4 className="text-title font-700 text-white mb-4">Video Info</h4>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-white/60">Quality:</span>
                    <span className="text-white font-mono">{quality}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white/60">Language:</span>
                    <span className="text-white font-mono">{language}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white/60">Duration:</span>
                    <span className="text-white font-mono">{duration}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white/60">Status:</span>
                    <span className="text-green-400 font-mono capitalize">{status}</span>
                </div>
            </div>
        </div>
    );
}
