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
    <div className="rounded-2xl border border-white/10 bg-white/2 p-6">
      <h4 className="mb-4 font-700 text-title text-white"> Thông tin phim</h4>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Chất lượng:</span>
          <span className="font-mono text-white">{quality}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Ngôn ngữ:</span>
          <span className="font-mono text-white">{language}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Thời lượng:</span>
          <span className="font-mono text-white">{duration}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Trạng thái:</span>
          <span className="font-mono text-green-400 capitalize">{status}</span>
        </div>
      </div>
    </div>
  );
}
